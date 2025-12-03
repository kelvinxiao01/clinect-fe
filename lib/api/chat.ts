// API Client for LLM-powered Chat

import type { ChatMessage, ChatRequest, ChatResponse } from "../types/chat";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

/**
 * Send a chat message to the LLM-powered assistant
 * @param message - User's message
 * @param conversationHistory - Previous messages in the conversation
 * @returns Assistant's response with optional trial results
 */
export async function sendChatMessage(
  message: string,
  conversationHistory: ChatMessage[]
): Promise<ChatResponse> {
  const requestBody: ChatRequest = {
    message,
    conversationHistory,
  };

  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error("Failed to send chat message");
  }

  return response.json();
}
