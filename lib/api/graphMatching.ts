// API Client for Neo4j Graph-Based Matching

import type {
  SmartMatchRequest,
  SmartMatchResponse,
  RelatedTrialsResponse,
  RecommendationsResponse,
  ConditionHierarchyResponse,
} from "../types/graph";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

/**
 * Smart Match - Graph-based trial matching
 * Uses Neo4j to find trials based on condition relationships
 */
export async function smartMatch(
  criteria: SmartMatchRequest
): Promise<SmartMatchResponse> {
  const response = await fetch(`${API_BASE_URL}/api/trials/smart-match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(criteria),
  });

  if (!response.ok) {
    throw new Error("Smart match failed");
  }

  return response.json();
}

/**
 * Get Related Trials
 * Find trials related to a specific trial through graph relationships
 */
export async function getRelatedTrials(
  nctId: string,
  limit = 10
): Promise<RelatedTrialsResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/trials/${nctId}/related?limit=${limit}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch related trials");
  }

  return response.json();
}

/**
 * Get Personalized Recommendations
 * Based on user's medical history from the database
 */
export async function getRecommendations(
  limit = 10
): Promise<RecommendationsResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/recommendations?limit=${limit}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch recommendations");
  }

  return response.json();
}

/**
 * Get Condition Hierarchy
 * Get parent/child relationships for a medical condition
 */
export async function getConditionHierarchy(
  condition: string
): Promise<ConditionHierarchyResponse> {
  const encodedCondition = encodeURIComponent(condition);
  const response = await fetch(
    `${API_BASE_URL}/api/conditions/hierarchy?condition=${encodedCondition}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch condition hierarchy");
  }

  return response.json();
}
