import { apiClient } from "@/services/apiClient"

export interface AIChatRequest {
  message: string
  context?: string
}

export interface AIChatResponse {
  response: string
}

export function chatWithAI(
  data: AIChatRequest,
  token?: string,
) {
  return apiClient.post<AIChatResponse>("/ai/chat", data, token)
}
