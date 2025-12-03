"use client";

import { useState, useEffect } from "react";
import { saveTrial, unsaveTrial, getSavedTrials } from "@/lib/api";

interface SaveButtonProps {
  nctId: string;
  trialData: {
    title?: string;
    status?: string;
    summary?: string;
  };
}

export default function SaveButton({ nctId, trialData }: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkIfSaved();
  }, [nctId]);

  const checkIfSaved = async () => {
    try {
      const savedTrials = await getSavedTrials();
      const saved = savedTrials.some((trial) => trial.nctId === nctId);
      setIsSaved(saved);
    } catch (err) {
      console.error("Failed to check saved status:", err);
    }
  };

  const handleToggle = async () => {
    setLoading(true);

    try {
      if (isSaved) {
        await unsaveTrial(nctId);
        setIsSaved(false);
      } else {
        await saveTrial({ nctId, trialData });
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Failed to toggle save:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
        isSaved
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title={isSaved ? "Unsave trial" : "Save trial"}
    >
      {loading ? "..." : isSaved ? "Saved" : "Save"}
    </button>
  );
}
