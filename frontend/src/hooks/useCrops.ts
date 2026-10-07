import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import {
  createCrop,
  deleteCrop,
  getCrop,
  getCrops,
  updateCrop,
} from "@/services/cropApi"

import type {
  CropCreateInput,
  CropUpdateInput,
} from "@/types/crop"

export function useCrops(farmId?: number) {
  return useQuery({
    queryKey: ["crops", farmId],
    queryFn: () => getCrops(farmId as number),
    enabled: Boolean(farmId),
  })
}

export function useCrop(
  farmId?: number,
  cropId?: number,
) {
  return useQuery({
    queryKey: ["crop", farmId, cropId],
    queryFn: () => getCrop(farmId as number, cropId as number),
    enabled: Boolean(farmId && cropId),
  })
}

export function useCreateCrop() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      farmId,
      data,
    }: {
      farmId: number
      data: CropCreateInput
    }) => createCrop(farmId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["crops", variables.farmId],
      })
    },
  })
}

export function useUpdateCrop() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      farmId,
      cropId,
      data,
    }: {
      farmId: number
      cropId: number
      data: CropUpdateInput
    }) => updateCrop(farmId, cropId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["crops", variables.farmId],
      })

      queryClient.invalidateQueries({
        queryKey: [
          "crop",
          variables.farmId,
          variables.cropId,
        ],
      })
    },
  })
}

export function useDeleteCrop() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      farmId,
      cropId,
    }: {
      farmId: number
      cropId: number
    }) => deleteCrop(farmId, cropId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["crops", variables.farmId],
      })

      queryClient.removeQueries({
        queryKey: [
          "crop",
          variables.farmId,
          variables.cropId,
        ],
      })
    },
  })
}