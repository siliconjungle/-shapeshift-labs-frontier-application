import {
  answerApplicationQuestion,
  compileApplicationGraph,
  createApplicationGraph,
  queryApplicationGraph,
  type FrontierApplicationAnswer,
  type FrontierApplicationGraph,
  type FrontierApplicationQueryResult
} from '../src/index.js';

const graph: FrontierApplicationGraph = createApplicationGraph({
  nodes: [{
    id: 'action.save',
    kind: 'action',
    feature: 'todos',
    actions: ['todos.save'],
    writes: ['/entities/todos/t1']
  }]
});

const compiled = compileApplicationGraph(graph);
const query: FrontierApplicationQueryResult = queryApplicationGraph(compiled, { actions: ['todos.save'] });
const answer: FrontierApplicationAnswer = answerApplicationQuestion(compiled, 'feature-touches', 'todos');

void query;
void answer;
