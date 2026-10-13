import { beforeEach, describe, expect, it } from 'vitest';
import { createLocalAdapter } from '../localAdapter';
import { createService } from '../service';
import { buildLeaderboard } from '../../domain/ranking';
import { groupBoard } from '../sessionBoard';
import { playerHistory } from '../../domain/ledger';
import { drawEntries, winLossEntries } from '../../domain/resultModels/headToHead';

function fakeStorage() {
  const map = new Map();
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    map
  };
}

let storage;
let service;

async function startSession(names = ['AL', 'SM', 'JO']) {
  const players = [];
  for (const name of names) players.push(await service.createPlayer(name));
  const session = await service.createSession({ gameId: 'seaforth', playerIds: players.map((p) => p.id) });
  return { session, players };
}

async function board(sessionId) {
  const view = await service.getSessionView(sessionId);
  return buildLeaderboard({ players: view.players, ledger: view.ledger, ruleset: view.ruleset });
}

beforeEach(() => {
  storage = fakeStorage();
  service = createService(createLocalAdapter(storage));
});

describe('session service on local storage', () => {
  it('records results and updates both players', async () => {
    const { session, players: [al, sm, jo] } = await startSession();
    await service.recordResult(session.id, winLossEntries(al.id, sm.id));
    await service.recordResult(session.id, drawEntries(al.id, jo.id));

    const rows = await board(session.id);
    expect(rows.map((row) => [row.displayName, row.points])).toEqual([
      ['AL', 5],
      ['JO', 2],
      ['SM', 1]
    ]);
  });

  it('survives closing and reopening the app', async () => {
    const { session, players: [al, sm] } = await startSession();
    await service.recordResult(session.id, winLossEntries(al.id, sm.id));

    const reopened = createService(createLocalAdapter(storage));
    const sessions = await reopened.listSessions();
    expect(sessions).toHaveLength(1);
    expect(sessions[0].endedAt).toBeNull();
    const view = await reopened.getSessionView(session.id);
    expect(playerHistory(view.ledger, al.id).total).toBe(3);
  });

  it('undo keeps the result on record and returns points to zero', async () => {
    const { session, players: [al, sm] } = await startSession();
    const result = await service.recordResult(session.id, winLossEntries(al.id, sm.id));
    await service.voidResult(result.id);

    const view = await service.getSessionView(session.id);
    expect(view.ledger.results).toHaveLength(1);
    expect(view.ledger.results[0].voidedAt).toBeTruthy();
    expect(view.ledger.transactions).toHaveLength(4);
    expect((await board(session.id)).every((row) => row.points === 0)).toBe(true);
  });

  it('correction swaps the outcome and links to the original', async () => {
    const { session, players: [al, sm] } = await startSession();
    await service.nextRound(session.id);
    const wrong = await service.recordResult(session.id, winLossEntries(al.id, sm.id));
    await service.nextRound(session.id);
    const fixed = await service.correctResult(wrong.id, winLossEntries(sm.id, al.id));

    expect(fixed.supersedesId).toBe(wrong.id);
    expect(fixed.round).toBe(2);
    const rows = await board(session.id);
    expect(rows.find((row) => row.displayName === 'SM').points).toBe(3);
    expect(rows.find((row) => row.displayName === 'AL').points).toBe(1);
  });

  it('a bad correction leaves the original in place', async () => {
    const { session, players: [al, sm] } = await startSession();
    const result = await service.recordResult(session.id, winLossEntries(al.id, sm.id));
    await expect(service.correctResult(result.id, winLossEntries(al.id, al.id))).rejects.toThrow();
    const view = await service.getSessionView(session.id);
    expect(view.ledger.results[0].voidedAt).toBeNull();
  });

  it('removing a player keeps their history; re-adding restores them', async () => {
    const { session, players: [al, sm] } = await startSession();
    await service.recordResult(session.id, winLossEntries(al.id, sm.id));
    await service.removePlayerFromSession(session.id, sm.id);

    let view = await service.getSessionView(session.id);
    expect(view.players.find((p) => p.id === sm.id).leftAt).toBeTruthy();
    expect(playerHistory(view.ledger, sm.id).total).toBe(1);

    await service.addPlayerToSession(session.id, sm.id);
    view = await service.getSessionView(session.id);
    expect(view.players.find((p) => p.id === sm.id).leftAt).toBeNull();
    expect(view.players).toHaveLength(3);
  });

  it('an ended session accepts no more results', async () => {
    const { session, players: [al, sm] } = await startSession();
    await service.endSession(session.id);
    await expect(service.recordResult(session.id, winLossEntries(al.id, sm.id))).rejects.toThrow(/ended/);
  });

  it('validates names and session size', async () => {
    await expect(service.createPlayer('   ')).rejects.toThrow();
    await expect(service.createPlayer('A very long name indeed')).rejects.toThrow();
    const solo = await service.createPlayer('AL');
    await expect(service.createSession({ gameId: 'chess', playerIds: [solo.id] })).rejects.toThrow(/two players/);
  });

  it('clears every record from the device', async () => {
    const { session, players: [al, sm] } = await startSession();
    await service.recordResult(session.id, winLossEntries(al.id, sm.id));
    await service.clearAll();
    expect(await service.listSessions()).toEqual([]);
    expect(await service.listPlayers()).toEqual([]);
    expect((await service.exportAll()).transactions).toEqual([]);
  });

  it('builds an overall leaderboard across a group\'s sessions', async () => {
    const al = await service.createPlayer('AL');
    const sm = await service.createPlayer('SM');
    const jo = await service.createPlayer('JO');

    const first = await service.createSession({ gameId: 'seaforth', playerIds: [al.id, sm.id], groupName: 'Tuesday Club' });
    await service.recordResult(first.id, winLossEntries(al.id, sm.id));
    await service.endSession(first.id);

    // Same group by name (different case), a different game, a new player.
    const second = await service.createSession({ gameId: 'chess', playerIds: [al.id, sm.id, jo.id], groupName: 'tuesday club' });
    await service.recordResult(second.id, winLossEntries(sm.id, al.id));
    await service.recordResult(second.id, drawEntries(jo.id, sm.id));

    // A session outside the group must not count.
    const other = await service.createSession({ gameId: 'chess', playerIds: [al.id, sm.id] });
    await service.recordResult(other.id, winLossEntries(al.id, sm.id));

    const groups = await service.listGroups();
    expect(groups).toHaveLength(1);
    expect(groups[0]).toMatchObject({ name: 'Tuesday Club', sessionCount: 2 });
    expect(groups[0].lastRosterPlayerIds).toEqual([al.id, sm.id, jo.id]);
    expect(second.groupId).toBe(first.groupId);
    expect(other.groupId).toBeNull();

    const view = await service.getGroupView(first.groupId);
    const rows = groupBoard(view);
    expect(rows.map((row) => [row.displayName, row.points, row.sessionsPlayed])).toEqual([
      ['SM', 6, 2],
      ['AL', 4, 2],
      ['JO', 2, 1]
    ]);
    expect(rows[0].bySession.map((entry) => [entry.session.number, entry.points])).toEqual([[1, 1], [2, 5]]);

    const sessionView = await service.getSessionView(second.id);
    expect(sessionView.group.name).toBe('Tuesday Club');
    expect(sessionView.sessionNumber).toBe(2);
    expect((await service.getSessionView(other.id)).group).toBeNull();
  });

  it('restores a backup saved before groups existed', async () => {
    const { session } = await startSession();
    const backup = JSON.parse(JSON.stringify(await service.exportAll()));
    delete backup.groups;
    const fresh = createService(createLocalAdapter(fakeStorage()));
    await fresh.importAll(backup);
    expect((await fresh.getSessionView(session.id)).group).toBeNull();
    expect(await fresh.listGroups()).toEqual([]);
  });

  it('exports and re-imports a backup', async () => {
    const { session, players: [al, sm] } = await startSession();
    await service.recordResult(session.id, winLossEntries(al.id, sm.id));
    const backup = JSON.parse(JSON.stringify(await service.exportAll()));

    const fresh = createService(createLocalAdapter(fakeStorage()));
    await fresh.importAll(backup);
    const view = await fresh.getSessionView(session.id);
    expect(view.ledger.transactions).toHaveLength(2);
    await expect(fresh.importAll({ nonsense: true })).rejects.toThrow(/backup/);
  });
});
