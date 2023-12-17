import {
  createConnection,
  ProposedFeatures,
  InitializeParams,
  TextDocumentPositionParams,
  CompletionItem,
} from 'vscode-languageserver/node';

console.log('Maestro Server core');

const connection = createConnection(ProposedFeatures.all);
connection.onInitialize((params: InitializeParams) => {
  console.log('onInitialize');
  console.log(params);
  return {
    capabilities: {},
  };
});

connection.onInitialized(() => {
  console.log('onInitialized');
});

connection.onDidChangeConfiguration((change) => {
  console.log('onDidChangeConfiguration');
  console.log(change);
});

connection.onDidChangeWatchedFiles((_change) => {
  console.log('onDidChangeWatchedFiles');
});

connection.onCompletion(
  (_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
    console.log('onCompletion');
    return [];
  }
);

connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
  console.log('onCompletionResolve');
  return item;
});

connection.listen();
