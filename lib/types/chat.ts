// Chat interface types for LLM-powered Smart Match

import type { MatchResult, SmartMatchRequest } from "./graph";

/**
 * Chat message role types
 */
export type ChatRole = "user" | "assistant" | "system";

/**
 * Individual chat message
 */
export interface ChatMessage {
  role: ChatRole;
  content: string;
  trials?: MatchResult[]; // Optional trial results attached to assistant messages
  timestamp: string; // ISO 8601 format
}

/**
 * Request to chat endpoint
 */
export interface ChatRequest {
  message: string;
  conversationHistory: ChatMessage[];
}

/**
 * Response from chat endpoint
 */
export interface ChatResponse {
  success: boolean;
  assistantMessage: string;
  trials?: MatchResult[]; // Trial results if LLM called smart match
  extractedCriteria?: SmartMatchRequest; // Structured criteria extracted by LLM
  timestamp: string;
  error?: string;
}
