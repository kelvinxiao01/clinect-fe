"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTrialDetails } from "@/lib/api";
import { ProtocolSection } from "@/lib/types";
import SaveButton from "@/app/components/SaveButton";
import RelatedTrials from "@/app/components/RelatedTrials";

export default function TrialDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const nctId = params.nctId as string;

  const [protocol, setProtocol] = useState<ProtocolSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTrialDetails();
  }, [nctId]);

  const loadTrialDetails = async () => {
    try {
      const response = await getTrialDetails(nctId);

      if (response.error) {
        setError(response.error);
      } else if (response.protocolSection) {
        setProtocol(response.protocolSection);
      }
    } catch (err) {
      setError("Failed to load trial details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading trial details...</p>
        </div>
      </div>
    );
  }

  if (error || !protocol) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error || "Trial not found"}</p>
          </div>
          <button
            onClick={() => router.back()}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  const title =
    protocol.identificationModule?.briefTitle ||
    protocol.identificationModule?.officialTitle ||
    "Untitled Study";
  const status = protocol.statusModule?.overallStatus || "Unknown";
  const summary = protocol.descriptionModule?.briefSummary || "";
  const detailedDescription = protocol.descriptionModule?.detailedDescription || "";
  const conditions = protocol.conditionsModule?.conditions || [];
  const eligibility = protocol.eligibilityModule?.eligibilityCriteria || "";
  const minAge = protocol.eligibilityModule?.minimumAge || "";
  const maxAge = protocol.eligibilityModule?.maximumAge || "";
  const sex = protocol.eligibilityModule?.sex || "";
  const studyType = protocol.designModule?.studyType || "";
  const phases = protocol.designModule?.phases || [];
  const interventions = protocol.armsInterventionsModule?.interventions || [];
  const locations = protocol.contactsLocationsModule?.locations || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-700 mb-4"
        >
          ← Back to search
        </button>

        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                {title}
              </h1>
              <p className="text-sm text-gray-500">NCT ID: {nctId}</p>
            </div>
            <SaveButton nctId={nctId} trialData={{ title, status, summary }} />
          </div>

          <div className="mb-6">
            <span
              className={`inline-block px-3 py-1 text-sm font-medium rounded ${
                status === "RECRUITING"
                  ? "bg-green-100 text-green-800"
                  : status === "NOT_YET_RECRUITING"
                  ? "bg-yellow-100 text-yellow-800"
                  : status === "COMPLETED"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {status}
            </span>
          </div>

          {conditions.length > 0 && (
            <Section title="Conditions">
              <ul className="list-disc list-inside space-y-1">
                {conditions.map((condition, idx) => (
                  <li key={idx} className="text-gray-700">
                    {condition}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {summary && (
            <Section title="Brief Summary">
              <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
            </Section>
          )}

          {detailedDescription && (
            <Section title="Detailed Description">
              <p className="text-gray-700 whitespace-pre-wrap">
                {detailedDescription}
              </p>
            </Section>
          )}

          {studyType && (
            <Section title="Study Type">
              <p className="text-gray-700">{studyType}</p>
              {phases.length > 0 && (
                <p className="text-gray-600 text-sm mt-1">
                  Phase: {phases.join(", ")}
                </p>
              )}
            </Section>
          )}

          {interventions.length > 0 && (
            <Section title="Interventions">
              <ul className="space-y-3">
                {interventions.map((intervention, idx) => (
                  <li key={idx} className="border-l-2 border-gray-200 pl-4">
                    <p className="font-medium text-gray-900">
                      {intervention.type}: {intervention.name}
                    </p>
                    {intervention.description && (
                      <p className="text-gray-600 text-sm mt-1">
                        {intervention.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <Section title="Eligibility Criteria">
            {(minAge || maxAge || sex) && (
              <div className="mb-4 space-y-1">
                {sex && (
                  <p className="text-gray-700">
                    <span className="font-medium">Sex:</span> {sex}
                  </p>
                )}
                {minAge && (
                  <p className="text-gray-700">
                    <span className="font-medium">Minimum Age:</span> {minAge}
                  </p>
                )}
                {maxAge && (
                  <p className="text-gray-700">
                    <span className="font-medium">Maximum Age:</span> {maxAge}
                  </p>
                )}
              </div>
            )}
            {eligibility && (
              <p className="text-gray-700 whitespace-pre-wrap text-sm">
                {eligibility}
              </p>
            )}
          </Section>

          {locations.length > 0 && (
            <Section title="Locations">
              <ul className="space-y-2">
                {locations.slice(0, 10).map((location, idx) => (
                  <li key={idx} className="text-gray-700 text-sm">
                    {location.facility && <span className="font-medium">{location.facility}</span>}
                    {location.city && `, ${location.city}`}
                    {location.state && `, ${location.state}`}
                    {location.country && ` - ${location.country}`}
                  </li>
                ))}
                {locations.length > 10 && (
                  <li className="text-gray-500 text-sm italic">
                    And {locations.length - 10} more locations...
                  </li>
                )}
              </ul>
            </Section>
          )}
        </div>

        <RelatedTrials nctId={nctId} />
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 pb-6 border-b border-gray-200 last:border-b-0">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>
      {children}
    </div>
  );
}
