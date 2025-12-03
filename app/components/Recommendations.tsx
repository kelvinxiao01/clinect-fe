"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRecommendations } from "@/lib/api/graphMatching";
import type { Recommendation } from "@/lib/types/graph";

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const response = await getRecommendations(5);
        setRecommendations(response.recommendations);
      } catch (err) {
        console.error("Failed to load recommendations:", err);
        setError("Unable to load recommendations");
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-blue-50 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          💡 Recommended for You
        </h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 bg-white rounded-lg shadow-sm animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || recommendations.length === 0) return null;

  return (
    <div className="p-6 bg-blue-50 rounded-lg mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        💡 Recommended for You
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Based on your medical history
      </p>
      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div
            key={rec.nctId}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <Link
              href={`/trials/${rec.nctId}`}
              className="text-lg font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              {rec.title}
            </Link>

            <div className="mt-2 text-sm text-gray-600">
              <span className="font-medium">Matches your conditions:</span>{" "}
              <span className="text-blue-700">
                {rec.matchingConditions.join(", ")}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  rec.status === "RECRUITING"
                    ? "bg-green-100 text-green-800"
                    : rec.status === "NOT_YET_RECRUITING"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {rec.status}
              </span>
              {rec.phase.length > 0 && (
                <span className="text-xs text-gray-500">
                  Phase: {rec.phase.join(", ")}
                </span>
              )}
              <span className="ml-auto px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                {rec.matchScore} match
                {rec.matchScore !== 1 ? "es" : ""}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
