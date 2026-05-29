import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import {
  affectedByStatePath,
  applicationImpact,
  compileApplicationGraph,
  createApplicationGraph,
  queryApplicationGraph
} from '../dist/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.resolve(__dirname, '..');
const repoRoot = path.basename(path.dirname(packageDir)) === 'packages'
  ? path.resolve(packageDir, '..', '..')
  : packageDir;
const args = parseArgs(process.argv.slice(2));
const nodes = readPositiveInt(args.nodes, 1000);
const rounds = readPositiveInt(args.rounds, 30);
const outPath = args.out ? path.resolve(repoRoot, args.out) : null;

const input = makeGraphInput(nodes);
const graph = createApplicationGraph(input);
const compiled = compileApplicationGraph(graph);
const appMapEvents = input.nodes.map((node) => ({ event: node.kind, id: node.id, feature: node.feature, path: node.writes?.[0] ?? node.reads?.[0], route: node.routes?.[0], action: node.actions?.[0] }));
const catalogEntities = input.nodes.map((node) => ({ kind: node.kind, metadata: { name: node.id, tags: node.tags ?? [] }, spec: { owner: node.owner, system: node.feature, lifecycle: 'production' } }));
const projectGraph = input.nodes.map((node) => ({ id: node.id, deps: input.edges.filter((edge) => edge.from === node.id).map((edge) => edge.to), files: node.files ?? [] }));
let cursor = 0;

const rows = [
  measure('frontier-application:query-state', 64, () => queryApplicationGraph(compiled, { states: ['/entities/feature-' + (cursor++ % 32) + '/' + (cursor % 64) + '/value'] }).nodeIds.length),
  measure('frontier-application:impact-state', 32, () => affectedByStatePath(compiled, '/entities/feature-' + (cursor++ % 32) + '/' + (cursor % 64) + '/value').nodeIds.length),
  measure('frontier-application:impact-feature', 32, () => applicationImpact(compiled, { features: ['feature-' + (cursor++ % 32)], direction: 'both' }).nodeIds.length),
  measure('plain-appmap-scan-path', 32, () => scanAppMapPath(appMapEvents, '/entities/feature-' + (cursor++ % 32) + '/' + (cursor % 64) + '/value')),
  measure('catalog-filter-feature', 32, () => scanCatalogFeature(catalogEntities, 'feature-' + (cursor++ % 32))),
  measure('project-graph-affected', 32, () => scanProjectGraph(projectGraph, 'action:feature-' + (cursor++ % 32) + '.' + (cursor % nodes)))
];

const report = {
  package: '@shapeshift-labs/frontier-application',
  type: 'competitor-control',
  generatedAt: new Date().toISOString(),
  node: process.version,
  platform: process.platform + ' ' + process.arch,
  nodes,
  rounds,
  notes: [
    'AppMap, Backstage catalog, and Nx project-graph rows are representative object-shape controls.',
    'Frontier rows include state/resource path indexes, typed app resources, evidence, and bounded impact traversal.'
  ],
  rows
};

if (outPath) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + '\n');
}

console.log('frontier-application competitor/control benchmark');
console.log('Node ' + report.node + ' on ' + report.platform + ', nodes=' + nodes + ', rounds=' + rounds);
console.log('Fixture'.padEnd(38) + 'Median'.padStart(12) + 'p95'.padStart(12));
for (const row of rows) console.log(row.fixture.padEnd(38) + formatUs(row.medianUs).padStart(12) + formatUs(row.p95Us).padStart(12));
if (outPath) console.log('\nwrote ' + path.relative(repoRoot, outPath));

function makeGraphInput(count) {
  const entries = [];
  const edges = [];
  for (let i = 0; i < count; i++) {
    const feature = 'feature-' + (i % 32);
    const route = '/' + feature;
    const pathName = '/entities/' + feature + '/' + (i % 64) + '/value';
    const id = 'action:' + feature + '.' + i;
    entries.push({ id, kind: 'action', feature, routes: [route], actions: ['action.' + feature + '.save'], writes: [pathName], tests: ['spec.' + feature], tags: ['bench'] });
    if (i > 0) edges.push({ from: id, to: 'action:feature-' + ((i - 1) % 32) + '.' + (i - 1), kind: 'depends-on' });
  }
  return { id: 'control.application', nodes: entries, edges };
}

function scanAppMapPath(rows, pathName) {
  let count = 0;
  for (const row of rows) if (row.path === pathName || (row.path && pathName.startsWith(row.path + '/'))) count++;
  return count;
}

function scanCatalogFeature(rows, feature) {
  let count = 0;
  for (const row of rows) if (row.spec.system === feature) count++;
  return count;
}

function scanProjectGraph(rows, id) {
  const seen = new Set([id]);
  const queue = [id];
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const current = queue[cursor];
    for (const row of rows) {
      if (!row.deps.includes(current) || seen.has(row.id)) continue;
      seen.add(row.id);
      queue.push(row.id);
    }
  }
  return seen.size;
}

function measure(fixture, batchSize, fn) {
  const values = [];
  let sink = 0;
  for (let round = 0; round < rounds; round++) {
    const started = performance.now();
    for (let i = 0; i < batchSize; i++) sink += fn();
    values[values.length] = ((performance.now() - started) * 1000) / batchSize;
  }
  if (sink === -1) console.log('sink=' + sink);
  values.sort((left, right) => left - right);
  return { fixture, medianUs: percentile(values, 0.5), p95Us: percentile(values, 0.95) };
}

function percentile(values, p) {
  return values[Math.min(values.length - 1, Math.floor((values.length - 1) * p))] ?? 0;
}

function formatUs(value) {
  if (value >= 1000) return (value / 1000).toFixed(2) + ' ms';
  return value.toFixed(2) + ' us';
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--nodes') out.nodes = argv[++i];
    else if (argv[i] === '--rounds') out.rounds = argv[++i];
    else if (argv[i] === '--out') out.out = argv[++i];
  }
  return out;
}

function readPositiveInt(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}
