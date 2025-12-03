"use client";

import { useState, useEffect } from "react";
import { getSavedTrials, unsaveTrial } from "@/lib/api";
import { SavedTrial } from "@/lib/types";
import Link from "next/link";

export default function SavedTrialsPage() {
  const [trials, setTrials] = useState<SavedTrial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSavedTrials();
  }, []);

  const loadSavedTrials = async () => {
    try {
      const savedTrials = await getSavedTrials();
      setTrials(savedTrials);
    } catch (err) {
      setError("Failed to load saved trials");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (nctId: string) => {
    try {
      await unsaveTrial(nctId);
      setTrials(trials.filter((trial) => trial.nctId !== nctId));
    } catch (err) {
      console.error("Failed to unsave trial:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading saved trials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">
          Saved Trials
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {trials.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">You haven't saved any trials yet.</p>
            <Link
              href="/search"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Search for trials →
            </Link>
          </div>
        )}

        {trials.length > 0 && (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {trials.length} saved trial{trials.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="space-y-4">
              {trials.map((trial) => (
                <div
                  key={trial.nctId}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <Link
                        href={`/trials/${trial.nctId}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {trial.trialData.title || "Untitled Study"}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        NCT ID: {trial.nctId}
                      </p>
                    </div>
                    <button
                      onClick={() => handleUnsave(trial.nctId)}
                      className="px-3 py-1 text-sm font-medium bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  </div>

                  {trial.trialData.status && (
                    <div className="mb-3">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                          trial.trialData.status === "RECRUITING"
                            ? "bg-green-100 text-green-800"
                            : trial.trialData.status === "NOT_YET_RECRUITING"
                            ? "bg-yellow-100 text-yellow-800"
                            : trial.trialData.status === "COMPLETED"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {trial.trialData.status}
                      </span>
                    </div>
                  )}

                  {trial.trialData.summary && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {trial.trialData.summary}
                    </p>
                  )}

                  {trial.savedAt && (
                    <p className="text-xs text-gray-400 mt-3">
                      Saved on {new Date(trial.savedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
