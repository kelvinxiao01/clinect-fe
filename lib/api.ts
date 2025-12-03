// API Client for Clinect Backend

import {
  LoginResponse,
  CurrentUserResponse,
  MedicalHistory,
  MedicalHistoryResponse,
  TrialsSearchResponse,
  TrialDetailsResponse,
  SavedTrial,
  SaveTrialRequest,
  SaveTrialResponse,
  RecruitmentStatus,
} from "./types";

// Backend API base URL - adjust for your environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// ============================================================================
// Authentication API
// ============================================================================

export async function login(username: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Important for session cookies
    body: JSON.stringify({ username }),
  });

  return response.json();
}

export async function logout(): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE_URL}/api/logout`, {
    method: "POST",
    credentials: "include",
  });

  return response.json();
}

export async function getCurrentUser(): Promise<CurrentUserResponse> {
  const response = await fetch(`${API_BASE_URL}/api/current-user`, {
    credentials: "include",
  });

  return response.json();
}

// ============================================================================
// Medical History API
// ============================================================================

export async function saveMedicalHistory(
  history: MedicalHistory
): Promise<MedicalHistoryResponse> {
  const response = await fetch(`${API_BASE_URL}/api/medical-history`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(history),
  });

  return response.json();
}

export async function getMedicalHistory(): Promise<MedicalHistory> {
  const response = await fetch(`${API_BASE_URL}/api/medical-history`, {
    credentials: "include",
  });

  return response.json();
}

// ============================================================================
// Clinical Trials API
// ============================================================================

export interface SearchTrialsParams {
  condition?: string;
  location?: string;
  status?: RecruitmentStatus;
  pageSize?: number;
  pageToken?: string;
  useCache?: boolean;
}

export async function searchTrials(
  params: SearchTrialsParams
): Promise<TrialsSearchResponse> {
  const queryParams = new URLSearchParams();

  if (params.condition) queryParams.append("condition", params.condition);
  if (params.location) queryParams.append("location", params.location);
  if (params.status && params.status !== "ALL") {
    queryParams.append("status", params.status);
  }
  if (params.pageSize) queryParams.append("pageSize", params.pageSize.toString());
  if (params.pageToken) queryParams.append("pageToken", params.pageToken);
  if (params.useCache !== undefined) {
    queryParams.append("use_cache", params.useCache.toString());
  }

  const response = await fetch(
    `${API_BASE_URL}/api/trials/search?${queryParams.toString()}`,
    {
      credentials: "include",
    }
  );

  return response.json();
}

export async function getTrialDetails(nctId: string): Promise<TrialDetailsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/trials/${nctId}`, {
    credentials: "include",
  });

  return response.json();
}

// ============================================================================
// Saved Trials API
// ============================================================================

export async function getSavedTrials(): Promise<SavedTrial[]> {
  const response = await fetch(`${API_BASE_URL}/api/saved-trials`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch saved trials");
  }

  return response.json();
}

export async function saveTrial(
  request: SaveTrialRequest
): Promise<SaveTrialResponse> {
  const response = await fetch(`${API_BASE_URL}/api/saved-trials`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(request),
  });

  return response.json();
}

export async function unsaveTrial(nctId: string): Promise<SaveTrialResponse> {
  const response = await fetch(`${API_BASE_URL}/api/saved-trials/${nctId}`, {
    method: "DELETE",
    credentials: "include",
  });

  return response.json();
}
