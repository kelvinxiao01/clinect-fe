import Link from "next/link";
import type { ChatMessage as ChatMessageType } from "@/lib/types/chat";
import MatchScoreBadge from "./MatchScoreBadge";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-900 border border-gray-200"
        }`}
      >
        {/* Message content */}
        <div className="whitespace-pre-wrap break-words">{message.content}</div>

        {/* Trial results (if any) */}
        {message.trials && message.trials.length > 0 && (
          <div className="mt-4 space-y-3">
            {message.trials.map((trial) => (
              <Link
                key={trial.nctId}
                href={`/trials/${trial.nctId}`}
                className="block bg-white rounded-lg p-3 border border-gray-300 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {trial.title}
                  </h4>
                  <MatchScoreBadge score={trial.matchScore} />
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                  <span className="font-medium">{trial.nctId}</span>
                  <span>•</span>
                  <span
                    className={`px-2 py-0.5 rounded ${
                      trial.status === "RECRUITING"
                        ? "bg-green-100 text-green-800"
                        : trial.status === "NOT_YET_RECRUITING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {trial.status}
                  </span>
                  {trial.phase && trial.phase.length > 0 && (
                    <>
                      <span>•</span>
                      <span>{trial.phase.join(", ")}</span>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div
          className={`text-xs mt-2 ${isUser ? "text-blue-200" : "text-gray-500"}`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
