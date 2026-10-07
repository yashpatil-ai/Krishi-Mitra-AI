import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  createFarm,
  deleteFarm,
  getFarm,
  getFarms,
  updateFarm,
} from "@/services/farmApi"

import type {
  FarmCreateInput,
  FarmUpdateInput,
} from "@/types/farm"

export function useFarms() {
  return useQuery({
    queryKey: ["farms"],
    queryFn: () => getFarms(),
  })
}

export function useFarm(farmId?: number) {
  return useQuery({
    queryKey: ["farm", farmId],
    queryFn: () => getFarm(farmId as number),
    enabled: Boolean(farmId),
  })
}

export function useCreateFarm() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: FarmCreateInput) => createFarm(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["farms"],
      })
    },
  })
}

export function useUpdateFarm() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      farmId,
      data,
    }: {
      farmId: number
      data: FarmUpdateInput
    }) => updateFarm(farmId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["farms"],
      })

      queryClient.invalidateQueries({
        queryKey: ["farm", variables.farmId],
      })
    },
  })
}

export function useDeleteFarm() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (farmId: number) => deleteFarm(farmId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["farms"],
      })
    },
  })
}