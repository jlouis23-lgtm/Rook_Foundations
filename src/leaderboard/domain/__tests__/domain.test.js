import { describe, expect, it } from 'vitest';
import { RF_POINTS_V1 } from '../rulesets';
import { drawEntries, winLossEntries } from '../resultModels/headToHead';
import { getResultModel } from '../resultModels/registry';
import {
  correctResult,
  emptyLedger,
  playerHistory,
  playerTotal,
  recordResult,
  voidResult
} from '../ledger';
import { buildLeaderboard, latestResult } from '../ranking';

const session = { id: 's1', gameId: 'seaforth', courseId: null };
const players = [
  { id: 'alex', displayName: 'AL' },
  { id: 'sam', displayName: 'SM' },
  { id: 'jo', displayName: 'JO' }
];

function testEnv() {
  let id = 0;
  let tick = 0;
  return {
    newId: () => `id-${++id}`,
    now: () => new Date(Date.UTC(2026, 9, 12, 10, 0, tick++)).toISOString()
  };
}

function play(ledger, entries, env, round = 1) {
  return recordResult(ledger, { session, ruleset: RF_POINTS_V1, entries, round }, env);
}

describe('head-to-head scoring', () => {
  it('awards the winner 3 and the loser 1', () => {
    const { transactions } = play(emptyLedger(), winLossEntries('alex', 'sam'), testEnv());
    expect(transactions.map((tx) => [tx.playerId, tx.label, tx.points])).toEqual([
      ['alex', 'Win', 3],
      ['sam', 'Loss', 1]
    ]);
  });

  it('awards both players 2 for a draw', () => {
    const { transactions } = play(emptyLedger(), drawEntries('alex', 'sam'), testEnv());
    expect(transactions.map((tx) => tx.points)).toEqual([2, 2]);
  });

  it('takes point values from the ruleset, not the model', () => {
    const custom = { ...RF_POINTS_V1, id: 'other', points: { win: 2, draw: 1, loss: 0 } };
    const { transactions } = recordResult(
      emptyLedger(),
      { session, ruleset: custom, entries: winLossEntries('alex', 'sam') },
      testEnv()
    );
    expect(transactions.map((tx) => tx.points)).toEqual([2, 0]);
  });

  it('rejects malformed results', () => {
    const model = getResultModel('headToHead');
    expect(model.validate(winLossEntries('alex', 'alex'), RF_POINTS_V1)).toMatch(/themselves/);
    expect(model.validate([{ playerId: 'alex', outcome: 'win' }], RF_POINTS_V1)).toMatch(/two players/);
    expect(
      model.validate(
        [
          { playerId: 'alex', outcome: 'win' },
          { playerId: 'sam', outcome: 'win' }
        ],
        RF_POINTS_V1
      )
    ).toMatch(/one win and one loss/);
    expect(model.validate(drawEntries('alex', 'sam'), { ...RF_POINTS_V1, allowDraw: false })).toMatch(/draws/);
    expect(() => play(emptyLedger(), winLossEntries('alex', 'alex'), testEnv())).toThrow();
  });
});

describe('score explanation', () => {
  it('explains a total as win, draw, loss = 6', () => {
    const env = testEnv();
    let { ledger } = play(emptyLedger(), winLossEntries('alex', 'sam'), env, 1);
    ({ ledger } = play(ledger, drawEntries('alex', 'jo'), env, 2));
    ({ ledger } = play(ledger, winLossEntries('sam', 'alex'), env, 3));

    const history = playerHistory(ledger, 'alex', { sessionId: 's1' });
    expect(history.lines.map((line) => [line.gameNumber, line.label, line.points])).toEqual([
      [1, 'Win', 3],
      [2, 'Draw', 2],
      [3, 'Loss', 1]
    ]);
    expect(history.total).toBe(6);
  });
});

describe('undo and correction', () => {
  it('undo reverses both players and keeps the original record', () => {
    const env = testEnv();
    const first = play(emptyLedger(), winLossEntries('alex', 'sam'), env);
    const { ledger } = voidResult(first.ledger, first.result.id, {}, env);

    expect(playerTotal(ledger, 'alex')).toBe(0);
    expect(playerTotal(ledger, 'sam')).toBe(0);
    expect(ledger.results).toHaveLength(1);
    expect(ledger.results[0].entries).toEqual(first.result.entries);
    expect(ledger.results[0].voidedAt).toBeTruthy();
    expect(ledger.transactions).toHaveLength(4);
    expect(playerHistory(ledger, 'alex').lines).toEqual([]);
  });

  it('cannot undo the same result twice', () => {
    const env = testEnv();
    const first = play(emptyLedger(), winLossEntries('alex', 'sam'), env);
    const { ledger } = voidResult(first.ledger, first.result.id, {}, env);
    expect(() => voidResult(ledger, first.result.id, {}, env)).toThrow(/already/);
  });

  it('correction replaces the result without losing the audit trail', () => {
    const env = testEnv();
    const first = play(emptyLedger(), winLossEntries('alex', 'sam'), env, 2);
    const fixed = correctResult(
      first.ledger,
      first.result.id,
      { session, ruleset: RF_POINTS_V1, entries: winLossEntries('sam', 'alex') },
      env
    );

    expect(playerTotal(fixed.ledger, 'alex')).toBe(1);
    expect(playerTotal(fixed.ledger, 'sam')).toBe(3);
    expect(fixed.result.supersedesId).toBe(first.result.id);
    expect(fixed.result.round).toBe(2);
    expect(fixed.ledger.results[0].voidReason).toBe('corrected');

    const audit = playerHistory(fixed.ledger, 'alex', undefined, { audit: true });
    expect(audit.lines.map((line) => [line.kind, line.points])).toEqual([
      ['award', 3],
      ['reversal', -3],
      ['award', 1]
    ]);
    expect(playerHistory(fixed.ledger, 'alex').lines.map((line) => line.label)).toEqual(['Loss']);
  });

  it('an invalid correction leaves the ledger untouched', () => {
    const env = testEnv();
    const first = play(emptyLedger(), winLossEntries('alex', 'sam'), env);
    expect(() =>
      correctResult(
        first.ledger,
        first.result.id,
        { session, ruleset: RF_POINTS_V1, entries: winLossEntries('sam', 'sam') },
        env
      )
    ).toThrow();
    expect(first.ledger.results[0].voidedAt).toBeNull();
  });
});

describe('leaderboard', () => {
  it('ranks by points with shared ranks for ties', () => {
    const env = testEnv();
    let { ledger } = play(emptyLedger(), winLossEntries('alex', 'sam'), env);
    ({ ledger } = play(ledger, drawEntries('sam', 'jo'), env));
    // alex 3, sam 1 + 2 = 3, jo 2

    const board = buildLeaderboard({ players, ledger, ruleset: RF_POINTS_V1, scope: { sessionId: 's1' } });
    expect(board.map((row) => [row.displayName, row.points, row.rank, row.tied])).toEqual([
      ['AL', 3, 1, true],
      ['SM', 3, 1, true],
      ['JO', 2, 3, false]
    ]);
    expect(board[1]).toMatchObject({ played: 2, wins: 0, draws: 1, losses: 1 });
  });

  it('applies configured tie-breakers', () => {
    const env = testEnv();
    let { ledger } = play(emptyLedger(), winLossEntries('alex', 'sam'), env);
    ({ ledger } = play(ledger, drawEntries('sam', 'jo'), env));

    const ruleset = { ...RF_POINTS_V1, tieBreakers: ['wins'] };
    const board = buildLeaderboard({ players, ledger, ruleset });
    expect(board.map((row) => [row.displayName, row.rank, row.tied])).toEqual([
      ['AL', 1, false],
      ['SM', 2, false],
      ['JO', 3, false]
    ]);
  });

  it('lists players with no games on zero points', () => {
    const board = buildLeaderboard({ players, ledger: emptyLedger(), ruleset: RF_POINTS_V1 });
    expect(board.every((row) => row.points === 0 && row.rank === 1 && row.tied)).toBe(true);
  });

  it('scopes to a session and ignores undone results', () => {
    const env = testEnv();
    const other = { id: 's2', gameId: 'chess', courseId: null };
    let { ledger } = play(emptyLedger(), winLossEntries('alex', 'sam'), env);
    const second = recordResult(ledger, { session: other, ruleset: RF_POINTS_V1, entries: winLossEntries('sam', 'alex') }, env);
    ledger = second.ledger;

    const s1 = buildLeaderboard({ players, ledger, ruleset: RF_POINTS_V1, scope: { sessionId: 's1' } });
    expect(s1.find((row) => row.playerId === 'alex').points).toBe(3);
    const all = buildLeaderboard({ players, ledger, ruleset: RF_POINTS_V1 });
    expect(all.find((row) => row.playerId === 'alex').points).toBe(4);

    expect(latestResult(ledger, { sessionId: 's2' }).id).toBe(second.result.id);
    ({ ledger } = voidResult(ledger, second.result.id, {}, env));
    expect(latestResult(ledger, { sessionId: 's2' })).toBeNull();
  });
});
