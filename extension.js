const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const disposable = vscode.commands.registerCommand("extension.selectPastedText", async () => {
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

				// Listen for the space key press to unselect the text
				const typeDisposable = vscode.commands.registerTextEditorCommand(
					"type",
					(textEditor, edit, args) => {
						if (args.text === " " && textEditor.selection.isEmpty === false) {
							// Unselect the text before inserting the space
							const position = textEditor.selection.end;
							textEditor.selection = new vscode.Selection(position, position);
						}
						// Pass the event to the original type command
						vscode.commands.executeCommand("default:type", args);
					},
				);

				context.subscriptions.push(typeDisposable);
			}
		}
	});

	context.subscriptions.push(disposable);
}

module.exports = {
	activate,
};
