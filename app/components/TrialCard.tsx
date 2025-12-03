import Link from "next/link";
import { Study } from "@/lib/types";
import SaveButton from "./SaveButton";

interface TrialCardProps {
  study: Study;
  showSaveButton?: boolean;
}

export default function TrialCard({ study, showSaveButton = true }: TrialCardProps) {
  const { protocolSection } = study;
  const nctId = protocolSection?.identificationModule?.nctId || "";
  const title =
    protocolSection?.identificationModule?.briefTitle ||
    protocolSection?.identificationModule?.officialTitle ||
    "Untitled Study";
  const status = protocolSection?.statusModule?.overallStatus || "Unknown";
  const summary = protocolSection?.descriptionModule?.briefSummary || "";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <Link
            href={`/trials/${nctId}`}
            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            {title}
          </Link>
          <p className="text-sm text-gray-500 mt-1">NCT ID: {nctId}</p>
        </div>
        {showSaveButton && (
          <SaveButton
            nctId={nctId}
            trialData={{ title, status, summary }}
          />
        )}
      </div>

      <div className="mb-3">
        <span
          className={`inline-block px-2 py-1 text-xs font-medium rounded ${
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

      {summary && (
        <p className="text-sm text-gray-600 line-clamp-3">{summary}</p>
      )}
    </div>
  );
}
