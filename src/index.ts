import type { JsonObject, JsonValue } from '@shapeshift-labs/frontier';
import { cloneJson } from '@shapeshift-labs/frontier/clone';
import {
  createFrontierRegistryGraph,
  normalizeFrontierRegistryPath,
  type FrontierRegistryEdge,
  type FrontierRegistryEntry,
  type FrontierRegistryGraph,
  type FrontierRegistryGraphInput,
  type FrontierRegistryPath,
  type FrontierRegistryRecord,
  type FrontierRegistrySource
} from '@shapeshift-labs/frontier/registry';

export const FRONTIER_APPLICATION_GRAPH_KIND = 'frontier.application.graph';
export const FRONTIER_APPLICATION_GRAPH_VERSION = 1;
export const FRONTIER_APPLICATION_COMPILED_KIND = 'frontier.application.compiled';
export const FRONTIER_APPLICATION_COMPILED_VERSION = 1;
export const FRONTIER_APPLICATION_QUERY_KIND = 'frontier.application.query';
export const FRONTIER_APPLICATION_QUERY_VERSION = 1;
export const FRONTIER_APPLICATION_IMPACT_KIND = 'frontier.application.impact';
export const FRONTIER_APPLICATION_IMPACT_VERSION = 1;
export const FRONTIER_APPLICATION_ANSWER_KIND = 'frontier.application.answer';
export const FRONTIER_APPLICATION_ANSWER_VERSION = 1;
export const FRONTIER_APPLICATION_FEATURE_MAP_KIND = 'frontier.application.feature-map';
export const FRONTIER_APPLICATION_FEATURE_MAP_VERSION = 1;
export const FRONTIER_APPLICATION_PROOF_KIND = 'frontier.application.proof';
export const FRONTIER_APPLICATION_PROOF_VERSION = 1;
export const FRONTIER_APPLICATION_OPERATOR_STATE_VIEW_KIND = 'frontier.application.operator-state-view';
export const FRONTIER_APPLICATION_OPERATOR_STATE_VIEW_VERSION = 1;

export type FrontierApplicationNodeKind =
  | 'feature'
  | 'package'
  | 'owner'
  | 'route'
  | 'view'
  | 'action'
  | 'tool'
  | 'mutation'
  | 'state'
  | 'effect'
  | 'worker'
  | 'asset'
  | 'test'
  | 'trace'
  | 'policy'
  | 'workflow'
  | 'migration'
  | 'benchmark'
  | 'resource'
  | 'task'
  | 'source'
  | 'component'
  | string;

export type FrontierApplicationEdgeKind =
  | 'part-of-feature'
  | 'owned-by'
  | 'in-package'
  | 'declared-in'
  | 'renders'
  | 'binds-action'
  | 'invokes-mutation'
  | 'reads-state'
  | 'writes-state'
  | 'runs-effect'
  | 'schedules-worker'
  | 'produces-asset'
  | 'consumes-resource'
  | 'depends-on'
  | 'covers'
  | 'proves'
  | 'allows'
  | 'guards'
  | 'part-of-workflow'
  | 'runs-migration'
  | 'protects'
  | 'touches'
  | string;

export type FrontierApplicationQuestionKind =
  | 'feature-touches'
  | 'source-file-impact'
  | 'source-region-impact'
  | 'state-path-impact'
  | 'route-agent-actions'
  | 'workflows-writing-path'
  | 'jobs-producing-asset'
  | 'traces-proving-journey'
  | 'benchmarks-protecting-hot-path'
  | string;

export type FrontierApplicationSemanticRegionId = string;

export interface FrontierApplicationNodeInput {
  id: string;
  kind?: FrontierApplicationNodeKind;
  title?: string;
  description?: string;
  package?: string;
  feature?: string;
  owner?: string;
  owners?: readonly string[];
  source?: string | FrontierRegistrySource;
  files?: readonly string[];
  semanticRegions?: readonly FrontierApplicationSemanticRegionId[];
  routes?: readonly string[];
  views?: readonly string[];
  actions?: readonly string[];
  tools?: readonly string[];
  mutations?: readonly string[];
  states?: readonly FrontierRegistryPath[];
  effects?: readonly string[];
  workers?: readonly string[];
  assets?: readonly string[];
  tests?: readonly string[];
  traces?: readonly string[];
  policies?: readonly string[];
  workflows?: readonly string[];
  migrations?: readonly string[];
  benchmarks?: readonly string[];
  resources?: readonly string[];
  hotPaths?: readonly string[];
  reads?: readonly FrontierRegistryPath[];
  writes?: readonly FrontierRegistryPath[];
  produces?: readonly string[];
  consumes?: readonly string[];
  dependsOn?: readonly string[];
  covers?: readonly string[];
  proves?: readonly string[];
  allows?: readonly string[];
  guards?: readonly string[];
  tags?: readonly string[];
  sourcePackage?: string;
  metadata?: unknown;
}

export interface FrontierApplicationNode {
  id: string;
  kind: FrontierApplicationNodeKind;
  title: string;
  description?: string;
  package?: string;
  feature?: string;
  owner?: string;
  owners: string[];
  source?: FrontierRegistrySource;
  files: string[];
  semanticRegions: string[];
  routes: string[];
  views: string[];
  actions: string[];
  tools: string[];
  mutations: string[];
  states: string[];
  effects: string[];
  workers: string[];
  assets: string[];
  tests: string[];
  traces: string[];
  policies: string[];
  workflows: string[];
  migrations: string[];
  benchmarks: string[];
  resources: string[];
  hotPaths: string[];
  reads: string[];
  writes: string[];
  produces: string[];
  consumes: string[];
  dependsOn: string[];
  covers: string[];
  proves: string[];
  allows: string[];
  guards: string[];
  tags: string[];
  sourcePackage?: string;
  metadata?: JsonObject;
}

export interface FrontierApplicationEdgeInput {
  from: string;
  to: string;
  kind?: FrontierApplicationEdgeKind;
  metadata?: unknown;
}

export interface FrontierApplicationEdge {
  from: string;
  to: string;
  kind: FrontierApplicationEdgeKind;
  metadata?: JsonObject;
}

export interface FrontierApplicationEvidenceInput {
  id?: string;
  kind?: string;
  sourcePackage?: string;
  nodes?: readonly string[];
  paths?: readonly FrontierRegistryPath[];
  files?: readonly string[];
  semanticRegions?: readonly FrontierApplicationSemanticRegionId[];
  features?: readonly string[];
  routes?: readonly string[];
  actions?: readonly string[];
  tests?: readonly string[];
  traces?: readonly string[];
  benchmarks?: readonly string[];
  status?: string;
  timestamp?: number | string | Date;
  metadata?: unknown;
}

export interface FrontierApplicationEvidence {
  id: string;
  kind: string;
  sourcePackage?: string;
  nodes: string[];
  paths: string[];
  files: string[];
  semanticRegions: string[];
  features: string[];
  routes: string[];
  actions: string[];
  tests: string[];
  traces: string[];
  benchmarks: string[];
  status?: string;
  timestamp?: number;
  metadata?: JsonObject;
}

export interface FrontierApplicationGraphInput {
  id?: string;
  title?: string;
  description?: string;
  generatedAt?: number;
  root?: string;
  nodes?: readonly FrontierApplicationNodeInput[];
  edges?: readonly FrontierApplicationEdgeInput[];
  evidence?: readonly FrontierApplicationEvidenceInput[];
  package?: string;
  feature?: string;
  owner?: string;
  source?: string | FrontierRegistrySource;
  tags?: readonly string[];
  metadata?: unknown;
}

export interface FrontierApplicationSummary {
  nodeCount: number;
  edgeCount: number;
  evidenceCount: number;
  featureCount: number;
  packageCount: number;
  ownerCount: number;
  routeCount: number;
  viewCount: number;
  actionCount: number;
  mutationCount: number;
  stateCount: number;
  effectCount: number;
  workerCount: number;
  assetCount: number;
  testCount: number;
  traceCount: number;
  policyCount: number;
  workflowCount: number;
  migrationCount: number;
  benchmarkCount: number;
  resourceCount: number;
  sourceFileCount: number;
  semanticRegionCount: number;
  warningCount: number;
  errorCount: number;
  kindCounts: Record<string, number>;
}

export interface FrontierApplicationValidationIssue {
  code: string;
  message: string;
  severity: 'error' | 'warning';
  nodeId?: string;
  edge?: FrontierApplicationEdge;
}

export interface FrontierApplicationValidation {
  kind: 'frontier.application.validation';
  version: 1;
  valid: boolean;
  issues: FrontierApplicationValidationIssue[];
}

export interface FrontierApplicationGraph {
  kind: typeof FRONTIER_APPLICATION_GRAPH_KIND;
  version: typeof FRONTIER_APPLICATION_GRAPH_VERSION;
  id: string;
  title?: string;
  description?: string;
  generatedAt?: number;
  root?: string;
  nodes: FrontierApplicationNode[];
  edges: FrontierApplicationEdge[];
  evidence: FrontierApplicationEvidence[];
  package?: string;
  feature?: string;
  owner?: string;
  source?: FrontierRegistrySource;
  tags: string[];
  summary: FrontierApplicationSummary;
  validation: FrontierApplicationValidation;
  metadata?: JsonObject;
}

export interface FrontierCompiledApplicationGraph {
  kind: typeof FRONTIER_APPLICATION_COMPILED_KIND;
  version: typeof FRONTIER_APPLICATION_COMPILED_VERSION;
  graph: FrontierApplicationGraph;
  nodesById: ReadonlyMap<string, FrontierApplicationNode>;
  edgesByFrom: ReadonlyMap<string, readonly FrontierApplicationEdge[]>;
  edgesByTo: ReadonlyMap<string, readonly FrontierApplicationEdge[]>;
  nodeIdsByKind: ReadonlyMap<string, readonly string[]>;
  nodeIdsByFeature: ReadonlyMap<string, readonly string[]>;
  nodeIdsByPackage: ReadonlyMap<string, readonly string[]>;
  nodeIdsByOwner: ReadonlyMap<string, readonly string[]>;
  nodeIdsByFile: ReadonlyMap<string, readonly string[]>;
  nodeIdsBySemanticRegion: ReadonlyMap<string, readonly string[]>;
  nodeIdsByRoute: ReadonlyMap<string, readonly string[]>;
  nodeIdsByView: ReadonlyMap<string, readonly string[]>;
  nodeIdsByAction: ReadonlyMap<string, readonly string[]>;
  nodeIdsByMutation: ReadonlyMap<string, readonly string[]>;
  nodeIdsByState: ReadonlyMap<string, readonly string[]>;
  nodeIdsByEffect: ReadonlyMap<string, readonly string[]>;
  nodeIdsByWorker: ReadonlyMap<string, readonly string[]>;
  nodeIdsByAsset: ReadonlyMap<string, readonly string[]>;
  nodeIdsByTest: ReadonlyMap<string, readonly string[]>;
  nodeIdsByTrace: ReadonlyMap<string, readonly string[]>;
  nodeIdsByPolicy: ReadonlyMap<string, readonly string[]>;
  nodeIdsByWorkflow: ReadonlyMap<string, readonly string[]>;
  nodeIdsByMigration: ReadonlyMap<string, readonly string[]>;
  nodeIdsByBenchmark: ReadonlyMap<string, readonly string[]>;
  nodeIdsByResource: ReadonlyMap<string, readonly string[]>;
  nodeIdsByHotPath: ReadonlyMap<string, readonly string[]>;
  nodeIdsByTag: ReadonlyMap<string, readonly string[]>;
  evidenceByNode: ReadonlyMap<string, readonly string[]>;
  evidenceByPath: ReadonlyMap<string, readonly string[]>;
  evidenceByFile: ReadonlyMap<string, readonly string[]>;
  evidenceBySemanticRegion: ReadonlyMap<string, readonly string[]>;
  evidenceByFeature: ReadonlyMap<string, readonly string[]>;
  evidenceByTrace: ReadonlyMap<string, readonly string[]>;
  evidenceByBenchmark: ReadonlyMap<string, readonly string[]>;
  validation: FrontierApplicationValidation;
  get(nodeId: string): FrontierApplicationNode;
}

export interface FrontierApplicationQueryInput {
  ids?: readonly string[];
  kinds?: readonly string[];
  features?: readonly string[];
  packages?: readonly string[];
  owners?: readonly string[];
  files?: readonly string[];
  semanticRegions?: readonly FrontierApplicationSemanticRegionId[];
  routes?: readonly string[];
  views?: readonly string[];
  actions?: readonly string[];
  mutations?: readonly string[];
  states?: readonly FrontierRegistryPath[];
  effects?: readonly string[];
  workers?: readonly string[];
  assets?: readonly string[];
  tests?: readonly string[];
  traces?: readonly string[];
  policies?: readonly string[];
  workflows?: readonly string[];
  migrations?: readonly string[];
  benchmarks?: readonly string[];
  resources?: readonly string[];
  hotPaths?: readonly string[];
  tags?: readonly string[];
  text?: string;
  limit?: number;
}

export interface FrontierApplicationQueryResult {
  kind: typeof FRONTIER_APPLICATION_QUERY_KIND;
  version: typeof FRONTIER_APPLICATION_QUERY_VERSION;
  query: FrontierApplicationQueryInput;
  nodeIds: string[];
  nodes: FrontierApplicationNode[];
  evidence: FrontierApplicationEvidence[];
  summary: FrontierApplicationSummary;
}

export interface FrontierApplicationImpactInput extends FrontierApplicationQueryInput {
  changedFiles?: readonly string[];
  changedSemanticRegions?: readonly FrontierApplicationSemanticRegionId[];
  changedStatePaths?: readonly FrontierRegistryPath[];
  changedResources?: readonly string[];
  changedAssets?: readonly string[];
  seedNodes?: readonly string[];
  direction?: 'forward' | 'reverse' | 'both';
  depth?: number;
  includeEvidence?: boolean;
}

export interface FrontierApplicationImpactReason {
  nodeId: string;
  kind: string;
  via?: string;
}

export interface FrontierApplicationImpact {
  kind: typeof FRONTIER_APPLICATION_IMPACT_KIND;
  version: typeof FRONTIER_APPLICATION_IMPACT_VERSION;
  graphId: string;
  seeds: string[];
  nodeIds: string[];
  nodes: FrontierApplicationNode[];
  edges: FrontierApplicationEdge[];
  evidence: FrontierApplicationEvidence[];
  features: string[];
  packages: string[];
  owners: string[];
  files: string[];
  semanticRegions: string[];
  routes: string[];
  views: string[];
  actions: string[];
  mutations: string[];
  states: string[];
  effects: string[];
  workers: string[];
  assets: string[];
  tests: string[];
  traces: string[];
  policies: string[];
  workflows: string[];
  migrations: string[];
  benchmarks: string[];
  resources: string[];
  hotPaths: string[];
  reasons: FrontierApplicationImpactReason[];
}

export interface FrontierApplicationAnswer {
  kind: typeof FRONTIER_APPLICATION_ANSWER_KIND;
  version: typeof FRONTIER_APPLICATION_ANSWER_VERSION;
  graphId: string;
  question: FrontierApplicationQuestionKind;
  target: string;
  nodeIds: string[];
  nodes: FrontierApplicationNode[];
  edges: FrontierApplicationEdge[];
  evidence: FrontierApplicationEvidence[];
  summary: FrontierApplicationSummary;
  result: {
    features: string[];
    files: string[];
    semanticRegions: string[];
    routes: string[];
    views: string[];
    actions: string[];
    mutations: string[];
    states: string[];
    effects: string[];
    workers: string[];
    assets: string[];
    tests: string[];
    traces: string[];
    policies: string[];
    workflows: string[];
    migrations: string[];
    benchmarks: string[];
    resources: string[];
  };
}

export interface FrontierApplicationFeatureMap {
  kind: typeof FRONTIER_APPLICATION_FEATURE_MAP_KIND;
  version: typeof FRONTIER_APPLICATION_FEATURE_MAP_VERSION;
  graphId: string;
  generatedAt?: number;
  summary: FrontierApplicationSummary;
  features: Array<{
    id: string;
    nodeIds: string[];
    owners: string[];
    packages: string[];
    files: string[];
    semanticRegions: string[];
    routes: string[];
    views: string[];
    actions: string[];
    states: string[];
    effects: string[];
    workers: string[];
    assets: string[];
    tests: string[];
    traces: string[];
    policies: string[];
    workflows: string[];
    migrations: string[];
    benchmarks: string[];
    resources: string[];
    nodeCount: number;
  }>;
}

export interface FrontierApplicationProof {
  kind: typeof FRONTIER_APPLICATION_PROOF_KIND;
  version: typeof FRONTIER_APPLICATION_PROOF_VERSION;
  graphId: string;
  generatedAt: number;
  hash: string;
  summary: FrontierApplicationSummary | FrontierApplicationImpact | FrontierApplicationAnswer;
  validation?: FrontierApplicationValidation;
  metadata?: JsonObject;
}

export type FrontierApplicationOperatorStateStatus = 'known' | 'unknown';
export type FrontierApplicationOperatorGateStatus = 'pass' | 'warn' | 'fail' | 'unknown';

export interface FrontierApplicationOperatorGoalInput {
  title?: string;
  summary?: string;
  reason?: string;
  status?: FrontierApplicationOperatorStateStatus;
}

export interface FrontierApplicationOperatorGoal {
  status: FrontierApplicationOperatorStateStatus;
  title: string;
  summary?: string;
  reason?: string;
}

export interface FrontierApplicationOperatorProgressRatioInput {
  completed?: number;
  total?: number;
  ratio?: number;
  summary?: string;
  reason?: string;
  status?: FrontierApplicationOperatorStateStatus;
}

export interface FrontierApplicationOperatorProgressRatio {
  status: FrontierApplicationOperatorStateStatus;
  completed: number | null;
  total: number | null;
  ratio: number | null;
  summary?: string;
  reason?: string;
}

export interface FrontierApplicationOperatorAgentInput {
  id?: string;
  title?: string;
  summary?: string;
  focus?: string;
  status?: string;
}

export interface FrontierApplicationOperatorAgent {
  id: string;
  title: string;
  summary?: string;
  focus?: string;
  status: string;
}

export interface FrontierApplicationOperatorTaskInput {
  id?: string;
  title?: string;
  summary?: string;
  owner?: string;
  status?: string;
  blockers?: readonly string[];
}

export interface FrontierApplicationOperatorTask {
  id: string;
  title: string;
  summary?: string;
  owner?: string;
  status: string;
  blockers: string[];
}

export interface FrontierApplicationOperatorQuestionInput {
  id?: string;
  question?: string;
  summary?: string;
  audience?: string;
  status?: string;
}

export interface FrontierApplicationOperatorQuestion {
  id: string;
  question: string;
  summary?: string;
  audience?: string;
  status: string;
}

export interface FrontierApplicationOperatorQualityGateInput {
  id?: string;
  title?: string;
  summary?: string;
  status?: FrontierApplicationOperatorGateStatus;
  checks?: readonly string[];
}

export interface FrontierApplicationOperatorQualityGate {
  id: string;
  title: string;
  summary?: string;
  status: FrontierApplicationOperatorGateStatus;
  checks: string[];
}

export interface FrontierApplicationOperatorPerformanceSummaryInput {
  summary?: string;
  latencyMs?: number;
  throughputPerMinute?: number;
  status?: FrontierApplicationOperatorStateStatus;
  reason?: string;
}

export interface FrontierApplicationOperatorPerformanceSummary {
  status: FrontierApplicationOperatorStateStatus;
  summary?: string;
  latencyMs: number | null;
  throughputPerMinute: number | null;
  reason?: string;
}

export interface FrontierApplicationOperatorCostSummaryInput {
  summary?: string;
  spentUsd?: number;
  budgetUsd?: number;
  estimatedUsd?: number;
  status?: FrontierApplicationOperatorStateStatus;
  reason?: string;
}

export interface FrontierApplicationOperatorCostSummary {
  status: FrontierApplicationOperatorStateStatus;
  summary?: string;
  spentUsd: number | null;
  budgetUsd: number | null;
  estimatedUsd: number | null;
  reason?: string;
}

export interface FrontierApplicationOperatorHistoryGraphReferenceInput {
  id?: string;
  title?: string;
  graphId?: string;
  proofHash?: string;
  summary?: string;
}

export interface FrontierApplicationOperatorHistoryGraphReference {
  id: string;
  title: string;
  graphId?: string;
  proofHash?: string;
  summary?: string;
}

export interface FrontierApplicationOperatorStateSection {
  id: string;
  title: string;
  summary?: string;
  items: string[];
}

export interface FrontierApplicationOperatorStateViewInput {
  id?: string;
  generatedAt?: number;
  title?: string;
  goal?: string | FrontierApplicationOperatorGoalInput;
  progressRatio?: FrontierApplicationOperatorProgressRatioInput;
  activeAgents?: readonly FrontierApplicationOperatorAgentInput[];
  currentTasks?: readonly FrontierApplicationOperatorTaskInput[];
  humanQuestions?: readonly FrontierApplicationOperatorQuestionInput[];
  qualityGates?: readonly FrontierApplicationOperatorQualityGateInput[];
  performanceSummary?: FrontierApplicationOperatorPerformanceSummaryInput;
  costSummary?: FrontierApplicationOperatorCostSummaryInput;
  historyGraphReferences?: readonly FrontierApplicationOperatorHistoryGraphReferenceInput[];
  metadata?: unknown;
}

export interface FrontierApplicationOperatorStateView {
  kind: typeof FRONTIER_APPLICATION_OPERATOR_STATE_VIEW_KIND;
  version: typeof FRONTIER_APPLICATION_OPERATOR_STATE_VIEW_VERSION;
  id: string;
  generatedAt?: number;
  title: string;
  goal: FrontierApplicationOperatorGoal;
  progressRatio: FrontierApplicationOperatorProgressRatio;
  activeAgents: FrontierApplicationOperatorAgent[];
  currentTasks: FrontierApplicationOperatorTask[];
  humanQuestions: FrontierApplicationOperatorQuestion[];
  qualityGates: FrontierApplicationOperatorQualityGate[];
  performanceSummary: FrontierApplicationOperatorPerformanceSummary;
  costSummary: FrontierApplicationOperatorCostSummary;
  historyGraphReferences: FrontierApplicationOperatorHistoryGraphReference[];
  sections: FrontierApplicationOperatorStateSection[];
  metadata?: JsonObject;
}

export interface FrontierApplicationManifestLike {
  entries?: readonly Record<string, unknown>[];
  tasks?: readonly Record<string, unknown>[];
  generatedAt?: number;
  root?: string;
  metadata?: unknown;
}

export function defineApplicationNode(input: FrontierApplicationNodeInput): FrontierApplicationNode {
  return normalizeNode(input);
}

export function createApplicationGraph(input: FrontierApplicationGraphInput = {}): FrontierApplicationGraph {
  const nodes = (input.nodes ?? []).map(normalizeNode).sort(compareNode);
  const explicitEdges = (input.edges ?? []).map(normalizeEdge);
  const derivedEdges = deriveEdges(nodes);
  const edges = dedupeEdges(explicitEdges.concat(derivedEdges)).sort(compareEdge);
  const evidence = (input.evidence ?? []).map((item, index) => normalizeEvidence(item, index)).sort(compareEvidence);
  const validation = validateApplicationParts(nodes, edges);
  return {
    kind: FRONTIER_APPLICATION_GRAPH_KIND,
    version: FRONTIER_APPLICATION_GRAPH_VERSION,
    id: normalizeId(input.id ?? 'application', 'application graph id'),
    ...(input.title ? { title: input.title } : {}),
    ...(input.description ? { description: input.description } : {}),
    ...(input.generatedAt !== undefined ? { generatedAt: input.generatedAt } : {}),
    ...(input.root ? { root: normalizeFilePath(input.root) } : {}),
    nodes,
    edges,
    evidence,
    ...optionalString('package', input.package),
    ...optionalString('feature', input.feature),
    ...optionalString('owner', input.owner),
    ...(input.source ? { source: normalizeSource(input.source) } : {}),
    tags: uniqueStrings(input.tags),
    summary: summarizeApplicationParts(nodes, edges, evidence, validation),
    validation,
    ...optionalObject('metadata', input.metadata)
  };
}

export function compileApplicationGraph(graphOrInput: FrontierApplicationGraph | FrontierApplicationGraphInput): FrontierCompiledApplicationGraph {
  const graph = isApplicationGraph(graphOrInput) ? cloneApplicationGraph(graphOrInput) : createApplicationGraph(graphOrInput);
  const nodesById = new Map<string, FrontierApplicationNode>();
  const edgesByFrom = new Map<string, FrontierApplicationEdge[]>();
  const edgesByTo = new Map<string, FrontierApplicationEdge[]>();
  const maps = createIndexMaps();
  const evidenceByNode = new Map<string, string[]>();
  const evidenceByPath = new Map<string, string[]>();
  const evidenceByFile = new Map<string, string[]>();
  const evidenceBySemanticRegion = new Map<string, string[]>();
  const evidenceByFeature = new Map<string, string[]>();
  const evidenceByTrace = new Map<string, string[]>();
  const evidenceByBenchmark = new Map<string, string[]>();

  for (const node of graph.nodes) {
    nodesById.set(node.id, node);
    pushMap(maps.kind, node.kind, node.id);
    pushMap(maps.feature, node.feature, node.id);
    pushMap(maps.package, node.package, node.id);
    pushMap(maps.owner, node.owner, node.id);
    for (const owner of node.owners) pushMap(maps.owner, owner, node.id);
    indexValues(maps.file, node.files, node.id);
    indexValues(maps.semanticRegion, node.semanticRegions, node.id);
    indexValues(maps.route, kindAwareValues(node, 'route', node.routes), node.id);
    indexValues(maps.view, kindAwareValues(node, 'view', node.views), node.id);
    indexValues(maps.action, kindAwareValues(node, 'action', node.actions), node.id);
    indexValues(maps.mutation, kindAwareValues(node, 'mutation', node.mutations), node.id);
    indexValues(maps.state, kindAwareValues(node, 'state', node.states.concat(node.reads, node.writes)), node.id);
    indexValues(maps.effect, kindAwareValues(node, 'effect', node.effects), node.id);
    indexValues(maps.worker, kindAwareValues(node, 'worker', node.workers), node.id);
    indexValues(maps.asset, kindAwareValues(node, 'asset', node.assets), node.id);
    indexValues(maps.test, kindAwareValues(node, 'test', node.tests), node.id);
    indexValues(maps.trace, kindAwareValues(node, 'trace', node.traces), node.id);
    indexValues(maps.policy, kindAwareValues(node, 'policy', node.policies), node.id);
    indexValues(maps.workflow, kindAwareValues(node, 'workflow', node.workflows), node.id);
    indexValues(maps.migration, kindAwareValues(node, 'migration', node.migrations), node.id);
    indexValues(maps.benchmark, kindAwareValues(node, 'benchmark', node.benchmarks), node.id);
    indexValues(maps.resource, kindAwareValues(node, 'resource', node.resources.concat(node.consumes, node.produces)), node.id);
    indexValues(maps.hotPath, node.hotPaths, node.id);
    indexValues(maps.tag, node.tags, node.id);
  }
  for (const edge of graph.edges) {
    pushEdgeMap(edgesByFrom, edge.from, edge);
    pushEdgeMap(edgesByTo, edge.to, edge);
  }
  for (const item of graph.evidence) {
    for (const id of item.nodes) pushMap(evidenceByNode, id, item.id);
    for (const path of item.paths) pushMap(evidenceByPath, path, item.id);
    for (const file of item.files) pushMap(evidenceByFile, file, item.id);
    for (const region of item.semanticRegions) pushMap(evidenceBySemanticRegion, region, item.id);
    for (const feature of item.features) pushMap(evidenceByFeature, feature, item.id);
    for (const trace of item.traces) pushMap(evidenceByTrace, trace, item.id);
    for (const benchmark of item.benchmarks) pushMap(evidenceByBenchmark, benchmark, item.id);
  }

  return {
    kind: FRONTIER_APPLICATION_COMPILED_KIND,
    version: FRONTIER_APPLICATION_COMPILED_VERSION,
    graph,
    nodesById,
    edgesByFrom,
    edgesByTo,
    nodeIdsByKind: maps.kind,
    nodeIdsByFeature: maps.feature,
    nodeIdsByPackage: maps.package,
    nodeIdsByOwner: maps.owner,
    nodeIdsByFile: maps.file,
    nodeIdsBySemanticRegion: maps.semanticRegion,
    nodeIdsByRoute: maps.route,
    nodeIdsByView: maps.view,
    nodeIdsByAction: maps.action,
    nodeIdsByMutation: maps.mutation,
    nodeIdsByState: maps.state,
    nodeIdsByEffect: maps.effect,
    nodeIdsByWorker: maps.worker,
    nodeIdsByAsset: maps.asset,
    nodeIdsByTest: maps.test,
    nodeIdsByTrace: maps.trace,
    nodeIdsByPolicy: maps.policy,
    nodeIdsByWorkflow: maps.workflow,
    nodeIdsByMigration: maps.migration,
    nodeIdsByBenchmark: maps.benchmark,
    nodeIdsByResource: maps.resource,
    nodeIdsByHotPath: maps.hotPath,
    nodeIdsByTag: maps.tag,
    evidenceByNode,
    evidenceByPath,
    evidenceByFile,
    evidenceBySemanticRegion,
    evidenceByFeature,
    evidenceByTrace,
    evidenceByBenchmark,
    validation: graph.validation,
    get(nodeId: string) {
      const node = nodesById.get(nodeId);
      if (!node) throw new Error('unknown application node: ' + nodeId);
      return node;
    }
  };
}

export function validateApplicationGraph(graphOrInput: FrontierApplicationGraph | FrontierApplicationGraphInput): FrontierApplicationValidation {
  const graph = isApplicationGraph(graphOrInput) ? graphOrInput : createApplicationGraph(graphOrInput);
  return validateApplicationParts(graph.nodes, graph.edges);
}

export function queryApplicationGraph(compiledOrGraph: FrontierCompiledApplicationGraph | FrontierApplicationGraph | FrontierApplicationGraphInput, query: FrontierApplicationQueryInput = {}): FrontierApplicationQueryResult {
  const compiled = isCompiledApplicationGraph(compiledOrGraph) ? compiledOrGraph : compileApplicationGraph(compiledOrGraph);
  let ids = compiled.graph.nodes.map((node) => node.id);
  ids = intersectFilter(ids, query.ids);
  ids = filterByMap(ids, query.kinds, compiled.nodeIdsByKind);
  ids = filterByMap(ids, query.features, compiled.nodeIdsByFeature);
  ids = filterByMap(ids, query.packages, compiled.nodeIdsByPackage);
  ids = filterByMap(ids, query.owners, compiled.nodeIdsByOwner);
  ids = filterByMap(ids, query.files?.map(normalizeFilePath), compiled.nodeIdsByFile);
  ids = filterByMap(ids, query.semanticRegions?.map(normalizeSemanticRegionId), compiled.nodeIdsBySemanticRegion);
  ids = filterByMap(ids, query.routes?.map(normalizeRoute), compiled.nodeIdsByRoute);
  ids = filterByMap(ids, query.views, compiled.nodeIdsByView);
  ids = filterByMap(ids, query.actions, compiled.nodeIdsByAction);
  ids = filterByMap(ids, query.mutations, compiled.nodeIdsByMutation);
  ids = filterByMap(ids, query.states?.map(normalizePath), compiled.nodeIdsByState, pathsOverlap);
  ids = filterByMap(ids, query.effects, compiled.nodeIdsByEffect);
  ids = filterByMap(ids, query.workers, compiled.nodeIdsByWorker);
  ids = filterByMap(ids, query.assets?.map(normalizeFilePath), compiled.nodeIdsByAsset);
  ids = filterByMap(ids, query.tests, compiled.nodeIdsByTest);
  ids = filterByMap(ids, query.traces, compiled.nodeIdsByTrace);
  ids = filterByMap(ids, query.policies, compiled.nodeIdsByPolicy);
  ids = filterByMap(ids, query.workflows, compiled.nodeIdsByWorkflow);
  ids = filterByMap(ids, query.migrations, compiled.nodeIdsByMigration);
  ids = filterByMap(ids, query.benchmarks, compiled.nodeIdsByBenchmark);
  ids = filterByMap(ids, query.resources?.map(normalizeResource), compiled.nodeIdsByResource);
  ids = filterByMap(ids, query.hotPaths, compiled.nodeIdsByHotPath);
  ids = filterByMap(ids, query.tags, compiled.nodeIdsByTag);
  if (query.text !== undefined) {
    const text = String(query.text).toLowerCase();
    ids = ids.filter((id) => nodeMatchesText(compiled.get(id), text));
  }
  if (query.limit !== undefined) ids = ids.slice(0, Math.max(0, Math.floor(query.limit)));
  const nodes = ids.map((id) => compiled.get(id));
  return {
    kind: FRONTIER_APPLICATION_QUERY_KIND,
    version: FRONTIER_APPLICATION_QUERY_VERSION,
    query: cloneQuery(query),
    nodeIds: ids,
    nodes,
    evidence: evidenceForNodes(compiled, nodes),
    summary: summarizeApplicationParts(nodes, [], evidenceForNodes(compiled, nodes), emptyValidation())
  };
}

export function applicationImpact(compiledOrGraph: FrontierCompiledApplicationGraph | FrontierApplicationGraph | FrontierApplicationGraphInput, input: FrontierApplicationImpactInput = {}): FrontierApplicationImpact {
  const compiled = isCompiledApplicationGraph(compiledOrGraph) ? compiledOrGraph : compileApplicationGraph(compiledOrGraph);
  const seedSet = new Set<string>();
  const seeds: string[] = [];
  const reasons: FrontierApplicationImpactReason[] = [];

  if (hasApplicationQueryFields(input)) {
    for (const node of queryApplicationGraph(compiled, input).nodes) markSeed(seedSet, seeds, reasons, node.id, 'query');
  }
  for (const id of input.seedNodes ?? []) markSeed(seedSet, seeds, reasons, normalizeId(id, 'seed node id'), 'seed-node');
  for (const file of input.changedFiles ?? []) {
    const normalized = normalizeFilePath(file);
    markMatches(seedSet, seeds, reasons, compiled.nodeIdsByFile, normalized, 'file', valueEquals, normalized);
    markEvidenceMatches(compiled, seedSet, seeds, reasons, compiled.evidenceByFile, normalized, 'file-evidence', valueEquals, normalized);
  }
  for (const region of input.changedSemanticRegions ?? []) {
    const normalized = normalizeSemanticRegionId(region);
    markMatches(seedSet, seeds, reasons, compiled.nodeIdsBySemanticRegion, normalized, 'semantic-region', valueEquals, normalized);
    markEvidenceMatches(compiled, seedSet, seeds, reasons, compiled.evidenceBySemanticRegion, normalized, 'semantic-region-evidence', valueEquals, normalized);
  }
  for (const path of input.changedStatePaths ?? []) {
    const normalized = normalizePath(path);
    markMatches(seedSet, seeds, reasons, compiled.nodeIdsByState, normalized, 'state-path', pathsOverlap, normalized);
  }
  for (const resource of input.changedResources ?? []) {
    const normalized = normalizeResource(resource);
    markMatches(seedSet, seeds, reasons, compiled.nodeIdsByResource, normalized, 'resource', valueEquals, normalized);
  }
  for (const asset of input.changedAssets ?? []) {
    const normalized = normalizeFilePath(asset);
    markMatches(seedSet, seeds, reasons, compiled.nodeIdsByAsset, normalized, 'asset', valueEquals, normalized);
  }

  const direction = input.direction ?? 'both';
  const depthLimit = input.depth ?? 6;
  const selected = traverseApplication(compiled, Array.from(seedSet), direction, depthLimit);
  const nodes = Array.from(selected).sort().map((id) => compiled.nodesById.get(id)).filter((node): node is FrontierApplicationNode => node !== undefined);
  const nodeIds = nodes.map((node) => node.id);
  const nodeIdSet = new Set(nodeIds);
  const edges = compiled.graph.edges.filter((edge) => nodeIdSet.has(edge.from) && nodeIdSet.has(edge.to));
  const evidence = input.includeEvidence === false ? [] : evidenceForNodes(compiled, nodes);
  return {
    kind: FRONTIER_APPLICATION_IMPACT_KIND,
    version: FRONTIER_APPLICATION_IMPACT_VERSION,
    graphId: compiled.graph.id,
    seeds,
    nodeIds,
    nodes,
    edges,
    evidence,
    ...collectApplicationValues(nodes, evidence),
    reasons: reasons.sort(compareReason)
  };
}

export function answerApplicationQuestion(compiledOrGraph: FrontierCompiledApplicationGraph | FrontierApplicationGraph | FrontierApplicationGraphInput, question: FrontierApplicationQuestionKind, target: string): FrontierApplicationAnswer {
  const compiled = isCompiledApplicationGraph(compiledOrGraph) ? compiledOrGraph : compileApplicationGraph(compiledOrGraph);
  let impact: FrontierApplicationImpact;
  if (question === 'feature-touches') impact = applicationImpact(compiled, { features: [target], direction: 'both' });
  else if (question === 'source-file-impact') impact = applicationImpact(compiled, { changedFiles: [target], direction: 'both' });
  else if (question === 'source-region-impact') impact = applicationImpact(compiled, { changedSemanticRegions: [target], direction: 'both' });
  else if (question === 'state-path-impact') impact = applicationImpact(compiled, { changedStatePaths: [target], direction: 'both' });
  else if (question === 'route-agent-actions') impact = allowedActionsForRoute(compiled, target);
  else if (question === 'workflows-writing-path') impact = workflowsWritingStatePath(compiled, target);
  else if (question === 'jobs-producing-asset') impact = backgroundJobsForAsset(compiled, target);
  else if (question === 'traces-proving-journey') impact = tracesForJourney(compiled, target);
  else if (question === 'benchmarks-protecting-hot-path') impact = benchmarksForHotPath(compiled, target);
  else impact = applicationImpact(compiled, { text: target, direction: 'both' });
  const values = collectApplicationValues(impact.nodes, impact.evidence);
  return {
    kind: FRONTIER_APPLICATION_ANSWER_KIND,
    version: FRONTIER_APPLICATION_ANSWER_VERSION,
    graphId: compiled.graph.id,
    question,
    target,
    nodeIds: impact.nodeIds,
    nodes: impact.nodes,
    edges: impact.edges,
    evidence: impact.evidence,
    summary: summarizeApplicationParts(impact.nodes, impact.edges, impact.evidence, emptyValidation()),
    result: {
      features: values.features,
      files: values.files,
      semanticRegions: values.semanticRegions,
      routes: values.routes,
      views: values.views,
      actions: values.actions,
      mutations: values.mutations,
      states: values.states,
      effects: values.effects,
      workers: values.workers,
      assets: values.assets,
      tests: values.tests,
      traces: values.traces,
      policies: values.policies,
      workflows: values.workflows,
      migrations: values.migrations,
      benchmarks: values.benchmarks,
      resources: values.resources
    }
  };
}

export function featureTouches(compiledOrGraph: FrontierCompiledApplicationGraph | FrontierApplicationGraph | FrontierApplicationGraphInput, feature: string): FrontierApplicationImpact {
  return applicationImpact(compiledOrGraph, { features: [feature], direction: 'both' });
}

export function affectedByStatePath(compiledOrGraph: FrontierCompiledApplicationGraph | FrontierApplicationGraph | FrontierApplicationGraphInput, path: FrontierRegistryPath): FrontierApplicationImpact {
  return applicationImpact(compiledOrGraph, { changedStatePaths: [path], direction: 'both' });
}

export function affectedBySourceFile(compiledOrGraph: FrontierCompiledApplicationGraph | FrontierApplicationGraph | FrontierApplicationGraphInput, file: string): FrontierApplicationImpact {
  return applicationImpact(compiledOrGraph, { changedFiles: [file], direction: 'both' });
}

export function affectedBySourceRegion(compiledOrGraph: FrontierCompiledApplicationGraph | FrontierApplicationGraph | FrontierApplicationGraphInput, semanticRegion: FrontierApplicationSemanticRegionId): FrontierApplicationImpact {
  return applicationImpact(compiledOrGraph, { changedSemanticRegions: [semanticRegion], direction: 'both' });
}

export function allowedActionsForRoute(compiledOrGraph: FrontierCompiledApplicationGraph | FrontierApplicationGraph | FrontierApplicationGraphInput, route: string): FrontierApplicationImpact {
  const compiled = isCompiledApplicationGraph(compiledOrGraph) ? compiledOrGraph : compileApplicationGraph(compiledOrGraph);
  const normalized = normalizeRoute(route);
  const routeNodes = queryApplicationGraph(compiled, { routes: [normalized] }).nodes;
  const seedIds = new Set(routeNodes.map((node) => node.id));
  for (const node of routeNodes) {
    for (const action of node.actions) addIdsByValue(compiled.nodeIdsByAction, action, seedIds);
    for (const policy of node.policies) addIdsByValue(compiled.nodeIdsByPolicy, policy, seedIds);
  }
  for (const edge of compiled.graph.edges) {
    if ((edge.kind === 'allows' || edge.kind === 'guards' || edge.kind === 'binds-action') && seedIds.has(edge.from)) seedIds.add(edge.to);
    if ((edge.kind === 'allows' || edge.kind === 'guards') && seedIds.has(edge.to)) seedIds.add(edge.from);
  }
  return applicationImpact(compiled, { seedNodes: Array.from(seedIds), direction: 'both', depth: 2 });
}

export function workflowsWritingStatePath(compiledOrGraph: FrontierCompiledApplicationGraph | FrontierApplicationGraph | FrontierApplicationGraphInput, path: FrontierRegistryPath): FrontierApplicationImpact {
  const compiled = isCompiledApplicationGraph(compiledOrGraph) ? compiledOrGraph : compileApplicationGraph(compiledOrGraph);
  const normalized = normalizePath(path);
  const seeds = queryApplicationGraph(compiled, { states: [normalized] }).nodes
    .filter((node) => node.kind === 'workflow' || node.workflows.length > 0 || node.writes.some((write) => pathsOverlap(write, normalized)))
    .map((node) => node.id);
  return applicationImpact(compiled, { seedNodes: seeds, changedStatePaths: [normalized], direction: 'both', depth: 3 });
}

export function backgroundJobsForAsset(compiledOrGraph: FrontierCompiledApplicationGraph | FrontierApplicationGraph | FrontierApplicationGraphInput, asset: string): FrontierApplicationImpact {
  const compiled = isCompiledApplicationGraph(compiledOrGraph) ? compiledOrGraph : compileApplicationGraph(compiledOrGraph);
  const normalized = normalizeFilePath(asset);
  const seeds = queryApplicationGraph(compiled, { assets: [normalized] }).nodes
    .filter((node) => node.kind === 'worker' || node.kind === 'task' || node.workers.length > 0 || node.produces.includes(normalized) || node.assets.includes(normalized))
    .map((node) => node.id);
  return applicationImpact(compiled, { seedNodes: seeds, changedAssets: [normalized], direction: 'both', depth: 3 });
}

export function tracesForJourney(compiledOrGraph: FrontierCompiledApplicationGraph | FrontierApplicationGraph | FrontierApplicationGraphInput, journey: string): FrontierApplicationImpact {
  const compiled = isCompiledApplicationGraph(compiledOrGraph) ? compiledOrGraph : compileApplicationGraph(compiledOrGraph);
  const seedIds = new Set<string>();
  for (const node of queryApplicationGraph(compiled, { traces: [journey] }).nodes) seedIds.add(node.id);
  for (const node of queryApplicationGraph(compiled, { routes: [journey] }).nodes) seedIds.add(node.id);
  for (const node of queryApplicationGraph(compiled, { actions: [journey] }).nodes) seedIds.add(node.id);
  for (const node of queryApplicationGraph(compiled, { text: journey }).nodes) seedIds.add(node.id);
  return applicationImpact(compiled, { seedNodes: Array.from(seedIds), direction: 'both', depth: 3 });
}

export function benchmarksForHotPath(compiledOrGraph: FrontierCompiledApplicationGraph | FrontierApplicationGraph | FrontierApplicationGraphInput, hotPath: string): FrontierApplicationImpact {
  const compiled = isCompiledApplicationGraph(compiledOrGraph) ? compiledOrGraph : compileApplicationGraph(compiledOrGraph);
  const seedIds = new Set<string>();
  for (const node of queryApplicationGraph(compiled, { hotPaths: [hotPath] }).nodes) seedIds.add(node.id);
  for (const node of queryApplicationGraph(compiled, { benchmarks: [hotPath] }).nodes) seedIds.add(node.id);
  for (const node of queryApplicationGraph(compiled, { text: hotPath }).nodes) seedIds.add(node.id);
  return applicationImpact(compiled, { seedNodes: Array.from(seedIds), direction: 'both', depth: 3 });
}

export function createApplicationFeatureMap(compiledOrGraph: FrontierCompiledApplicationGraph | FrontierApplicationGraph | FrontierApplicationGraphInput): FrontierApplicationFeatureMap {
  const compiled = isCompiledApplicationGraph(compiledOrGraph) ? compiledOrGraph : compileApplicationGraph(compiledOrGraph);
  const features = new Set<string>();
  for (const feature of compiled.nodeIdsByFeature.keys()) features.add(feature);
  for (const node of compiled.graph.nodes) if (node.kind === 'feature') features.add(stripPrefix(node.id, 'feature:'));
  const out: FrontierApplicationFeatureMap['features'] = [];
  for (const feature of Array.from(features).sort()) {
    const impact = featureTouches(compiled, feature);
    out.push({
      id: feature,
      nodeIds: impact.nodeIds,
      owners: impact.owners,
      packages: impact.packages,
      files: impact.files,
      semanticRegions: impact.semanticRegions,
      routes: impact.routes,
      views: impact.views,
      actions: impact.actions,
      states: impact.states,
      effects: impact.effects,
      workers: impact.workers,
      assets: impact.assets,
      tests: impact.tests,
      traces: impact.traces,
      policies: impact.policies,
      workflows: impact.workflows,
      migrations: impact.migrations,
      benchmarks: impact.benchmarks,
      resources: impact.resources,
      nodeCount: impact.nodeIds.length
    });
  }
  return {
    kind: FRONTIER_APPLICATION_FEATURE_MAP_KIND,
    version: FRONTIER_APPLICATION_FEATURE_MAP_VERSION,
    graphId: compiled.graph.id,
    generatedAt: compiled.graph.generatedAt,
    summary: compiled.graph.summary,
    features: out
  };
}

export function mergeApplicationGraphs(graphs: readonly (FrontierApplicationGraph | FrontierApplicationGraphInput)[], options: FrontierApplicationGraphInput = {}): FrontierApplicationGraph {
  const nodes = new Map<string, FrontierApplicationNodeInput>();
  const edges: FrontierApplicationEdgeInput[] = [];
  const evidence: FrontierApplicationEvidenceInput[] = [];
  for (const item of graphs) {
    const graph = isApplicationGraph(item) ? item : createApplicationGraph(item);
    for (const node of graph.nodes) nodes.set(node.id, node);
    edges.push(...graph.edges);
    evidence.push(...graph.evidence);
  }
  return createApplicationGraph({ ...options, nodes: Array.from(nodes.values()), edges, evidence });
}

export function createApplicationRegistryGraph(compiledOrGraph: FrontierCompiledApplicationGraph | FrontierApplicationGraph | FrontierApplicationGraphInput, options: { generatedAt?: number; metadata?: unknown } = {}): FrontierRegistryGraph {
  const compiled = isCompiledApplicationGraph(compiledOrGraph) ? compiledOrGraph : compileApplicationGraph(compiledOrGraph);
  const entries: FrontierRegistryEntry[] = compiled.graph.nodes.map((node) => ({
    id: node.id,
    kind: node.kind,
    description: node.description ?? node.title,
    package: node.package,
    feature: node.feature,
    owner: node.owner,
    source: node.source,
    reads: node.reads,
    writes: node.writes,
    calls: node.actions.concat(node.mutations, node.effects, node.workers),
    dependsOn: node.dependsOn,
    affects: node.routes.concat(node.views, node.states, node.resources, node.assets),
    touches: node.files.map((file) => 'source:' + file).concat(node.semanticRegions.map((region) => 'semantic-region:' + region)),
    produces: node.produces.concat(node.assets),
    consumes: node.consumes.concat(node.resources),
    covers: node.covers.concat(node.tests, node.benchmarks),
    tags: node.tags,
    metadata: compactJsonObject({ applicationKind: node.kind, files: node.files, semanticRegions: node.semanticRegions, hotPaths: node.hotPaths, owners: node.owners })
  }));
  const records: FrontierRegistryRecord[] = compiled.graph.evidence.flatMap((item) => item.nodes.map((nodeId) => ({
    id: item.id + ':' + nodeId,
    entryId: nodeId,
    kind: item.kind,
    status: item.status,
    startedAt: item.timestamp,
    reads: item.paths,
    affected: item.features.concat(item.routes, item.actions, item.tests, item.traces, item.benchmarks, item.files.map((file) => 'source:' + file), item.semanticRegions.map((region) => 'semantic-region:' + region)),
    metadata: compactJsonObject({ ...(item.metadata ?? {}), files: item.files, semanticRegions: item.semanticRegions })
  })));
  const edges: FrontierRegistryEdge[] = compiled.graph.edges.map((edge) => ({ from: edge.from, to: edge.to, kind: edge.kind, metadata: edge.metadata }));
  return createFrontierRegistryGraph({
    generatedAt: options.generatedAt ?? compiled.graph.generatedAt,
    entries,
    records,
    edges,
    metadata: compactJsonObject({ ...(compiled.graph.metadata ?? {}), ...(asJsonObject(options.metadata) ?? {}), graphId: compiled.graph.id })
  });
}

export function createApplicationGraphFromRegistryGraph(graph: FrontierRegistryGraph | FrontierRegistryGraphInput, options: FrontierApplicationGraphInput = {}): FrontierApplicationGraph {
  const registry = createFrontierRegistryGraph(graph);
  const nodes = registry.entries.map((entry) => ({
    id: entry.id,
    kind: entry.kind,
    title: entry.description ?? entry.id,
    package: entry.package,
    feature: entry.feature,
    owner: entry.owner,
    source: entry.source,
    files: sourceFilesFromRegistryEntry(entry),
    semanticRegions: semanticRegionsFromRegistryEntry(entry),
    states: normalizePathValues((entry.reads ?? []).concat(entry.writes ?? [])),
    reads: entry.reads,
    writes: entry.writes,
    actions: entry.calls,
    dependsOn: entry.dependsOn,
    resources: (entry.consumes ?? []).concat(entry.produces ?? []),
    assets: entry.produces,
    tests: entry.covers,
    tags: entry.tags,
    metadata: entry.metadata
  } satisfies FrontierApplicationNodeInput));
  const evidence = registry.records.map((record) => ({
    id: record.id,
    kind: record.kind ?? 'registry-record',
    nodes: [record.entryId],
    paths: (record.reads ?? []).concat(record.writes ?? []),
    files: sourceFilesFromRegistryRecord(record),
    semanticRegions: semanticRegionsFromRegistryRecord(record),
    status: record.status,
    timestamp: record.startedAt,
    metadata: record.metadata
  } satisfies FrontierApplicationEvidenceInput));
  return createApplicationGraph({
    id: options.id ?? 'application.registry',
    generatedAt: options.generatedAt ?? registry.generatedAt,
    nodes,
    edges: registry.edges,
    evidence,
    metadata: options.metadata ?? registry.metadata,
    root: options.root,
    tags: options.tags,
    package: options.package,
    feature: options.feature,
    owner: options.owner
  });
}

export function createApplicationGraphFromManifestLike(manifest: FrontierApplicationManifestLike, options: FrontierApplicationGraphInput = {}): FrontierApplicationGraph {
  const nodes: FrontierApplicationNodeInput[] = [];
  for (const entry of manifest.entries ?? []) nodes.push(nodeFromManifestEntry(entry));
  for (const task of manifest.tasks ?? []) nodes.push(nodeFromManifestTask(task));
  return createApplicationGraph({
    id: options.id ?? 'application.manifest',
    generatedAt: options.generatedAt ?? readNumber(manifest.generatedAt),
    root: options.root ?? readString(manifest.root),
    nodes,
    metadata: options.metadata ?? manifest.metadata,
    tags: options.tags,
    package: options.package,
    feature: options.feature,
    owner: options.owner
  });
}

export function encodeApplicationJsonl(items: readonly unknown[]): string {
  return items.map((item) => stableStringify(item)).join('\n') + (items.length ? '\n' : '');
}

export function decodeApplicationJsonl(text: string): unknown[] {
  return text.split(/\r?\n/g).filter((line) => line.trim().length > 0).map((line) => JSON.parse(line));
}

export function createApplicationProof(input: FrontierApplicationGraph | FrontierApplicationImpact | FrontierApplicationAnswer | FrontierApplicationFeatureMap, options: { generatedAt?: number; metadata?: unknown } = {}): FrontierApplicationProof {
  const graphId = 'graphId' in input ? input.graphId : input.id;
  const summary = input.kind === FRONTIER_APPLICATION_GRAPH_KIND || input.kind === FRONTIER_APPLICATION_FEATURE_MAP_KIND ? input.summary : input;
  const validation = input.kind === FRONTIER_APPLICATION_GRAPH_KIND ? input.validation : undefined;
  const generatedAt = options.generatedAt ?? Date.now();
  return {
    kind: FRONTIER_APPLICATION_PROOF_KIND,
    version: FRONTIER_APPLICATION_PROOF_VERSION,
    graphId,
    generatedAt,
    hash: hashString(stableStringify({ input, generatedAt })),
    summary,
    ...(validation ? { validation } : {}),
    ...optionalObject('metadata', options.metadata)
  };
}

export function createApplicationOperatorStateView(input: FrontierApplicationOperatorStateViewInput = {}): FrontierApplicationOperatorStateView {
  const activeAgents = (input.activeAgents ?? []).map(normalizeOperatorAgent).sort(compareOperatorAgent);
  const currentTasks = (input.currentTasks ?? []).map(normalizeOperatorTask).sort(compareOperatorTask);
  const humanQuestions = (input.humanQuestions ?? []).map(normalizeOperatorQuestion).sort(compareOperatorQuestion);
  const qualityGates = (input.qualityGates ?? []).map(normalizeOperatorQualityGate).sort(compareOperatorQualityGate);
  const historyGraphReferences = (input.historyGraphReferences ?? []).map(normalizeOperatorHistoryGraphReference).sort(compareOperatorHistoryGraphReference);
  const goal = normalizeOperatorGoal(input.goal);
  const progressRatio = normalizeOperatorProgressRatio(input.progressRatio);
  const performanceSummary = normalizeOperatorPerformanceSummary(input.performanceSummary);
  const costSummary = normalizeOperatorCostSummary(input.costSummary);

  return {
    kind: FRONTIER_APPLICATION_OPERATOR_STATE_VIEW_KIND,
    version: FRONTIER_APPLICATION_OPERATOR_STATE_VIEW_VERSION,
    id: normalizeId(input.id ?? 'application.operator-state', 'application operator state view id'),
    ...(input.generatedAt !== undefined ? { generatedAt: input.generatedAt } : {}),
    title: input.title ?? 'Application operator state',
    goal,
    progressRatio,
    activeAgents,
    currentTasks,
    humanQuestions,
    qualityGates,
    performanceSummary,
    costSummary,
    historyGraphReferences,
    sections: [
      {
        id: 'goal',
        title: 'Current Goal',
        summary: goal.status === 'known' ? goal.summary ?? goal.title : goal.reason ?? goal.title,
        items: goal.status === 'known' ? [goal.title, ...(goal.summary ? [goal.summary] : [])] : [goal.title]
      },
      {
        id: 'progress',
        title: 'Progress',
        summary: progressSummaryText(progressRatio),
        items: [progressSummaryText(progressRatio)]
      },
      {
        id: 'active-agents',
        title: 'Active Agents',
        summary: activeAgents.length ? activeAgents.length + ' active agent' + (activeAgents.length === 1 ? '' : 's') : 'No active agents',
        items: activeAgents.map(formatOperatorAgent)
      },
      {
        id: 'current-tasks',
        title: 'Current Tasks',
        summary: currentTasks.length ? currentTasks.length + ' current task' + (currentTasks.length === 1 ? '' : 's') : 'No current tasks',
        items: currentTasks.map(formatOperatorTask)
      },
      {
        id: 'human-questions',
        title: 'Human Questions',
        summary: humanQuestions.length ? humanQuestions.length + ' human question' + (humanQuestions.length === 1 ? '' : 's') : 'No human questions',
        items: humanQuestions.map(formatOperatorQuestion)
      },
      {
        id: 'quality-gates',
        title: 'Quality Gates',
        summary: qualityGates.length ? qualityGates.length + ' quality gate' + (qualityGates.length === 1 ? '' : 's') : 'No quality gates',
        items: qualityGates.map(formatOperatorQualityGate)
      },
      {
        id: 'performance-cost',
        title: 'Performance / Cost',
        summary: compactStrings([performanceSummaryText(performanceSummary), costSummaryText(costSummary)]).join(' | '),
        items: compactStrings([performanceSummaryText(performanceSummary), costSummaryText(costSummary)])
      },
      {
        id: 'history-graphs',
        title: 'History Graph References',
        summary: historyGraphReferences.length ? historyGraphReferences.length + ' history graph reference' + (historyGraphReferences.length === 1 ? '' : 's') : 'No history graph references',
        items: historyGraphReferences.map(formatOperatorHistoryGraphReference)
      }
    ],
    ...optionalObject('metadata', input.metadata)
  };
}

function normalizeNode(input: FrontierApplicationNodeInput): FrontierApplicationNode {
  const kind = input.kind ?? inferNodeKind(input.id);
  const states = normalizePathValues(input.states);
  const reads = normalizePathValues(input.reads);
  const writes = normalizePathValues(input.writes);
  const owners = uniqueStrings([input.owner, ...(input.owners ?? [])]);
  return {
    id: normalizeId(input.id, 'application node id'),
    kind,
    title: input.title ?? input.id,
    ...optionalString('description', input.description),
    ...optionalString('package', input.package),
    ...optionalString('feature', normalizeFeature(input.feature)),
    ...optionalString('owner', input.owner ?? owners[0]),
    owners,
    ...(input.source ? { source: normalizeSource(input.source) } : {}),
    files: uniqueStrings(input.files?.map(normalizeFilePath)),
    semanticRegions: uniqueStrings(input.semanticRegions?.map(normalizeSemanticRegionId)),
    routes: uniqueStrings(input.routes?.map(normalizeRoute)),
    views: uniqueStrings(input.views),
    actions: uniqueStrings(input.actions),
    tools: uniqueStrings(input.tools),
    mutations: uniqueStrings(input.mutations),
    states,
    effects: uniqueStrings(input.effects),
    workers: uniqueStrings(input.workers),
    assets: uniqueStrings(input.assets?.map(normalizeFilePath)),
    tests: uniqueStrings(input.tests),
    traces: uniqueStrings(input.traces),
    policies: uniqueStrings(input.policies),
    workflows: uniqueStrings(input.workflows),
    migrations: uniqueStrings(input.migrations),
    benchmarks: uniqueStrings(input.benchmarks),
    resources: uniqueStrings(input.resources?.map(normalizeResource)),
    hotPaths: uniqueStrings(input.hotPaths),
    reads,
    writes,
    produces: uniqueStrings(input.produces?.map(normalizeResourceOrFile)),
    consumes: uniqueStrings(input.consumes?.map(normalizeResourceOrFile)),
    dependsOn: uniqueStrings(input.dependsOn),
    covers: uniqueStrings(input.covers),
    proves: uniqueStrings(input.proves),
    allows: uniqueStrings(input.allows),
    guards: uniqueStrings(input.guards),
    tags: uniqueStrings(input.tags),
    ...optionalString('sourcePackage', input.sourcePackage),
    ...optionalObject('metadata', input.metadata)
  };
}

function normalizeEdge(input: FrontierApplicationEdgeInput): FrontierApplicationEdge {
  return {
    from: normalizeId(input.from, 'application edge from'),
    to: normalizeId(input.to, 'application edge to'),
    kind: input.kind ?? 'depends-on',
    ...optionalObject('metadata', input.metadata)
  };
}

function normalizeEvidence(input: FrontierApplicationEvidenceInput, index: number): FrontierApplicationEvidence {
  return {
    id: input.id ?? 'evidence:' + index,
    kind: input.kind ?? 'evidence',
    ...optionalString('sourcePackage', input.sourcePackage),
    nodes: uniqueStrings(input.nodes),
    paths: normalizePathValues(input.paths),
    files: uniqueStrings(input.files?.map(normalizeFilePath)),
    semanticRegions: uniqueStrings(input.semanticRegions?.map(normalizeSemanticRegionId)),
    features: uniqueStrings(input.features?.map(normalizeFeature)),
    routes: uniqueStrings(input.routes?.map(normalizeRoute)),
    actions: uniqueStrings(input.actions),
    tests: uniqueStrings(input.tests),
    traces: uniqueStrings(input.traces),
    benchmarks: uniqueStrings(input.benchmarks),
    ...optionalString('status', input.status),
    ...(input.timestamp !== undefined ? { timestamp: normalizeTimestamp(input.timestamp) } : {}),
    ...optionalObject('metadata', input.metadata)
  };
}

function normalizeOperatorGoal(input: string | FrontierApplicationOperatorGoalInput | undefined): FrontierApplicationOperatorGoal {
  if (typeof input === 'string') {
    return {
      status: 'known',
      title: input
    };
  }
  if (!input) {
    return {
      status: 'unknown',
      title: 'Goal not set',
      summary: 'No current goal has been recorded yet.',
      reason: 'goal missing'
    };
  }
  const status = input.status ?? (input.title || input.summary ? 'known' : 'unknown');
  return {
    status,
    title: input.title ?? input.summary ?? 'Goal not set',
    ...optionalString('summary', input.summary),
    ...optionalString('reason', input.reason)
  };
}

function normalizeOperatorProgressRatio(input: FrontierApplicationOperatorProgressRatioInput | undefined): FrontierApplicationOperatorProgressRatio {
  const completed = readNumber(input?.completed);
  const total = readNumber(input?.total);
  const ratio = readNumber(input?.ratio);
  const derivedRatio = completed !== undefined && total !== undefined && total > 0 ? completed / total : undefined;
  const status = input?.status ?? (derivedRatio !== undefined || ratio !== undefined ? 'known' : 'unknown');
  const resolvedRatio = derivedRatio ?? ratio;
  return {
    status,
    completed: completed ?? null,
    total: total ?? null,
    ratio: resolvedRatio !== undefined && Number.isFinite(resolvedRatio) ? resolvedRatio : null,
    ...optionalString('summary', input?.summary ?? (status === 'known' && completed !== undefined && total !== undefined ? completed + ' of ' + total + ' complete' : undefined)),
    ...optionalString('reason', input?.reason)
  };
}

function normalizeOperatorAgent(input: FrontierApplicationOperatorAgentInput, index: number): FrontierApplicationOperatorAgent {
  const id = normalizeId(input.id ?? 'agent:' + index, 'application operator agent id');
  return {
    id,
    title: input.title ?? id,
    ...optionalString('summary', input.summary),
    ...optionalString('focus', input.focus),
    status: input.status ?? 'unknown'
  };
}

function normalizeOperatorTask(input: FrontierApplicationOperatorTaskInput, index: number): FrontierApplicationOperatorTask {
  const id = normalizeId(input.id ?? 'task:' + index, 'application operator task id');
  return {
    id,
    title: input.title ?? id,
    ...optionalString('summary', input.summary),
    ...optionalString('owner', input.owner),
    status: input.status ?? 'unknown',
    blockers: uniqueStrings(input.blockers)
  };
}

function normalizeOperatorQuestion(input: FrontierApplicationOperatorQuestionInput, index: number): FrontierApplicationOperatorQuestion {
  const id = normalizeId(input.id ?? 'question:' + index, 'application operator question id');
  return {
    id,
    question: input.question ?? input.summary ?? id,
    ...optionalString('summary', input.summary),
    ...optionalString('audience', input.audience),
    status: input.status ?? 'unknown'
  };
}

function normalizeOperatorQualityGate(input: FrontierApplicationOperatorQualityGateInput, index: number): FrontierApplicationOperatorQualityGate {
  const id = normalizeId(input.id ?? 'gate:' + index, 'application operator quality gate id');
  return {
    id,
    title: input.title ?? id,
    ...optionalString('summary', input.summary),
    status: input.status ?? 'unknown',
    checks: uniqueStrings(input.checks)
  };
}

function normalizeOperatorPerformanceSummary(input: FrontierApplicationOperatorPerformanceSummaryInput | undefined): FrontierApplicationOperatorPerformanceSummary {
  const latencyMs = readNumber(input?.latencyMs);
  const throughputPerMinute = readNumber(input?.throughputPerMinute);
  const status = input?.status ?? (input?.summary || latencyMs !== undefined || throughputPerMinute !== undefined ? 'known' : 'unknown');
  return {
    status,
    ...optionalString('summary', input?.summary),
    latencyMs: latencyMs ?? null,
    throughputPerMinute: throughputPerMinute ?? null,
    ...optionalString('reason', input?.reason)
  };
}

function normalizeOperatorCostSummary(input: FrontierApplicationOperatorCostSummaryInput | undefined): FrontierApplicationOperatorCostSummary {
  const spentUsd = readNumber(input?.spentUsd);
  const budgetUsd = readNumber(input?.budgetUsd);
  const estimatedUsd = readNumber(input?.estimatedUsd);
  const status = input?.status ?? (input?.summary || spentUsd !== undefined || budgetUsd !== undefined || estimatedUsd !== undefined ? 'known' : 'unknown');
  return {
    status,
    ...optionalString('summary', input?.summary),
    spentUsd: spentUsd ?? null,
    budgetUsd: budgetUsd ?? null,
    estimatedUsd: estimatedUsd ?? null,
    ...optionalString('reason', input?.reason)
  };
}

function normalizeOperatorHistoryGraphReference(input: FrontierApplicationOperatorHistoryGraphReferenceInput, index: number): FrontierApplicationOperatorHistoryGraphReference {
  const id = normalizeId(input.id ?? 'history-graph:' + index, 'application operator history graph reference id');
  return {
    id,
    title: input.title ?? input.graphId ?? id,
    ...optionalString('graphId', input.graphId),
    ...optionalString('proofHash', input.proofHash),
    ...optionalString('summary', input.summary)
  };
}

function formatOperatorAgent(agent: FrontierApplicationOperatorAgent): string {
  return compactStrings([agent.title, agent.focus, agent.summary, agent.status]).join(' · ');
}

function formatOperatorTask(task: FrontierApplicationOperatorTask): string {
  return compactStrings([task.title, task.owner, task.summary, task.status, task.blockers.length ? task.blockers.join(', ') : undefined]).join(' · ');
}

function formatOperatorQuestion(question: FrontierApplicationOperatorQuestion): string {
  return compactStrings([question.question, question.audience, question.summary, question.status]).join(' · ');
}

function formatOperatorQualityGate(gate: FrontierApplicationOperatorQualityGate): string {
  return compactStrings([gate.title, gate.status, gate.summary, gate.checks.length ? gate.checks.join(', ') : undefined]).join(' · ');
}

function formatOperatorHistoryGraphReference(reference: FrontierApplicationOperatorHistoryGraphReference): string {
  return compactStrings([reference.title, reference.graphId, reference.proofHash, reference.summary]).join(' · ');
}

function progressSummaryText(progress: FrontierApplicationOperatorProgressRatio): string {
  if (progress.status === 'unknown') return progress.reason ?? progress.summary ?? 'Progress not yet reported';
  if (progress.summary) return progress.summary;
  if (progress.ratio !== null) return Math.round(progress.ratio * 100) + '% complete';
  if (progress.completed !== null && progress.total !== null) return progress.completed + ' of ' + progress.total + ' complete';
  return 'Progress reported';
}

function performanceSummaryText(performance: FrontierApplicationOperatorPerformanceSummary): string {
  if (performance.status === 'unknown') return performance.reason ?? performance.summary ?? 'Performance not yet reported';
  const parts = compactStrings([performance.summary, performance.latencyMs !== null ? 'latency ' + performance.latencyMs + 'ms' : undefined, performance.throughputPerMinute !== null ? performance.throughputPerMinute + '/min' : undefined]);
  return parts.length ? parts.join(' · ') : 'Performance reported';
}

function costSummaryText(cost: FrontierApplicationOperatorCostSummary): string {
  if (cost.status === 'unknown') return cost.reason ?? cost.summary ?? 'Cost not yet reported';
  const parts = compactStrings([cost.summary, cost.spentUsd !== null ? '$' + cost.spentUsd.toFixed(2) + ' spent' : undefined, cost.budgetUsd !== null ? '$' + cost.budgetUsd.toFixed(2) + ' budget' : undefined, cost.estimatedUsd !== null ? '$' + cost.estimatedUsd.toFixed(2) + ' estimated' : undefined]);
  return parts.length ? parts.join(' · ') : 'Cost reported';
}

function deriveEdges(nodes: readonly FrontierApplicationNode[]): FrontierApplicationEdge[] {
  const out: FrontierApplicationEdge[] = [];
  for (const node of nodes) {
    if (node.feature) out.push(edge(node.id, 'feature:' + node.feature, 'part-of-feature'));
    if (node.package) out.push(edge(node.id, 'package:' + node.package, 'in-package'));
    for (const owner of node.owners) out.push(edge(node.id, 'owner:' + owner, 'owned-by'));
    for (const file of node.files) out.push(edge(node.id, 'source:' + file, 'declared-in'));
    for (const region of node.semanticRegions) out.push(edge(node.id, 'semantic-region:' + region, 'declared-in'));
    for (const route of node.routes) out.push(edge(node.id, 'route:' + route, node.kind === 'view' ? 'renders' : 'touches'));
    for (const view of node.views) out.push(edge(node.id, 'view:' + view, node.kind === 'route' ? 'renders' : 'touches'));
    for (const action of node.actions.concat(node.tools)) out.push(edge(node.id, 'action:' + action, 'binds-action'));
    for (const mutation of node.mutations) out.push(edge(node.id, 'mutation:' + mutation, 'invokes-mutation'));
    for (const state of node.reads.concat(node.states)) out.push(edge(node.id, 'state:' + state, 'reads-state'));
    for (const state of node.writes) out.push(edge(node.id, 'state:' + state, 'writes-state'));
    for (const effectName of node.effects) out.push(edge(node.id, 'effect:' + effectName, 'runs-effect'));
    for (const worker of node.workers) out.push(edge(node.id, 'worker:' + worker, 'schedules-worker'));
    for (const asset of node.assets) out.push(edge(node.id, 'asset:' + asset, 'produces-asset'));
    for (const resource of node.resources.concat(node.consumes)) out.push(edge(node.id, 'resource:' + resource, 'consumes-resource'));
    for (const value of node.produces) out.push(edge(node.id, resourceTarget(value), value.startsWith('asset:') ? 'produces-asset' : 'produces'));
    for (const dependency of node.dependsOn) out.push(edge(node.id, dependency, 'depends-on'));
    for (const test of node.tests.concat(node.covers)) out.push(edge('test:' + test, node.id, 'covers'));
    for (const trace of node.traces.concat(node.proves)) out.push(edge('trace:' + trace, node.id, 'proves'));
    for (const policy of node.policies) out.push(edge('policy:' + policy, node.id, 'allows'));
    for (const guard of node.guards) out.push(edge('policy:' + guard, node.id, 'guards'));
    for (const workflow of node.workflows) out.push(edge(node.id, 'workflow:' + workflow, 'part-of-workflow'));
    for (const migration of node.migrations) out.push(edge('migration:' + migration, node.id, 'runs-migration'));
    for (const benchmark of node.benchmarks) out.push(edge('benchmark:' + benchmark, node.id, 'protects'));
  }
  return out;
}

function edge(from: string, to: string, kind: FrontierApplicationEdgeKind): FrontierApplicationEdge {
  return { from, to, kind };
}

function validateApplicationParts(nodes: readonly FrontierApplicationNode[], edges: readonly FrontierApplicationEdge[]): FrontierApplicationValidation {
  const issues: FrontierApplicationValidationIssue[] = [];
  const ids = new Set<string>();
  for (const node of nodes) {
    if (ids.has(node.id)) issues.push({ code: 'duplicate-node-id', message: 'duplicate application node id: ' + node.id, severity: 'error', nodeId: node.id });
    ids.add(node.id);
    if (node.kind !== 'feature' && !node.feature) issues.push({ code: 'missing-feature', message: 'node has no feature: ' + node.id, severity: 'warning', nodeId: node.id });
  }
  for (const edgeItem of edges) {
    if (!ids.has(edgeItem.from) && !isSyntheticNode(edgeItem.from)) issues.push({ code: 'unknown-edge-from', message: 'edge references unknown from node: ' + edgeItem.from, severity: 'warning', edge: edgeItem });
    if (!ids.has(edgeItem.to) && !isSyntheticNode(edgeItem.to)) issues.push({ code: 'unknown-edge-to', message: 'edge references unknown to node: ' + edgeItem.to, severity: 'warning', edge: edgeItem });
  }
  return { kind: 'frontier.application.validation', version: 1, valid: issues.every((issue) => issue.severity !== 'error'), issues };
}

function summarizeApplicationParts(nodes: readonly FrontierApplicationNode[], edges: readonly FrontierApplicationEdge[], evidence: readonly FrontierApplicationEvidence[], validation: FrontierApplicationValidation): FrontierApplicationSummary {
  const values = collectApplicationValues(nodes, evidence);
  const kindCounts: Record<string, number> = {};
  for (const node of nodes) kindCounts[node.kind] = (kindCounts[node.kind] ?? 0) + 1;
  return {
    nodeCount: nodes.length,
    edgeCount: edges.length,
    evidenceCount: evidence.length,
    featureCount: values.features.length,
    packageCount: values.packages.length,
    ownerCount: values.owners.length,
    routeCount: values.routes.length,
    viewCount: values.views.length,
    actionCount: values.actions.length,
    mutationCount: values.mutations.length,
    stateCount: values.states.length,
    effectCount: values.effects.length,
    workerCount: values.workers.length,
    assetCount: values.assets.length,
    testCount: values.tests.length,
    traceCount: values.traces.length,
    policyCount: values.policies.length,
    workflowCount: values.workflows.length,
    migrationCount: values.migrations.length,
    benchmarkCount: values.benchmarks.length,
    resourceCount: values.resources.length,
    sourceFileCount: values.files.length,
    semanticRegionCount: values.semanticRegions.length,
    warningCount: validation.issues.filter((issue) => issue.severity === 'warning').length,
    errorCount: validation.issues.filter((issue) => issue.severity === 'error').length,
    kindCounts
  };
}

function collectApplicationValues(nodes: readonly FrontierApplicationNode[], evidence: readonly FrontierApplicationEvidence[]) {
  return {
    features: uniqueStrings(nodes.flatMap((node) => [node.feature, ...(node.kind === 'feature' ? [stripPrefix(node.id, 'feature:')] : [])]).concat(evidence.flatMap((item) => item.features))),
    packages: uniqueStrings(nodes.flatMap((node) => [node.package])),
    owners: uniqueStrings(nodes.flatMap((node) => [node.owner, ...node.owners])),
    files: uniqueStrings(nodes.flatMap((node) => node.files).concat(evidence.flatMap((item) => item.files))),
    semanticRegions: uniqueStrings(nodes.flatMap((node) => node.semanticRegions).concat(evidence.flatMap((item) => item.semanticRegions))),
    routes: uniqueStrings(nodes.flatMap((node) => kindAwareValues(node, 'route', node.routes)).concat(evidence.flatMap((item) => item.routes))),
    views: uniqueStrings(nodes.flatMap((node) => kindAwareValues(node, 'view', node.views))),
    actions: uniqueStrings(nodes.flatMap((node) => kindAwareValues(node, 'action', node.actions.concat(node.tools))).concat(evidence.flatMap((item) => item.actions))),
    mutations: uniqueStrings(nodes.flatMap((node) => kindAwareValues(node, 'mutation', node.mutations))),
    states: uniqueStrings(nodes.flatMap((node) => kindAwareValues(node, 'state', node.states.concat(node.reads, node.writes))).concat(evidence.flatMap((item) => item.paths))),
    effects: uniqueStrings(nodes.flatMap((node) => kindAwareValues(node, 'effect', node.effects))),
    workers: uniqueStrings(nodes.flatMap((node) => kindAwareValues(node, 'worker', node.workers))),
    assets: uniqueStrings(nodes.flatMap((node) => kindAwareValues(node, 'asset', node.assets))),
    tests: uniqueStrings(nodes.flatMap((node) => kindAwareValues(node, 'test', node.tests.concat(node.covers))).concat(evidence.flatMap((item) => item.tests))),
    traces: uniqueStrings(nodes.flatMap((node) => kindAwareValues(node, 'trace', node.traces.concat(node.proves))).concat(evidence.flatMap((item) => item.traces))),
    policies: uniqueStrings(nodes.flatMap((node) => kindAwareValues(node, 'policy', node.policies.concat(node.guards, node.allows)))),
    workflows: uniqueStrings(nodes.flatMap((node) => kindAwareValues(node, 'workflow', node.workflows))),
    migrations: uniqueStrings(nodes.flatMap((node) => kindAwareValues(node, 'migration', node.migrations))),
    benchmarks: uniqueStrings(nodes.flatMap((node) => kindAwareValues(node, 'benchmark', node.benchmarks)).concat(evidence.flatMap((item) => item.benchmarks))),
    resources: uniqueStrings(nodes.flatMap((node) => kindAwareValues(node, 'resource', node.resources.concat(node.consumes, node.produces)))),
    hotPaths: uniqueStrings(nodes.flatMap((node) => node.hotPaths))
  };
}

function traverseApplication(compiled: FrontierCompiledApplicationGraph, seeds: readonly string[], direction: 'forward' | 'reverse' | 'both', depthLimit: number): Set<string> {
  const selected = new Set<string>();
  const queue = seeds.map((id) => ({ id, depth: 0 }));
  for (const id of seeds) selected.add(id);
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const item = queue[cursor]!;
    if (item.depth >= depthLimit) continue;
    const nextEdges = direction === 'forward'
      ? compiled.edgesByFrom.get(item.id) ?? []
      : direction === 'reverse'
        ? compiled.edgesByTo.get(item.id) ?? []
        : (compiled.edgesByFrom.get(item.id) ?? []).concat(compiled.edgesByTo.get(item.id) ?? []);
    for (const edgeItem of nextEdges) {
      const next = edgeItem.from === item.id ? edgeItem.to : edgeItem.from;
      if (!compiled.nodesById.has(next) || selected.has(next)) continue;
      selected.add(next);
      queue.push({ id: next, depth: item.depth + 1 });
    }
  }
  return selected;
}

function evidenceForNodes(compiled: FrontierCompiledApplicationGraph, nodes: readonly FrontierApplicationNode[]): FrontierApplicationEvidence[] {
  const ids = new Set<string>();
  for (const node of nodes) {
    for (const id of compiled.evidenceByNode.get(node.id) ?? []) ids.add(id);
    if (node.feature) for (const id of compiled.evidenceByFeature.get(node.feature) ?? []) ids.add(id);
    for (const file of node.files) for (const id of compiled.evidenceByFile.get(file) ?? []) ids.add(id);
    for (const region of node.semanticRegions) for (const id of compiled.evidenceBySemanticRegion.get(region) ?? []) ids.add(id);
    for (const path of node.states.concat(node.reads, node.writes)) {
      for (const [key, values] of compiled.evidenceByPath) if (pathsOverlap(key, path)) for (const id of values) ids.add(id);
    }
    for (const trace of node.traces) for (const id of compiled.evidenceByTrace.get(trace) ?? []) ids.add(id);
    for (const benchmark of node.benchmarks) for (const id of compiled.evidenceByBenchmark.get(benchmark) ?? []) ids.add(id);
  }
  return compiled.graph.evidence.filter((item) => ids.has(item.id));
}

function createIndexMaps() {
  return {
    kind: new Map<string, string[]>(),
    feature: new Map<string, string[]>(),
    package: new Map<string, string[]>(),
    owner: new Map<string, string[]>(),
    file: new Map<string, string[]>(),
    semanticRegion: new Map<string, string[]>(),
    route: new Map<string, string[]>(),
    view: new Map<string, string[]>(),
    action: new Map<string, string[]>(),
    mutation: new Map<string, string[]>(),
    state: new Map<string, string[]>(),
    effect: new Map<string, string[]>(),
    worker: new Map<string, string[]>(),
    asset: new Map<string, string[]>(),
    test: new Map<string, string[]>(),
    trace: new Map<string, string[]>(),
    policy: new Map<string, string[]>(),
    workflow: new Map<string, string[]>(),
    migration: new Map<string, string[]>(),
    benchmark: new Map<string, string[]>(),
    resource: new Map<string, string[]>(),
    hotPath: new Map<string, string[]>(),
    tag: new Map<string, string[]>()
  };
}

function nodeFromManifestEntry(entry: Record<string, unknown>): FrontierApplicationNodeInput {
  return {
    id: readString(entry.id) ?? 'manifest-entry:' + hashString(stableStringify(entry)),
    kind: readString(entry.kind) ?? 'component',
    title: readString(entry.name) ?? readString(entry.title),
    description: readString(entry.description),
    package: readString(entry.package),
    feature: readString(entry.feature),
    owner: readString(entry.owner),
    owners: readStringArray(entry.owners),
    source: readSource(entry.source),
    files: readStringArray(entry.files),
    semanticRegions: readStringArray(entry.semanticRegions),
    routes: readStringArray(entry.routes),
    views: readStringArray(entry.views),
    actions: readStringArray(entry.actions),
    mutations: readStringArray(entry.mutations),
    states: readPathArray(entry.states),
    effects: readStringArray(entry.effects),
    workers: readStringArray(entry.workers).concat(readStringArray(entry.tasks)),
    assets: readStringArray(entry.assets),
    tests: readStringArray(entry.tests),
    traces: readStringArray(entry.traces),
    policies: readStringArray(entry.policies),
    workflows: readStringArray(entry.workflows),
    migrations: readStringArray(entry.migrations),
    benchmarks: readStringArray(entry.benchmarks),
    resources: readStringArray(entry.resources),
    reads: readPathArray(entry.reads),
    writes: readPathArray(entry.writes),
    produces: readStringArray(entry.produces),
    consumes: readStringArray(entry.consumes),
    dependsOn: readStringArray(entry.dependsOn),
    covers: readStringArray(entry.covers),
    tags: readStringArray(entry.tags),
    metadata: readJsonObject(entry.metadata)
  };
}

function nodeFromManifestTask(task: Record<string, unknown>): FrontierApplicationNodeInput {
  const id = readString(task.id) ?? 'task:' + hashString(stableStringify(task));
  return {
    id,
    kind: 'task',
    title: readString(task.command) ?? id,
    package: readString(task.package),
    feature: readString(task.feature),
    owner: readString(task.owner),
    owners: readStringArray(task.owners),
    files: readStringArray(task.inputs),
    semanticRegions: readStringArray(task.semanticRegions),
    assets: readStringArray(task.outputs),
    workers: [id],
    dependsOn: readStringArray(task.dependsOn),
    tags: readStringArray(task.tags),
    metadata: readJsonObject(task.metadata)
  };
}

function inferNodeKind(id: string): FrontierApplicationNodeKind {
  const index = id.indexOf(':');
  return index > 0 ? id.slice(0, index) : 'component';
}

function kindAwareValues(node: FrontierApplicationNode, kind: string, values: readonly string[]): string[] {
  const fromId = node.kind === kind ? [stripPrefix(node.id, kind + ':')] : [];
  return uniqueStrings(fromId.concat(values));
}

function normalizePathValues(values: readonly FrontierRegistryPath[] | undefined): string[] {
  return uniqueStrings((values ?? []).map(normalizePath));
}

function normalizePath(path: FrontierRegistryPath): string {
  return normalizeFrontierRegistryPath(path);
}

function normalizeRoute(route: string): string {
  if (!route) return '/';
  if (route.startsWith('route:')) return route.slice('route:'.length);
  return route.startsWith('/') ? route : '/' + route;
}

function normalizeFeature(feature: string | undefined): string | undefined {
  if (!feature) return undefined;
  return stripPrefix(feature, 'feature:');
}

function normalizeFilePath(file: string): string {
  return String(file).replace(/\\/g, '/').replace(/^\.\/+/, '');
}

function normalizeSemanticRegionId(region: FrontierApplicationSemanticRegionId): string {
  return stripPrefix(normalizeFilePath(region), 'semantic-region:');
}

function normalizeResource(resource: string): string {
  const value = String(resource);
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return value;
  return 'resource:' + value;
}

function normalizeResourceOrFile(value: string): string {
  return /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : normalizeFilePath(value);
}

function resourceTarget(value: string): string {
  if (value.startsWith('asset:') || value.startsWith('resource:')) return value;
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return 'resource:' + value;
  return 'asset:' + normalizeFilePath(value);
}

function isSyntheticNode(id: string): boolean {
  return /^(feature|package|owner|source|semantic-region|route|view|action|mutation|state|effect|worker|asset|resource|test|trace|policy|workflow|migration|benchmark):/.test(id);
}

function nodeMatchesText(node: FrontierApplicationNode, text: string): boolean {
  return stableStringify({
    id: node.id,
    kind: node.kind,
    title: node.title,
    description: node.description,
    feature: node.feature,
    package: node.package,
    files: node.files,
    semanticRegions: node.semanticRegions,
    tags: node.tags
  }).toLowerCase().includes(text);
}

function markSeed(seedSet: Set<string>, seeds: string[], reasons: FrontierApplicationImpactReason[], nodeId: string, kind: string, via?: string): void {
  if (!seedSet.has(nodeId)) {
    seedSet.add(nodeId);
    seeds.push(nodeId);
  }
  reasons.push({ nodeId, kind, via });
}

function markMatches(seedSet: Set<string>, seeds: string[], reasons: FrontierApplicationImpactReason[], map: ReadonlyMap<string, readonly string[]>, target: string, kind: string, matcher: (left: string, right: string) => boolean, via: string): void {
  for (const [key, ids] of map) {
    if (!matcher(key, target)) continue;
    for (const id of ids) markSeed(seedSet, seeds, reasons, id, kind, via);
  }
}

function markEvidenceMatches(compiled: FrontierCompiledApplicationGraph, seedSet: Set<string>, seeds: string[], reasons: FrontierApplicationImpactReason[], map: ReadonlyMap<string, readonly string[]>, target: string, kind: string, matcher: (left: string, right: string) => boolean, via: string): void {
  const evidenceIds = new Set<string>();
  for (const [key, ids] of map) {
    if (!matcher(key, target)) continue;
    for (const id of ids) evidenceIds.add(id);
  }
  if (evidenceIds.size === 0) return;
  for (const item of compiled.graph.evidence) {
    if (!evidenceIds.has(item.id)) continue;
    for (const nodeId of item.nodes) markSeed(seedSet, seeds, reasons, nodeId, kind, via);
    for (const feature of item.features) {
      for (const nodeId of compiled.nodeIdsByFeature.get(feature) ?? []) markSeed(seedSet, seeds, reasons, nodeId, kind, via);
    }
    for (const route of item.routes) {
      for (const nodeId of compiled.nodeIdsByRoute.get(route) ?? []) markSeed(seedSet, seeds, reasons, nodeId, kind, via);
    }
    for (const action of item.actions) {
      for (const nodeId of compiled.nodeIdsByAction.get(action) ?? []) markSeed(seedSet, seeds, reasons, nodeId, kind, via);
    }
    for (const test of item.tests) {
      for (const nodeId of compiled.nodeIdsByTest.get(test) ?? []) markSeed(seedSet, seeds, reasons, nodeId, kind, via);
    }
    for (const trace of item.traces) {
      for (const nodeId of compiled.nodeIdsByTrace.get(trace) ?? []) markSeed(seedSet, seeds, reasons, nodeId, kind, via);
    }
    for (const benchmark of item.benchmarks) {
      for (const nodeId of compiled.nodeIdsByBenchmark.get(benchmark) ?? []) markSeed(seedSet, seeds, reasons, nodeId, kind, via);
    }
  }
}

function addIdsByValue(map: ReadonlyMap<string, readonly string[]>, value: string, out: Set<string>): void {
  for (const id of map.get(value) ?? []) out.add(id);
}

function filterByMap(ids: string[], filters: readonly string[] | undefined, map: ReadonlyMap<string, readonly string[]>, matcher: (left: string, right: string) => boolean = valueEquals): string[] {
  if (!filters || filters.length === 0) return ids;
  const selected = new Set<string>();
  for (const [key, values] of map) {
    if (filters.some((filter) => matcher(key, filter))) for (const value of values) selected.add(value);
  }
  return ids.filter((id) => selected.has(id));
}

function hasApplicationQueryFields(input: FrontierApplicationQueryInput): boolean {
  return hasValues(input.ids)
    || hasValues(input.kinds)
    || hasValues(input.features)
    || hasValues(input.packages)
    || hasValues(input.owners)
    || hasValues(input.files)
    || hasValues(input.semanticRegions)
    || hasValues(input.routes)
    || hasValues(input.views)
    || hasValues(input.actions)
    || hasValues(input.mutations)
    || hasValues(input.states)
    || hasValues(input.effects)
    || hasValues(input.workers)
    || hasValues(input.assets)
    || hasValues(input.tests)
    || hasValues(input.traces)
    || hasValues(input.policies)
    || hasValues(input.workflows)
    || hasValues(input.migrations)
    || hasValues(input.benchmarks)
    || hasValues(input.resources)
    || hasValues(input.hotPaths)
    || hasValues(input.tags)
    || input.text !== undefined;
}

function hasValues(value: readonly unknown[] | undefined): boolean {
  return value !== undefined && value.length > 0;
}

function intersectFilter(ids: string[], filters: readonly string[] | undefined): string[] {
  if (!filters || filters.length === 0) return ids;
  const set = new Set(filters);
  return ids.filter((id) => set.has(id));
}

function pathsOverlap(left: string, right: string): boolean {
  const a = normalizePath(left);
  const b = normalizePath(right);
  return a === b || a.startsWith(b.endsWith('/') ? b : b + '/') || b.startsWith(a.endsWith('/') ? a : a + '/');
}

function valueEquals(left: string, right: string): boolean {
  return left === right;
}

function indexValues(map: Map<string, string[]>, values: readonly string[], id: string): void {
  for (const value of values) pushMap(map, value, id);
}

function pushMap(map: Map<string, string[]>, key: string | undefined, value: string): void {
  if (!key) return;
  let values = map.get(key);
  if (!values) {
    values = [];
    map.set(key, values);
  }
  if (!values.includes(value)) values.push(value);
}

function pushEdgeMap(map: Map<string, FrontierApplicationEdge[]>, key: string, value: FrontierApplicationEdge): void {
  let values = map.get(key);
  if (!values) {
    values = [];
    map.set(key, values);
  }
  values.push(value);
}

function dedupeEdges(edges: readonly FrontierApplicationEdge[]): FrontierApplicationEdge[] {
  const seen = new Set<string>();
  const out: FrontierApplicationEdge[] = [];
  for (const edgeItem of edges) {
    const key = edgeItem.from + '\u0000' + edgeItem.kind + '\u0000' + edgeItem.to + '\u0000' + stableStringify(edgeItem.metadata ?? null);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(edgeItem);
  }
  return out;
}

function cloneApplicationGraph(graph: FrontierApplicationGraph): FrontierApplicationGraph {
  return cloneJson(graph as unknown as JsonValue) as unknown as FrontierApplicationGraph;
}

function cloneQuery<T>(value: T): T {
  return cloneJson(value as unknown as JsonValue) as unknown as T;
}

function emptyValidation(): FrontierApplicationValidation {
  return { kind: 'frontier.application.validation', version: 1, valid: true, issues: [] };
}

function normalizeSource(source: string | FrontierRegistrySource): FrontierRegistrySource {
  return typeof source === 'string' ? { file: source } : source;
}

function readSource(value: unknown): FrontierRegistrySource | undefined {
  if (typeof value === 'string') return { file: value };
  if (value && typeof value === 'object') return value as FrontierRegistrySource;
  return undefined;
}

function sourceFilesFromRegistryEntry(entry: FrontierRegistryEntry): string[] {
  return uniqueStrings(sourceFilesFromSource(entry.source)
    .concat(sourceFilesFromReferences(entry.touches))
    .concat(readMetadataStringArray(entry.metadata, 'files').map(normalizeFilePath)));
}

function sourceFilesFromRegistryRecord(record: FrontierRegistryRecord): string[] {
  return uniqueStrings(sourceFilesFromReferences(record.affected)
    .concat(readMetadataStringArray(record.metadata, 'files').map(normalizeFilePath)));
}

function sourceFilesFromSource(source: FrontierRegistrySource | undefined): string[] {
  if (!source) return [];
  const locations = Array.isArray(source) ? source : [source];
  return uniqueStrings(locations.map((location) => normalizeFilePath(location.file)));
}

function sourceFilesFromReferences(values: readonly string[] | undefined): string[] {
  return uniqueStrings((values ?? []).map(readSourceFileReference));
}

function semanticRegionsFromRegistryEntry(entry: FrontierRegistryEntry): string[] {
  return uniqueStrings(semanticRegionsFromReferences(entry.touches)
    .concat(readMetadataStringArray(entry.metadata, 'semanticRegions').map(normalizeSemanticRegionId)));
}

function semanticRegionsFromRegistryRecord(record: FrontierRegistryRecord): string[] {
  return uniqueStrings(semanticRegionsFromReferences(record.affected)
    .concat(readMetadataStringArray(record.metadata, 'semanticRegions').map(normalizeSemanticRegionId)));
}

function semanticRegionsFromReferences(values: readonly string[] | undefined): string[] {
  return uniqueStrings((values ?? []).map(readSemanticRegionReference));
}

function readSourceFileReference(value: string): string | undefined {
  return value.startsWith('source:') ? normalizeFilePath(value.slice('source:'.length)) : undefined;
}

function readSemanticRegionReference(value: string): string | undefined {
  return value.startsWith('semantic-region:') ? normalizeSemanticRegionId(value) : undefined;
}

function readMetadataStringArray(metadata: JsonObject | undefined, key: string): string[] {
  const value = metadata?.[key];
  return Array.isArray(value) ? uniqueStrings(value.filter((item): item is string => typeof item === 'string')) : [];
}

function optionalString<Key extends string>(key: Key, value: string | undefined): { [K in Key]?: string } {
  return value ? { [key]: value } as { [K in Key]?: string } : {};
}

function optionalObject<Key extends string>(key: Key, value: unknown): { [K in Key]?: JsonObject } {
  const object = asJsonObject(value);
  return object ? { [key]: object } as { [K in Key]?: JsonObject } : {};
}

function asJsonObject(value: unknown): JsonObject | undefined {
  if (value === undefined) return undefined;
  if (value && typeof value === 'object' && !Array.isArray(value)) return cloneJson(value as JsonObject) as JsonObject;
  return { value: cloneJson(value as JsonValue) };
}

function compactJsonObject(value: Record<string, unknown>): JsonObject {
  const out: Record<string, JsonValue> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (entry === undefined) continue;
    out[key] = cloneJson(entry as JsonValue);
  }
  return out as JsonObject;
}

function readJsonObject(value: unknown): JsonObject | undefined {
  return value && typeof value === 'object' && !Array.isArray(value) ? cloneJson(value as JsonObject) as JsonObject : undefined;
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function readNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value) ? uniqueStrings(value.filter((item): item is string => typeof item === 'string')) : [];
}

function readPathArray(value: unknown): FrontierRegistryPath[] {
  return Array.isArray(value) ? value.filter((item): item is FrontierRegistryPath => typeof item === 'string' || Array.isArray(item)) : [];
}

function normalizeTimestamp(value: number | string | Date): number | undefined {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  const time = value instanceof Date ? value.getTime() : Date.parse(value);
  return Number.isFinite(time) ? time : undefined;
}

function stripPrefix(value: string, prefix: string): string {
  return value.startsWith(prefix) ? value.slice(prefix.length) : value;
}

function normalizeId(value: string, label: string): string {
  if (typeof value !== 'string' || value.length === 0) throw new Error(label + ' must be a non-empty string');
  return value;
}

function uniqueStrings(values: readonly (string | undefined | null)[] | undefined): string[] {
  return Array.from(new Set((values ?? []).filter((value): value is string => typeof value === 'string' && value.length > 0))).sort();
}

function compactStrings(values: readonly (string | undefined | null | false)[]): string[] {
  return values.filter((value): value is string => typeof value === 'string' && value.length > 0);
}

function compareNode(left: FrontierApplicationNode, right: FrontierApplicationNode): number {
  return left.id.localeCompare(right.id);
}

function compareEdge(left: FrontierApplicationEdge, right: FrontierApplicationEdge): number {
  return left.from.localeCompare(right.from) || left.kind.localeCompare(right.kind) || left.to.localeCompare(right.to);
}

function compareEvidence(left: FrontierApplicationEvidence, right: FrontierApplicationEvidence): number {
  return (left.timestamp ?? 0) - (right.timestamp ?? 0) || left.id.localeCompare(right.id);
}

function compareReason(left: FrontierApplicationImpactReason, right: FrontierApplicationImpactReason): number {
  return left.nodeId.localeCompare(right.nodeId) || left.kind.localeCompare(right.kind) || (left.via ?? '').localeCompare(right.via ?? '');
}

function compareOperatorAgent(left: FrontierApplicationOperatorAgent, right: FrontierApplicationOperatorAgent): number {
  return left.title.localeCompare(right.title) || left.id.localeCompare(right.id);
}

function compareOperatorTask(left: FrontierApplicationOperatorTask, right: FrontierApplicationOperatorTask): number {
  return left.title.localeCompare(right.title) || left.id.localeCompare(right.id);
}

function compareOperatorQuestion(left: FrontierApplicationOperatorQuestion, right: FrontierApplicationOperatorQuestion): number {
  return left.question.localeCompare(right.question) || left.id.localeCompare(right.id);
}

function compareOperatorQualityGate(left: FrontierApplicationOperatorQualityGate, right: FrontierApplicationOperatorQualityGate): number {
  return left.title.localeCompare(right.title) || left.id.localeCompare(right.id);
}

function compareOperatorHistoryGraphReference(left: FrontierApplicationOperatorHistoryGraphReference, right: FrontierApplicationOperatorHistoryGraphReference): number {
  return left.title.localeCompare(right.title) || left.id.localeCompare(right.id);
}

function isApplicationGraph(value: unknown): value is FrontierApplicationGraph {
  return !!value && typeof value === 'object' && (value as { kind?: unknown }).kind === FRONTIER_APPLICATION_GRAPH_KIND;
}

function isCompiledApplicationGraph(value: unknown): value is FrontierCompiledApplicationGraph {
  return !!value && typeof value === 'object' && (value as { kind?: unknown }).kind === FRONTIER_APPLICATION_COMPILED_KIND;
}

function stableStringify(value: unknown): string {
  return JSON.stringify(sortForJson(value));
}

function sortForJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortForJson);
  if (!value || typeof value !== 'object') return value;
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(value).sort()) out[key] = sortForJson((value as Record<string, unknown>)[key]);
  return out;
}

function hashString(value: string): string {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return 'fnv1a32:' + (hash >>> 0).toString(16).padStart(8, '0');
}
