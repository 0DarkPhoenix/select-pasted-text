const vscode = require("vscode");

let isSelectionFromPaste = false;
let ignoreNextSelectionChange = false;
let debounceTimer = null;
let previousContentChangesText = "";
let lastPastedText = "";

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const disposable = vscode.commands.registerCommand(
		"selectPastedText.selectPastedText",
		async () => {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				// Get clipboard content before pasting
				const clipboardText = await vscode.env.clipboard.readText();
				lastPastedText = clipboardText; // Store what's about to be pasted

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
					previousContentChangesText = lastPastedText;
				}
			}
		},
	);

	const editDisposable = vscode.workspace.onDidChangeTextDocument((event) => {
		const editor = vscode.window.activeTextEditor;
		if (!editor || event.document !== editor.document) return;

		if (isSelectionFromPaste && event.contentChanges.length > 0) {
			const change = event.contentChanges[0];

			// Only handle character typing that replaces the selection
			if (change.text.length === 1 && change.rangeLength > 0) {
				// Undo the replacement that already happened
				vscode.commands.executeCommand("undo").then(() => {
					// Get all selections after undo
					const selections = editor.selections;

					// Process each selection
					editor
						.edit((editBuilder) => {
							for (const selection of selections) {
								// Get the text that is currently selected (The pasted text)
								const selectedText = editor.document.getText(selection);

								// Combine with typed character
								const combinedText = selectedText + change.text;

								// Replace selection with combined text
								editBuilder.replace(selection, combinedText);
							}
						})
						.then(() => {
							// Create new selections with cursors at the end of each insertion
							const newSelections = selections.map((selection) => {
								const selectedText = editor.document.getText(selection);
								const startOffset = editor.document.offsetAt(selection.start);
								const newOffset =
									startOffset + selectedText.length + change.text.length;
								const newPosition = editor.document.positionAt(newOffset);
								return new vscode.Selection(newPosition, newPosition);
							});

							// Set all cursors at their new positions
							editor.selections = newSelections;
						});

					// Reset flags
					isSelectionFromPaste = false;
				});

				return;
			}
		}
		if (
			event.contentChanges.length > 0 &&
			(event.contentChanges[0].text.length > 1 || event.contentChanges[0].rangeLength === 0)
		) {
			previousContentChangesText = event.contentChanges[0].text;
		}
	});

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
	context.subscriptions.push(editDisposable);
	context.subscriptions.push(selectionChangeDisposable);
}

module.exports = {
	activate,
};
