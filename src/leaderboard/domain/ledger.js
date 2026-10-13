import { getResultModel } from './resultModels/registry';

// The ledger is { results, transactions }. Both lists are append-only:
// a result's entries are never edited, and transactions are never removed.
// Undo and correction void the result and append reversal transactions.

const defaultNewId = () => crypto.randomUUID();
const defaultNow = () => new Date().toISOString();

export function emptyLedger() {
  return { results: [], transactions: [] };
}

export function recordResult(ledger, { session, ruleset, entries, round = 1, supersedesId = null }, env = {}) {
  const newId = env.newId ?? defaultNewId;
  const now = (env.now ?? defaultNow)();

  const model = getResultModel(ruleset.resultModel);
  const problem = model.validate(entries, ruleset);
  if (problem) throw new Error(problem);

  const result = {
    id: newId(),
    sessionId: session.id,
    gameId: session.gameId,
    courseId: session.courseId ?? null,
    rulesetId: ruleset.id,
    round,
    entries: entries.map((entry) => ({ ...entry })),
    recordedAt: now,
    supersedesId,
    voidedAt: null,
    voidReason: null
  };

  const transactions = model.score(entries, ruleset).map((line) => ({
    id: newId(),
    kind: 'award',
    resultId: result.id,
    reversesId: null,
    playerId: line.playerId,
    sessionId: result.sessionId,
    gameId: result.gameId,
    courseId: result.courseId,
    round,
    outcome: line.outcome,
    label: line.label,
    points: line.points,
    createdAt: now
  }));

  return {
    ledger: {
      results: [...ledger.results, result],
      transactions: [...ledger.transactions, ...transactions]
    },
    result,
    transactions
  };
}

export function voidResult(ledger, resultId, { reason = 'undo' } = {}, env = {}) {
  const newId = env.newId ?? defaultNewId;
  const now = (env.now ?? defaultNow)();

  const target = ledger.results.find((result) => result.id === resultId);
  if (!target) throw new Error(`Unknown result: ${resultId}`);
  if (target.voidedAt) throw new Error('This result has already been undone.');

  const reversals = ledger.transactions
    .filter((tx) => tx.resultId === resultId && tx.kind === 'award')
    .map((tx) => ({
      ...tx,
      id: newId(),
      kind: 'reversal',
      reversesId: tx.id,
      points: -tx.points,
      createdAt: now
    }));

  return {
    ledger: {
      results: ledger.results.map((result) =>
        result.id === resultId ? { ...result, voidedAt: now, voidReason: reason } : result
      ),
      transactions: [...ledger.transactions, ...reversals]
    },
    reversals
  };
}

// Replace a wrongly entered result: the original stays in the history as
// voided, and the replacement records which result it supersedes.
export function correctResult(ledger, resultId, { session, ruleset, entries }, env = {}) {
  const original = ledger.results.find((result) => result.id === resultId);
  if (!original) throw new Error(`Unknown result: ${resultId}`);

  const model = getResultModel(ruleset.resultModel);
  const problem = model.validate(entries, ruleset);
  if (problem) throw new Error(problem);

  const voided = voidResult(ledger, resultId, { reason: 'corrected' }, env);
  return recordResult(
    voided.ledger,
    { session, ruleset, entries, round: original.round, supersedesId: resultId },
    env
  );
}

// A scope selects which part of the ledger a leaderboard or history covers.
// Any of sessionId, sessionIds, courseId, gameId, from, to may be given.
export function inScope(record, scope = {}) {
  if (scope.sessionId && record.sessionId !== scope.sessionId) return false;
  if (scope.sessionIds && !scope.sessionIds.includes(record.sessionId)) return false;
  if (scope.courseId && record.courseId !== scope.courseId) return false;
  if (scope.gameId && record.gameId !== scope.gameId) return false;
  const at = record.createdAt ?? record.recordedAt;
  if (scope.from && at < scope.from) return false;
  if (scope.to && at > scope.to) return false;
  return true;
}

export function playerTotal(ledger, playerId, scope) {
  return ledger.transactions
    .filter((tx) => tx.playerId === playerId && inScope(tx, scope))
    .reduce((sum, tx) => sum + tx.points, 0);
}

// The explanation of a player's score: one line per result that still
// counts, in the order played, ending in the total. With { audit: true }
// every transaction is returned, including undone results and reversals.
export function playerHistory(ledger, playerId, scope, { audit = false } = {}) {
  const voidedIds = new Set(ledger.results.filter((r) => r.voidedAt).map((r) => r.id));
  const mine = ledger.transactions.filter((tx) => tx.playerId === playerId && inScope(tx, scope));

  const lines = audit
    ? mine.map((tx) => ({ ...tx, voided: voidedIds.has(tx.resultId) }))
    : mine
        .filter((tx) => tx.kind === 'award' && !voidedIds.has(tx.resultId))
        .map((tx, index) => ({ ...tx, gameNumber: index + 1 }));

  return {
    playerId,
    lines,
    total: mine.reduce((sum, tx) => sum + tx.points, 0)
  };
}
