import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import type { DecisionRecord } from './types.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'greg.db');

let dbInstance: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (dbInstance) {
    return dbInstance;
  }

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  dbInstance = new Database(DB_PATH);
  dbInstance.pragma('journal_mode = WAL');

  // Initialize schema
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS decisions (
      id TEXT PRIMARY KEY,
      topic TEXT NOT NULL,
      constraints TEXT,
      created_at TEXT NOT NULL,
      execution_time_ms INTEGER NOT NULL,
      engine_used TEXT NOT NULL,
      search_provider_used TEXT NOT NULL,
      winner TEXT NOT NULL,
      confidence TEXT NOT NULL,
      sources_json TEXT NOT NULL,
      options_json TEXT NOT NULL,
      consensus_json TEXT NOT NULL,
      matrix_json TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_decisions_created_at ON decisions(created_at DESC);
  `);

  return dbInstance;
}

export function saveDecision(record: DecisionRecord): void {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO decisions (
      id, topic, constraints, created_at, execution_time_ms,
      engine_used, search_provider_used, winner, confidence,
      sources_json, options_json, consensus_json, matrix_json
    ) VALUES (
      @id, @topic, @constraints, @created_at, @execution_time_ms,
      @engine_used, @search_provider_used, @winner, @confidence,
      @sources_json, @options_json, @consensus_json, @matrix_json
    )
  `);

  stmt.run({
    id: record.id,
    topic: record.topic,
    constraints: record.constraints || null,
    created_at: record.createdAt,
    execution_time_ms: record.executionTimeMs,
    engine_used: record.engineUsed,
    search_provider_used: record.searchProviderUsed,
    winner: record.consensus.winner,
    confidence: record.consensus.confidence,
    sources_json: JSON.stringify(record.sources),
    options_json: JSON.stringify(record.options),
    consensus_json: JSON.stringify(record.consensus),
    matrix_json: JSON.stringify(record.matrix),
  });
}

export function listRecentDecisions(limit: number = 20): Array<{
  id: string;
  topic: string;
  constraints?: string;
  createdAt: string;
  winner: string;
  confidence: string;
  executionTimeMs: number;
}> {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT id, topic, constraints, created_at as createdAt, winner, confidence, execution_time_ms as executionTimeMs
    FROM decisions
    ORDER BY created_at DESC
    LIMIT ?
  `);

  return stmt.all(limit) as Array<{
    id: string;
    topic: string;
    constraints?: string;
    createdAt: string;
    winner: string;
    confidence: string;
    executionTimeMs: number;
  }>;
}

export function getDecisionById(id: string): DecisionRecord | null {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM decisions WHERE id = ?
  `);

  const row = stmt.get(id) as any;
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    topic: row.topic,
    constraints: row.constraints || undefined,
    createdAt: row.created_at,
    executionTimeMs: row.execution_time_ms,
    engineUsed: row.engine_used,
    searchProviderUsed: row.search_provider_used,
    sources: JSON.parse(row.sources_json),
    options: JSON.parse(row.options_json),
    consensus: JSON.parse(row.consensus_json),
    matrix: JSON.parse(row.matrix_json),
  };
}
