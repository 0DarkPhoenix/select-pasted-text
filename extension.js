const vscode = require("vscode");

let isSelectionFromPaste = false;
let ignoreNextSelectionChange = false;
let debounceTimer = null;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const disposable = vscode.commands.registerCommand(
		"selectPastedText.selectPastedText",
		async () => {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				const document = editor.document;

				if (
					document.uri.scheme === "file" ||
					document.uri.scheme === "vscode-userdata" ||
					document.uri.scheme === "vscode" ||
					document.uri.scheme === "untitled"
				) {
					const currentSelection = editor.selection;
					ignoreNextSelectionChange = true;
					await vscode.commands.executeCommand("editor.action.clipboardPasteAction");
					const newPosition = editor.selection.active;
					const newSelection = new vscode.Selection(currentSelection.start, newPosition);
					editor.selection = newSelection;
					isSelectionFromPaste = true;
				}
			}
		},
	);

	const typeDisposable = vscode.commands.registerTextEditorCommand(
		"type",
		(textEditor, edit, args) => {
			// Check if the typed character is a opening bracket. If so, don't execute the logic
			const openingBrackets = ["(", "[", "{"];
			if (!openingBrackets.includes(args.text)) {
				if (textEditor.selection.isEmpty === false && isSelectionFromPaste) {
					const position = textEditor.selection.end;
					textEditor.selection = new vscode.Selection(position, position);
				}
			}
			vscode.commands.executeCommand("default:type", args);
		},
	);

	const selectionChangeDisposable = vscode.window.onDidChangeTextEditorSelection(() => {
		if (ignoreNextSelectionChange) {
			// Clear any existing timer
			if (debounceTimer) {
				clearTimeout(debounceTimer);
			}

			// Set new timer
			debounceTimer = setTimeout(() => {
				ignoreNextSelectionChange = false;
			}, 50);
			return;
		}
		isSelectionFromPaste = false;
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(typeDisposable);
	context.subscriptions.push(selectionChangeDisposable);
}

module.exports = {
	activate,
};
