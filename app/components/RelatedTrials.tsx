"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRelatedTrials } from "@/lib/api/graphMatching";
import type { RelatedTrial } from "@/lib/types/graph";

interface RelatedTrialsProps {
  nctId: string;
}

export default function RelatedTrials({ nctId }: RelatedTrialsProps) {
  const [related, setRelated] = useState<RelatedTrial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRelated() {
      try {
        const response = await getRelatedTrials(nctId, 5);
        setRelated(response.relatedTrials);
      } catch (err) {
        console.error("Failed to load related trials:", err);
        setError("Unable to load related trials");
      } finally {
        setLoading(false);
      }
    }

    loadRelated();
  }, [nctId]);

  if (loading) {
    return (
      <div className="mt-6 border-t pt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Related Trials
        </h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 bg-gray-50 rounded-lg animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || related.length === 0) return null;

  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Related Trials
      </h2>
      <div className="space-y-3">
        {related.map((trial) => (
          <div
            key={trial.nctId}
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Link
              href={`/trials/${trial.nctId}`}
              className="text-lg font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              {trial.title}
            </Link>

            <div className="mt-2 flex flex-wrap gap-2">
              {trial.sharedConditions.length > 0 && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                  {trial.sharedConditions.length} shared condition
                  {trial.sharedConditions.length !== 1 ? "s" : ""}
                </span>
              )}
              {trial.sharedLocations.length > 0 && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                  Same location
                </span>
              )}
              <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded">
                Score: {trial.relationshipScore}
              </span>
            </div>

            {trial.sharedConditions.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">Shared conditions:</span>{" "}
                {trial.sharedConditions.join(", ")}
              </div>
            )}

            <div className="mt-1 text-xs text-gray-500">
              Status: {trial.status}
              {trial.phase.length > 0 && ` | Phase: ${trial.phase.join(", ")}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
