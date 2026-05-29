import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import {
  affectedByStatePath,
  allowedActionsForRoute,
  applicationImpact,
  benchmarksForHotPath,
  compileApplicationGraph,
  createApplicationFeatureMap,
  createApplicationGraph,
  createApplicationProof,
  createApplicationRegistryGraph,
  decodeApplicationJsonl,
  encodeApplicationJsonl,
  queryApplicationGraph
} from '../dist/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.resolve(__dirname, '..');
const repoRoot = path.basename(path.dirname(packageDir)) === 'packages'
  ? path.resolve(packageDir, '..', '..')
  : packageDir;
const args = parseArgs(process.argv.slice(2));
const nodeCount = readPositiveInt(args.nodes, 1000);
const rounds = readPositiveInt(args.rounds, 30);
const outPath = args.out ? path.resolve(repoRoot, args.out) : null;

const input = makeGraphInput(nodeCount);
let graph = createApplicationGraph(input);
let compiled = compileApplicationGraph(graph);
let impact = affectedByStatePath(compiled, '/entities/feature-1/1/value');
let jsonl = encodeApplicationJsonl([graph, impact]);
let cursor = 0;

const rows = [
  measure('create-graph-' + nodeCount, 8, () => {
    graph = createApplicationGraph(input);
    return graph.nodes.length + graph.edges.length;
  }),
  measure('compile-graph-' + nodeCount, 8, () => {
    compiled = compileApplicationGraph(graph);
    return compiled.nodesById.size;
  }),
  measure('query-feature', 64, () => queryApplicationGraph(compiled, { features: ['feature-' + (cursor++ % 32)] }).nodeIds.length),
  measure('query-route', 64, () => queryApplicationGraph(compiled, { routes: ['/feature-' + (cursor++ % 32)] }).nodeIds.length),
  measure('query-state', 64, () => queryApplicationGraph(compiled, { states: ['/entities/feature-' + (cursor++ % 32) + '/' + (cursor % 64) + '/value'] }).nodeIds.length),
  measure('impact-state', 32, () => {
    impact = affectedByStatePath(compiled, '/entities/feature-' + (cursor++ % 32) + '/' + (cursor % 64) + '/value');
    return impact.nodeIds.length;
  }),
  measure('impact-feature', 32, () => applicationImpact(compiled, { features: ['feature-' + (cursor++ % 32)], direction: 'both' }).nodeIds.length),
  measure('allowed-actions-route', 32, () => allowedActionsForRoute(compiled, '/feature-' + (cursor++ % 32)).actions.length),
  measure('benchmarks-hot-path', 32, () => benchmarksForHotPath(compiled, 'feature-' + (cursor++ % 32) + '.hot').benchmarks.length),
  measure('feature-map', 8, () => createApplicationFeatureMap(compiled).features.length),
  measure('registry-graph', 4, () => {
    const registry = createApplicationRegistryGraph(compiled);
    return registry.entries.length + registry.edges.length + registry.records.length;
  }),
  measure('jsonl-encode', 16, () => {
    jsonl = encodeApplicationJsonl([graph, impact]);
    return jsonl.length;
  }),
  measure('jsonl-decode', 16, () => decodeApplicationJsonl(jsonl).length),
  measure('proof', 8, () => createApplicationProof(graph).hash.length)
];

const report = {
  package: '@shapeshift-labs/frontier-application',
  version: readPackageVersion(),
  generatedAt: new Date().toISOString(),
  node: process.version,
  platform: process.platform + ' ' + process.arch,
  nodeCount,
  edgeCount: graph.edges.length,
  rounds,
  rows
};

if (outPath) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + '\n');
}

console.log(report.package + ' package benchmark');
console.log('Node ' + report.node + ' on ' + report.platform + ', nodes=' + nodeCount + ', rounds=' + rounds);
console.log('These are Frontier-only package measurements, not competitor comparisons.');
console.log('');
console.log(padRight('Fixture', 28) + padLeft('Median', 12) + padLeft('p95', 12));
for (const row of rows) console.log(padRight(row.fixture, 28) + padLeft(formatUs(row.medianUs), 12) + padLeft(formatUs(row.p95Us), 12));
if (outPath) console.log('\nwrote ' + path.relative(repoRoot, outPath));

function makeGraphInput(count) {
  const nodes = [];
  const edges = [];
  const evidence = [];
  const featureCount = 32;
  for (let featureIndex = 0; featureIndex < featureCount; featureIndex++) {
    const feature = 'feature-' + featureIndex;
    nodes.push({ id: 'feature:' + feature, kind: 'feature', feature, owners: ['@team/' + feature], routes: ['/' + feature] });
    nodes.push({ id: 'route:/' + feature, kind: 'route', feature, routes: ['/' + feature], views: [feature + '.view'], actions: ['action.' + feature + '.save'], policies: ['policy.' + feature + '.write'] });
    nodes.push({ id: 'view:' + feature + '.view', kind: 'view', feature, views: [feature + '.view'], reads: ['/entities/' + feature], actions: ['action.' + feature + '.save'] });
  }
  for (let i = 0; i < count; i++) {
    const feature = 'feature-' + (i % featureCount);
    const pathName = '/entities/' + feature + '/' + (i % 64) + '/value';
    const actionId = 'action:' + feature + '.' + i;
    nodes.push({
      id: actionId,
      kind: 'action',
      feature,
      actions: ['action.' + feature + '.save'],
      mutations: ['mutation.' + feature + '.set'],
      writes: [pathName],
      effects: i % 3 === 0 ? ['effect.' + feature + '.sync'] : [],
      workers: i % 4 === 0 ? ['worker.' + feature + '.job'] : [],
      assets: i % 5 === 0 ? ['public/' + feature + '/' + i + '.png'] : [],
      tests: ['spec.' + feature + '.' + (i % 23)],
      traces: ['journey.' + feature],
      policies: ['policy.' + feature + '.write'],
      workflows: ['workflow.' + feature],
      benchmarks: i % 7 === 0 ? ['bench.' + feature] : [],
      hotPaths: i % 7 === 0 ? [feature + '.hot'] : [],
      dependsOn: ['route:/' + feature]
    });
    edges.push({ from: 'route:/' + feature, to: actionId, kind: 'binds-action' });
    if (i % 8 === 0) evidence.push({ id: 'trace-run:' + i, kind: 'trace', nodes: [actionId], paths: [pathName], traces: ['journey.' + feature], status: 'ok' });
  }
  return { id: 'bench.application', nodes, edges, evidence };
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

function padRight(value, width) {
  return String(value).padEnd(width, ' ');
}

function padLeft(value, width) {
  return String(value).padStart(width, ' ');
}

function readPackageVersion() {
  return JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json'), 'utf8')).version;
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
