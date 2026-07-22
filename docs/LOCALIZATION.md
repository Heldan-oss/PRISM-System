# Localization Guide

## Overview

This guide explains how localization is organized and maintained in **PRISM RPG for Foundry Virtual Tabletop**.

The system currently supports:

* English
* Italian

Localization files contain interface text used by:

* The Anomaly sheet.
* The virtual bag.
* Dialogs.
* Notifications.
* Chat messages.
* Buttons, labels, placeholders, and tab names.

This document covers localization-specific procedures only. For source-code architecture and general development rules, see [`DEVELOPMENT.md`](DEVELOPMENT.md). For branches, commits, and Pull Requests, see [`CONTRIBUTING.md`](../CONTRIBUTING.md).

---

## Table of Contents

* [Current Localization Structure](#current-localization-structure)
* [Registered Languages](#registered-languages)
* [Localization File Format](#localization-file-format)
* [Key Organization](#key-organization)
* [Using Localization in JavaScript](#using-localization-in-javascript)
* [Using Localization in Handlebars](#using-localization-in-handlebars)
* [Adding New User-Facing Text](#adding-new-user-facing-text)
* [Editing an Existing Translation](#editing-an-existing-translation)
* [Adding a New Language](#adding-a-new-language)
* [Terminology and Translation Style](#terminology-and-translation-style)
* [Placeholders and Dynamic Values](#placeholders-and-dynamic-values)
* [Capitalization and Interface Consistency](#capitalization-and-interface-consistency)
* [Localization Key Changes](#localization-key-changes)
* [Validation](#validation)
* [Manual Testing](#manual-testing)
* [Common Problems](#common-problems)
* [Pull Request Requirements](#pull-request-requirements)
* [Current Localization Notes](#current-localization-notes)
* [Related Documentation](#related-documentation)

---

## Current Localization Structure

Localization files are stored in:

```text
prism/lang/
├── en.json
└── it.json
```

The current language files are:

| File                 | Language |
| -------------------- | -------- |
| `prism/lang/en.json` | English  |
| `prism/lang/it.json` | Italian  |

Both files must contain the same localization keys.

Only the translated values should differ.

For example, both files must contain:

```text
prism.sheet.characterName
```

but the values may be:

```text
Anomaly Name
```

and:

```text
Nome dell'Anomalia
```

The English file should normally be treated as the reference structure when adding new keys.

This does not mean that every translation must follow English sentence structure literally. Translations should remain natural and clear in the target language.

---

## Registered Languages

Languages are registered in:

```text
prism/system.json
```

The current manifest contains:

```json
{
  "languages": [
    {
      "lang": "it",
      "name": "Italiano",
      "path": "lang/it.json"
    },
    {
      "lang": "en",
      "name": "English",
      "path": "lang/en.json"
    }
  ]
}
```

Each language entry contains:

| Property | Purpose                                                   |
| -------- | --------------------------------------------------------- |
| `lang`   | Language code used by Foundry VTT                         |
| `name`   | Human-readable language name                              |
| `path`   | Path to the localization file relative to the system root |

The file path is relative to:

```text
prism/
```

Therefore:

```text
lang/en.json
```

refers to:

```text
prism/lang/en.json
```

A localization file is not loaded merely because it exists in `prism/lang/`. It must also be registered in `system.json`.

---

## Localization File Format

Localization files use JSON.

The current root namespace is:

```text
prism
```

A simplified localization file looks like:

```json
{
  "prism": {
    "sheet": {
      "characterName": "Anomaly Name",
      "concept": "Concept",
      "bag": "Bag"
    },
    "dialog": {
      "extract": "Draw",
      "cancel": "Cancel"
    }
  }
}
```

### JSON Requirements

Localization JSON must:

* Use double quotes around keys and string values.
* Use commas between properties.
* Avoid trailing commas.
* Use matching braces.
* Contain valid UTF-8 text.
* Preserve the same key hierarchy in every language.
* Avoid comments, because standard JSON does not support them.

This is invalid:

```json
{
  "prism": {
    "sheet": {
      "bag": "Bag",
    }
  }
}
```

The trailing comma after `"Bag"` makes the file invalid.

This is also invalid:

```json
{
  // Sheet translations
  "prism": {
    "sheet": {
      "bag": "Bag"
    }
  }
}
```

JSON comments are not supported.

---

## Key Organization

Current localization keys are grouped by feature.

The main groups are:

```text
prism.bag
prism.sheet
prism.bagManager
prism.dialog
prism.chat
```

### `prism.bag`

Contains messages and actions associated with the virtual bag.

Current examples include:

```text
prism.bag.empty
prism.bag.labelWithoutName
prism.bag.pExtractMessage
prism.bag.riskMessage
prism.bag.emptyMessage
```

Example use:

```js
game.i18n.localize("prism.bag.empty")
```

### `prism.sheet`

Contains text displayed on the Anomaly sheet.

Current examples include:

```text
prism.sheet.characterName
prism.sheet.concept
prism.sheet.mainTab
prism.sheet.bioTab
prism.sheet.inventoryTab
prism.sheet.traits
prism.sheet.adversity
prism.sheet.fear
prism.sheet.danger
prism.sheet.latestDraw
```

This group also contains placeholders and section titles.

### `prism.bagManager`

Contains localized names used when generic entries are inserted into the bag.

Current keys are:

```text
prism.bagManager.fear
prism.bagManager.danger
```

These values become stored display names in bag entries.

Changing these translations affects only newly created generic entries unless existing Actor data is also migrated.

### `prism.dialog`

Contains text shown by dialogs.

Current examples include:

```text
prism.dialog.risk
prism.dialog.qLabels
prism.dialog.fLabel
prism.dialog.sLabel
prism.dialog.tLabel
prism.dialog.extract
prism.dialog.cancel
```

### `prism.chat`

Contains titles and text used in Foundry chat messages.

Current keys are:

```text
prism.chat.draw
prism.chat.risk
```

---

## Key Naming Rules

Localization keys should describe meaning rather than a temporary visual position.

Prefer:

```text
prism.sheet.characterName
```

Avoid:

```text
prism.sheet.topLeftInput
```

Prefer:

```text
prism.dialog.cancel
```

Avoid:

```text
prism.dialog.secondButton
```

A localization key should remain understandable even if the interface layout changes.

### Recommended Naming Style

Use:

* Lower camel case for individual key names.
* Existing feature groups where appropriate.
* Clear and stable semantic names.
* One key for one distinct meaning.

Examples:

```text
prism.sheet.personalNotes
prism.inventory.quantity
prism.notifications.invalidQuantity
prism.chat.latestDraw
```

Do not create multiple keys with meaningless numeric suffixes:

```text
prism.sheet.label1
prism.sheet.label2
prism.sheet.label3
```

### Reusing Keys

Reuse a key only when the text has the same semantic meaning.

For example, a generic Cancel button may use:

```text
prism.dialog.cancel
```

in several dialogs.

Do not reuse a key merely because its current English value happens to match another label.

For example, the word “Draw” may refer to:

* An action button.
* A chat-message title.
* A previous result.
* A gameplay operation.

These may require separate keys if their translations differ by context.

---

## Using Localization in JavaScript

Use Foundry’s localization API for user-facing JavaScript strings.

### Basic Localization

```js
const title = game.i18n.localize("prism.chat.draw");
```

Current examples include:

```js
ui.notifications.warn(
    game.i18n.localize("prism.bag.empty")
);
```

and:

```js
name: game.i18n.localize("prism.bagManager.fear")
```

### Do Not Hard-Code Visible Text

Avoid:

```js
ui.notifications.warn("The bag is empty.");
```

Use:

```js
ui.notifications.warn(
    game.i18n.localize("prism.bag.empty")
);
```

Avoid:

```js
label: "Cancel"
```

Use:

```js
label: game.i18n.localize("prism.dialog.cancel")
```

### Internal Values Must Not Be Translated

Do not localize internal identifiers such as:

```text
trait
adversity
fear
danger
character
```

These values are used as:

* Data types.
* CSS class suffixes.
* Actor paths.
* `data-type` attributes.
* Programmatic identifiers.

For example:

```js
{
    name: game.i18n.localize("prism.bagManager.fear"),
    type: "fear"
}
```

The visible name is localized, but the internal type remains:

```text
fear
```

Changing internal values based on language would break stored data and code behavior.

---

## Using Localization in Handlebars

Use Foundry’s `localize` helper in Handlebars templates.

Example:

```hbs
<h2>{{localize "prism.sheet.traits"}}</h2>
```

Example inside an input placeholder:

```hbs
<input
  type="text"
  placeholder="{{localize 'prism.sheet.characterName'}}"
/>
```

Example inside a button:

```hbs
<button type="button">
  {{localize "prism.dialog.extract"}}
</button>
```

### Quote Localized Attribute Values

Localized attribute values should be quoted.

Correct:

```hbs
placeholder="{{localize 'prism.sheet.objectMessage'}}"
```

Avoid:

```hbs
placeholder={{localize 'prism.sheet.objectMessage'}}
```

Quoted values are safer when translations contain spaces, punctuation, or special characters.

### Do Not Localize Programmatic Attributes

Do not translate:

```hbs
data-action="add-label"
data-type="trait"
data-tab="inventory"
```

These attributes are read by JavaScript and must remain stable in every language.

Only the visible label should be localized:

```hbs
<a class="item" data-tab="inventory">
  {{localize "prism.sheet.inventoryTab"}}
</a>
```

---

## Adding New User-Facing Text

When adding a new button, message, field, dialog, notification, or chat element:

1. Choose a clear semantic key.
2. Add the key to `en.json`.
3. Add the same key to `it.json`.
4. Use the key in JavaScript or Handlebars.
5. Verify JSON syntax.
6. Test both languages in Foundry.
7. Check the interface layout.
8. Update documentation when the new text represents a new feature.

Example new notification:

```json
{
  "prism": {
    "notifications": {
      "invalidQuantity": "Quantity must be zero or greater."
    }
  }
}
```

Italian version:

```json
{
  "prism": {
    "notifications": {
      "invalidQuantity": "La quantità deve essere maggiore o uguale a zero."
    }
  }
}
```

JavaScript use:

```js
ui.notifications.warn(
    game.i18n.localize("prism.notifications.invalidQuantity")
);
```

Do not merge code that introduces visible text in only one language unless the missing translation is explicitly documented and accepted.

---

## Editing an Existing Translation

An existing translation may be changed to:

* Correct grammar.
* Improve clarity.
* Use more consistent game terminology.
* Correct capitalization.
* Improve interface fit.
* Resolve ambiguity.
* Correct a mistranslation.

Before changing a value:

1. Search for the key in the source code.
2. Identify every interface location using it.
3. Confirm whether the same key has multiple contexts.
4. Check that the replacement works in all contexts.
5. Test the result inside Foundry VTT.

A translation that is correct in one sentence may be incorrect when reused as:

* A button.
* A heading.
* A stored bag-entry name.
* A chat title.
* A notification.

When one key is used for incompatible contexts, split it into more specific keys rather than forcing one translation to serve every case.

---

## Adding a New Language

Adding a language requires both a new localization file and a manifest entry.

### 1. Choose the Language Code

Use the appropriate language code supported by Foundry VTT.

Examples:

```text
fr
de
es
pt-BR
```

Use one consistent code in:

* The filename.
* The manifest `lang` property.
* Documentation.
* Pull Request descriptions.

### 2. Copy the Reference File

Copy:

```text
prism/lang/en.json
```

to a new file.

Example:

```text
prism/lang/fr.json
```

Do not build a new file from an old or incomplete translation.

### 3. Preserve Every Key

Translate string values only.

Do not change:

* Key names.
* Key nesting.
* JSON structure.
* Internal placeholders.
* Formatting tokens.

Correct:

```json
{
  "prism": {
    "sheet": {
      "bag": "Sac"
    }
  }
}
```

Incorrect:

```json
{
  "prisme": {
    "feuille": {
      "sac": "Sac"
    }
  }
}
```

The key structure must remain:

```text
prism.sheet.bag
```

### 4. Register the Language

Add the language to `prism/system.json`.

Example:

```json
{
  "lang": "fr",
  "name": "Français",
  "path": "lang/fr.json"
}
```

The complete manifest section would become:

```json
{
  "languages": [
    {
      "lang": "it",
      "name": "Italiano",
      "path": "lang/it.json"
    },
    {
      "lang": "en",
      "name": "English",
      "path": "lang/en.json"
    },
    {
      "lang": "fr",
      "name": "Français",
      "path": "lang/fr.json"
    }
  ]
}
```

### 5. Update Documentation

Update:

* `README.md`
* `CHANGELOG.md`
* This localization guide, when relevant
* Release notes

The README language badge and language list may also require updating.

### 6. Test the Language

Test:

* System startup.
* Anomaly sheet.
* Tabs.
* Placeholders.
* Bag controls.
* Dialogs.
* Notifications.
* Chat messages.
* Inventory.
* Long labels.
* Special characters.
* Text wrapping.
* Missing localization keys.

A translation file should not be described as complete until every current key has been reviewed.

---

## Terminology and Translation Style

Translations should prioritize:

1. Correct PRISM terminology.
2. Clear gameplay meaning.
3. Natural target-language phrasing.
4. Consistency across the interface.
5. Reasonable interface length.

Do not translate terminology differently in separate parts of the system without a deliberate reason.

For example, the same concept should not alternate between different target-language words in:

* The sheet.
* A dialog.
* The bag.
* Chat messages.
* Documentation.

### Preferred Style

User-facing text should generally be:

* Direct.
* Concise.
* Clear.
* Suitable for an interface.
* Free from unnecessary technical jargon.

Buttons should normally describe actions:

```text
Draw
Cancel
Empty Bag
```

Headings should normally describe sections:

```text
Traits
Inventory
Latest Draw
```

Notifications should explain the problem and, where useful, the required action:

```text
Unnamed label: it cannot be added to the bag.
```

### Avoid Literal Translation When It Reduces Clarity

A literal translation is not required when it produces unnatural or misleading interface text.

The target-language version should preserve meaning, function, and tone.

Do not alter gameplay meaning merely to shorten a translation.

---

## Placeholders and Dynamic Values

The current localization files mostly contain fixed strings.

Future messages may require dynamic values.

For example:

```text
Drawn labels: {count}
```

When dynamic localization is introduced, use Foundry’s formatting functionality rather than string concatenation.

Preferred conceptual structure:

```js
game.i18n.format("prism.chat.drawCount", {
    count: drawn.length
});
```

Localization value:

```json
{
  "drawCount": "Drawn labels: {count}"
}
```

Do not build translated sentences like:

```js
"The bag contains " + amount + " labels."
```

Word order and grammar differ between languages.

Use named placeholders with complete localized sentence templates.

### Placeholder Rules

* Preserve placeholder names in every language.
* Do not translate placeholder identifiers.
* Do not remove required placeholders.
* Do not add a placeholder that the code does not supply.
* Test singular and plural forms where relevant.
* Avoid relying on English word order.

---

## Capitalization and Interface Consistency

Capitalization should be consistent within each language.

Review whether each value is used as:

* A title.
* A section heading.
* A button.
* A sentence.
* A stored label.
* A lowercase gameplay term.

The current English values mix title-style and lowercase values in different contexts.

For example:

```json
{
  "bagManager": {
    "fear": "fear",
    "danger": "danger"
  }
}
```

These lowercase values become generic bag-entry names.

By contrast:

```json
{
  "sheet": {
    "fear": "Fear",
    "danger": "Danger"
  }
}
```

These are section headings.

This distinction may be intentional and should not be normalized automatically without checking how the values are used.

A heading and a stored gameplay label may require separate capitalization.

---

## Localization Key Changes

Localization keys are part of the source-code interface.

Renaming or removing a key requires updates to every use in:

* JavaScript.
* Handlebars.
* All language files.
* Documentation.
* Tests or validation scripts, when introduced.

Before renaming a key:

1. Search the entire repository.
2. Update every language file.
3. Update every JavaScript reference.
4. Update every template reference.
5. Test every affected interface.
6. Record user-visible changes in `CHANGELOG.md` when applicable.

Do not rename keys only to improve cosmetic consistency unless the benefit justifies the review risk.

### Removing Keys

A key may be removed when:

* It is not referenced anywhere.
* It is not reserved for a confirmed upcoming feature.
* It is not used by a released or supported branch.
* Its removal is included in a focused cleanup.

An unused key does not usually affect stored world data, but removing it can still break templates or code that were missed during review.

---

## Validation

Every localization change should validate both structure and content.

### JSON Syntax

At minimum, confirm that every language file contains valid JSON.

A simple validation can be performed with an editor that supports JSON diagnostics.

When Node.js is available, a basic syntax check can be run with:

```bash
node -e "JSON.parse(require('fs').readFileSync('prism/lang/en.json', 'utf8'))"
```

and:

```bash
node -e "JSON.parse(require('fs').readFileSync('prism/lang/it.json', 'utf8'))"
```

Node.js is not currently a project prerequisite, so these commands are optional development aids rather than required project tooling.

### Key Parity

Every supported language should contain the same key paths.

For example, if English contains:

```text
prism.sheet.objectMessage
```

Italian must also contain:

```text
prism.sheet.objectMessage
```

A translation file with valid JSON can still be incomplete.

### Source Reference Check

Search the repository for localization calls:

```text
game.i18n.localize(
```

and:

```text
{{localize
```

Confirm that every referenced key exists.

Also check future uses of:

```text
game.i18n.format(
```

### Duplicate Meanings

Review whether multiple keys contain the same text but represent different meanings.

Duplicate values are not necessarily an error.

Two keys may intentionally have the same English value but require different translations in another language.

---

## Manual Testing

Localization changes must be tested inside Foundry VTT.

### Changing the Foundry Language

Use Foundry’s language settings to switch between supported languages.

After changing the language:

* Reload the world.
* Reopen the Actor sheet.
* Reopen dialogs.
* Repeat notifications and chat actions.

Some strings are created only when a feature is activated.

### Sheet Testing

Verify:

* Actor name placeholder.
* Concept label and placeholder.
* Tab names.
* Trait and adversity headings.
* Add buttons.
* Bag actions.
* Fear and danger labels.
* Latest Draw heading.
* Marks heading.
* Biography and notes.
* Inventory headings.
* Item placeholder.
* Quantity heading.

### Bag Testing

Verify:

* Empty-bag warning.
* Unnamed-label warning.
* Draw button.
* Risk button.
* Clear-bag button.
* Generic fear and danger names.
* Latest-draw display.

### Dialog Testing

Verify:

* Dialog title.
* Question text.
* One-label option.
* Two-label option.
* Three-label option.
* Confirm button.
* Cancel button.

### Chat Testing

Verify:

* Standard draw title.
* Risk draw title.
* Special characters in label names.
* Long translated titles.
* Chat-card layout.

### Layout Testing

Check:

* Text wrapping.
* Button width.
* Tab width.
* Input placeholder length.
* Dialog width.
* Inventory headings.
* Narrow or resized sheet layouts.

A translation may be linguistically correct but still require a layout change if essential text becomes unreadable.

Do not shorten important meaning merely to avoid fixing a layout problem.

### Missing-Key Testing

Visible text like:

```text
prism.sheet.inventory
```

usually means that:

* The key is missing.
* The key contains a typo.
* The wrong language file loaded.
* The JSON file is invalid.
* The system was not reloaded.

No raw localization key should appear in the normal interface.

---

## Common Problems

### Localization File Does Not Load

Check:

* JSON syntax.
* Filename.
* Manifest path.
* Language code.
* Whether Foundry was restarted or reloaded.
* Whether the system is loading the expected installation directory.

### English Works but Italian Does Not

Check:

* The key exists in `it.json`.
* The hierarchy matches `en.json`.
* The Italian JSON file is valid.
* The current Foundry language is actually Italian.
* The browser is not displaying cached content.

### A Key Appears in the Interface

Check the exact spelling and case.

These are different keys:

```text
prism.sheet.characterName
prism.sheet.charactername
```

Localization keys are case-sensitive.

### Text Is Still in English

The text may be hard-coded in:

* JavaScript.
* Handlebars.
* HTML assembled for chat.
* A dialog definition.
* A notification.
* Stored Actor data.

Search the source for the visible English text.

Some values, such as generic fear and danger entries, may already be stored in Actor data from an earlier language setting. Changing the localization file does not automatically translate existing stored values.

### Translation Changed but Existing Bag Entries Did Not

Generic bag entries store their localized display name at the time they are created.

For example:

```js
{
    name: game.i18n.localize("prism.bagManager.fear"),
    type: "fear"
}
```

Changing the language later does not currently update existing entries already stored in:

```text
actor.system.bag
```

This is expected under the current data model.

A future implementation may choose to store semantic keys instead of translated values, but that would be a data-model change requiring migration planning.

### Translation Breaks the Layout

Do not immediately replace the translation with an inaccurate abbreviation.

First evaluate:

* Flexible button width.
* Text wrapping.
* Responsive layout.
* Larger dialog dimensions.
* Shorter but still correct phrasing.
* A context-specific key.

Layout changes should be handled in the relevant CSS and tested in all supported languages.

---

## Pull Request Requirements

A localization Pull Request should normally contain localization changes only.

Avoid combining translation work with unrelated:

* Refactoring.
* Feature development.
* CSS restructuring.
* Data-model changes.
* Dependency changes.

A localization Pull Request should explain:

* Which language is affected.
* Which keys were added, changed, or removed.
* Why existing translations changed.
* Whether terminology decisions were made.
* Whether the change introduces a new language.
* How the translation was tested.
* Whether any layout issue was found.
* Whether screenshots are included.

Follow the complete contribution process in [`CONTRIBUTING.md`](../CONTRIBUTING.md).

---

## Current Localization Notes

The current localization implementation has several behaviors that contributors should understand.

### English and Italian Are Both Required

Every new user-facing key should normally be added to both:

```text
prism/lang/en.json
prism/lang/it.json
```

Do not leave one file structurally incomplete.

### English Filename

The current English localization file is:

```text
en.json
```

and the manifest path is:

```text
lang/en.json
```

Keep the filename and manifest path synchronized.

### Generic Bag Labels Are Stored as Translated Text

Fear and danger entries use localized text when they are added to the bag.

Existing entries do not automatically change when the Foundry language changes.

This should be considered when changing:

```text
prism.bagManager.fear
prism.bagManager.danger
```

## Related Documentation

* [Project README](../README.md)
* [Development Guide](DEVELOPMENT.md)
* [Installation Guide](INSTALLATION.md)
* [Contributing Guidelines](../CONTRIBUTING.md)
* [Security Policy](../SECURITY.md)
* [Changelog](../CHANGELOG.md)
* [License](../LICENSE)
