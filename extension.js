const vscode = require("vscode");

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

				// Ensure the cursor is in a file, not in the debug console, terminal, etc.
				if (
					document.uri.scheme === "file" ||
					document.uri.scheme === "vscode-userdata" ||
					document.uri.scheme === "vscode" ||
					document.uri.scheme === "untitled"
				) {
					// Save the current selection
					const currentSelection = editor.selection;

					// Listen for the next paste event
					await vscode.commands.executeCommand("editor.action.clipboardPasteAction");

					// Get the new cursor position after the paste
					const newPosition = editor.selection.active;

					// Create a selection from the start of the original selection to the new position
					const newSelection = new vscode.Selection(currentSelection.start, newPosition);
					editor.selection = newSelection;
				}
			}
		},
	);
	// Listen for any change in the active text editor
	const typeDisposable = vscode.commands.registerTextEditorCommand(
		"type",
		(textEditor, edit, args) => {
			// If a character, space or enter is inserted, unselect the text before inserting the character
			if (textEditor.selection.isEmpty === false) {
				// Unselect the text by placing the start and end of the selection at the new cursor position at the end of the original selection
				const position = textEditor.selection.end;
				textEditor.selection = new vscode.Selection(position, position);
			}
			// Insert the character
			vscode.commands.executeCommand("default:type", args);
		},
	);

	context.subscriptions.push(disposable);
	context.subscriptions.push(typeDisposable);
}

module.exports = {
	activate,
};
