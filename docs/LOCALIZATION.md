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

Localization keys are grouped by feature.

The current groups are:

```text
prism.bag
prism.sheet
prism.bagManager
prism.dialog
prism.chat
```

### `prism.bag`

Contains virtual-bag actions, validation warnings, and session-state feedback.

Current action-label examples include:

```text
prism.bag.pExtractMessage
prism.bag.riskMessage
prism.bag.emptyMessage
```

Current validation keys include:

```text
prism.bag.empty
prism.bag.labelWithoutName
prism.bag.duplicateLabel
prism.bag.maxAdversities
prism.bag.maxFears
prism.bag.maxDangers
prism.bag.drawThreeRequiresDanger
prism.bag.riskRequiresInitialDraw
prism.bag.initialDrawAlreadyCompleted
prism.bag.riskAlreadyCompleted
prism.bag.bagLocked
```

Example use:

```js
game.i18n.localize("prism.bag.bagLocked")
```

The validation messages are used by both direct action checks and warning-capable controls that look unavailable but remain clickable.

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
prism.sheet.signs
prism.sheet.bio
prism.sheet.note
prism.sheet.inventory
prism.sheet.object
prism.sheet.quantity
```

This group also contains placeholders and section titles.

### `prism.bagManager`

Contains localized display names used when generic entries are inserted into the bag.

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

The risk dialog dynamically displays only the amount options supported by the remaining bag size. All possible option labels must still exist in every language file.

### `prism.chat`

Contains titles used in Foundry chat messages.

Current keys are:

```text
prism.chat.draw
prism.chat.risk
```

Chat titles are localized at message creation time and escaped before being inserted into the PRISM chat-card HTML.

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

When adding a new button, message, field, dialog, notification, title attribute, or chat element:

1. Choose a clear semantic key.
2. Add the key to `en.json`.
3. Add the same key to `it.json`.
4. Use the key in JavaScript or Handlebars.
5. Verify JSON syntax in both files.
6. Verify key parity.
7. Test both languages in Foundry.
8. Check the interface layout and warning behavior.
9. Update documentation when the text represents a new feature or rule.

Example new notification:

```json
{
  "prism": {
    "bag": {
      "exampleRule": "This operation is not allowed."
    }
  }
}
```

Italian version:

```json
{
  "prism": {
    "bag": {
      "exampleRule": "Questa operazione non è consentita."
    }
  }
}
```

JavaScript use:

```js
ui.notifications.warn(
	game.i18n.localize("prism.bag.exampleRule")
);
```

Handlebars title use:

```hbs
title="{{localize 'prism.bag.exampleRule'}}"
```

Do not merge code that introduces visible text in only one language unless the missing translation is explicitly documented and accepted.

For blocked bag actions, use one specific message per reason. Do not collapse duplicate, limit, missing-Danger, locked-session, and repeated-draw failures into a generic warning.

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

Every localization change must validate both structure and content.

### JSON Syntax

At minimum, confirm that every language file contains valid JSON.

A trailing comma, missing quote, comment, or mismatched brace can prevent the entire file from loading.

When Node.js is available, validate both files with:

```bash
node -e "for (const file of ['prism/lang/en.json','prism/lang/it.json']) JSON.parse(require('fs').readFileSync(file, 'utf8')); console.log('Localization JSON is valid.');"
```

Individual checks also remain valid:

```bash
node -e "JSON.parse(require('fs').readFileSync('prism/lang/en.json', 'utf8'))"
node -e "JSON.parse(require('fs').readFileSync('prism/lang/it.json', 'utf8'))"
```

Node.js is not currently a project prerequisite, so these commands are optional development aids rather than required project tooling.

### Key Parity

Every supported language must contain the same key paths.

For example, if English contains:

```text
prism.bag.riskAlreadyCompleted
```

Italian must also contain:

```text
prism.bag.riskAlreadyCompleted
```

A translation file with valid JSON can still be incomplete.

Key parity should include all current bag-validation keys, not only visible sheet headings.

### Source Reference Check

Search the repository for localization calls:

```text
game.i18n.localize(
```

and:

```text
{{localize
```

Confirm that every referenced key exists in both files.

Also check current or future uses of:

```text
game.i18n.format(
```

Search title attributes as well as visible element content, because unavailable bag controls use localized explanatory titles.

### Runtime Diagnostic

Inside a running world, check the active language:

```js
game.i18n.lang
```

For Italian, the expected result is:

```text
it
```

Then test a known key:

```js
game.i18n.localize("prism.sheet.traits")
```

A translated value confirms that the file loaded and the key exists.

If Foundry returns the key itself, the key is missing, misspelled, or the language file did not load.

### Duplicate Meanings

Review whether multiple keys contain the same text but represent different meanings.

Duplicate values are not necessarily an error.

Two keys may intentionally have the same English value but require different translations in another language.

---

## Manual Testing

Localization changes must be tested inside Foundry VTT.

### Changing the Foundry Language

Use Foundry world settings to switch between supported languages.

After changing the language:

* Save the setting.
* Reload the world.
* Reopen the Actor sheet.
* Reopen dialogs.
* Repeat notifications and chat actions.

Some strings are created only when a feature is activated. A sheet that was already open may retain old rendered text until it is reopened or re-rendered.

### Sheet Testing

Verify:

* Actor name placeholder.
* Concept label and placeholder.
* Tab names.
* Trait, Adversity, Fear, and Danger headings.
* Add buttons.
* Bag actions.
* Latest Draw heading.
* Signs heading.
* Biography and notes.
* Inventory headings.
* Item placeholder.
* Quantity heading.
* Localized title attributes on warning-capable controls.

### Bag Validation Testing

Trigger and verify every current warning:

* Empty bag.
* Unnamed source label.
* Duplicate source label.
* Maximum Adversities reached.
* Maximum Fears reached.
* Maximum Dangers reached.
* Initial draw attempted without a Danger.
* Risk attempted before the initial draw.
* Initial draw attempted twice.
* Risk attempted twice.
* Bag modification attempted after the initial draw.

Every warning must be specific, understandable, and present in both languages.

### Dialog Testing

Verify:

* Dialog title.
* Question text.
* One-label option.
* Two-label option.
* Three-label option.
* Confirm button.
* Cancel button.

Also verify dynamic option visibility:

* One remaining bag entry shows only the one-label option.
* Two remaining entries show one and two.
* Three or more remaining entries show one, two, and three.

### Chat Testing

Verify:

* Initial-draw title.
* Risk-draw title.
* Special characters in label names.
* Long translated titles.
* Chat-card layout.
* Trait, Adversity, Fear, and Danger label presentation.

### Layout Testing

Check:

* Text wrapping.
* Button width.
* Tab width.
* Input placeholder length.
* Dialog width.
* Inventory headings.
* Type-panel headings.
* Neutral-panel headings.
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
* The system or world was not reloaded.

No raw localization key should appear in the normal interface.

---

## Common Problems

### Localization File Does Not Load

Check:

* JSON syntax.
* Trailing commas.
* Filename.
* Manifest path.
* Language code.
* Whether Foundry was restarted or the world reloaded.
* Whether the system is loading the expected installation directory.

A syntax error in one localization file can prevent that whole file from loading even when `system.json` is configured correctly.

### English Works but Italian Does Not

Check:

* The key exists in `it.json`.
* The hierarchy matches `en.json`.
* The Italian JSON file is valid.
* The current Foundry language is actually Italian.
* The browser is not displaying cached content.

Useful console checks:

```js
game.i18n.lang
```

and:

```js
game.i18n.localize("prism.sheet.traits")
```

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
* A title attribute.
* Stored Actor data.

Search the source for the visible English text.

Also confirm that Foundry is loading the development copy you edited rather than a previously installed release.

### Translation Changed but Existing Bag Entries Did Not

Bag entries store their display name at insertion time.

Generic Fear and Danger example:

```js
{
	name: game.i18n.localize("prism.bagManager.fear"),
		type: "fear"
}
```

Changing the language later does not update existing entries already stored in:

```text
actor.system.bag
```

Stored Trait and Adversity bag entries also retain the name snapshot captured when they were added.

This is expected under the current data model.

A future implementation may store semantic localization keys instead of translated display values, but that would require a planned data-model change and migration strategy.

### Warning-Capable Button Does Nothing

The current interface intentionally keeps visually unavailable bag controls clickable so they can show a localized explanation.

Check that:

* The template does not add the native `disabled` attribute.
* CSS does not apply `pointer-events: none`.
* `aria-disabled="true"` and `prism-is-disabled` are present when expected.
* The JavaScript action reaches `BagManager` validation.
* The referenced warning key exists in both language files.

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

### English Is the Reference Structure

The current English localization file is:

```text
en.json
```

and the manifest path is:

```text
lang/en.json
```

Use it as the structural reference when adding keys, while keeping translations natural rather than mechanically literal.

Keep filenames and manifest paths synchronized.

### Bag Validation Messages Are Required Interface Text

The current bag workflow depends on localized warnings for invalid operations.

The key set includes:

```text
prism.bag.duplicateLabel
prism.bag.maxAdversities
prism.bag.maxFears
prism.bag.maxDangers
prism.bag.drawThreeRequiresDanger
prism.bag.riskRequiresInitialDraw
prism.bag.initialDrawAlreadyCompleted
prism.bag.riskAlreadyCompleted
prism.bag.bagLocked
```

Do not remove or consolidate these keys without updating `BagManager`, the sheet template, tests, and both language files.

### Generic Bag Labels Are Stored as Translated Text

Fear and Danger entries use localized text when they are added to the bag.

Existing entries do not automatically change when the Foundry language changes.

This should be considered when changing:

```text
prism.bagManager.fear
prism.bagManager.danger
```

### Stored Label Names Are Snapshots

Trait and Adversity bag entries store the source name present when the entry is added.

Renaming the source label later does not automatically rename the existing bag entry. Remove and re-add the entry before the test begins when an updated snapshot is required.

### Language Changes Require a Reload

After changing Foundry's language preference, reload the world and reopen the sheet.

When localization appears unchanged, verify the active language and a known key through the console before changing `system.json`.

### Invalid JSON Can Cause Apparent Fallback

A valid `languages` manifest section is not sufficient when a language file contains invalid JSON.

Trailing commas are a common cause. Validate both files before every release.

---

## Related Documentation

* [Project README](../README.md)
* [Development Guide](DEVELOPMENT.md)
* [Installation Guide](INSTALLATION.md)
* [Contributing Guidelines](../CONTRIBUTING.md)
* [Security Policy](../SECURITY.md)
* [Changelog](../CHANGELOG.md)
* [License](../LICENSE)
