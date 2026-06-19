import assert from 'node:assert';
import {
  affectedByStatePath,
  affectedBySourceFile,
  affectedBySourceRegion,
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
  createApplicationOperatorStateView,
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

const sourceFile = 'src/todos/TodosList.tsx';
const sourceRegion = 'src/todos/TodosList.tsx#view:TodosList.render';

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
      files: [sourceFile],
      semanticRegions: [sourceRegion],
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
      id: 'semantic-import:todos-list',
      kind: 'semantic-source',
      nodes: ['view:todos.list'],
      files: [sourceFile],
      semanticRegions: [sourceRegion],
      features: ['todos'],
      tests: ['spec.todos.complete'],
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
assert.ok(queryApplicationGraph(compiled, { semanticRegions: [sourceRegion] }).nodeIds.includes('view:todos.list'));

const feature = featureTouches(compiled, 'todos');
assert.ok(feature.actions.includes('todos.complete'));
assert.ok(feature.routes.includes('/todos'));
assert.ok(feature.benchmarks.includes('bench.todos.render'));
assert.ok(feature.files.includes(sourceFile));
assert.ok(feature.semanticRegions.includes(sourceRegion));

const pathImpact = affectedByStatePath(compiled, '/entities/todos/t1/done');
assert.ok(pathImpact.nodeIds.includes('action:todos.complete'));
assert.ok(pathImpact.nodeIds.includes('view:todos.list'));

const sourceFileImpact = affectedBySourceFile(compiled, './src/todos/TodosList.tsx');
assert.ok(sourceFileImpact.nodeIds.includes('view:todos.list'));
assert.ok(sourceFileImpact.evidence.some((item) => item.id === 'semantic-import:todos-list'));

const sourceRegionImpact = affectedBySourceRegion(compiled, sourceRegion);
assert.ok(sourceRegionImpact.features.includes('todos'));
assert.ok(sourceRegionImpact.files.includes(sourceFile));
assert.ok(sourceRegionImpact.semanticRegions.includes(sourceRegion));
assert.ok(sourceRegionImpact.evidence.some((item) => item.id === 'semantic-import:todos-list'));

assert.ok(allowedActionsForRoute(compiled, '/todos').actions.includes('todos.complete'));
assert.ok(workflowsWritingStatePath(compiled, '/entities/todos/t1/done').workflows.includes('workflow.onboarding'));
assert.ok(backgroundJobsForAsset(compiled, 'public/todos/thumb.png').workers.includes('thumbnail.generate'));
assert.ok(tracesForJourney(compiled, 'journey.todos.complete').traces.includes('journey.todos.complete'));
assert.ok(benchmarksForHotPath(compiled, 'todos.complete.latency').benchmarks.includes('bench.todos.render'));

const answer = answerApplicationQuestion(compiled, 'state-path-impact', '/entities/todos/t1/done');
assert.ok(answer.result.workflows.includes('workflow.onboarding'));
const sourceRegionAnswer = answerApplicationQuestion(compiled, 'source-region-impact', sourceRegion);
assert.ok(sourceRegionAnswer.result.features.includes('todos'));
assert.ok(sourceRegionAnswer.evidence.some((item) => item.id === 'semantic-import:todos-list'));

const featureMap = createApplicationFeatureMap(compiled);
assert.strictEqual(featureMap.features[0].id, 'todos');

const operatorView = createApplicationOperatorStateView({
  id: 'application.operator-state',
  generatedAt: 3,
  title: 'Application operator state',
  goal: {
    title: 'Ship the visibility lane',
    summary: 'Keep the operator-facing state view compact and human-readable.'
  },
  progressRatio: {
    completed: 3,
    total: 5
  },
  activeAgents: [
    {
      id: 'agent:coordinator',
      title: 'Coordinator',
      focus: 'merge admission',
      status: 'active'
    },
    {
      id: 'agent:worker',
      title: 'Worker 1',
      summary: 'Implementing the package surface',
      status: 'active'
    }
  ],
  currentTasks: [
    {
      id: 'task:smoke',
      title: 'Smoke coverage',
      owner: '@team/frontier',
      status: 'in-progress',
      blockers: ['test command']
    }
  ],
  humanQuestions: [
    {
      id: 'question:review',
      question: 'Approve the operator view shape?',
      audience: 'coordinator',
      status: 'needs-human'
    }
  ],
  qualityGates: [
    {
      id: 'gate:test',
      title: 'Package test command',
      status: 'pass',
      checks: ['npm --prefix packages/frontier-application run test']
    }
  ],
  performanceSummary: {
    summary: 'Stable package build',
    latencyMs: 14,
    throughputPerMinute: 120
  },
  costSummary: {
    status: 'unknown',
    reason: 'No billing signal attached to the local smoke run'
  },
  historyGraphReferences: [
    {
      id: 'history:latest',
      title: 'Latest graph proof',
      graphId: 'app.graph',
      proofHash: 'fnv1a32:deadbeef'
    }
  ]
});

assert.strictEqual(operatorView.kind, 'frontier.application.operator-state-view');
assert.strictEqual(operatorView.progressRatio.status, 'known');
assert.strictEqual(operatorView.progressRatio.ratio, 0.6);
assert.strictEqual(operatorView.costSummary.status, 'unknown');
assert.ok(operatorView.sections.some((section) => section.title === 'Current Goal'));
assert.ok(operatorView.sections.some((section) => section.title === 'Active Agents' && section.items.length === 2));
assert.ok(operatorView.sections.some((section) => section.title === 'Current Tasks' && section.items[0].includes('Smoke coverage')));
assert.ok(operatorView.sections.some((section) => section.title === 'Human Questions' && section.items[0].includes('Approve the operator view shape?')));
assert.ok(operatorView.sections.some((section) => section.title === 'Quality Gates' && section.items[0].includes('Package test command')));
assert.ok(operatorView.sections.some((section) => section.title === 'Performance / Cost' && section.items.some((item) => item.includes('Stable package build'))));
assert.ok(operatorView.sections.some((section) => section.title === 'History Graph References' && section.items[0].includes('app.graph')));

const registry = createApplicationRegistryGraph(compiled);
assert.ok(registry.entries.some((entry) => entry.id === 'action:todos.complete'));
assert.ok(registry.entries.some((entry) => entry.touches?.includes('semantic-region:' + sourceRegion)));
const fromRegistry = createApplicationGraphFromRegistryGraph(registry, { id: 'from.registry' });
assert.ok(fromRegistry.nodes.some((node) => node.id === 'action:todos.complete'));
assert.ok(fromRegistry.nodes.some((node) => node.id === 'view:todos.list' && node.files.includes(sourceFile) && node.semanticRegions.includes(sourceRegion)));
assert.ok(fromRegistry.evidence.some((item) => item.id === 'semantic-import:todos-list:view:todos.list' && item.semanticRegions.includes(sourceRegion)));

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
