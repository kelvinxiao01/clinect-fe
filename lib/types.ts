// API Response Types for Clinect Platform

export interface User {
  id: number;
  username: string;
  created_at: string;
}

export interface LoginResponse {
  success: boolean;
  username?: string;
  error?: string;
}

export interface CurrentUserResponse {
  logged_in: boolean;
  username?: string;
}

export interface MedicalHistory {
  age?: number;
  gender?: string;
  location?: string;
  conditions?: string;
  medications?: string;
}

export interface MedicalHistoryResponse {
  success?: boolean;
  data?: MedicalHistory;
  error?: string;
}

// Clinical Trials API Types (based on ClinicalTrials.gov schema)
export interface ProtocolSection {
  identificationModule?: {
    nctId: string;
    briefTitle?: string;
    officialTitle?: string;
    organization?: {
      fullName?: string;
      class?: string;
    };
  };
  statusModule?: {
    statusVerifiedDate?: string;
    overallStatus?: string;
    lastKnownStatus?: string;
    startDateStruct?: {
      date?: string;
      type?: string;
    };
    completionDateStruct?: {
      date?: string;
      type?: string;
    };
  };
  descriptionModule?: {
    briefSummary?: string;
    detailedDescription?: string;
  };
  conditionsModule?: {
    conditions?: string[];
  };
  designModule?: {
    studyType?: string;
    phases?: string[];
    enrollmentInfo?: {
      count?: number;
      type?: string;
    };
  };
  armsInterventionsModule?: {
    interventions?: Array<{
      type?: string;
      name?: string;
      description?: string;
    }>;
  };
  eligibilityModule?: {
    eligibilityCriteria?: string;
    healthyVolunteers?: boolean;
    sex?: string;
    minimumAge?: string;
    maximumAge?: string;
    stdAges?: string[];
  };
  contactsLocationsModule?: {
    centralContacts?: Array<{
      name?: string;
      role?: string;
      phone?: string;
      email?: string;
    }>;
    locations?: Array<{
      facility?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
      geoPoint?: {
        lat?: number;
        lon?: number;
      };
    }>;
  };
}

export interface Study {
  protocolSection: ProtocolSection;
}

export interface TrialsSearchResponse {
  studies?: Study[];
  totalCount?: number;
  nextPageToken?: string;
  cached?: boolean;
  error?: string;
}

export interface TrialDetailsResponse {
  protocolSection?: ProtocolSection;
  cached?: boolean;
  error?: string;
}

export interface SavedTrial {
  nctId: string;
  trialData: {
    title?: string;
    status?: string;
    summary?: string;
  };
  savedAt?: string;
}

export interface SaveTrialRequest {
  nctId: string;
  trialData: {
    title?: string;
    status?: string;
    summary?: string;
  };
}

export interface SaveTrialResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Recruitment status options
export type RecruitmentStatus =
  | "RECRUITING"
  | "NOT_YET_RECRUITING"
  | "ENROLLING_BY_INVITATION"
  | "ALL";

export const RECRUITMENT_STATUS_OPTIONS: Array<{ value: RecruitmentStatus; label: string }> = [
  { value: "ALL", label: "All" },
  { value: "RECRUITING", label: "Recruiting" },
  { value: "NOT_YET_RECRUITING", label: "Not Yet Recruiting" },
  { value: "ENROLLING_BY_INVITATION", label: "Enrolling by Invitation" },
];
