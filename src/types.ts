import { z } from 'zod';

export const DecisionRequestSchema = z.object({
  topic: z
    .string({ required_error: 'Topic is required' })
    .trim()
    .min(3, 'Decision topic must be at least 3 characters long')
    .max(500, 'Topic is too long (max 500 characters)'),
  constraints: z
    .string()
    .trim()
    .max(1000, 'Constraints cannot exceed 1000 characters')
    .optional()
    .or(z.literal('')),
});

export type DecisionRequest = z.infer<typeof DecisionRequestSchema>;

export interface SearchCitation {
  id: number;
  title: string;
  url: string;
  domain: string;
  snippet: string;
}

export interface OptionEvaluation {
  name: string;
  tagline: string;
  keyPros: string[];
  keyCons: string[];
  hardDealbreaker: string | null;
  score: number;
  citations: number[];
}

export interface FinalConsensus {
  winner: string;
  tagline: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  whyItWins: string[];
  mainTradeoff: string;
  verifiedFacts: string[];
  assumptions: string[];
  unknowns: string[];
  rejectedAlternatives: {
    name: string;
    reasonRejected: string;
  }[];
  discardedFluff: string[];
}

export interface ComparisonMatrix {
  options: string[];
  metrics: {
    name: string;
    values: Record<string, string>;
  }[];
}

export interface DecisionRecord {
  id: string;
  topic: string;
  constraints?: string;
  createdAt: string;
  executionTimeMs: number;
  engineUsed: string;
  searchProviderUsed: string;
  sources: SearchCitation[];
  options: OptionEvaluation[];
  consensus: FinalConsensus;
  matrix: ComparisonMatrix;
}

export interface ProviderStatus {
  id: string;
  name: string;
  configured: boolean;
  type: 'llm' | 'search';
  model?: string;
}

export interface SystemStatus {
  isConfigured: boolean;
  activeLlmProvider: string | null;
  activeSearchProvider: string | null;
  providers: ProviderStatus[];
  error?: string;
}
