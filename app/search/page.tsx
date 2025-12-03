"use client";

import { useState } from "react";
import Link from "next/link";
import SearchFilters from "@/app/components/SearchFilters";
import TrialCard from "@/app/components/TrialCard";
import Recommendations from "@/app/components/Recommendations";
import { searchTrials } from "@/lib/api";
import { Study, RecruitmentStatus } from "@/lib/types";

export default function SearchPage() {
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const handleSearch = async (filters: {
    condition: string;
    location: string;
    status: RecruitmentStatus;
  }) => {
    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const response = await searchTrials({
        condition: filters.condition,
        location: filters.location,
        status: filters.status,
        pageSize: 20,
      });

      if (response.error) {
        setError(response.error);
        setStudies([]);
      } else {
        setStudies(response.studies || []);
        setTotalCount(response.totalCount || 0);
      }
    } catch (err) {
      setError("Failed to search trials. Please try again.");
      setStudies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">
            Search Clinical Trials
          </h1>
          <Link
            href="/smart-match"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            🧠 Smart Match
          </Link>
        </div>

        <Recommendations />

        <SearchFilters onSearch={handleSearch} />

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Searching trials...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {!loading && searched && studies.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-600">No trials found. Try adjusting your search criteria.</p>
          </div>
        )}

        {!loading && studies.length > 0 && (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Found {totalCount} trial{totalCount !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="space-y-4">
              {studies.map((study) => (
                <TrialCard
                  key={study.protocolSection?.identificationModule?.nctId}
                  study={study}
                />
              ))}
            </div>
          </>
        )}

        {!loading && !searched && (
          <div className="text-center py-12">
            <p className="text-gray-500">Enter search criteria above to find clinical trials</p>
          </div>
        )}
      </div>
    </div>
  );
}
