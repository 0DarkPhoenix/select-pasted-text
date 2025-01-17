# Select Pasted Text

## Overview

The "Select Pasted Text" extension automatically selects text that you paste into a file. This functionality helps you quickly modify or move the pasted content without manually selecting it. 

## Features

- Automatically selects pasted text in any file.
- Works only when the cursor is within a file, ensuring it does not interfere with other parts of VS Code (like the terminal or debug console).
- Binds to the default paste shortcut (`Ctrl+V` for Windows/Linux and `Cmd+V` for Mac).
- When inserting a character, whitespace (space) or newline (enter), the new character won't delete the selected code. Instead, the new character will be inserted at the end of the selection.

## Usage

- Paste text using `Ctrl+V` (Windows/Linux) or `Cmd+V` (Mac) in any text file.
- The extension will automatically select the pasted text.
- If you insert any character, whitespace (space) or newline (enter), the new character will be inserted at the end of the selection instead of replacing the selection with the character

## Commands

This extension contributes the following command:

- `selectPastedText.selectPastedText`: Automatically selects pasted text.

## Keybindings

The extension comes with the following default keybindings:

- `Ctrl+V` (Windows/Linux): Triggers the `selectPastedText.selectPastedText` command.
- `Cmd+V` (Mac): Triggers the `selectPastedText.selectPastedText` command.

## License

This extension is licensed under the MIT License.
