const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let disposable = vscode.commands.registerCommand(
        "extension.selectPastedText",
        async function () {
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
                    const currentPosition = editor.selection.active;

                    // Listen for the next paste event
                    await vscode.commands.executeCommand(
                        "editor.action.clipboardPasteAction"
                    );

                    const newPosition = editor.selection.active;

                    // Create a selection from the original cursor position to the new position
                    const newSelection = new vscode.Selection(
                        currentPosition,
                        newPosition
                    );
                    editor.selection = newSelection;
                }
            }
        }
    );

    context.subscriptions.push(disposable);
}

module.exports = {
    activate,
};
