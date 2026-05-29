import assert from 'node:assert';
import {
  affectedByStatePath,
  answerApplicationQuestion,
  applicationImpact,
  compileApplicationGraph,
  createApplicationFeatureMap,
  createApplicationGraph,
  createApplicationProof,
  createApplicationRegistryGraph,
  decodeApplicationJsonl,
  encodeApplicationJsonl,
  queryApplicationGraph,
  validateApplicationGraph
} from '../dist/index.js';

const args = parseArgs(process.argv.slice(2));
const cases = readPositiveInt(args.cases, 500);
let seed = readPositiveInt(args.seed, 0x0a9917);
let checked = 0;

for (let i = 0; i < cases; i++) {
  const input = makeGraphInput(i);
  const graph = createApplicationGraph(input);
  const compiled = compileApplicationGraph(graph);
  const validation = validateApplicationGraph(graph);
  assert.strictEqual(compiled.validation.valid, validation.valid);

  const feature = 'feature-' + nextInt(input.featureCount);
  const featureResult = queryApplicationGraph(compiled, { features: [feature] });
  assert.ok(featureResult.nodes.every((node) => node.feature === feature || node.id === 'feature:' + feature));

  const path = '/entities/' + feature + '/' + nextInt(input.recordsPerFeature) + '/value';
  const pathResult = queryApplicationGraph(compiled, { states: [path] });
  assert.ok(pathResult.nodes.every((node) => touchesPath(node, path)));

  const action = 'action.' + feature + '.save';
  const actionResult = queryApplicationGraph(compiled, { actions: [action] });
  assert.ok(actionResult.nodes.every((node) => node.actions.includes(action) || node.id === 'action:' + action));

  const impact = affectedByStatePath(compiled, path);
  assert.ok(impact.nodeIds.every((id) => compiled.nodesById.has(id)));
  assert.ok(applicationImpact(compiled, { features: [feature], direction: 'both' }).features.includes(feature));
  assert.strictEqual(createApplicationFeatureMap(compiled).summary.nodeCount, graph.summary.nodeCount);
  assert.ok(createApplicationRegistryGraph(compiled).entries.length >= graph.nodes.length);
  assert.strictEqual(decodeApplicationJsonl(encodeApplicationJsonl([graph, impact])).length, 2);
  assert.notStrictEqual(createApplicationProof(answerApplicationQuestion(compiled, 'feature-touches', feature)).hash.length, 0);
  checked++;
}

console.log('frontier-application fuzz ok: ' + checked + ' cases');

function makeGraphInput(index) {
  const featureCount = 2 + nextInt(6);
  const recordsPerFeature = 4 + nextInt(10);
  const nodes = [];
  const edges = [];
  const evidence = [];
  for (let featureIndex = 0; featureIndex < featureCount; featureIndex++) {
    const feature = 'feature-' + featureIndex;
    nodes.push({ id: 'feature:' + feature, kind: 'feature', feature, owners: ['@team/' + feature] });
    nodes.push({ id: 'route:/' + feature, kind: 'route', feature, routes: ['/' + feature], views: [feature + '.view'], actions: ['action.' + feature + '.save'], policies: ['policy.' + feature + '.write'] });
    nodes.push({ id: 'view:' + feature + '.view', kind: 'view', feature, views: [feature + '.view'], reads: ['/entities/' + feature], actions: ['action.' + feature + '.save'] });
    for (let j = 0; j < recordsPerFeature; j++) {
      const path = '/entities/' + feature + '/' + j + '/value';
      const actionId = 'action:' + feature + '.' + j;
      nodes.push({
        id: actionId,
        kind: 'action',
        feature,
        actions: ['action.' + feature + '.save'],
        writes: [path],
        mutations: ['mutation.' + feature + '.set'],
        effects: j % 3 === 0 ? ['effect.' + feature + '.sync'] : [],
        workers: j % 4 === 0 ? ['worker.' + feature + '.job'] : [],
        assets: j % 5 === 0 ? ['public/' + feature + '/' + j + '.png'] : [],
        tests: ['spec.' + feature + '.' + j],
        traces: ['journey.' + feature],
        benchmarks: j % 6 === 0 ? ['bench.' + feature] : [],
        hotPaths: j % 6 === 0 ? [feature + '.hot'] : [],
        policies: ['policy.' + feature + '.write'],
        workflows: ['workflow.' + feature]
      });
      edges.push({ from: 'route:/' + feature, to: actionId, kind: 'binds-action' });
      if (j % 7 === 0) evidence.push({ id: 'trace:' + index + ':' + feature + ':' + j, kind: 'trace', nodes: [actionId], paths: [path], traces: ['journey.' + feature], status: 'ok' });
    }
  }
  return { id: 'graph-' + index, featureCount, recordsPerFeature, nodes, edges, evidence };
}

function touchesPath(node, path) {
  const paths = node.states.concat(node.reads, node.writes);
  return paths.some((candidate) => path === candidate || path.startsWith(candidate + '/') || candidate.startsWith(path + '/'));
}

function nextInt(max) {
  return next() % max;
}

function next() {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed;
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--cases') out.cases = argv[++i];
    else if (argv[i] === '--seed') out.seed = argv[++i];
  }
  return out;
}

function readPositiveInt(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}
