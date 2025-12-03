// TypeScript types for Neo4j Graph-Based Matching

export interface SmartMatchRequest {
  conditions: string[];
  location?: string;
  age?: number;
  gender?: string;
  maxDistance?: number;
}

export interface MatchResult {
  nctId: string;
  title: string;
  status: string;
  phase: string[];
  matchScore: number;
}

export interface SmartMatchResponse {
  success: boolean;
  matches: MatchResult[];
  totalMatches: number;
  method: string;
}

export interface RelatedTrial {
  nctId: string;
  title: string;
  status: string;
  phase: string[];
  sharedConditions: string[];
  sharedLocations: string[];
  relationshipScore: number;
}

export interface RelatedTrialsResponse {
  success: boolean;
  nctId: string;
  relatedTrials: RelatedTrial[];
  totalFound: number;
}

export interface Recommendation {
  nctId: string;
  title: string;
  status: string;
  phase: string[];
  matchingConditions: string[];
  matchScore: number;
}

export interface RecommendationsResponse {
  success: boolean;
  recommendations: Recommendation[];
  totalFound: number;
}

export interface ConditionHierarchy {
  condition: string;
  parents: string[];
  children: string[];
}

export interface ConditionHierarchyResponse {
  success: boolean;
  hierarchy: ConditionHierarchy;
}
