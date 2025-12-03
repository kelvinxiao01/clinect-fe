"use client";

import { useState, FormEvent } from "react";
import { RECRUITMENT_STATUS_OPTIONS, RecruitmentStatus, MedicalHistory } from "@/lib/types";
import { getMedicalHistory } from "@/lib/api";

interface SearchFiltersProps {
  onSearch: (filters: {
    condition: string;
    location: string;
    status: RecruitmentStatus;
  }) => void;
}

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<RecruitmentStatus>("ALL");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch({ condition, location, status });
  };

  const handleUseMedicalHistory = async () => {
    setLoading(true);
    try {
      const history: MedicalHistory = await getMedicalHistory();

      if (history.conditions) {
        setCondition(history.conditions);
      }
      if (history.location) {
        setLocation(history.location);
      }
    } catch (err) {
      console.error("Failed to load medical history:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label
            htmlFor="condition"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Condition / Disease
          </label>
          <input
            id="condition"
            type="text"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            placeholder="e.g., diabetes, cancer"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., New York, California"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Recruitment Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as RecruitmentStatus)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {RECRUITMENT_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Search Trials
        </button>

        <button
          type="button"
          onClick={handleUseMedicalHistory}
          disabled={loading}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Use My Medical History"}
        </button>
      </div>
    </form>
  );
}
