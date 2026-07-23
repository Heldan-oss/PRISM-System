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
* Foundry Application V1 `ActorSheet` and `Dialog` classes.
* A custom Actor sheet rendered with Handlebars.
* JSON localization files.
* CSS custom properties and scoped stylesheets.
* Foundry VTT notifications and chat messages.
* A JSON Actor data template.
* No runtime dependencies, compiler, bundler, or build step.

The runtime package currently targets the compatibility range declared in `prism/system.json`. At the time of this update, the manifest declares Foundry VTT 12 as the minimum version and Foundry VTT 14 as the verified version. The manifest remains the authoritative source if those values change.

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

The `version`, release tag, and version-specific `download` URL must match exactly. Do not change version or distribution fields outside release preparation unless explicitly requested by a maintainer.

### Entry Module

Foundry loads:

```text
module/prism.mjs
```

through the `esmodules` manifest field.

### Stylesheets

The stylesheet order is:

```text
styles/variables.css
styles/sheet.css
styles/prism.css
```

Order matters:

1. `variables.css` defines the PRISM palette, semantic colors, geometry, shadows, and transitions.
2. `sheet.css` defines the Actor-sheet window, layout, controls, panels, bag presentation, and inventory.
3. `prism.css` defines shared presentation, including PRISM chat cards and result labels.

### Languages

The manifest registers:

```text
lang/it.json
lang/en.json
```

Both files must remain valid JSON and synchronized at the key-path level.

### Compatibility

The current compatibility declaration is:

```json
{
  "compatibility": {
    "minimum": "12",
    "verified": "14"
  }
}
```

Do not change compatibility declarations without testing the affected Foundry versions.

A compatibility change must update, when applicable:

* `prism/system.json`
* `README.md`
* `CHANGELOG.md`
* Release notes
* Pull Request test results

---

## Runtime Architecture

The runtime code is divided into five modules.

| File                     | Responsibility                                                       |
| ------------------------ | -------------------------------------------------------------------- |
| `module/prism.mjs`       | System initialization and Actor-sheet registration                   |
| `module/actor-sheet.mjs` | Sheet context, delegated actions, queued form submission, and chat output |
| `module/bag-manager.mjs` | Bag composition rules, session state, validation, and draw operations |
| `module/dialogs.mjs`     | User dialogs and risk-amount selection                               |
| `module/utils.mjs`       | Shared paths, label helpers, and array utilities                     |

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

Business rules must remain separate from:

* Handlebars presentation.
* Click-handler routing.
* CSS state.
* Translated values.

`BagManager` is the authoritative owner of bag rules and warnings. The sheet may expose visual state, but it must not be the only layer preventing invalid operations.

The Actor sheet uses a single delegated listener for elements with `data-action`. Supported actions are routed through an internal action map. New actions should follow the same pattern instead of adding unrelated per-button listeners.

Dynamic Trait, Adversity, and Inventory inputs use a separate targeted `change` listener. Their values are merged into Foundry's normal form-submission data and saved through a serialized submission queue. This keeps field changes, sheet actions, and sheet closure on one persistence path.

Reusable interface-independent helpers belong in a focused module rather than directly in the Actor sheet.

---

## Actor Data

The Actor schema is defined in:

```text
prism/template.json
```

The system supports one Actor type:

```text
character
```

No custom Item types are currently defined.

### Current Actor Fields

| Field           | Default | Purpose                                      |
| --------------- | ------: | -------------------------------------------- |
| `concept`       |    `""` | Character concept                            |
| `biography`     |    `""` | Biography                                    |
| `personalNotes` |    `""` | Personal notes                               |
| `notes`         |    `""` | Reserved or unused                           |
| `questions`     |    `""` | Reserved or unused                           |
| `inventory`     |    `[]` | Inventory entries                            |
| `traits`        |    `[]` | Trait entries                                |
| `adversities`   |    `[]` | Adversity entries                            |
| `fears`         |    `[]` | Reserved collection                          |
| `dangers`       |    `[]` | Reserved collection                          |
| `marks`         |    `[]` | Current Signs/Marks value; type mismatch remains |
| `bag`           |    `[]` | Virtual-bag entries                          |
| `lastDraw`      |    `[]` | Most recent successful draw                  |
| `bagSession`    | object  | Initial-draw and risk-use session state       |

The current `bagSession` default is:

```json
{
  "initialDrawCompleted": false,
  "riskCompleted": false
}
```

Existing Actors created before this field was introduced may not contain it. Runtime code must treat missing values as `false`; changing `template.json` does not automatically update existing Actors.

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

The same structure is used for Adversities with:

```text
adversity
```

as the internal type.

### Bag Entries

Stored Trait and Adversity entries use:

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

For stored Traits and Adversities, `sourceId` is the identity used for duplicate prevention. A source label may appear in the bag only once, regardless of its translated or edited display name.

Generic Fear and Danger entries intentionally use `sourceId: null`. They are controlled by type limits rather than source-label uniqueness.

Bag-entry names are snapshots stored at insertion time. Renaming a source label or changing the active Foundry language does not automatically rewrite existing bag entries.

### Inventory Entries

```json
{
  "id": "RANDOM_ID",
  "name": "Example item",
  "quantity": 1
}
```

Inventory entries are plain objects stored inside Actor data. They are not Foundry Item documents.

Inventory quantities are normalized to non-negative integers when sheet data is synchronized.

### Current Data Rules

Unless a focused data change is approved:

* Dynamic entries must have stable IDs.
* Internal types must not be localized.
* `bag` and `lastDraw` must remain arrays.
* Blank labels must not be added to the bag.
* A stored Trait or Adversity may be present in the bag only once per `sourceId`.
* The bag may contain at most four Adversities.
* The bag may contain at most three generic Fears.
* The bag may contain at most four generic Dangers.
* The initial draw requires at least one Danger in the bag.
* Drawn entries are removed from the bag.
* Clearing the bag also clears `lastDraw` and resets `bagSession`.
* Adding the first entry to an empty bag starts a new test and clears the previous `lastDraw`.
* Existing invalid bags are preserved; runtime validation prevents new invalid operations but does not silently delete or normalize stored entries.

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

The default sheet size is currently:

```text
800 × 900
```

The sheet is resizable and retains the PRISM-specific classes:

```text
prism sheet actor
```

These classes are required by the scoped stylesheet selectors.

### Sheet Context

The sheet exposes:

```text
system
traits
adversities
bag
lastDraw
inventory
bagSize
initialDrawCompleted
riskCompleted
canModifyBag
canInitialDraw
canTakeRisk
```

Missing collections fall back to empty arrays. Bag-state flags are derived through `BagManager.getViewState(actor)` rather than duplicated in the template.

### Sheet Actions

Current actions include:

| Action                  | Purpose                                      |
| ----------------------- | -------------------------------------------- |
| `add-label`             | Add a Trait or Adversity source row          |
| `delete-label`          | Delete a Trait or Adversity source row       |
| `add-to-bag`            | Add a stored source label to the bag         |
| `remove-from-bag`       | Remove one bag entry before the test starts  |
| `clear-bag`             | Clear the bag, latest draw, and session state |
| `draw-three`            | Perform the one allowed initial draw         |
| `risk`                  | Open the risk dialog and perform one risk draw |
| `add-fear`              | Add a generic Fear                           |
| `add-danger`            | Add a generic Danger                         |
| `add-inventory-item`    | Add an inventory row                         |
| `delete-inventory-item` | Delete an inventory row                      |

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

### Delegated Action Handling

The sheet routes supported `data-action` values through one delegated click listener and an action-handler map.

A handler should:

1. Identify a supported action.
2. Prevent default behavior only for that supported action.
3. Synchronize unsaved sheet data when required.
4. Validate IDs and semantic types.
5. Delegate bag rules to `BagManager`.
6. Await document updates.
7. Re-render only after a successful state change.

Unknown `data-action` elements should not be intercepted by PRISM routing.

### Sheet Synchronization

The sheet uses Foundry's normal form-submission workflow as the authoritative persistence path.

Static named fields, such as Actor name, Concept, Biography, Notes, and Signs, are collected by the base `ActorSheet` implementation. Dynamic collections are added by the sheet override:

```text
_getSubmitData()
```

The override merges the following collections into the submission payload:

* `system.traits`
* `system.adversities`
* `system.inventory`

Dynamic row inputs intentionally do not use index-based `name` paths. Their stable `data-id` values and semantic row classes are used to rebuild the arrays without making stored identity depend on visual order.

The current form options are:

```text
submitOnChange: false
submitOnClose: true
closeOnSubmit: false
```

Global `submitOnChange` remains disabled. Instead, the sheet listens specifically for `change` events from:

```text
.prism-label-row input
.prism-inventory-row input
```

A targeted change calls the standard `submit()` workflow with:

```text
preventClose: true
preventRender: true
```

This saves the current form without closing or re-rendering the sheet.

Before actions that may update or re-render Actor data, handlers call:

```text
_syncSheetData()
```

`_syncSheetData()` does not update the Actor directly. It delegates to the same queued `submit()` workflow used by dynamic field changes.

Submissions are serialized through an internal Promise queue. This prevents a field-change save and an immediately following action from completing out of order and overwriting newer values.

The current synchronization guarantees that Trait, Adversity, and Inventory values are preserved when:

* A dynamic field changes.
* Another sheet action is performed.
* The sheet is closed.
* The world or sheet is subsequently reloaded.

Inventory quantities are parsed as integers and clamped to zero or greater during submission.

Any new dynamic collection must define:

* How rows are identified without array-index identity.
* How its values are added to `_getSubmitData()`.
* Whether its inputs belong in the targeted change selector.
* How pending values are synchronized before actions and re-renders.
* Which persistence and immediate-close tests cover the collection.

Do not introduce controls or custom update paths that can silently discard unsaved data.

### Chat Output Safety

The sheet escapes localized titles and user-controlled label names before inserting them into chat-card HTML.

Only known semantic result types are accepted for CSS class suffixes:

```text
trait
adversity
fear
danger
```

Unknown values must fall back to a safe presentation class rather than being interpolated directly into HTML.

---

## Virtual Bag

Bag logic is implemented in:

```text
prism/module/bag-manager.mjs
```

### Current Responsibilities

`BagManager` handles:

* Reading cloned bag data.
* Counting entries by semantic type.
* Exposing sheet view state.
* Adding stored labels.
* Adding generic Fear and Danger entries.
* Preventing duplicate source labels.
* Enforcing composition limits.
* Removing entries before a test begins.
* Clearing the bag and session.
* Validating the initial draw.
* Validating the risk draw.
* Updating `lastDraw`.
* Persisting `bagSession` state.
* Showing localized warnings for invalid operations.

### Composition Rules

The current limits are:

| Entry type | Rule |
| ---------- | ---- |
| Trait | No type-count limit; each source label may be added once |
| Adversity | Maximum four; each source label may be added once |
| Fear | Maximum three generic entries |
| Danger | Maximum four generic entries |

The limits are enforced in `BagManager`, not only through template state or CSS.

The initial draw additionally requires at least one Danger in the bag.

### Test Session State

A bag test uses two persistent flags:

```json
{
  "initialDrawCompleted": false,
  "riskCompleted": false
}
```

The intended state flow is:

```text
Bag preparation
    │
    ├── composition may be changed
    ├── initial draw available when the bag contains a Danger
    └── risk unavailable

Initial draw succeeds and entries remain
    │
    ├── composition locks
    ├── initial draw becomes unavailable
    └── one risk draw becomes available

Risk draw succeeds and entries remain
    │
    ├── composition remains locked
    ├── initial draw remains unavailable
    └── risk becomes unavailable

Bag becomes empty or Clear Bag is used
    │
    └── session flags reset
```

Rules:

* Only one initial draw is allowed per test.
* Only one risk draw is allowed per test.
* Risk requires a completed initial draw.
* Risk does not require a remaining Danger.
* Bag composition is locked after a successful initial draw while entries remain.
* Locked composition prevents adding and manually removing bag entries.
* Source Trait and Adversity rows may still be edited independently; the lock applies to bag composition.
* `Clear Bag` is always available and resets the test.
* If the initial draw empties the bag, the session resets automatically.
* If the risk draw empties the bag, the session resets automatically.
* Automatic reset does not erase the successful `lastDraw` result.
* Adding the first entry to the next empty bag clears the previous `lastDraw`.

### View State

`BagManager.getViewState(actor)` exposes:

```text
bagSize
initialDrawCompleted
riskCompleted
canModifyBag
canInitialDraw
canTakeRisk
```

The template uses these values to communicate availability. They are presentation helpers only; every action must still be validated by `BagManager`.

### Clickable Unavailable Controls

Unavailable bag controls are visually marked with:

```hbs
class="prism-is-disabled"
aria-disabled="true"
```

They intentionally remain clickable so JavaScript can display the specific localized reason for the blocked operation.

Do not add:

```html
disabled
```

and do not apply:

```css
pointer-events: none;
```

to those controls unless the interaction model is deliberately redesigned.

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

### Initial Draw

The initial draw:

1. Rejects an empty bag.
2. Rejects a test whose initial draw is already complete.
3. Requires at least one Danger in the current bag.
4. Draws up to three entries.
5. Removes the drawn entries from the bag.
6. Stores them in `lastDraw`.
7. Locks the test if entries remain.
8. Resets session flags if no entries remain.

“Draw up to three” means a valid bag containing fewer than three entries draws all available entries.

### Risk Draw

The risk draw:

1. Rejects an empty bag.
2. Requires a completed initial draw.
3. Rejects a second risk during the same test.
4. Allows one, two, or three entries according to the remaining bag size.
5. Removes the drawn entries from the bag.
6. Stores them in `lastDraw`.
7. Marks risk as completed if entries remain.
8. Resets session flags if no entries remain.

### Existing Invalid Data

Validation is prospective. Existing Actors with duplicated entries or counts above current limits are not automatically rewritten.

This avoids silent data loss. Such bags remain stored until the user clears or manually resolves them through allowed actions.

### Randomization

The system uses a Fisher–Yates-style shuffle based on `Math.random()`.

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

The available options are generated from the remaining bag size:

| Remaining entries | Selectable amounts |
| ----------------- | ------------------ |
| 1 | 1 |
| 2 | 1 or 2 |
| 3 or more | 1, 2, or 3 |

The dialog resolves with a positive integer from the displayed options, or:

```text
null
```

when cancelled or closed.

The dialog must not open when `BagManager.validateRisk(actor)` rejects the action.

Visible dialog text must be localized.

### Chat Messages

Successful initial and risk draws are created by the Actor sheet using Foundry `ChatMessage`.

Current result types use CSS classes such as:

```text
prism-trait
prism-adversity
prism-fear
prism-danger
prism-unknown
```

Chat output must:

* Use the current Actor as speaker.
* Use localized titles.
* Preserve known semantic result types.
* Handle long labels.
* Escape localized titles and user-controlled label names.
* Reject unsafe type-derived CSS suffixes through an allow-list.
* Avoid exposing private data.

Do not interpolate additional user-controlled values into HTML without reviewing and preserving the existing escaping strategy.

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
* Avoid duplicating gameplay validation.
* Preserve clickable warning behavior for visually unavailable bag controls.

Correct:

```hbs
placeholder="{{localize 'prism.sheet.objectMessage'}}"
```

Avoid:

```hbs
placeholder={{localize 'prism.sheet.objectMessage'}}
```

Current semantic panel classes include:

```text
prism-type-panel
prism-trait-panel
prism-adversity-panel
prism-fear-panel
prism-danger-panel
prism-neutral-panel
prism-bag
```

Type classes identify visual meaning only. Game rules still use internal data types and `BagManager` validation.

### Styles

Styles are divided into:

```text
styles/variables.css
styles/sheet.css
styles/prism.css
```

Use:

* `variables.css` for the base palette, semantic colors, type colors, geometry, shadows, and transitions.
* `sheet.css` for Actor-sheet layout, controls, semantic panels, bag presentation, and inventory.
* `prism.css` for shared system and chat components.

The current visual direction uses:

* Cold metallic gray surfaces.
* Graphite neutral borders for general panels.
* Cyan for Traits.
* Muted red for Adversities.
* Cool desaturated violet-gray for Fears.
* Amber for Dangers and risk emphasis.

General sections such as the header, bag container, latest draw, Signs, Biography, Notes, and Inventory use the neutral graphite treatment rather than a gameplay-type accent.

The character image is currently designed at `224 × 224` pixels inside the sheet header.

CSS must:

* Be scoped under PRISM-specific classes.
* Avoid broad selectors affecting Foundry core.
* Preserve keyboard focus indicators.
* Support translated text.
* Avoid communicating state through color alone.
* Remain usable when the sheet is resized.
* Keep `variables.css` loaded before dependent stylesheets.
* Keep visually unavailable controls clickable when the interface relies on a JavaScript warning.
* Avoid `pointer-events: none` on those warning-capable controls.

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

Bag localization includes action labels and validation messages for:

* Empty bags.
* Blank labels.
* Duplicate source labels.
* Adversity, Fear, and Danger limits.
* Missing Danger for the initial draw.
* Risk before the initial draw.
* Repeated initial draws.
* Repeated risk draws.
* Locked bag composition.

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
* Validate both JSON files after every edit.
* Test translated text and title attributes in Foundry.
* Reload the world after changing the active language or localization files.
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

Keep these identities distinct:

* Source Trait or Adversity ID.
* Bag-entry ID.
* Internal semantic type.
* Localized display name.

### Event Handlers

Handlers should:

1. Route only supported semantic actions.
2. Prevent unwanted default behavior for handled actions.
3. Synchronize unsaved data through the queued form-submission path.
4. Validate IDs and types.
5. Delegate reusable rules to `BagManager`.
6. Await document updates.
7. Re-render only when required.

Do not reproduce bag limits or session rules inside template event handlers.

Do not create a second full-form persistence path with a direct `actor.update()` call. Dynamic sheet synchronization should continue through `_getSubmitData()`, `submit()`, and the submission queue. Focused Actor updates remain appropriate after synchronization when an action deliberately changes one specific stored collection or gameplay state.

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
* Adding persistent session state such as `bagSession`.
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
* Runtime code must provide safe fallbacks for missing `bagSession` fields.
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
* The Anomaly sheet opens at its expected default size.

### Sheet

Verify:

* Actor name and concept persist.
* Tabs work.
* Traits and Adversities can be managed.
* A newly added Trait retains its name when the sheet is closed immediately.
* A newly added Adversity retains its name when the sheet is closed immediately.
* Editing a dynamic label and immediately selecting another action preserves the latest value.
* Biography and notes persist.
* Inventory rows persist.
* The newest Inventory row retains both name and quantity when the sheet is closed immediately.
* Several Inventory rows can be edited without the final row losing its values.
* Dynamic values persist after closing and reopening the sheet.
* Dynamic values persist after reloading the world.
* Negative or invalid inventory quantities normalize safely.
* Submission does not unexpectedly close or re-render the sheet during a dynamic-field change.
* Rapid field-change and action sequences do not restore stale values.
* The `224 × 224` image area renders correctly.
* Type panels use the intended semantic accents.
* Neutral sections do not inherit a type color.
* The sheet remains usable when resized.
* Existing Actor data still renders.

### Virtual Bag Composition

Verify:

* A valid Trait can be added once.
* A valid Adversity can be added once.
* Adding the same source Trait or Adversity twice is rejected.
* Four Adversities are accepted and a fifth is rejected.
* Three Fears are accepted and a fourth is rejected.
* Four Dangers are accepted and a fifth is rejected.
* Blank labels are rejected.
* Every rejection displays the correct localized warning.
* Existing invalid bags are not silently modified on load.

### Initial Draw and Session Lock

Verify:

* An empty bag cannot be drawn.
* A bag without a Danger cannot perform the initial draw.
* Adding at least one Danger makes the initial draw available.
* Removing the last Danger before the test makes the initial draw unavailable again.
* A valid initial draw removes up to three entries without replacement.
* A valid two-entry bag containing a Danger draws two entries.
* A successful initial draw with remaining entries locks composition.
* Locked add and remove controls remain clickable and display `bagLocked`.
* A second initial draw is rejected.
* If the initial draw empties the bag, session flags reset automatically.

### Risk Dialog and Risk Draw

Verify:

* Risk is rejected before the initial draw.
* With one remaining entry, only amount one is offered.
* With two remaining entries, only amounts one and two are offered.
* With three or more remaining entries, amounts one, two, and three are offered.
* Confirm performs the selected draw.
* Cancel performs no draw.
* Closing the dialog performs no draw.
* Risk does not require a remaining Danger.
* Only one risk draw is allowed per test.
* A second risk attempt displays the correct warning.
* If risk leaves entries in the bag, both draw actions remain unavailable.
* If risk empties the bag, session flags reset automatically.

### Clear and New Test

Verify:

* `Clear Bag` empties the bag.
* `Clear Bag` clears `lastDraw`.
* `Clear Bag` resets both session flags.
* Adding the first entry to a new empty bag clears the previous `lastDraw`.
* A new test can perform one initial draw and one risk draw again.

### Chat

Verify:

* Initial and risk draws create messages.
* The Actor speaker is correct.
* Every result is present.
* Type classes render correctly.
* Trait, Adversity, Fear, and Danger colors match the sheet.
* Long and special-character labels do not break output.
* HTML-like label content is displayed safely rather than executed.

### Localization

Test both:

* English.
* Italian.

Verify:

* Both JSON files parse successfully.
* No raw localization keys appear.
* Dialogs are translated.
* Every bag validation warning is translated.
* Chat titles are translated.
* Button titles and visual unavailable-state messages are translated.
* Buttons, tabs, and panel headings fit the interface.

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
* Invalid localization paths or JSON syntax.
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

### Dynamic Sheet Data Is Not Persisted

If a Trait, Adversity, or Inventory row exists but its latest values are missing after reopening the sheet, check:

* `_getSubmitData()` includes Traits, Adversities, and Inventory.
* The current form is available through `this.form`.
* Dynamic row selectors still match the template.
* Every row has a stable `data-id`.
* Trait and Adversity rows retain the correct `data-type`.
* Dynamic inputs match the targeted `change` selector.
* `_syncSheetData()` calls the queued `submit()` workflow rather than updating the Actor directly.
* `submitOnClose` remains enabled.
* `closeOnSubmit` remains disabled.
* Automatic submissions use `preventClose` and `preventRender`.
* The submission queue is not bypassed by a newly added action.
* The browser console does not contain:

```text
PRISM | Failed to save dynamic sheet data
```

Reproduce the problem by editing only the newest row and closing the sheet immediately. Testing only after clicking another action can hide persistence defects because that action may synchronize the form first.

### Wrong Bag Entry Removed or Duplicate Check Fails

Check the distinction between:

* Source-label ID in `sourceId`.
* Bag-entry ID in `id`.

Duplicate prevention uses `sourceId`. Bag removal uses the bag-entry `id`.

### Bag Controls Look Unavailable but Show No Warning

Confirm:

* The template does not use the native `disabled` attribute.
* CSS does not use `pointer-events: none` on warning-capable controls.
* The click reaches the delegated sheet action.
* The relevant localization key exists.

### Session State Looks Incorrect

Inspect:

```js
actor.system.bagSession
```

Expected fields are:

```text
initialDrawCompleted
riskCompleted
```

Also inspect:

```js
actor.system.bag
```

An empty bag causes runtime session helpers to treat the test as reset, even if stale flags exist in old data.

### Localization Does Not Load

Check the active language:

```js
game.i18n.lang
```

Check a known key:

```js
game.i18n.localize("prism.sheet.traits")
```

If the key itself is returned, verify:

* JSON syntax, especially trailing commas.
* The `languages` paths in `system.json`.
* The installed development directory.
* Browser cache and world reload.

A single JSON syntax error can prevent the entire language file from loading.

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

Dynamic-field persistence currently relies on the Application V1 form lifecycle, including `_getSubmitData()`, `submit()`, `submitOnClose`, and submission options that suppress closing and rendering.

A future focused change should evaluate migration to Foundry Application V2 classes. That migration must explicitly replace and retest:

* Dynamic collection serialization.
* Targeted field-change saving.
* Save-on-close behavior.
* Submission ordering.
* Action synchronization.
* Dialog behavior.

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

Fear and Danger are currently added directly to the bag as generic entries whose display names are localized at insertion time.

The long-term relationship between:

* Stored Fear or Danger collections.
* Generic bag entries.
* Language-independent stored labels.
* Gameplay limits.

must be defined before expanding the data model.

### Existing Invalid Bag Data

Current validation prevents new invalid operations but does not migrate or normalize bags created under older rules.

A future migration, if introduced, must:

* Avoid silent data loss.
* Define how duplicates are resolved.
* Define how over-limit entries are handled.
* Be repeatable.
* Be tested on copied existing worlds.

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
* Dynamic rows preserve their latest values after field changes, actions, and sheet closure.

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
* Immediate-close persistence is tested for newly added dynamic rows when applicable.
* Rapid field-change and action sequences are tested when form submission is affected.
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
