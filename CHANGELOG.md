## [1.3.0] - 2025-01-20
### Added
- Added multi-cursor support

### Improved
-  Reduced the size of the logo from 6.7kb to 1.4kb
-  Removed unused npm package

## [1.2.0] - 2025-01-19
### Added
- Added new logic so the new character insertion logic only works for the selection of the pasted text

### Changed
- Opening brackets ("{", "(", "[") are no longer inserted at the end of a selection, so they will work as the standard VS Code behavior

## [1.1.0] - 2025-01-17
### Added
- Any character, whitespace (space) or newline (enter) inserted when the selection is active will be inserted at the end of the selection instead of replacing the selection with the character

## [1.0.9] - 2024-07-21
### Changed
- Updated the npm packages

## [1.0.8] - 2024-07-07
### Added
- Pressing enter when text is selected unselects the text before using the key

## [1.0.7] - 2024-07-07
### Fixed
- Pasting text would give an error "command 'type' already exists"

## [1.0.5] - 2024-07-05
### Added
- Pressing space when text is selected unselects the text before using the key

## [1.0.4] - 2024-06-18
### Changed
- Re-added removed keybind because I forgot it was specifically made for MacOS😅

## [1.0.3] - 2024-06-15
### Fixed
- Selecting text from bottom to top or using Ctrl+A/Cmd+A to select all preventing pasted text from being selected properly
## [1.0.2] - 2024-06-14
### Changed
- Removed a keybind from package.json which would appear as a duplicate in the keyboard shortcut list

## [1.0.1] - 2024-06-08
### Added
-   Extra document.uri.scheme properties to support more file types (vscode-userdata, vscode, untitled)
### Changed
-   Slightly altered the color of the logo

## [0.0.2] - 2024-05-27
### Added
-   Logo

## [0.0.1] - 2024-05-27
### Initial release
