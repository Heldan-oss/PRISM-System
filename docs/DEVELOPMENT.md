# Development Guide

## Overview

This document describes the current architecture, development workflow, testing requirements, data-management rules, and release process for **PRISM RPG for Foundry Virtual Tabletop**.

PRISM RPG for Foundry VTT is an unofficial, fan-made system currently in Alpha development.

During the Alpha phase:

* Features may be incomplete.
* Internal architecture may change.
* Stored Actor data may change.
* Backward compatibility is not guaranteed.
* Manual testing is required before every release.

This document describes the implementation currently present in the repository. It must be updated whenever a contribution changes:

* Repository structure.
* Runtime architecture.
* Actor data.
* Sheet behavior.
* Virtual-bag behavior.
* Localization.
* Packaging.
* Release procedures.
* Development requirements.

For contribution branches, commits, Pull Requests, and review rules, see [`CONTRIBUTING.md`](../CONTRIBUTING.md).

For user installation instructions, see [`INSTALLATION.md`](INSTALLATION.md).

---

## Table of Contents

* [Current Technology](#current-technology)
* [Repository Structure](#repository-structure)
* [Local Development Setup](#local-development-setup)
* [System Manifest](#system-manifest)
* [Runtime Architecture](#runtime-architecture)
* [Actor Data](#actor-data)
* [Anomaly Sheet](#anomaly-sheet)
* [Virtual Bag](#virtual-bag)
* [Dialogs and Chat](#dialogs-and-chat)
* [Templates and Styles](#templates-and-styles)
* [Localization](#localization)
* [Coding Rules](#coding-rules)
* [Data Changes and Migrations](#data-changes-and-migrations)
* [Testing](#testing)
* [Debugging](#debugging)
* [Dependencies and Generated Files](#dependencies-and-generated-files)
* [Security Requirements](#security-requirements)
* [Release Process](#release-process)
* [Known Technical Debt](#known-technical-debt)
* [Definition of Done](#definition-of-done)
* [Related Documentation](#related-documentation)

---

## Current Technology

The current implementation uses:

* JavaScript ES modules with the `.mjs` extension.
* Foundry VTT Actor documents.
* A custom Actor sheet.
* Handlebars templates.
* JSON localization files.
* CSS stylesheets.
* Foundry VTT dialogs.
* Foundry VTT notifications.
* Foundry VTT chat messages.
* A JSON Actor data template.

---

## Repository Structure

The repository is named `PRISM-System`.

The Foundry VTT runtime package is contained in the `prism/` directory.

```text
PRISM-System/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.yml
│   │   ├── config.yml
│   │   └── feature_request.yml
│   ├── CODEOWNERS
│   └── pull_request_template.md
│
├── docs/
│   ├── images/
│   ├── DEVELOPMENT.md
│   ├── INSTALLATION.md
│   └── LOCALIZATION.md
│
├── prism/
│   ├── lang/
│   │   ├── en.json
│   │   └── it.json
│   │
│   ├── module/
│   │   ├── actor-sheet.mjs
│   │   ├── bag-manager.mjs
│   │   ├── dialogs.mjs
│   │   ├── prism.mjs
│   │   └── utils.mjs
│   │
│   ├── styles/
│   │   ├── variables.css
│   │   ├── sheet.css
│   │   └── prism.css
│   │
│   ├── templates/
│   │   └── actor-character-sheet.hbs
│   │
│   ├── system.json
│   └── template.json
│
├── .gitignore
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
└── SECURITY.md
```

### Repository Root

The repository root contains:

* Project documentation.
* GitHub configuration.
* Licensing information.
* Governance files.
* The `prism/` runtime package.

The repository root is not the Foundry system directory.

### Runtime Directory

Everything required by Foundry at runtime must be contained in:

```text
prism/
```

After installation, Foundry must be able to access:

```text
Data/systems/prism/system.json
```

### Documentation Directory

The `docs/` directory contains documentation for:

* Installation.
* Development.
* Localization.
* Repository images.

### GitHub Configuration

GitHub-specific files belong in:

```text
.github/
```

IDE metadata does not belong in `.github/` and must not be committed.

---

## Repository Hygiene

The root `.gitignore` should exclude local and generated files such as:

```gitignore
# JetBrains IDEs
.idea/
*.iml
*.ipr
*.iws

# Operating-system metadata
.DS_Store
Thumbs.db

# Logs and temporary files
*.log
*.tmp
*.swp
*.swo

# Foundry local data
Data/
Config/
Logs/
worlds/

# Dependencies and generated output
node_modules/
dist/
build/
coverage/

# Local release package
prism.zip

# Environment files
.env
.env.*
```

Do not commit:

* `.idea/`
* IDE project files.
* Foundry worlds.
* Local Foundry configuration.
* Access tokens.
* Environment files.
* Generated release archives.
* Temporary logs.
* Private campaign data.

The Actor data file must be named exactly:

```text
template.json
```

---

## Local Development Setup

### Prerequisites

Development requires:

* A working Foundry Virtual Tabletop installation.
* Git.
* A text editor or IDE.
* A modern browser with developer tools, or the Foundry desktop client.
* A dedicated Foundry world for development and testing.

Use disposable test data. Do not use an important campaign as the primary development environment.

### Clone the Repository

```bash
git clone https://github.com/Heldan-oss/PRISM-System.git
cd PRISM-System
```

The runtime source is:

```text
PRISM-System/prism/
```

### Foundry User Data Directory

Foundry systems are installed under:

```text
FOUNDRY_USER_DATA/Data/systems/
```

The development installation must resolve to:

```text
FOUNDRY_USER_DATA/
└── Data/
    └── systems/
        └── prism/
            ├── system.json
            ├── template.json
            ├── lang/
            ├── module/
            ├── styles/
            └── templates/
```

The system directory must be named:

```text
prism
```

### Recommended Development Link

Use a symbolic link or directory junction so that Foundry loads the repository files directly.

#### Linux or macOS

```bash
ln -s "/path/to/PRISM-System/prism" \
      "/path/to/FOUNDRY_USER_DATA/Data/systems/prism"
```

#### Windows PowerShell

```powershell
New-Item `
  -ItemType Junction `
  -Path "C:\path\to\FOUNDRY_USER_DATA\Data\systems\prism" `
  -Target "C:\path\to\PRISM-System\prism"
```

Do not create:

```text
Data/systems/prism/prism/system.json
```

The correct path is:

```text
Data/systems/prism/system.json
```

### Create a Test World

After linking the system:

1. Start Foundry VTT.
2. Open the Setup screen.
3. Confirm that PRISM appears in the system list.
4. Create a new PRISM world.
5. Launch the world.
6. Create an Actor of type `character`.
7. Open the Anomaly sheet.
8. Check the browser developer console.

The console should contain:

```text
PRISM | Init
```

---

## System Manifest

The runtime manifest is:

```text
prism/system.json
```

It is the authoritative source for:

* System ID.
* Display title.
* Description.
* Version.
* Foundry compatibility.
* Authors.
* Repository metadata.
* Manifest URL.
* Package download URL.
* JavaScript modules.
* Stylesheets.
* Languages.
* Grid settings.
* Socket configuration.

### Distribution Fields

The public manifest URL is:

```text
https://github.com/Heldan-oss/PRISM-System/releases/latest/download/system.json
```

The manifest should contain:

```json
{
  "url": "https://github.com/Heldan-oss/PRISM-System",
  "manifest": "https://github.com/Heldan-oss/PRISM-System/releases/latest/download/system.json",
  "download": "https://github.com/Heldan-oss/PRISM-System/releases/download/vX.Y.Z/prism.zip"
}
```

The `manifest` URL remains stable between releases.

The `download` URL must point to the exact release matching the manifest version.

For example:

```json
{
  "version": "0.1.1",
  "download": "https://github.com/Heldan-oss/PRISM-System/releases/download/v0.1.1/prism.zip"
}
```

Do not change the `version` or version-specific `download` URL outside release preparation unless explicitly requested by a maintainer.

### Entry Module

Foundry loads:

```text
module/prism.mjs
```

through the `esmodules` manifest field.

### Stylesheets

The current stylesheet order is:

```text
styles/variables.css
styles/sheet.css
styles/prism.css
```

Order matters:

1. `variables.css` defines reusable design values.
2. `sheet.css` defines the Actor-sheet layout.
3. `prism.css` defines shared system and chat presentation.

### Languages

The current manifest registers:

```text
lang/en.json
lang/it.json
```

Language files must remain synchronized at the key level.

### Compatibility Changes

Do not change Foundry compatibility declarations without testing the affected versions.

A compatibility change must update, when applicable:

* `prism/system.json`
* `README.md`
* `CHANGELOG.md`
* Release notes
* Pull Request test results

---

## Runtime Architecture

The runtime code is divided into five modules.

| File                     | Responsibility                                          |
| ------------------------ | ------------------------------------------------------- |
| `module/prism.mjs`       | System initialization and Actor-sheet registration      |
| `module/actor-sheet.mjs` | Sheet context, events, synchronization, and chat output |
| `module/bag-manager.mjs` | Virtual-bag data and draw operations                    |
| `module/dialogs.mjs`     | User dialogs                                            |
| `module/utils.mjs`       | Shared paths, labels, and array utilities               |

High-level flow:

```text
Foundry init
    │
    ▼
module/prism.mjs
    │
    ▼
PrismActorSheet
    │
    ├── actor-character-sheet.hbs
    ├── BagManager
    ├── PrismDialogs
    ├── utility functions
    └── ChatMessage
```

Keep initialization code small.

Business logic should be separated from:

* Handlebars presentation.
* Click handlers.
* CSS.
* Localization values.

Reusable bag behavior belongs in `BagManager`.

Reusable interface-independent helpers belong in a focused module rather than directly in the Actor sheet.

---

## Actor Data

The Actor schema is defined in:

```text
prism/template.json
```

The current system supports one Actor type:

```text
character
```

No custom Item types are currently defined.

### Current Actor Fields

| Field           | Default | Purpose             |
| --------------- | ------: | ------------------- |
| `concept`       |    `""` | Character concept   |
| `biography`     |    `""` | Biography           |
| `personalNotes` |    `""` | Personal notes      |
| `notes`         |    `""` | Reserved or unused  |
| `questions`     |    `""` | Reserved or unused  |
| `inventory`     |    `[]` | Inventory entries   |
| `traits`        |    `[]` | Trait entries       |
| `adversities`   |    `[]` | Adversity entries   |
| `fears`         |    `[]` | Reserved collection |
| `dangers`       |    `[]` | Reserved collection |
| `marks`         |    `[]` | Current Marks value |
| `bag`           |    `[]` | Virtual-bag entries |
| `lastDraw`      |    `[]` | Most recent draw    |

### Trait and Adversity Entries

```json
{
  "id": "RANDOM_ID",
  "name": "Example label",
  "type": "trait"
}
```

Each entry contains:

* A stable local ID.
* A user-visible name.
* An internal semantic type.

### Bag Entries

```json
{
  "id": "BAG_ENTRY_ID",
  "sourceId": "SOURCE_LABEL_ID",
  "name": "Example label",
  "type": "trait"
}
```

Generic Fear and Danger entries use:

```json
{
  "id": "BAG_ENTRY_ID",
  "sourceId": null,
  "name": "Localized name",
  "type": "fear"
}
```

The bag-entry ID is distinct from the source-label ID.

The current implementation permits multiple bag entries originating from the same source label. Future validation changes must update this document and describe their effect on existing Actors.

### Inventory Entries

```json
{
  "id": "RANDOM_ID",
  "name": "Example item",
  "quantity": 1
}
```

Inventory entries are plain objects stored inside Actor data. They are not Foundry Item documents.

### Current Data Rules

Unless a focused data change is approved:

* Dynamic entries must have stable IDs.
* Internal types must not be localized.
* Inventory quantities must be numeric.
* `bag` and `lastDraw` must remain arrays.
* Blank labels must not be added to the bag.
* Drawn entries must be removed from the bag.
* Clearing the bag must also clear `lastDraw`.

---

## Anomaly Sheet

The custom Actor sheet is implemented in:

```text
prism/module/actor-sheet.mjs
```

and rendered by:

```text
prism/templates/actor-character-sheet.hbs
```

### Sheet Context

The sheet currently exposes:

```text
system
traits
adversities
bag
lastDraw
inventory
```

Missing collections fall back to empty arrays.

### Sheet Actions

Current actions include:

| Action                  | Purpose                       |
| ----------------------- | ----------------------------- |
| `add-label`             | Add a Trait or Adversity      |
| `delete-label`          | Delete a Trait or Adversity   |
| `add-to-bag`            | Add a stored label to the bag |
| `remove-from-bag`       | Remove one bag entry          |
| `clear-bag`             | Clear the bag and latest draw |
| `draw-three`            | Draw up to three entries      |
| `risk`                  | Open the risk dialog and draw |
| `add-fear`              | Add a generic Fear            |
| `add-danger`            | Add a generic Danger          |
| `add-inventory-item`    | Add an inventory row          |
| `delete-inventory-item` | Delete an inventory row       |

Use semantic template attributes:

```hbs
data-action="add-label"
data-type="trait"
data-id="{{this.id}}"
```

Do not bind behavior to:

* Translated text.
* Visual position.
* CSS presentation.
* Array indexes.

### Sheet Synchronization

Dynamic fields are synchronized before actions through:

```text
_syncSheetData()
```

Any new dynamic collection must define how unsaved values are preserved before:

* Adding rows.
* Deleting rows.
* Drawing.
* Updating the bag.
* Re-rendering the sheet.

Do not introduce controls that silently discard unsaved data.

---

## Virtual Bag

Bag logic is implemented in:

```text
prism/module/bag-manager.mjs
```

### Current Responsibilities

`BagManager` handles:

* Reading cloned bag data.
* Adding stored labels.
* Adding generic Fear and Danger entries.
* Removing entries.
* Clearing the bag.
* Drawing entries.
* Updating `lastDraw`.

### Data Mutation

Always clone stored arrays before changing them.

```js
const bag = foundry.utils.deepClone(actor.system.bag ?? []);
```

Persist changes through Foundry document updates:

```js
await actor.update({
    "system.bag": bag
});
```

Do not directly mutate persisted Actor source data.

### Drawing

The current draw process:

1. Reads the current bag.
2. Rejects an empty bag.
3. Limits the amount to the number of available entries.
4. Shuffles the entries.
5. Selects the requested entries.
6. Removes drawn entries from the bag.
7. Stores the result in `lastDraw`.
8. Returns the result.

Drawing is without replacement.

### Randomization

The system currently uses a Fisher–Yates-style shuffle based on `Math.random()`.

It is intended for ordinary gameplay resolution, not cryptographic use.

A change to randomization must document:

* Gameplay impact.
* Expected distribution.
* Testing performed.
* Compatibility with existing workflows.

---

## Dialogs and Chat

### Risk Dialog

The risk dialog is implemented in:

```text
prism/module/dialogs.mjs
```

It resolves with:

```text
1
2
3
```

or:

```text
null
```

when cancelled or closed.

Visible dialog text must be localized.

### Chat Messages

Draw results are created by the Actor sheet using Foundry `ChatMessage`.

Current result types use CSS classes such as:

```text
prism-trait
prism-adversity
prism-fear
prism-danger
```

Chat output must:

* Use the current Actor as speaker.
* Use localized titles.
* Preserve semantic result types.
* Handle long labels.
* Escape or sanitize user-controlled content.
* Avoid exposing private data.

Do not interpolate new user-controlled values into HTML without reviewing their safety.

---

## Templates and Styles

### Templates

The main template is:

```text
prism/templates/actor-character-sheet.hbs
```

Templates should:

* Contain presentation logic only.
* Use `{{localize}}` for visible text.
* Use semantic `data-*` attributes.
* Quote generated attribute values.
* Avoid mutating data.
* Avoid complex gameplay logic.

Correct:

```hbs
placeholder="{{localize 'prism.sheet.objectMessage'}}"
```

Avoid:

```hbs
placeholder={{localize 'prism.sheet.objectMessage'}}
```

### Styles

Styles are divided into:

```text
styles/variables.css
styles/sheet.css
styles/prism.css
```

Use:

* `variables.css` for reusable values and palette definitions.
* `sheet.css` for Actor-sheet layout and controls.
* `prism.css` for shared system and chat components.

CSS must:

* Be scoped under PRISM-specific classes.
* Avoid broad selectors affecting Foundry core.
* Preserve keyboard focus indicators.
* Support translated text.
* Avoid communicating state through color alone.
* Remain usable when the sheet is resized.

---

## Localization

Localization files are:

```text
prism/lang/en.json
prism/lang/it.json
```

Current key groups include:

```text
prism.bag
prism.sheet
prism.bagManager
prism.dialog
prism.chat
```

### JavaScript

```js
game.i18n.localize("prism.sheet.characterName");
```

### Handlebars

```hbs
{{localize "prism.sheet.characterName"}}
```

Rules:

* Do not hard-code user-facing strings.
* Keep English and Italian keys synchronized.
* Do not localize internal types or IDs.
* Preserve placeholders.
* Test translated text in Foundry.
* Avoid adding substantial copyrighted rules text.

See [`LOCALIZATION.md`](LOCALIZATION.md) for the complete translation workflow.

---

## Coding Rules

### Formatting

Follow the style of the edited file.

Current JavaScript generally uses:

* Four-space indentation.
* Semicolons.
* Double-quoted strings.
* `async` and `await`.
* Descriptive method names.
* Braces for multi-line control structures.

Do not combine functional changes with repository-wide formatting.

### Imports

* Keep imports at the beginning of the file.
* Use relative paths.
* Include `.mjs`.
* Remove unused imports.
* Avoid circular dependencies.

### Identifiers

Use:

```js
foundry.utils.randomID()
```

for persistent plain-object IDs.

Do not use array indexes as stored identifiers.

### Event Handlers

Handlers should:

1. Prevent unwanted default behavior.
2. Synchronize unsaved data.
3. Validate IDs and types.
4. Delegate reusable logic.
5. Await document updates.
6. Re-render only when required.

### Error Handling

Expected user errors should use localized notifications.

Unexpected failures should:

* Preserve stored data.
* Provide enough technical context for debugging.
* Avoid exposing sensitive data.
* Avoid being silently ignored.

Remove temporary debugging output before review.

The initialization log:

```text
PRISM | Init
```

is intentional.

---

## Data Changes and Migrations

The project does not currently provide an automated migration framework.

Any stored-data change is therefore high risk.

Examples include:

* Adding or removing Actor fields.
* Renaming fields.
* Changing field types.
* Changing Trait or Adversity structure.
* Changing bag-entry structure.
* Changing inventory structure.
* Moving inventory to Foundry Items.
* Replacing `template.json` with formal DataModel classes.

A Pull Request changing stored data must explain:

* Previous structure.
* New structure.
* Existing-world impact.
* Default behavior for new Actors.
* Migration or fallback behavior.
* Compatibility implications.
* Backup requirements.
* Test results using existing data.

Rules:

* Do not silently delete stored data.
* Do not silently rename stored properties.
* Do not assume that changing defaults updates existing Actors.
* Preserve unknown data unless deliberate removal is approved.
* Make migrations repeatable when possible.
* Test migrations on copied worlds.
* Never test migration code first on an important campaign.

Every schema change must be documented in:

* The Pull Request.
* `CHANGELOG.md`.
* Release notes.
* This guide when architecture changes.
* Installation documentation when user action is required.

---

## Testing

Manual testing is currently required for every functional change.

Use a dedicated test world with unrelated modules disabled whenever possible.

### Required Baseline

Verify:

* The system appears in Foundry Setup.
* A PRISM world can be created.
* The world loads.
* `PRISM | Init` appears.
* No blocking console errors appear.
* A `character` Actor can be created.
* The Anomaly sheet opens.

### Sheet

Verify:

* Actor name and concept persist.
* Tabs work.
* Traits and Adversities can be managed.
* Biography and notes persist.
* Inventory rows persist.
* The sheet remains usable when resized.
* Existing Actor data still renders.

### Virtual Bag

Verify:

* Valid entries can be added.
* Invalid entries are rejected as intended.
* Entries can be removed.
* Clearing resets the bag and latest draw.
* Empty-bag drawing displays a warning.
* Drawn entries leave the bag.
* Remaining entries persist.
* Draw results persist after reload.
* Any new composition limits are tested at, below, and above their boundaries.

### Risk Dialog

Verify:

* One, two, and three can be selected.
* Confirm performs the correct draw.
* Cancel performs no draw.
* Closing the dialog performs no draw.
* Small bags are handled safely.

### Chat

Verify:

* Standard and risk draws create messages.
* The Actor speaker is correct.
* Every result is present.
* Type classes render correctly.
* Long and special-character labels do not break output.
* User-controlled HTML is handled safely.

### Localization

Test both:

* English.
* Italian.

Verify:

* No raw localization keys appear.
* Dialogs are translated.
* Notifications are translated.
* Chat titles are translated.
* Buttons and labels fit the interface.

### Compatibility

When changing Foundry APIs, record:

* Exact Foundry version and build.
* Browser or desktop client.
* Operating system.
* Enabled modules.
* Whether the world is new or existing.
* Relevant console output.

### Permissions

When relevant, test as:

* Gamemaster.
* Player owning the Actor.
* Player not owning the Actor.

Users must not modify Actor data beyond their Foundry permissions.

---

## Debugging

Inspect:

* Browser console errors.
* Failed network requests.
* Missing templates.
* Missing stylesheets.
* Invalid localization paths.
* Invalid Actor update paths.
* Unhandled Promise rejections.

Useful console filter:

```text
PRISM
```

Common checks:

### System Not Listed

Confirm:

```text
Data/systems/prism/system.json
```

and validate `system.json`.

### Sheet Not Registered

Confirm:

* `module/prism.mjs` loads.
* `PRISM | Init` appears.
* Imports resolve.
* The Actor type is `character`.

### Template Not Found

Confirm:

```text
systems/prism/templates/actor-character-sheet.hbs
```

### Data Lost After an Action

Check:

* `_syncSheetData()`.
* Row selectors.
* `data-id`.
* `data-type`.
* Actor update paths.

### Wrong Bag Entry Removed

Check the distinction between:

* Source-label ID.
* Bag-entry ID.

Bag removal uses the bag-entry ID.

---

## Dependencies and Generated Files

The current project runs directly from source.

Do not add a dependency, package manager, compiler, bundler, or framework without explaining:

* The problem it solves.
* Why existing code is insufficient.
* Runtime or development-only use.
* License.
* Maintenance status.
* Security implications.
* Contributor impact.
* Build and release impact.
* Generated output.

Do not commit:

```text
node_modules/
coverage/
dist/
build/
prism.zip
```

Generated release assets are uploaded to GitHub Releases and are not normal source files.

---

## Security Requirements

Follow [`SECURITY.md`](../SECURITY.md) for private vulnerability reporting.

Development changes must:

* Respect Foundry permissions.
* Validate user-controlled input.
* Escape or sanitize user-controlled HTML.
* Avoid dynamic code execution.
* Avoid exposing tokens or credentials.
* Avoid logging private campaign data.
* Avoid unsafe filesystem assumptions.
* Review third-party dependencies.
* Treat chat output as security-sensitive.

Do not open a public Issue for an exploitable security vulnerability.

---

## Release Process

Publishing a release is a maintainer responsibility.

External contributors should not:

* Create release tags.
* Publish GitHub Releases.
* Change the package version without approval.
* Change release URLs without approval.
* Upload release assets.

### 1. Confirm Release Scope

Before release preparation:

1. Confirm the intended version.
2. Review the associated milestone, when used.
3. Confirm that required Issues are closed.
4. Confirm that required Pull Requests are merged.
5. Move deferred work out of the milestone.
6. Review unresolved security or data-loss concerns.

A release should not be published with known blocking security or data-loss defects.

### 2. Prepare the Changelog

During development, notable changes belong under:

```md
## [Unreleased]
```

Before publishing, move those entries into a versioned section:

```md
## [Unreleased]

## [X.Y.Z] - YYYY-MM-DD
```

Include only changes actually present in the release.

### 3. Create a Release Branch

From an updated `main`:

```bash
git checkout main
git pull --ff-only origin main
git checkout -b release/X.Y.Z
```

Example:

```bash
git checkout -b release/0.2.0
```

### 4. Update the Manifest

Update:

```text
prism/system.json
```

Set:

```json
{
  "version": "X.Y.Z",
  "manifest": "https://github.com/Heldan-oss/PRISM-System/releases/latest/download/system.json",
  "download": "https://github.com/Heldan-oss/PRISM-System/releases/download/vX.Y.Z/prism.zip"
}
```

Confirm that the tag and download URL use the same version.

Review:

* Compatibility values.
* Authors.
* Repository URL.
* Manifest URL.
* Download URL.
* Languages.
* Runtime file paths.

### 5. Validate and Test

Before opening the release Pull Request:

* Validate `system.json`.
* Validate `template.json`.
* Validate localization JSON.
* Test English and Italian.
* Test a new world.
* Test a copied existing world when data changed.
* Test the main gameplay workflow.
* Check the browser console.
* Review the package for unauthorized content.

### 6. Open the Release Pull Request

Use a Pull Request title such as:

```text
chore: prepare release 0.2.0
```

The Pull Request should include:

* Version change.
* Final changelog.
* Compatibility changes.
* Release-specific documentation updates.

After approval, merge it into `main` using the normal repository merge policy.

### 7. Update Local `main`

```bash
git checkout main
git pull --ff-only origin main
```

The package must be created from the same `main` commit that will be tagged.

### 8. Build `prism.zip`

Run the packaging command from the repository root.

#### Windows PowerShell

```powershell
Compress-Archive `
  -Path prism `
  -DestinationPath prism.zip `
  -Force
```

#### Linux or macOS

```bash
rm -f prism.zip
zip -r prism.zip prism \
  -x "*.DS_Store" \
  -x "*/.idea/*"
```

### 9. Verify the Package

Open the archive and confirm that it contains:

```text
prism/
├── system.json
├── template.json
├── lang/
├── module/
├── styles/
└── templates/
```

Confirm that:

* `prism/system.json` exists.
* The ZIP contains no `.git/` directory.
* The ZIP contains no `.github/` directory.
* The ZIP contains no `docs/` directory.
* The ZIP contains no IDE metadata.
* The included manifest matches the version being published.

### 10. Create the GitHub Release

In GitHub:

1. Open **Releases**.
2. Select **Draft a new release**.
3. Create or select the tag:

```text
vX.Y.Z
```

4. Select `main` as the target.
5. Use a title such as:

```text
PRISM System X.Y.Z
```

6. Add release notes based on `CHANGELOG.md`.
7. Upload:

```text
prism.zip
prism/system.json
```

The uploaded manifest asset must be named:

```text
system.json
```

The uploaded archive must be named:

```text
prism.zip
```

The release intended for the public `latest` manifest URL must be published and available as the latest normal release. Do not leave it as a draft.

### 11. Publish and Verify

After publishing, verify:

```text
https://github.com/Heldan-oss/PRISM-System/releases/latest/download/system.json
```

and:

```text
https://github.com/Heldan-oss/PRISM-System/releases/download/vX.Y.Z/prism.zip
```

Then test installation from a clean Foundry Setup screen using the public manifest URL.

Verify:

* Foundry reads the manifest.
* Foundry downloads the correct ZIP.
* The displayed version is correct.
* A new PRISM world starts.
* The Anomaly sheet opens.
* English and Italian work.
* No blocking console errors appear.

### 12. Complete the Release

After successful verification:

* Close the corresponding milestone, when used.
* Update the GitHub Project.
* Delete the release branch.
* Keep `CHANGELOG.md` ready for new `Unreleased` entries.
* Announce the release through the appropriate project channel.

Do not modify an already published release asset to represent a different version. Publish a new version instead.

---

## Known Technical Debt

The following items remain known technical debt.

### Application V1

The current implementation uses:

```text
ActorSheet
Dialog
```

A future focused change should evaluate migration to Foundry Application V2 classes.

Do not combine that migration with an unrelated feature.

### JSON Actor Template

Actor defaults are currently defined through:

```text
template.json
```

A future migration to formal Foundry DataModel classes would require:

* Schema design.
* Compatibility review.
* Migration planning.
* Existing-world testing.

### Marks Type

The schema currently defines:

```json
{
  "marks": []
}
```

while the sheet treats Marks as textarea content.

The intended type and future Signs implementation must be resolved through a dedicated data-model change.

### Reserved Fields

These fields are currently unused or only partially used:

```text
notes
questions
fears
dangers
```

Do not remove them without reviewing existing worlds and planned gameplay features.

### Fear and Danger Storage

Fear and Danger are currently added directly to the bag as generic entries.

The long-term relationship between:

* Stored Fear or Danger collections.
* Generic bag entries.
* Gameplay limits.

must be defined before expanding the data model.

### Bag Composition Validation

The current implementation allows repeated source labels and does not enforce all gameplay composition limits.

Any validation change must:

* Use internal IDs and types.
* Preserve existing Actor data.
* Provide localized feedback.
* Test boundary conditions.
* Update this document.

### Chat HTML

User-controlled label names are currently interpolated into chat HTML.

Escaping or sanitization must be reviewed before a stable release.

### Inventory

Inventory is stored as plain Actor data rather than Foundry Item documents.

Migrating to Items would be a significant data and architecture change.

### Automated Validation

The repository currently has no automated checks for:

* JavaScript syntax.
* JSON validity.
* Localization-key parity.
* Handlebars templates.
* Unit tests.
* Integration tests.
* Release packaging.

These should be introduced incrementally rather than as an unrelated large tooling change.

### Unused Helpers

Review whether all exported utility functions remain necessary.

Unused helpers should be:

* Used consistently.
* Documented as planned.
* Removed through a focused cleanup.

---

## Definition of Done

A change is complete when all applicable requirements are satisfied.

### Code

* The implementation solves one defined problem.
* Existing architecture is followed.
* Reusable logic is separated from presentation.
* No unrelated refactoring is included.
* Temporary debugging code is removed.
* User-controlled data is validated.
* Persisted Actor data is updated through Foundry APIs.

### Data

* Changed fields are documented.
* Existing-world impact is understood.
* Migration needs are identified.
* IDs remain stable.
* Invalid states are handled.
* Data persists after reload.

### Interface

* Visible text is localized.
* English and Italian are updated.
* Resized layouts remain usable.
* Keyboard and accessibility effects are considered.
* Visual changes include screenshots in the Pull Request.

### Testing

* The system loads.
* The affected workflow is tested.
* Relevant edge cases are tested.
* The console is checked.
* Existing data is tested when affected.
* Exact Foundry and client versions are recorded.

### Documentation

* `CHANGELOG.md` is updated for notable changes.
* This guide is updated for architecture or release changes.
* `INSTALLATION.md` is updated for installation changes.
* `LOCALIZATION.md` is updated for translation-workflow changes.
* `README.md` is updated for public project behavior.

### Legal and Security

* No secrets or private data are included.
* No unauthorized commercial material is included.
* Third-party licensing is documented.
* Security-sensitive findings are handled privately.
* The contribution may be distributed under the repository license.

---

## Related Documentation

* [Project README](../README.md)
* [Installation Guide](INSTALLATION.md)
* [Localization Guide](LOCALIZATION.md)
* [Contributing Guidelines](../CONTRIBUTING.md)
* [Security Policy](../SECURITY.md)
* [Changelog](../CHANGELOG.md)
* [License](../LICENSE)
