import assert from 'node:assert';
import {
  affectedByStatePath,
  allowedActionsForRoute,
  answerApplicationQuestion,
  applicationImpact,
  backgroundJobsForAsset,
  benchmarksForHotPath,
  compileApplicationGraph,
  createApplicationFeatureMap,
  createApplicationGraph,
  createApplicationGraphFromManifestLike,
  createApplicationGraphFromRegistryGraph,
  createApplicationProof,
  createApplicationRegistryGraph,
  decodeApplicationJsonl,
  defineApplicationNode,
  encodeApplicationJsonl,
  featureTouches,
  mergeApplicationGraphs,
  queryApplicationGraph,
  tracesForJourney,
  validateApplicationGraph,
  workflowsWritingStatePath
} from '../dist/index.js';

const graph = createApplicationGraph({
  id: 'app.graph',
  generatedAt: 1,
  nodes: [
    {
      id: 'feature:todos',
      kind: 'feature',
      title: 'Todos',
      feature: 'todos',
      owners: ['@team/todos'],
      routes: ['/todos'],
      views: ['todos.list'],
      actions: ['todos.complete'],
      states: ['/entities/todos'],
      tests: ['spec.todos.complete'],
      benchmarks: ['bench.todos.render']
    },
    {
      id: 'route:/todos',
      kind: 'route',
      feature: 'todos',
      routes: ['/todos'],
      views: ['todos.list'],
      actions: ['todos.complete'],
      policies: ['todo.write'],
      traces: ['journey.todos.complete']
    },
    {
      id: 'view:todos.list',
      kind: 'view',
      feature: 'todos',
      views: ['todos.list'],
      actions: ['todos.complete'],
      reads: ['/entities/todos'],
      tests: ['spec.todos.complete']
    },
    {
      id: 'action:todos.complete',
      kind: 'action',
      feature: 'todos',
      actions: ['todos.complete'],
      mutations: ['todos.setDone'],
      effects: ['todos.sync'],
      policies: ['todo.write'],
      workflows: ['workflow.onboarding'],
      writes: ['/entities/todos/t1/done'],
      tests: ['spec.todos.complete'],
      traces: ['journey.todos.complete'],
      hotPaths: ['todos.complete.latency']
    },
    {
      id: 'workflow:workflow.onboarding',
      kind: 'workflow',
      feature: 'todos',
      workflows: ['workflow.onboarding'],
      writes: ['/entities/todos/t1/done']
    },
    {
      id: 'worker:thumbnail.generate',
      kind: 'worker',
      feature: 'todos',
      workers: ['thumbnail.generate'],
      assets: ['public/todos/thumb.png'],
      produces: ['public/todos/thumb.png']
    },
    {
      id: 'asset:public/todos/thumb.png',
      kind: 'asset',
      feature: 'todos',
      assets: ['public/todos/thumb.png'],
      workers: ['thumbnail.generate']
    },
    {
      id: 'policy:todo.write',
      kind: 'policy',
      feature: 'todos',
      policies: ['todo.write'],
      allows: ['action:todos.complete']
    },
    {
      id: 'trace:journey.todos.complete',
      kind: 'trace',
      feature: 'todos',
      traces: ['journey.todos.complete'],
      routes: ['/todos'],
      actions: ['todos.complete']
    },
    {
      id: 'benchmark:bench.todos.render',
      kind: 'benchmark',
      feature: 'todos',
      benchmarks: ['bench.todos.render'],
      hotPaths: ['todos.complete.latency'],
      covers: ['action:todos.complete']
    }
  ],
  edges: [
    { from: 'policy:todo.write', to: 'action:todos.complete', kind: 'allows' },
    { from: 'benchmark:bench.todos.render', to: 'action:todos.complete', kind: 'protects' }
  ],
  evidence: [
    {
      id: 'trace-run:1',
      kind: 'trace',
      nodes: ['trace:journey.todos.complete', 'action:todos.complete'],
      paths: ['/entities/todos/t1/done'],
      traces: ['journey.todos.complete'],
      status: 'ok'
    },
    {
      id: 'bench-run:1',
      kind: 'benchmark',
      nodes: ['benchmark:bench.todos.render'],
      benchmarks: ['bench.todos.render'],
      status: 'ok'
    }
  ]
});

assert.strictEqual(defineApplicationNode({ id: 'route:/settings' }).kind, 'route');
assert.strictEqual(graph.summary.featureCount, 1);
assert.strictEqual(validateApplicationGraph(graph).valid, true);

const compiled = compileApplicationGraph(graph);
assert.strictEqual(compiled.get('action:todos.complete').kind, 'action');
assert.deepStrictEqual(queryApplicationGraph(compiled, { routes: ['/todos'], kinds: ['route'] }).nodeIds, ['route:/todos']);
assert.ok(queryApplicationGraph(compiled, { states: ['/entities/todos/t1'] }).nodeIds.includes('action:todos.complete'));

const feature = featureTouches(compiled, 'todos');
assert.ok(feature.actions.includes('todos.complete'));
assert.ok(feature.routes.includes('/todos'));
assert.ok(feature.benchmarks.includes('bench.todos.render'));

const pathImpact = affectedByStatePath(compiled, '/entities/todos/t1/done');
assert.ok(pathImpact.nodeIds.includes('action:todos.complete'));
assert.ok(pathImpact.nodeIds.includes('view:todos.list'));

assert.ok(allowedActionsForRoute(compiled, '/todos').actions.includes('todos.complete'));
assert.ok(workflowsWritingStatePath(compiled, '/entities/todos/t1/done').workflows.includes('workflow.onboarding'));
assert.ok(backgroundJobsForAsset(compiled, 'public/todos/thumb.png').workers.includes('thumbnail.generate'));
assert.ok(tracesForJourney(compiled, 'journey.todos.complete').traces.includes('journey.todos.complete'));
assert.ok(benchmarksForHotPath(compiled, 'todos.complete.latency').benchmarks.includes('bench.todos.render'));

const answer = answerApplicationQuestion(compiled, 'state-path-impact', '/entities/todos/t1/done');
assert.ok(answer.result.workflows.includes('workflow.onboarding'));

const featureMap = createApplicationFeatureMap(compiled);
assert.strictEqual(featureMap.features[0].id, 'todos');

const registry = createApplicationRegistryGraph(compiled);
assert.ok(registry.entries.some((entry) => entry.id === 'action:todos.complete'));
const fromRegistry = createApplicationGraphFromRegistryGraph(registry, { id: 'from.registry' });
assert.ok(fromRegistry.nodes.some((node) => node.id === 'action:todos.complete'));

const fromManifest = createApplicationGraphFromManifestLike({
  entries: [{
    id: 'manifest.action',
    kind: 'action',
    feature: 'todos',
    routes: ['/todos'],
    actions: ['todos.load'],
    states: ['/entities/todos'],
    tests: ['spec.todos.load']
  }],
  tasks: [{
    id: 'task.todos.test',
    command: 'vitest',
    feature: 'todos',
    inputs: ['src/todos/**'],
    outputs: ['coverage/todos/**']
  }]
});
assert.ok(fromManifest.nodes.some((node) => node.id === 'task.todos.test' && node.kind === 'task'));

const merged = mergeApplicationGraphs([graph, fromManifest], { id: 'merged' });
assert.ok(merged.summary.nodeCount > graph.summary.nodeCount);

const jsonl = encodeApplicationJsonl([graph, answer]);
assert.strictEqual(decodeApplicationJsonl(jsonl).length, 2);
assert.notStrictEqual(createApplicationProof(graph, { generatedAt: 2 }).hash.length, 0);
assert.notStrictEqual(createApplicationProof(answer, { generatedAt: 2 }).hash.length, 0);
