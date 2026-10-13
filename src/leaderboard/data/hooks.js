import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { getAdapter } from './repository';
import { createService } from './service';

// React bindings over the service. Screens use these hooks and never reach
// the adapter or storage directly.

const service = createService(getAdapter());
const ROOT = ['leaderboard'];

// Refreshes every leaderboard query when data changes, including changes
// made in another window on this device.
export function useLeaderboardSync() {
  const queryClient = useQueryClient();
  useEffect(
    () => getAdapter().subscribe(() => queryClient.invalidateQueries({ queryKey: ROOT })),
    [queryClient]
  );
}

export function useSessions() {
  return useQuery({ queryKey: [...ROOT, 'sessions'], queryFn: () => service.listSessions() });
}

export function useGroups() {
  return useQuery({ queryKey: [...ROOT, 'groups'], queryFn: () => service.listGroups() });
}

export function useGroupView(groupId, enabled = true) {
  return useQuery({
    queryKey: [...ROOT, 'group', groupId],
    queryFn: () => service.getGroupView(groupId),
    enabled: !!groupId && enabled,
    retry: false
  });
}

export function usePlayers() {
  return useQuery({ queryKey: [...ROOT, 'players'], queryFn: () => service.listPlayers() });
}

export function useSessionView(sessionId) {
  return useQuery({
    queryKey: [...ROOT, 'session', sessionId],
    queryFn: () => service.getSessionView(sessionId),
    enabled: !!sessionId,
    retry: false
  });
}

// One mutation hook exposing every service operation by name, e.g.
// const run = useLeaderboardActions(); await run('recordResult', id, entries)
export function useLeaderboardActions() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ action, args }) => service[action](...args),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ROOT }),
    onError: (error) =>
      toast({ title: 'That did not work', description: error.message, variant: 'destructive' })
  });
  return (action, ...args) => mutation.mutateAsync({ action, args });
}

export const isStoragePersistent = () => getAdapter().isPersistent();
