import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Project, RecutsSettings, UserProfile } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    }
  });
}

export function useGetRecutsProjectsByCaller() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecutsProjectsByCaller();
    },
    enabled: !!actor && !actorFetching
  });
}

export function useGetRecutsProjectById(projectId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Project | null>({
    queryKey: ['project', projectId?.toString()],
    queryFn: async () => {
      if (!actor || !projectId) return null;
      return actor.getRecutsProjectById(projectId);
    },
    enabled: !!actor && !actorFetching && projectId !== null
  });
}

export function useCreateRecutsProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      description,
      recutsSettings
    }: {
      name: string;
      description: string;
      recutsSettings: RecutsSettings;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createRecutsProject(name, description, recutsSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });
}

export function useUpdateRecutsProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      name,
      description,
      recutsSettings
    }: {
      projectId: bigint;
      name: string;
      description: string;
      recutsSettings: RecutsSettings;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateRecutsProject(projectId, name, description, recutsSettings);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId.toString()] });
    }
  });
}

export function useDeleteRecutsProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteRecutsProject(projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });
}
