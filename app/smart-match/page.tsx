"use client";

import { useState, useEffect, useRef } from "react";
import { sendChatMessage } from "@/lib/api/chat";
import { getMedicalHistory } from "@/lib/api";
import type { ChatMessage as ChatMessageType } from "@/lib/types/chat";
import ChatMessage from "@/app/components/ChatMessage";
import ChatInput from "@/app/components/ChatInput";
import TypingIndicator from "@/app/components/TypingIndicator";

const INITIAL_GREETING: ChatMessageType = {
  role: "assistant",
  content:
    "Hello! I'm your Clinical Trial Matching Assistant. I'm here to help you find relevant clinical trials based on your medical conditions and location.\n\nTo get started, could you tell me about any medical conditions you're dealing with?",
  timestamp: new Date().toISOString(),
};

export default function SmartMatchPage() {
  const [messages, setMessages] = useState<ChatMessageType[]>([INITIAL_GREETING]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (userMessage: string) => {
    setError("");

    // Add user message to chat
    const newUserMessage: ChatMessageType = {
      role: "user",
      content: userMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsTyping(true);

    try {
      // Send to LLM backend
      const response = await sendChatMessage(userMessage, messages);

      if (!response.success) {
        throw new Error(response.error || "Failed to get response");
      }

      // Add assistant response to chat
      const assistantMessage: ChatMessageType = {
        role: "assistant",
        content: response.assistantMessage,
        trials: response.trials,
        timestamp: response.timestamp,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again."
      );

      // Add error message to chat
      const errorMessage: ChatMessageType = {
        role: "assistant",
        content:
          "I'm sorry, I encountered an error processing your message. Could you try rephrasing or try again in a moment?",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleUseMedicalHistory = async () => {
    setError("");
    setIsTyping(true);

    try {
      const history = await getMedicalHistory();

      // Build a natural language message from medical history
      const parts: string[] = [];

      if (history.conditions) {
        parts.push(`I have the following conditions: ${history.conditions}`);
      }
      if (history.location) {
        parts.push(`I'm located in ${history.location}`);
      }
      if (history.age) {
        parts.push(`I'm ${history.age} years old`);
      }
      if (history.gender) {
        parts.push(`My gender is ${history.gender.toLowerCase()}`);
      }

      const message = parts.join(". ") + ".";

      if (message.length > 2) {
        await handleSendMessage(message);
      } else {
        throw new Error("No medical history found. Please fill out your profile first.");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load medical history"
      );
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Smart Match Chat
        </h1>
        <p className="text-gray-600">
          Chat with our AI assistant to find clinical trials tailored to your
          needs using intelligent graph-based matching.
        </p>
      </div>

      {/* Quick Action Button */}
      <div className="mb-4">
        <button
          onClick={handleUseMedicalHistory}
          disabled={isTyping}
          className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
        >
          Use My Medical History
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Chat Container */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 flex flex-col h-[600px]">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}

          {/* Typing Indicator */}
          {isTyping && <TypingIndicator />}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-4 text-sm text-gray-600 text-center">
        <p>
          Tip: You can press <kbd className="px-2 py-1 bg-gray-200 rounded">Enter</kbd> to send, or{" "}
          <kbd className="px-2 py-1 bg-gray-200 rounded">Shift+Enter</kbd> for a new line.
        </p>
      </div>
    </div>
  );
}
