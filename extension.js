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
					const currentSelections = editor.selections;
					ignoreNextSelectionChange = true;
					await vscode.commands.executeCommand("editor.action.clipboardPasteAction");
					const newPositions = editor.selections.map((sel) => sel.active);
					const newSelections = currentSelections.map(
						(sel, index) => new vscode.Selection(sel.start, newPositions[index]),
					);
					editor.selections = newSelections;
					isSelectionFromPaste = true;
				}
			}
		},
	);

	const selectionChangeDisposable = vscode.window.onDidChangeTextEditorSelection(() => {
		if (ignoreNextSelectionChange) {
			if (debounceTimer) {
				clearTimeout(debounceTimer);
			}
			debounceTimer = setTimeout(() => {
				ignoreNextSelectionChange = false;
			}, 50);
			return;
		}
		isSelectionFromPaste = false;
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(selectionChangeDisposable);

	//Fixes incompatibility related to both extensions attempting to overwrite the type command
	const config = vscode.workspace.getConfiguration('selectPastedText');
    const isTypeCommandCompatibilityFixEnabled = config.get('typeCommandCompatibilityFix');
	if(!isTypeCommandCompatibilityFixEnabled)
	{
		const typeDisposable = vscode.commands.registerTextEditorCommand(
			"type",
			(textEditor, edit, args) => {
				// Special characters that should not trigger selection clearing
				const specialCharacters = ["(", "[", "{", '"', "'", "`"];
				if (!specialCharacters.includes(args.text)) {
					if (isSelectionFromPaste) {
						const newSelections = textEditor.selections.map((selection) => {
							if (!selection.isEmpty) {
								const position = selection.end;
								return new vscode.Selection(position, position);
							}
							return selection;
						});
						textEditor.selections = newSelections;
					}
				}
				vscode.commands.executeCommand("default:type", args);
			},
		);	
		context.subscriptions.push(typeDisposable);
	}
}

module.exports = {
	activate,
};
