import { emptyLedger, recordResult as recordInLedger, voidResult as voidInLedger } from '../domain/ledger';
import { getResultModel } from '../domain/resultModels/registry';
import { getRuleset } from '../domain/rulesets';
import { getGame } from './seedGames';

// Application operations. The UI calls these through hooks; they apply the
// domain rules and persist through whichever adapter is passed in.

const newId = () => crypto.randomUUID();
const now = () => new Date().toISOString();

// view: 'session' shows this session's scores; 'overall' shows the group's
// leaderboard across all of its sessions.
export const DEFAULT_DISPLAY = { showPlayed: true, showRecord: false, showRecent: true, view: 'session' };
export const NAME_MAX_LENGTH = 14;
export const GROUP_NAME_MAX_LENGTH = 40;

function cleanName(displayName) {
  const name = String(displayName ?? '').trim().replace(/\s+/g, ' ');
  if (!name) throw new Error('Enter a name or initials.');
  if (name.length > NAME_MAX_LENGTH) throw new Error(`Keep names to ${NAME_MAX_LENGTH} characters or fewer.`);
  return name;
}

function cleanGroupName(name) {
  const clean = String(name ?? '').trim().replace(/\s+/g, ' ');
  if (clean.length > GROUP_NAME_MAX_LENGTH) {
    throw new Error(`Keep group names to ${GROUP_NAME_MAX_LENGTH} characters or fewer.`);
  }
  return clean;
}

const byStart = (a, b) => a.startedAt.localeCompare(b.startedAt);

export function createService(adapter) {
  async function getSession(sessionId) {
    const [session] = await adapter.list('sessions', { id: sessionId });
    if (!session) throw new Error('That session could not be found on this device.');
    return session;
  }

  async function sessionLedger(sessionId) {
    const [results, transactions] = await Promise.all([
      adapter.list('results', { sessionId }),
      adapter.list('transactions', { sessionId })
    ]);
    return { results, transactions };
  }

  // Finds the group by id or by name (ignoring case), creating it when the
  // name is new. Returns null when the session has no group.
  async function resolveGroup({ groupId, groupName }) {
    const groups = await adapter.list('groups');
    if (groupId) {
      const group = groups.find((candidate) => candidate.id === groupId);
      if (!group) throw new Error('That group could not be found on this device.');
      return group;
    }
    const name = cleanGroupName(groupName);
    if (!name) return null;
    const existing = groups.find((candidate) => candidate.name.toLowerCase() === name.toLowerCase());
    if (existing) return existing;
    const group = { id: newId(), name, createdAt: now() };
    await adapter.insert('groups', [group]);
    return group;
  }

  async function openSession(sessionId) {
    const session = await getSession(sessionId);
    if (session.endedAt) throw new Error('This session has ended.');
    return session;
  }

  return {
    async listPlayers() {
      return adapter.list('players');
    },

    async createPlayer(displayName) {
      const player = { id: newId(), displayName: cleanName(displayName), createdAt: now() };
      await adapter.insert('players', [player]);
      return player;
    },

    async renamePlayer(playerId, displayName) {
      return adapter.update('players', playerId, { displayName: cleanName(displayName) });
    },

    async listSessions() {
      const [sessions, links, groups] = await Promise.all([
        adapter.list('sessions'),
        adapter.list('sessionPlayers'),
        adapter.list('groups')
      ]);
      return sessions
        .map((session) => ({
          ...session,
          game: getGame(session.gameId),
          group: groups.find((group) => group.id === session.groupId) ?? null,
          playerCount: links.filter((link) => link.sessionId === session.id).length
        }))
        .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
    },

    // Groups, most recently played first, each with the players from its
    // latest session so a returning group can be set up in one tap.
    async listGroups() {
      const [groups, sessions, links] = await Promise.all([
        adapter.list('groups'),
        adapter.list('sessions'),
        adapter.list('sessionPlayers')
      ]);
      return groups
        .map((group) => {
          const own = sessions.filter((session) => session.groupId === group.id).sort(byStart);
          const last = own[own.length - 1];
          return {
            ...group,
            sessionCount: own.length,
            lastPlayedAt: last?.startedAt ?? group.createdAt,
            lastRosterPlayerIds: last
              ? links.filter((link) => link.sessionId === last.id && !link.leftAt).map((link) => link.playerId)
              : []
          };
        })
        .sort((a, b) => b.lastPlayedAt.localeCompare(a.lastPlayedAt));
    },

    // Everything the overall leaderboard needs: every session the group has
    // played, everyone who took part, and the combined scoring history.
    async getGroupView(groupId) {
      const group = await resolveGroup({ groupId });
      const [allSessions, links, allPlayers, results, transactions] = await Promise.all([
        adapter.list('sessions'),
        adapter.list('sessionPlayers'),
        adapter.list('players'),
        adapter.list('results'),
        adapter.list('transactions')
      ]);
      const sessions = allSessions
        .filter((session) => session.groupId === groupId)
        .sort(byStart)
        .map((session, index) => ({ ...session, number: index + 1, game: getGame(session.gameId) }));
      const sessionIds = sessions.map((session) => session.id);
      const playerIds = new Set(
        links.filter((link) => sessionIds.includes(link.sessionId)).map((link) => link.playerId)
      );
      const latest = sessions[sessions.length - 1];
      return {
        group,
        sessions,
        sessionIds,
        players: allPlayers.filter((player) => playerIds.has(player.id)),
        ledger: {
          results: results.filter((result) => sessionIds.includes(result.sessionId)),
          transactions: transactions.filter((tx) => sessionIds.includes(tx.sessionId))
        },
        // Ranking rules and theme follow the group's most recent session.
        game: latest ? latest.game : null,
        ruleset: latest ? getRuleset(latest.rulesetId) : null
      };
    },

    async createSession({ gameId, playerIds, groupId = null, groupName = '' }) {
      const game = getGame(gameId);
      if (playerIds.length < 2) throw new Error('Add at least two players to start.');
      const group = await resolveGroup({ groupId, groupName });
      const startedAt = now();
      const session = {
        id: newId(),
        gameId: game.id,
        rulesetId: game.rulesetId,
        courseId: null,
        groupId: group?.id ?? null,
        startedAt,
        endedAt: null,
        currentRound: 1,
        display: { ...DEFAULT_DISPLAY }
      };
      await adapter.insert('sessions', [session]);
      await adapter.insert(
        'sessionPlayers',
        playerIds.map((playerId) => ({ id: newId(), sessionId: session.id, playerId, joinedAt: startedAt, leftAt: null }))
      );
      return session;
    },

    // Everything a session screen needs, in one read.
    async getSessionView(sessionId) {
      const session = await getSession(sessionId);
      const [links, allPlayers, ledger, groups, allSessions] = await Promise.all([
        adapter.list('sessionPlayers', { sessionId }),
        adapter.list('players'),
        sessionLedger(sessionId),
        adapter.list('groups'),
        adapter.list('sessions')
      ]);
      const group = groups.find((candidate) => candidate.id === session.groupId) ?? null;
      const groupSessions = group
        ? allSessions.filter((candidate) => candidate.groupId === group.id).sort(byStart)
        : [];
      const byId = new Map(allPlayers.map((player) => [player.id, player]));
      const players = links
        .filter((link) => byId.has(link.playerId))
        .map((link) => ({ ...byId.get(link.playerId), joinedAt: link.joinedAt, leftAt: link.leftAt }));
      return {
        session,
        game: getGame(session.gameId),
        ruleset: getRuleset(session.rulesetId),
        group,
        // This session's place in the group's run of sessions (1 = first).
        sessionNumber: group ? groupSessions.findIndex((candidate) => candidate.id === session.id) + 1 : null,
        groupSessionCount: groupSessions.length,
        players,
        ledger
      };
    },

    async addPlayerToSession(sessionId, playerId) {
      await openSession(sessionId);
      const [existing] = await adapter.list('sessionPlayers', { sessionId, playerId });
      if (existing) return adapter.update('sessionPlayers', existing.id, { leftAt: null });
      const link = { id: newId(), sessionId, playerId, joinedAt: now(), leftAt: null };
      await adapter.insert('sessionPlayers', [link]);
      return link;
    },

    // The player's results stay in the session's history.
    async removePlayerFromSession(sessionId, playerId) {
      await openSession(sessionId);
      const [link] = await adapter.list('sessionPlayers', { sessionId, playerId });
      if (!link) throw new Error('That player is not in this session.');
      return adapter.update('sessionPlayers', link.id, { leftAt: now() });
    },

    async nextRound(sessionId) {
      const session = await openSession(sessionId);
      return adapter.update('sessions', sessionId, { currentRound: session.currentRound + 1 });
    },

    async setDisplay(sessionId, patch) {
      const session = await getSession(sessionId);
      return adapter.update('sessions', sessionId, { display: { ...session.display, ...patch } });
    },

    async endSession(sessionId) {
      await openSession(sessionId);
      return adapter.update('sessions', sessionId, { endedAt: now() });
    },

    async recordResult(sessionId, entries) {
      const session = await openSession(sessionId);
      const ruleset = getRuleset(session.rulesetId);
      const { result, transactions } = recordInLedger(emptyLedger(), {
        session,
        ruleset,
        entries,
        round: session.currentRound
      });
      await adapter.insert('results', [result]);
      await adapter.insert('transactions', transactions);
      return result;
    },

    async voidResult(resultId, reason = 'undo') {
      const [result] = await adapter.list('results', { id: resultId });
      if (!result) throw new Error('That result could not be found.');
      await openSession(result.sessionId);
      const ledger = await sessionLedger(result.sessionId);
      const { ledger: next, reversals } = voidInLedger(ledger, resultId, { reason });
      const voided = next.results.find((candidate) => candidate.id === resultId);
      await adapter.update('results', resultId, { voidedAt: voided.voidedAt, voidReason: voided.voidReason });
      await adapter.insert('transactions', reversals);
    },

    async correctResult(resultId, entries) {
      const [original] = await adapter.list('results', { id: resultId });
      if (!original) throw new Error('That result could not be found.');
      const session = await openSession(original.sessionId);
      const ruleset = getRuleset(session.rulesetId);

      // Check the replacement before touching the original.
      const problem = getResultModel(ruleset.resultModel).validate(entries, ruleset);
      if (problem) throw new Error(problem);

      await this.voidResult(resultId, 'corrected');
      const { result, transactions } = recordInLedger(emptyLedger(), {
        session,
        ruleset,
        entries,
        round: original.round,
        supersedesId: resultId
      });
      await adapter.insert('results', [result]);
      await adapter.insert('transactions', transactions);
      return result;
    },

    exportAll: () => adapter.exportAll(),
    importAll: (data) => adapter.importAll(data),
    clearAll: () => adapter.clearAll()
  };
}
