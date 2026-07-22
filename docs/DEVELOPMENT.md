# Development Guide

## Overview

This document describes the current architecture, development workflow, data strucRISM RPG for Foundry Virtual Tabletop**.

PRISM RPG for Foundry VTT is currently an Alpha project. Its architecture and stored data may change while the system is under active development.

This guide documents the implementation that currently exists. It must be updated whenundry system manifest.

* Actor or Item data.
* Sheet behavior.
* The virtual bag.
* Chat messages.
* Localization.
* Styling.
* Development tools.
* Testing procedures.
* Packaging or release workflows.

For contribution branches, commits, Pull Requests, and review rules, see [`CONTRIBUTING.md`](../CONTRIBUTING.md).

---

## Table of Contents

* [Current Technology](#current-technology)
* [Repository Structure](#repository-structure)
* [Repository Hygiene](#repository-hygiene)
* [Local Development Setup](#local-development-setup)
* [System Manifest](#system-manifest)
* [System Initialization](#system-initialization)
* [Current Architecture](#current-architecture)
* [Actor Data Structure](#actor-data-structure)
* [Anomaly Sheet](#anomaly-sheet)
* [Virtual Bag](#virtual-bag)
* [Risk Dialog](#risk-dialog)
* [Chat Messages](#chat-messages)
* [Utility Functions](#utility-functions)
* [Templates](#templates)
* [Localization](#localization)
* [Styling](#styling)
* [Coding Conventions](#coding-conventions)
* [Error Handling](#error-handling)
* [Data Changes and Migrations](#data-changes-and-migrations)
* [Manual Testing](#manual-testing)
* [Debugging](#debugging)
* [Dependencies and Build Tools](#dependencies-and-build-tools)
* [Security Requirements](#security-requirements)
* [Packaging and Releases](#packaging-and-releases)
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
* Foundry VTT chat messages.
* Foundry VTT notifications and dialogs.
* A JSON-based Actor data template.

The project currently has:

* No Node.js package requirement.
* No package manager configuration.
* No compilation step.
* No bundler.
* No linter configuration.
* No automated test suite.
* No database migration framework.
* No custom socket communication.
* No custom Item types.

Contributors must not assume that `npm install`, a build command, or an automated test command exists unless such tooling is added and documented in a dedicated change.

---

## Repository Structure

The repository is named `PRISM-System`.

The actual Foundry VTT game system is contained in the `prism/` directory.

The intended repository structure is:

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
        └── ...
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

The repository root contains project-level documentation, governance files, licensing information, and the `prism/` system package.

The repository root is not itself the installed Foundry VTT system directory.

### `prism/`

The `prism/` directory contains everything required by the Foundry game system at runtime.

When installed for development or packaged for distribution, `prism/system.json` must appear as `system.json` at the root of the installed `prism` system directory.

### `docs/`

The `docs/` directory contains development, installation, localization, and image documentation.

### `.github/`

The `.github/` directory contains GitHub-specific repository configuration.

It is separate from `.idea/`.

---

## Repository Hygiene

IDE and local environment metadata are not part of the application source.

The following files should normally be excluded from version control:

```text
.idea/
*.iml
.DS_Store
Thumbs.db
*.log
```

A root-level `.gitignore` should contain at least:

```gitignore
# IntelliJ IDEA
.idea/
*.iml

# Operating-system metadata
.DS_Store
Thumbs.db

# Logs and temporary files
*.log
*.tmp
*.swp

# Foundry local data
worlds/
Data/
Config/
Logs/

# Dependencies and build output, if introduced later
node_modules/
dist/
build/
coverage/
```

Do not store GitHub Issue Forms, `CODEOWNERS`, or the Pull Request template inside `.idea/`.

Use:

```text
.github/ISSUE_TEMPLATE/
.github/CODEOWNERS
.github/pull_request_template.md
```

The file defining the current Actor defaults must be named exactly:

```text
template.json
```

Avoid misspellings such as:

```text
templete.json
tempalte.json
```

---

## Local Development Setup

### Prerequisites

Current development requires:

* A licensed and working Foundry Virtual Tabletop installation.
* Git.
* A text editor or IDE.
* A modern browser with developer tools, or the Foundry desktop application.
* A separate Foundry world used only for development and testing.

### Clone the Repository

```bash
git clone https://github.com/Heldan-oss/PRISM-System.git
cd PRISM-System
```

The cloned repository contains the installable system in:

```text
PRISM-System/prism/
```

### Locate the Foundry User Data Directory

Foundry systems are stored under:

```text
FOUNDRY_USER_DATA/Data/systems/
```

The exact user-data location depends on the operating system and the Foundry configuration.

The final development installation must have this structure:

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

The system folder must be named:

```text
prism
```

This matches the manifest identifier:

```json
{
  "id": "prism"
}
```

### Recommended Development Link

A symbolic link or directory junction allows Foundry to load the repository files directly without copying them after every change.

#### Linux or macOS

```bash
ln -s "/path/to/PRISM-System/prism" \
      "/path/to/FoundryVTT/Data/systems/prism"
```

#### Windows PowerShell

```powershell
New-Item `
  -ItemType Junction `
  -Path "C:\path\to\FoundryVTT\Data\systems\prism" `
  -Target "C:\path\to\PRISM-System\prism"
```

Adjust the paths for the local environment.

Do not create a nested installation such as:

```text
Data/systems/prism/prism/system.json
```

The correct location is:

```text
Data/systems/prism/system.json
```

### Create a Test World

After installing or linking the system:

1. Start Foundry VTT.
2. Open the Setup screen.
3. Confirm that the PRISM system is listed.
4. Create a new world using the PRISM system.
5. Launch the world.
6. Create a test Actor of type `character`.
7. Open the Actor sheet.
8. Check the browser developer console for initialization errors.

Use disposable test data. Do not use a production campaign as the primary development environment.

---

## System Manifest

The runtime manifest is:

```text
prism/system.json
```

The current manifest declares:

```json
{
  "id": "prism",
  "title": "prism-system",
  "description": "An unofficial system for playing PRISM on Foundry VTT",
  "version": "0.1.1",
  "compatibility": {
    "minimum": "12",
    "verified": "13"
  }
}
```

The manifest is the authoritative source for:

* System identifier.
* Display title.
* Description.
* System version.
* Foundry VTT compatibility.
* Authors.
* JavaScript entry points.
* Stylesheets.
* Languages.
* Socket availability.
* Grid configuration.

### Entry Module

The manifest loads:

```text
module/prism.mjs
```

through:

```json
{
  "esmodules": [
    "module/prism.mjs"
  ]
}
```

### Stylesheets

The current stylesheet order is:

```json
{
  "styles": [
    "styles/variables.css",
    "styles/sheet.css",
    "styles/prism.css"
  ]
}
```

Order matters:

1. `variables.css` defines reusable values.
2. `sheet.css` defines sheet layout and components.
3. `prism.css` defines remaining system-wide or presentation rules.

### Languages

The current manifest registers:

* Italian: `lang/it.json`
* English: `lang/en.json`

### Compatibility Changes

Do not change `minimum`, `verified`, or any future `maximum` value without testing the system on the corresponding Foundry versions.

Any compatibility change must also update:

* `README.md`, when relevant.
* `CHANGELOG.md`.
* Release notes.
* Pull Request testing information.

### Version Changes

A release change must update the `version` field in `system.json`.

Do not change the version for unrelated development commits unless the change is part of a planned release process.

---

## System Initialization

The entry point is:

```text
prism/module/prism.mjs
```

Current initialization:

```js
import { PrismActorSheet } from "./actor-sheet.mjs";

Hooks.once("init", () => {
    console.log("PRISM | Init");

    Actors.unregisterSheet("core", ActorSheet);

    Actors.registerSheet("prism", PrismActorSheet, {
        types: ["character"],
        makeDefault: true,
        label: game.i18n.localize("prism.sheet.plabel")
    });
});
```

During the Foundry `init` hook, the system:

1. Logs the initialization message.
2. Unregisters the default core Actor sheet.
3. Registers `PrismActorSheet`.
4. Associates it with Actors of type `character`.
5. Makes it the default sheet for that Actor type.

Initialization code should remain small.

Additional initialization responsibilities should be separated into dedicated modules when they become significant, such as:

* Data-model registration.
* Settings registration.
* Handlebars helpers.
* Socket registration.
* Migration registration.
* Custom Document classes.
* Custom application registration.

---

## Current Architecture

The runtime architecture is divided into five JavaScript modules.

| File                     | Responsibility                                                       |
| ------------------------ | -------------------------------------------------------------------- |
| `module/prism.mjs`       | System initialization and sheet registration                         |
| `module/actor-sheet.mjs` | Actor-sheet data, user events, data synchronization, and chat output |
| `module/bag-manager.mjs` | Virtual-bag state and draw operations                                |
| `module/dialogs.mjs`     | User dialogs                                                         |
| `module/utils.mjs`       | Shared path, label, and randomization helpers                        |

The current high-level flow is:

```text
Foundry initializes the system
        │
        ▼
prism.mjs registers PrismActorSheet
        │
        ▼
actor-character-sheet.hbs renders Actor data
        │
        ▼
actor-sheet.mjs handles user actions
        │
        ├── Bag operations → bag-manager.mjs
        ├── Risk choice → dialogs.mjs
        ├── Shared helpers → utils.mjs
        └── Draw result → Foundry ChatMessage
```

Business logic that can be separated from rendering should not be placed directly in the Handlebars template.

Reusable bag behavior belongs in `BagManager`, not in individual click handlers.

---

## Actor Data Structure

The current Actor schema is defined in:

```text
prism/template.json
```

The system currently supports one Actor type:

```text
character
```

It does not define Item types.

### Current Actor Fields

| Field           | Current default | Intended purpose                                                         |
| --------------- | --------------: | ------------------------------------------------------------------------ |
| `concept`       |            `""` | Short character concept                                                  |
| `biography`     |            `""` | Character biography                                                      |
| `personalNotes` |            `""` | Personal notes                                                           |
| `notes`         |            `""` | Currently reserved or unused                                             |
| `questions`     |            `""` | Currently reserved or unused                                             |
| `inventory`     |            `[]` | Inventory entries                                                        |
| `traits`        |            `[]` | Trait labels                                                             |
| `adversities`   |            `[]` | Adversity labels                                                         |
| `fears`         |            `[]` | Currently reserved; generic fear entries are added directly to the bag   |
| `dangers`       |            `[]` | Currently reserved; generic danger entries are added directly to the bag |
| `marks`         |            `[]` | Marks displayed by the sheet                                             |
| `bag`           |            `[]` | Current virtual-bag entries                                              |
| `lastDraw`      |            `[]` | Most recently drawn entries                                              |

### Label Structure

Traits and adversities use this shape:

```json
{
  "id": "FOUNDARY_RANDOM_ID",
  "name": "Example label",
  "type": "trait"
}
```

Supported label types currently include:

```text
trait
adversity
fear
danger
```

A stored trait or adversity contains:

* `id`: stable identifier within the Actor data.
* `name`: user-entered display value.
* `type`: semantic label type.

### Bag Entry Structure

A bag entry uses:

```json
{
  "id": "BAG_ENTRY_RANDOM_ID",
  "sourceId": "SOURCE_LABEL_ID",
  "name": "Example label",
  "type": "trait"
}
```

Generic fear and danger entries use:

```json
{
  "id": "BAG_ENTRY_RANDOM_ID",
  "sourceId": null,
  "name": "fear",
  "type": "fear"
}
```

The `id` of a bag entry is different from the original label ID.

This allows:

* The same source label to be placed into the bag more than once.
* Each bag copy to be removed independently.
* Generic entries to exist without a source label.

### Inventory Entry Structure

Inventory entries use:

```json
{
  "id": "FOUNDARY_RANDOM_ID",
  "name": "Example item",
  "quantity": 1
}
```

Inventory quantities are converted to numbers when read from the sheet.

### Data-Model Invariants

Contributions should preserve these rules unless a documented schema change is approved:

* Every dynamic row has an `id`.
* Trait and adversity entries have a valid `type`.
* Bag entries have their own unique `id`.
* Generic fear and danger entries have `sourceId: null`.
* Inventory quantities are numeric.
* `bag` and `lastDraw` remain arrays.
* Blank named labels cannot be added to the bag.
* Drawn entries are removed from the bag.
* Clearing the bag also clears `lastDraw`.

---

## Anomaly Sheet

The custom Actor sheet is implemented by:

```text
prism/module/actor-sheet.mjs
```

and rendered using:

```text
prism/templates/actor-character-sheet.hbs
```

### Sheet Options

The sheet currently uses:

```js
{
    classes: ["prism", "sheet", "actor"],
    template: "systems/prism/templates/actor-character-sheet.hbs",
    width: 760,
    height: 820,
    resizable: true
}
```

It defines a tab group with:

* `main`
* `bio`
* `inventory`

The initial tab is:

```text
main
```

### Template Context

`getData()` adds the following values to the standard Actor-sheet context:

```text
system
traits
adversities
bag
lastDraw
inventory
```

Missing arrays fall back to empty arrays.

### Registered Sheet Actions

The sheet registers event listeners for:

| Action                  | Handler                  |
| ----------------------- | ------------------------ |
| `add-label`             | `_onAddLabel`            |
| `delete-label`          | `_onDeleteLabel`         |
| `add-to-bag`            | `_onAddToBag`            |
| `remove-from-bag`       | `_onRemoveFromBag`       |
| `clear-bag`             | `_onClearBag`            |
| `draw-three`            | `_onDrawThree`           |
| `risk`                  | `_onRisk`                |
| `add-fear`              | `_onAddFear`             |
| `add-danger`            | `_onAddDanger`           |
| `add-inventory-item`    | `_onAddInventoryItem`    |
| `delete-inventory-item` | `_onDeleteInventoryItem` |

Template actions are declared through `data-action` attributes.

Example:

```html
<button type="button" data-action="add-label" data-type="trait">
```

Do not bind behavior through translated text, visual position, or CSS presentation classes.

Use semantic `data-action`, `data-type`, and `data-id` attributes.

### Data Synchronization

Dynamic label and inventory inputs are synchronized manually before action handlers change Actor data.

The method:

```text
_syncSheetData()
```

collects:

* Trait rows.
* Adversity rows.
* Inventory rows.

It then performs one Actor update before the requested action continues.

This prevents typed but not yet submitted values from being lost when a user:

* Adds another row.
* Deletes a row.
* Adds a label to the bag.
* Removes a bag entry.
* Draws from the bag.
* Clears the bag.
* Changes inventory rows.

Any new dynamic collection added to the sheet must either:

1. Use standard named form inputs that Foundry submits correctly, or
2. Be included in `_syncSheetData()`.

Do not create a new dynamic collection without defining how unsaved input values are preserved.

### Adding Labels

`_onAddLabel()`:

1. Synchronizes the sheet.
2. Reads `data-type`.
3. Resolves the Actor-system path through `labelPathFromType()`.
4. Clones the existing collection.
5. Appends a new blank entry.
6. Updates the Actor.
7. Renders the sheet.

### Deleting Labels

`_onDeleteLabel()` removes the entry matching the selected ID.

Deleting a source label does not currently search for or remove copies already present in the bag.

Changes to that behavior require a deliberate gameplay decision and must not be introduced as an incidental refactor.

### Inventory

Inventory rows are managed as embedded plain objects inside `actor.system.inventory`.

They are not Foundry Item documents.

Adding a custom Item system in the future would be a significant architecture and migration change.

---

## Virtual Bag

The virtual bag is managed by:

```text
prism/module/bag-manager.mjs
```

`BagManager` is responsible for reading, cloning, changing, and drawing entries from `actor.system.bag`.

### Reading the Bag

```js
static getBag(actor) {
    return foundry.utils.deepClone(actor.system.bag ?? []);
}
```

Bag operations should work on cloned data rather than directly mutating the Actor source object.

### Adding a Stored Label

`BagManager.add()`:

1. Trims the label name.
2. Rejects an empty name.
3. Displays a localized warning.
4. Creates a new bag-entry ID.
5. Preserves the source-label ID.
6. Copies the name and type.
7. Updates `system.bag`.

The same source label may currently be added more than once.

Each addition creates a separate bag entry.

### Adding Generic Entries

`BagManager.addGeneric()` adds fear and danger entries directly to the bag.

Generic entries:

* Have a new bag-entry ID.
* Have no source label.
* Use `sourceId: null`.
* Use localized names.
* Use `fear` or `danger` as their type.

### Removing Entries

`BagManager.remove()` removes one bag entry by its bag-entry ID.

It does not remove all entries with the same `sourceId`.

### Clearing the Bag

`BagManager.clear()` resets:

```json
{
  "system.bag": [],
  "system.lastDraw": []
}
```

Any future change to the clearing behavior must explicitly decide whether `lastDraw` should also be preserved or cleared.

### Drawing Entries

`BagManager.draw()`:

1. Clones the current bag.
2. Rejects an empty bag.
3. Limits the requested amount to the number of available entries.
4. Shuffles the bag.
5. Selects the requested entries.
6. Stores the unselected entries as the remaining bag.
7. Stores selected entries as `lastDraw`.
8. Returns the selected entries.

Drawing is without replacement.

A draw of three entries from a bag containing only two entries returns both available entries.

### Randomization

The bag uses `shuffleArray()` from `utils.mjs`.

The current implementation uses a Fisher–Yates-style shuffle with `Math.random()`.

This is appropriate for ordinary gameplay randomization but is not intended for cryptographic use.

Do not replace or significantly change randomization behavior without:

* Explaining the gameplay effect.
* Testing distribution behavior.
* Updating the changelog.
* Documenting whether existing workflows are affected.

---

## Risk Dialog

The risk-selection dialog is implemented by:

```text
prism/module/dialogs.mjs
```

`PrismDialogs.askRiskAmount()` displays a dialog allowing the user to select:

* One label.
* Two labels.
* Three labels.

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

The Actor sheet passes the selected amount to `BagManager.draw()`.

Dialog text must be localized.

Do not hard-code visible labels inside dialog definitions.

---

## Chat Messages

Draw results are sent to Foundry chat by:

```text
PrismActorSheet._sendDrawToChat()
```

The current chat structure is:

```html
<div class="prism-chat-card">
    <h2>Localized title</h2>
    <p>
        <span class="prism-chat-label prism-trait">Label name</span>
    </p>
</div>
```

The speaker is generated from the current Actor.

Draw titles use:

```text
prism.chat.draw
prism.chat.risk
```

Bag-entry types are also used as CSS class suffixes:

```text
prism-trait
prism-adversity
prism-fear
prism-danger
```

### Chat-Safety Requirement

Label names are user-controlled data.

New code must not introduce additional unescaped user-controlled HTML.

Before the system is considered stable, the current chat-message construction should be reviewed to ensure that label names are safely escaped or sanitized before being interpolated into HTML.

Do not assume that a value is safe merely because it originated from an Actor sheet.

---

## Utility Functions

Shared helpers are defined in:

```text
prism/module/utils.mjs
```

### `labelPathFromType(type)`

Maps label types to Actor-system paths:

```js
{
    trait: "traits",
    adversity: "adversities",
    fear: "fears",
    danger: "dangers"
}
```

Callers must handle an unknown type returning `undefined`.

### `labelTypeLabel(type)`

Maps a label type to localized display text.

It currently supports:

* Trait.
* Adversity.
* Fear.
* Danger.

Unknown values fall back to the original type.

This helper should be used where a localized label-type name is needed instead of creating duplicate mappings.

### `shuffleArray(array)`

Creates a deep clone and shuffles the clone.

The input array must not be mutated.

General-purpose helpers should remain:

* Small.
* Deterministic where appropriate.
* Independent of sheet rendering.
* Clearly named.
* Reusable by more than one caller.

Avoid turning `utils.mjs` into a collection of unrelated business logic.

---

## Templates

The main template is:

```text
prism/templates/actor-character-sheet.hbs
```

### Template Sections

The template contains:

* Actor header.
* Character image.
* Character name.
* Concept.
* Sheet navigation.
* Main tab.
* Biography tab.
* Inventory tab.

### Main Tab

The main tab contains:

* Traits.
* Adversities.
* Fear controls.
* Danger controls.
* Virtual bag.
* Latest draw.
* Marks.

### Biography Tab

The biography tab contains:

* Biography.
* Personal notes.

### Inventory Tab

The inventory tab contains:

* Item name.
* Quantity.
* Delete action.
* Add-item action.

### Template Rules

Templates should:

* Contain presentation and simple conditional rendering.
* Use `{{localize}}` for visible text.
* Use semantic `data-*` attributes for actions.
* Avoid complex business logic.
* Avoid mutating Actor data.
* Keep paths consistent with `actor.system`.
* Quote generated HTML attribute values.

For example, use:

```hbs
placeholder="{{localize 'prism.sheet.objectMessage'}}"
```

rather than:

```hbs
placeholder={{localize 'prism.sheet.objectMessage'}}
```

### Adding a New Sheet Field

When adding a new field:

1. Add or confirm the field in the data schema.
2. Add the localization keys.
3. Add the template control.
4. Confirm how the field is submitted.
5. Add any required sheet context.
6. Add event handling only when standard form submission is insufficient.
7. Add styles.
8. Test persistence after reload.
9. Test both English and Italian.
10. Update documentation and `CHANGELOG.md` when user-visible.

---

## Localization

Localization files are stored in:

```text
prism/lang/en.json
prism/lang/it.json
```

The English and Italian files must use the same key structure.

The root namespace is:

```text
prism
```

Current key groups include:

```text
prism.bag
prism.sheet
prism.bagManager
prism.dialog
prism.chat
```

### JavaScript Localization

Use:

```js
game.i18n.localize("prism.sheet.characterName")
```

### Handlebars Localization

Use:

```hbs
{{localize "prism.sheet.characterName"}}
```

### Localization Rules

* Do not hard-code user-facing text in JavaScript.
* Do not hard-code user-facing text in templates.
* Keep English and Italian key sets synchronized.
* Preserve placeholders and formatting tokens.
* Use one key for one stable semantic purpose.
* Do not reuse an unrelated key because its current English text happens to match.
* Keep key names stable whenever possible.
* Use consistent PRISM terminology.
* Test translated text in the actual interface.
* Check that translated labels fit the available layout.
* Do not include substantial copyrighted rules text in localization files.

Complete translation procedures belong in [`LOCALIZATION.md`](LOCALIZATION.md).

---

## Styling

Stylesheets are stored in:

```text
prism/styles/
```

### `variables.css`

Use `variables.css` for reusable design values such as:

* Spacing.
* Borders.
* Radii.
* Typography values.
* Surface colors.
* Type-specific colors.
* Shared dimensions.

Avoid repeating the same literal value throughout multiple stylesheets when it represents a shared design token.

### `sheet.css`

Use `sheet.css` for:

* Actor-sheet layout.
* Header structure.
* Tabs.
* Panels.
* Form controls.
* Inventory table.
* Bag list.
* Responsive sheet behavior.

### `prism.css`

Use `prism.css` for:

* Shared PRISM components.
* Chat-message presentation.
* General system-level presentation not limited to one sheet.

### CSS Rules

* Scope system styles under PRISM-specific classes.
* Avoid broad selectors that could affect Foundry core or other modules.
* Reuse existing component classes.
* Preserve visible focus indicators.
* Test narrow and resized sheet layouts.
* Avoid using color as the only indicator of label type.
* Check both light and dark Foundry themes when practical.
* Keep type classes consistent with runtime values.

Current type-specific classes include:

```text
prism-trait
prism-adversity
prism-fear
prism-danger
```

---

## Coding Conventions

### Language

Use modern JavaScript modules.

Prefer:

```js
import { BagManager } from "./bag-manager.mjs";
export class PrismActorSheet extends ActorSheet {
}
```

### Formatting

Follow the style of the file being edited.

Current code generally uses:

* Four-space indentation.
* Semicolons.
* Double quotes for strings.
* Trailing commas only where already established.
* Braces for multi-line control structures.
* Descriptive method names.
* `async` and `await` for document updates.

Avoid combining a functional change with repository-wide formatting.

### Imports

* Keep imports at the beginning of the file.
* Use relative paths.
* Include the `.mjs` extension.
* Remove unused imports.
* Avoid circular dependencies.

### Actor Updates

Use Foundry document updates:

```js
await actor.update({
    "system.bag": bag
});
```

Do not directly mutate persisted Actor data.

Clone arrays or objects before modifying them:

```js
const inventory = foundry.utils.deepClone(
    this.actor.system.inventory ?? []
);
```

### Identifiers

Use `foundry.utils.randomID()` for new plain-object entries requiring stable IDs.

Do not use array indexes as persistent identifiers.

### Event Handlers

Event handlers should:

1. Prevent unwanted default behavior.
2. Stop propagation when required.
3. Synchronize unsaved data.
4. Validate `data-*` values.
5. Delegate reusable logic.
6. Await document updates.
7. Re-render only when necessary.

### Naming

Use:

* `PascalCase` for classes.
* `camelCase` for variables and methods.
* Leading underscores for internal sheet handlers and helpers.
* Clear action names matching their `data-action` values.
* Lowercase hyphen-separated filenames where practical.

### Comments

Comments should explain:

* Why a non-obvious decision exists.
* Important Foundry lifecycle behavior.
* Compatibility constraints.
* Migration assumptions.
* Security-sensitive handling.

Do not add comments that merely repeat the code.

---

## Error Handling

Current code uses early returns and localized notifications for expected user errors.

Example:

```js
if (!name) {
    ui.notifications.warn(
        game.i18n.localize("prism.bag.labelWithoutName")
    );
    return;
}
```

New code should:

* Validate user-controlled values.
* Reject invalid IDs and types.
* Avoid partial updates.
* Display useful localized messages for recoverable errors.
* Log enough technical context for unexpected failures.
* Avoid exposing private Actor or world data in logs.
* Avoid silently swallowing unexpected exceptions.
* Preserve data when an operation fails.

Temporary `console.log()` calls must be removed before a Pull Request unless they are part of the intentional logging strategy.

The initialization message:

```text
PRISM | Init
```

is intentional and may remain.

---

## Data Changes and Migrations

The project does not currently have a migration framework.

A change to stored Actor data is therefore high risk.

Examples include:

* Adding a field.
* Changing a field type.
* Renaming a field.
* Removing a field.
* Changing the structure of a label.
* Changing the structure of an inventory entry.
* Changing the structure of a bag entry.
* Moving inventory from plain objects to Item documents.
* Replacing `template.json` with formal DataModel classes.

### Required Change Description

A Pull Request changing stored data must document:

* Previous path and structure.
* New path and structure.
* Affected Actor types.
* Effect on existing worlds.
* Default behavior for new Actors.
* Migration or fallback behavior.
* Compatibility implications.
* Manual test results using existing data.
* Backup and recovery expectations.

### Migration Rules

* Do not silently delete stored fields.
* Do not silently rename stored fields.
* Do not assume schema-default changes repair existing Actors.
* Preserve unknown data unless removal is deliberate.
* Make migration operations repeatable where possible.
* Record migration completion when a formal migration system is introduced.
* Back up a test world before running migration code.
* Never test migration code first on an important campaign.

### Schema Versioning

A future migration framework should introduce an explicit schema version stored in system or Actor data.

Until that exists, every schema change must be clearly identified in:

* The Pull Request.
* `CHANGELOG.md`.
* Release notes.
* Relevant development documentation.

---

## Manual Testing

Manual testing is currently required for every functional change.

Use a dedicated test world with unrelated modules disabled whenever possible.

### System Startup

Verify:

* The system appears in Foundry Setup.
* A PRISM world can be created.
* The world loads.
* `PRISM | Init` appears in the console.
* No initialization errors appear.
* The custom Actor sheet is registered.
* A `character` Actor can be created.

### Sheet Rendering

Verify:

* The Actor sheet opens.
* The character image renders.
* The Actor name is editable.
* The concept field persists.
* Main, Bio, and Inventory tabs work.
* The sheet can be resized.
* Existing Actor data renders correctly.
* Closing and reopening the sheet preserves saved values.

### Traits and Adversities

Verify:

* A trait can be added.
* An adversity can be added.
* Names can be edited.
* Empty rows persist correctly while performing another action.
* A trait can be deleted.
* An adversity can be deleted.
* Deleting one row does not delete another.
* IDs remain stable after reload.
* A blank label cannot be added to the bag.
* The localized warning appears for a blank label.

### Virtual Bag

Verify:

* Traits can be added.
* Adversities can be added.
* Fear can be added.
* Danger can be added.
* The same label can be added more than once.
* Individual copies can be removed.
* Clearing removes all bag entries.
* Clearing also resets the latest draw.
* Drawing from an empty bag displays a warning.
* Drawing three entries works with at least three entries.
* Drawing three from a bag with one or two entries draws only what is available.
* Drawn entries leave the bag.
* Remaining entries stay in the bag.
* The latest draw contains only the most recent result.
* Data remains correct after a reload.

### Risk Action

Verify:

* The dialog opens.
* One, two, and three can be selected.
* Confirm performs the selected draw.
* Cancel performs no draw.
* Closing the dialog performs no draw.
* Drawing more entries than available is handled safely.
* The result uses the risk chat title.

### Chat

Verify:

* A standard draw creates a chat message.
* A risk draw creates a chat message.
* The correct Actor appears as speaker.
* Every drawn label appears.
* Trait, adversity, fear, and danger classes render correctly.
* Long label names do not break the card.
* Special characters do not break the markup.
* Potential HTML input is handled safely.
* English and Italian titles are correct.

### Biography and Notes

Verify:

* Biography persists.
* Personal notes persist.
* Marks persist.
* Multi-line content is preserved.
* Reloading the world does not lose text.

### Inventory

Verify:

* An inventory row can be added.
* The item name persists.
* Quantity persists as a number.
* Quantity `0` is supported.
* Rows can be deleted independently.
* Editing one row does not overwrite another.
* Values persist after another sheet action.
* Values persist after reload.

### Localization

Test the system in both:

* English.
* Italian.

Verify:

* No localization keys appear visibly.
* Both files contain all used keys.
* Buttons fit the interface.
* Dialogs are translated.
* Notifications are translated.
* Chat titles are translated.
* New user-facing strings are translated.

### Compatibility

When changing Foundry APIs, test all Foundry versions claimed by `system.json`.

Record:

* Exact Foundry version and build.
* Browser or desktop client.
* Operating system.
* Enabled modules.
* New or existing world.
* Relevant console output.

### Permissions

When a change affects editing or chat behavior, test with:

* A Gamemaster user.
* A Player who owns the Actor.
* A Player who does not own the Actor.

Confirm that users cannot modify Actor data beyond their Foundry permissions.

---

## Debugging

### Browser Developer Console

Open the browser developer tools and inspect:

* Console errors.
* Failed network requests.
* Missing templates.
* Missing stylesheet files.
* Localization errors.
* Invalid Actor update paths.
* Unhandled Promise rejections.

Filter console messages using:

```text
PRISM
```

### Inspecting Actor Data

During development, inspect:

```js
actor.system
```

or retrieve a known test Actor through the Foundry console.

Do not include private campaign data in screenshots, bug reports, or commits.

### Common Failure Areas

#### System Not Listed

Check:

* Directory name is `prism`.
* `system.json` is directly inside that directory.
* JSON syntax is valid.
* Manifest paths exist.

#### Sheet Not Registered

Check:

* `module/prism.mjs` loads.
* The console contains `PRISM | Init`.
* Import paths are valid.
* The Actor type is `character`.
* Initialization did not fail before registration.

#### Template Not Found

Check:

```text
systems/prism/templates/actor-character-sheet.hbs
```

and confirm that the installed folder name matches the system ID.

#### Localization Key Visible

Check:

* The key exists in both language files.
* The JSON is valid.
* The key uses the correct case.
* The namespace begins with `prism`.
* The manifest language path is correct.

#### Data Lost After Clicking a Button

Check:

* `_syncSheetData()` runs before the action.
* The row selector matches the template.
* `data-id` and `data-type` exist.
* The row is included in the serialization helper.
* The Actor update path is correct.

#### Bag Entry Not Found

Check the distinction between:

* Source label ID.
* Bag-entry ID.

Removal uses the bag-entry ID.

---

## Dependencies and Build Tools

The current project runs directly from source.

Do not add a dependency, package manager, bundler, compiler, or framework without discussing the change first.

A proposal for new tooling must explain:

* What problem it solves.
* Why existing browser and Foundry APIs are insufficient.
* Runtime versus development-only use.
* License.
* Maintenance status.
* Security implications.
* Installation commands.
* Build commands.
* Generated output.
* Release impact.
* Contributor impact.

When tooling is introduced, update:

* Root `.gitignore`.
* This development guide.
* Installation documentation where relevant.
* Pull Request checks.
* Release instructions.
* `CONTRIBUTING.md` if contributor steps change.

Do not commit:

```text
node_modules/
coverage/
temporary build output
local caches
```

Generated distributable files should be clearly separated from source files.

---

## Security Requirements

Follow [`SECURITY.md`](../SECURITY.md) for vulnerability reporting.

Development changes must:

* Respect Foundry ownership and permission checks.
* Validate user-controlled data.
* Escape or sanitize user-controlled HTML.
* Avoid `eval()` and equivalent dynamic code execution.
* Avoid exposing tokens, credentials, paths, or private world data.
* Avoid logging sensitive Actor or user information.
* Avoid unsafe filesystem assumptions.
* Avoid loading executable code from untrusted remote sources.
* Review third-party dependencies before introduction.
* Treat chat content as a security-sensitive output surface.

Security-sensitive findings must not be discussed in a public Issue before coordinated review.

---

## Packaging and Releases

The repository root is not the Foundry system package root.

The package source is:

```text
prism/
```

A distributable archive must preserve this runtime structure:

```text
prism/
├── system.json
├── template.json
├── lang/
├── module/
├── styles/
└── templates/
```

After installation, Foundry must see:

```text
Data/systems/prism/system.json
```

### Release Preparation

Before creating a release:

1. Confirm the intended version.
2. Update `prism/system.json`.
3. Update `CHANGELOG.md`.
4. Verify compatibility values.
5. Validate all JSON files.
6. Test English and Italian.
7. Test the installation package in a clean environment.
8. Test a new world.
9. Test an existing backed-up world when data changed.
10. Remove debug output and local files.
11. Confirm that no commercial or unauthorized assets are included.
12. Prepare release notes.
13. Create the distributable archive.
14. Verify that the archive contains the correct root structure.

A release should not be marked stable while known data-loss or security issues remain unresolved.

---

## Known Technical Debt

The following items are known from the current implementation and should be tracked deliberately.

### GitHub Files and IDE Metadata

GitHub configuration must be stored under `.github/`, not `.idea/`.

The following local files should be removed from version control and ignored:

```text
.idea/
PRISM-System.iml
```

### Application Architecture

The current sheet and dialog use Foundry Application V1 classes:

```text
ActorSheet
Dialog
```

A future modernization should evaluate:

```text
ActorSheetV2
DialogV2
ApplicationV2
```

Do not combine that migration with an unrelated feature or bug fix.

It should be handled as a dedicated architectural change with complete regression testing.

### JSON Template Data Model

The current system defines Actor defaults through `template.json`.

A future architecture may migrate to formal Foundry DataModel classes and manifest document-type declarations.

That migration would affect:

* Schema validation.
* Default values.
* Existing Actors.
* Compatibility.
* Migration logic.
* Tests.
* Developer documentation.

### `marks` Type Inconsistency

The current schema defines:

```json
{
  "marks": []
}
```

The sheet renders `system.marks` as a textarea, which indicates text rather than an array.

This type must be reviewed.

A likely target is:

```json
{
  "marks": ""
}
```

Do not change it without checking existing Actor data and documenting the migration effect.

### Reserved or Unused Fields

The following schema fields are currently not clearly used by the sheet:

```text
notes
questions
fears
dangers
```

Before removing them, determine whether they are:

* Planned fields.
* Legacy fields.
* Used by existing worlds.
* Required by future gameplay work.

Removal requires a data-change review.

### Fear and Danger Collections

`labelPathFromType()` maps fear and danger to:

```text
fears
dangers
```

The current sheet does not create persistent fear or danger label rows.

Instead, fear and danger are added directly to the bag as generic entries.

The intended long-term model should be clarified before extending either approach.

### Chat HTML Escaping

The current chat builder interpolates label names into an HTML string.

User-controlled values must be safely escaped or sanitized.

This should be addressed before a stable release.

### Inventory Representation

Inventory entries are currently plain objects inside Actor data.

They are not Foundry Items.

This is simple and appropriate for the current Alpha implementation, but it limits:

* Drag and drop.
* Reusable item documents.
* Compendiums.
* Item sheets.
* Item-level permissions.
* Future automation.

Migrating inventory to Item documents would require a dedicated design and migration.

### Automated Validation

The repository currently has no automated validation for:

* JavaScript syntax.
* JSON syntax.
* Localization-key parity.
* Template validity.
* Formatting.
* Unit tests.
* Integration tests.
* Packaging.

These checks may be introduced progressively.

### Manifest Review

Before a packaged public release, review:

* Human-readable system title.
* Grid configuration.
* Repository URL.
* Manifest URL.
* Download URL.
* Author links.
* Compatibility range.
* Release packaging fields.

### Template Attribute Quoting

The inventory placeholder currently appears without quotes around the localized value.

Use:

```hbs
placeholder="{{localize 'prism.sheet.objectMessage'}}"
```

### Unused Helpers

Review whether `labelTypeLabel()` is currently used.

Unused helpers should either:

* Be used consistently.
* Be documented as planned.
* Be removed in a focused cleanup.

---

## Definition of Done

A development change is complete when all applicable conditions are satisfied.

### Code

* The implementation solves one defined problem.
* Existing architecture is followed.
* Reusable logic is separated from rendering.
* No temporary debugging code remains.
* No unrelated refactoring is included.
* User-controlled data is validated.
* Actor data is not directly mutated.

### Data

* Changed fields are documented.
* Existing-world impact is understood.
* Migration needs are identified.
* New entries have stable IDs.
* Invalid states are handled.
* Data persists after reload.

### Interface

* User-facing text is localized.
* English and Italian are updated.
* The interface remains usable when resized.
* Keyboard and accessibility effects are considered.
* Relevant screenshots are included in the Pull Request.

### Testing

* The system loads.
* The affected workflow is tested.
* Relevant edge cases are tested.
* Additional modules are disabled when isolating behavior.
* Existing data is tested when affected.
* Exact Foundry and client versions are recorded.

### Documentation

* `CHANGELOG.md` is updated for user-visible changes.
* This guide is updated for architecture changes.
* `INSTALLATION.md` is updated for setup or packaging changes.
* `LOCALIZATION.md` is updated for translation workflow changes.
* `README.md` is updated for project-level behavior or compatibility changes.

### Legal and Security

* No secrets or private data are included.
* No unauthorized commercial material is included.
* Third-party licenses are documented.
* Security-sensitive concerns are handled privately.
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
