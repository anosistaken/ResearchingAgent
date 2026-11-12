import type { DecisionRecord } from './types.js';

export function formatDecisionAsMarkdown(record: DecisionRecord): string {
  const c = record.consensus;
  const lines: string[] = [];

  lines.push(`# Decision Report: ${record.topic}`);
  lines.push('');
  lines.push(`- **Winner:** ${c.winner}`);
  lines.push(`- **Confidence:** ${c.confidence}`);
  lines.push(`- **Date:** ${new Date(record.createdAt).toUTCString()}`);
  lines.push(`- **Engine:** ${record.engineUsed}`);
  lines.push(`- **Search Provider:** ${record.searchProviderUsed}`);
  if (record.constraints) {
    lines.push(`- **Constraints:** ${record.constraints}`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(`## Recommended Winner: ${c.winner}`);
  lines.push('');
  lines.push(`> ${c.tagline}`);
  lines.push('');
  lines.push('### Why It Wins');
  c.whyItWins.forEach((reason) => {
    lines.push(`- ${reason}`);
  });
  lines.push('');
  lines.push('### Accepted Trade-off');
  lines.push(`${c.mainTradeoff}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Comparison Matrix (What Actually Matters)');
  lines.push('');

  // Markdown Table
  const headers = ['Factor', ...record.matrix.options];
  lines.push(`| ${headers.join(' | ')} |`);
  lines.push(`| ${headers.map(() => ':---').join(' | ')} |`);

  record.matrix.metrics.forEach((m) => {
    const row = [m.name, ...record.matrix.options.map((opt) => m.values[opt] || '-')];
    lines.push(`| ${row.join(' | ')} |`);
  });

  lines.push('');
  lines.push('---');
  lines.push('');

  lines.push('## Verified Facts');
  (c.verifiedFacts || []).forEach((f) => lines.push(`- ${f}`));
  lines.push('');

  lines.push('## Working Assumptions');
  (c.assumptions || []).forEach((a) => lines.push(`- ${a}`));
  lines.push('');

  lines.push('## Unknowns (Not Guessed)');
  (c.unknowns || []).forEach((u) => lines.push(`- ${u}`));
  lines.push('');

  lines.push('## Rejected Alternatives');
  (c.rejectedAlternatives || []).forEach((r) => {
    lines.push(`- **${r.name}**: ${r.reasonRejected}`);
  });
  lines.push('');

  lines.push('## Discarded Marketing Fluff');
  (c.discardedFluff || []).forEach((fluff) => lines.push(`- ${fluff}`));
  lines.push('');

  lines.push('---');
  lines.push('');
  lines.push('## Source Citations');
  record.sources.forEach((s) => {
    lines.push(`- [Source ${s.id}] [${s.title}](${s.url}) (${s.domain})`);
  });
  lines.push('');

  return lines.join('\n');
}
