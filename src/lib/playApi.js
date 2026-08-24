import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const FRIEND_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const UNIQUE_VIOLATION = '23505';

export function generateFriendCode() {
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += FRIEND_CODE_CHARS[Math.floor(Math.random() * FRIEND_CODE_CHARS.length)];
  }
  return code;
}

// --- row <-> camelCase mappers ---

function mapChildProfile(row) {
  if (!row) return null;
  return {
    id: row.id,
    parentUserId: row.parent_user_id,
    displayName: row.display_name,
    avatarColor: row.avatar_color,
    avatarEmoji: row.avatar_emoji,
    ageBand: row.age_band,
    friendCode: row.friend_code
  };
}

function mapGameProgress(row) {
  if (!row) return null;
  return {
    id: row.id,
    childProfileId: row.child_profile_id,
    gameId: row.game_id,
    bestScore: row.best_score,
    stars: row.stars,
    timesPlayed: row.times_played,
    lastPlayedDate: row.last_played_date
  };
}

function mapFriendLink(row) {
  if (!row) return null;
  return {
    id: row.id,
    requesterChildId: row.requester_child_id,
    targetChildId: row.target_child_id,
    status: row.status
  };
}

function mapChallenge(row) {
  if (!row) return null;
  return {
    id: row.id,
    fromChildId: row.from_child_id,
    toChildId: row.to_child_id,
    gameId: row.game_id,
    status: row.status,
    fromScore: row.from_score,
    toScore: row.to_score,
    winnerChildId: row.winner_child_id
  };
}

// --- Child profiles ---

export function useChildProfiles(parentUserId) {
  return useQuery({
    queryKey: ['childProfiles', parentUserId],
    queryFn: async () => {
      const { data, error } = await supabase.from('child_profiles').select('*').eq('parent_user_id', parentUserId);
      if (error) throw error;
      return data.map(mapChildProfile);
    },
    enabled: !!parentUserId
  });
}

export function useChildProfile(childProfileId) {
  return useQuery({
    queryKey: ['childProfile', childProfileId],
    queryFn: async () => {
      const { data, error } = await supabase.from('child_profiles').select('*').eq('id', childProfileId).maybeSingle();
      if (error) throw error;
      return mapChildProfile(data);
    },
    enabled: !!childProfileId
  });
}

export function useCreateChildProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const payload = {
        parent_user_id: data.parentUserId,
        display_name: data.displayName,
        avatar_color: data.avatarColor,
        avatar_emoji: data.avatarEmoji,
        age_band: data.ageBand
      };

      for (let attempt = 0; attempt < 3; attempt++) {
        const { data: row, error } = await supabase
          .from('child_profiles')
          .insert({ ...payload, friend_code: generateFriendCode() })
          .select()
          .single();
        if (!error) return mapChildProfile(row);
        if (error.code !== UNIQUE_VIOLATION) throw error;
      }
      throw new Error('Could not generate a unique friend code, please try again.');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['childProfiles', variables.parentUserId] });
    }
  });
}

export function useUpdateChildProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const payload = {};
      if (data.displayName !== undefined) payload.display_name = data.displayName;
      if (data.avatarColor !== undefined) payload.avatar_color = data.avatarColor;
      if (data.avatarEmoji !== undefined) payload.avatar_emoji = data.avatarEmoji;
      if (data.ageBand !== undefined) payload.age_band = data.ageBand;
      const { data: row, error } = await supabase.from('child_profiles').update(payload).eq('id', id).select().single();
      if (error) throw error;
      return mapChildProfile(row);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['childProfiles'] });
    }
  });
}

export function useDeleteChildProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('child_profiles').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['childProfiles'] });
    }
  });
}

// --- Game progress ---

export function useGameProgress(childProfileId) {
  return useQuery({
    queryKey: ['gameProgress', childProfileId],
    queryFn: async () => {
      const { data, error } = await supabase.from('game_progress').select('*').eq('child_profile_id', childProfileId);
      if (error) throw error;
      return data.map(mapGameProgress);
    },
    enabled: !!childProfileId
  });
}

export function useRecordGameResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ childProfileId, gameId, score, stars }) => {
      const { data: existing, error: selectError } = await supabase
        .from('game_progress')
        .select('*')
        .eq('child_profile_id', childProfileId)
        .eq('game_id', gameId)
        .maybeSingle();
      if (selectError) throw selectError;

      const lastPlayedDate = new Date().toISOString();

      if (existing) {
        const { data, error } = await supabase
          .from('game_progress')
          .update({
            best_score: Math.max(existing.best_score ?? 0, score),
            stars: Math.max(existing.stars ?? 0, stars),
            times_played: (existing.times_played ?? 0) + 1,
            last_played_date: lastPlayedDate
          })
          .eq('id', existing.id)
          .select()
          .single();
        if (error) throw error;
        return mapGameProgress(data);
      }

      const { data, error } = await supabase
        .from('game_progress')
        .insert({
          child_profile_id: childProfileId,
          game_id: gameId,
          best_score: score,
          stars,
          times_played: 1,
          last_played_date: lastPlayedDate
        })
        .select()
        .single();
      if (error) throw error;
      return mapGameProgress(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['gameProgress', variables.childProfileId] });
    }
  });
}

// --- Friend links ---

export function useFriends(childProfileId) {
  return useQuery({
    queryKey: ['friends', childProfileId],
    queryFn: async () => {
      const { data: links, error } = await supabase
        .from('friend_links')
        .select('*')
        .eq('status', 'accepted')
        .or(`requester_child_id.eq.${childProfileId},target_child_id.eq.${childProfileId}`);
      if (error) throw error;

      const friendIds = links.map((l) =>
        l.requester_child_id === childProfileId ? l.target_child_id : l.requester_child_id
      );
      if (friendIds.length === 0) return [];

      const { data: profiles, error: profilesError } = await supabase
        .from('child_profiles')
        .select('*')
        .in('id', friendIds);
      if (profilesError) throw profilesError;
      return profiles.map(mapChildProfile);
    },
    enabled: !!childProfileId
  });
}

export function useFriendLinks(childProfileId) {
  return useQuery({
    queryKey: ['friendLinks', childProfileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('friend_links')
        .select('*')
        .or(`requester_child_id.eq.${childProfileId},target_child_id.eq.${childProfileId}`);
      if (error) throw error;
      return data.map(mapFriendLink);
    },
    enabled: !!childProfileId
  });
}

export function useSendFriendRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ requesterChildId, friendCode }) => {
      const { data: matches, error: rpcError } = await supabase.rpc('find_child_by_friend_code', {
        code: friendCode
      });
      if (rpcError) throw rpcError;
      const target = matches?.[0];
      if (!target) {
        throw new Error('No child profile found with that friend code.');
      }
      if (target.id === requesterChildId) {
        throw new Error("You can't add your own profile as a friend.");
      }

      const { data, error } = await supabase
        .from('friend_links')
        .insert({ requester_child_id: requesterChildId, target_child_id: target.id, status: 'pending' })
        .select()
        .single();
      if (error) throw error;
      return mapFriendLink(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['friendLinks', variables.requesterChildId] });
    }
  });
}

export function useRespondToFriendRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const { data, error } = await supabase.from('friend_links').update({ status }).eq('id', id).select().single();
      if (error) throw error;
      return mapFriendLink(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendLinks'] });
    }
  });
}

// --- Challenges ---

export function useChallenge(challengeId) {
  return useQuery({
    queryKey: ['challenge', challengeId],
    queryFn: async () => {
      const { data, error } = await supabase.from('challenges').select('*').eq('id', challengeId).maybeSingle();
      if (error) throw error;
      return mapChallenge(data);
    },
    enabled: !!challengeId
  });
}

export function useChallenges(childProfileId) {
  return useQuery({
    queryKey: ['challenges', childProfileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .or(`from_child_id.eq.${childProfileId},to_child_id.eq.${childProfileId}`);
      if (error) throw error;
      return data.map(mapChallenge);
    },
    enabled: !!childProfileId
  });
}

export function useCreateChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ fromChildId, toChildId, gameId, fromScore }) => {
      const { data, error } = await supabase
        .from('challenges')
        .insert({ from_child_id: fromChildId, to_child_id: toChildId, game_id: gameId, from_score: fromScore, status: 'pending' })
        .select()
        .single();
      if (error) throw error;
      return mapChallenge(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['challenges', variables.fromChildId] });
    }
  });
}

export function useCompleteChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, toScore, winnerChildId }) => {
      const { data, error } = await supabase
        .from('challenges')
        .update({ to_score: toScore, winner_child_id: winnerChildId, status: 'completed' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return mapChallenge(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    }
  });
}

export function useDeclineChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data, error } = await supabase.from('challenges').update({ status: 'declined' }).eq('id', id).select().single();
      if (error) throw error;
      return mapChallenge(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    }
  });
}
