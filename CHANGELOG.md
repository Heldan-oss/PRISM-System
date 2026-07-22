# Changelog

All notable changes to **PRISM RPG for Foundry Virtual Tabletop** will be documented in this file.

The project follows [Semantic Versioning](https://semver.org/) where practical during Alpha development.

Because the project is currently in Alpha:

* Features may change between releases.
* Stored Actor and world data may change.
* Backward compatibility is not guaranteed.
* Updates may require manual intervention or data migration.
* Version numbers below `1.0.0` represent unstable development releases.

---

## [Unreleased]

### Added

* No unreleased changes documented yet.

### Changed

* No unreleased changes documented yet.

### Fixed

* No unreleased fixes documented yet.

---

## [0.1.1] - 2026-07-22

### Added

* Added complete English localization support.
* Added a detailed project `README.md`
* Added contributor documentation
* Added an installation guide
* Added a development guide
* Added a localization guide
* Added a security policy for privately reporting vulnerabilities.
* Added an MIT software license.
* Added GitHub Issue Forms for:
    * Bug reports.
    * Feature requests.
* Added an Issue template configuration with links for community support and private vulnerability reporting.
* Added a Pull Request template.
* Added repository ownership configuration through `.github/CODEOWNERS`.
* Added repository contribution and review policies for the protected `main` branch.
* Added `.gitignore` rules for IDE metadata, temporary files, local Foundry data, build output, and environment files.

### Changed

* Revised existing Italian interface text for improved clarity and consistency.
* Standardized user-facing terminology across the Anomaly sheet, virtual bag, dialogs, and chat messages.
* Organized localization values under feature-specific namespaces:
    * `prism.bag`
    * `prism.sheet`
    * `prism.bagManager`
    * `prism.dialog`
    * `prism.chat`
### Fixed
* Corrected and refined interface wording in the existing localization.
* Prevented IDE metadata from being tracked through the root `.gitignore`.

---

## [0.1.0] - 2026-07-03

### Added

* Created the initial Alpha implementation of PRISM RPG for Foundry Virtual Tabletop.
* Added the Foundry VTT game-system manifest.
* Added support for the `character` Actor type.
* Added a custom Anomaly Actor sheet.
* Added editable character information:
    * Anomaly name.
    * Concept.
    * Biography.
    * Personal notes.
    * Marks.
* Added sheet navigation with:
    * Main tab.
    * Biography tab.
    * Inventory tab.
* Added trait management:
    * Create traits.
    * Edit trait names.
    * Delete traits.
    * Add traits to the virtual bag.
* Added adversity management:
    * Create adversities.
    * Edit adversity names.
    * Delete adversities.
    * Add adversities to the virtual bag.
* Added generic Fear entries.
* Added generic Danger entries.
* Added the virtual tag bag.
* Added support for:
    * Adding labels to the bag.
    * Adding the same source label multiple times.
    * Removing individual bag entries.
    * Emptying the bag.
    * Tracking the latest draw.
* Added the standard Draw 3 action.
* Added the Take a Risk action.
* Added a localized risk dialog allowing the user to draw:
    * One label.
    * Two labels.
    * Three labels.
* Added random bag extraction without replacement.
* Added safe handling when the requested draw exceeds the number of available bag entries.
* Added a warning when drawing from an empty bag.
* Added validation preventing unnamed labels from being added to the bag.
* Added Foundry chat integration for:
    * Standard draws.
    * Risk draws.
* Added type-specific chat and interface classes for:
    * Traits.
    * Adversities.
    * Fear.
    * Danger.
* Added inventory management:
    * Create inventory entries.
    * Edit item names.
    * Set quantities.
    * Delete inventory entries.
* Added synchronization of unsaved sheet values before executing sheet actions.
* Added Italian localization.
* Added localized interface text for:
    * The Anomaly sheet.
    * The virtual bag.
    * Dialogs.
    * Warnings.
    * Chat messages.
* Added Handlebars templates for the Anomaly sheet.
* Added CSS architecture divided into:
    * Shared variables.
    * Sheet styles.
    * General PRISM styles.
* Added utility functions for:
    * Resolving label collection paths.
    * Resolving localized label-type names.
    * Randomizing arrays.
* Added initial Foundry VTT compatibility declarations:
    * Minimum version 12.
    * Verified version 13.

### Technical Notes

* Actor data is stored through `template.json`.
* Inventory entries are stored as plain objects inside Actor system data.
* Traits and adversities are stored as plain objects with generated identifiers.
* Bag entries receive identifiers separate from their source labels.
* Fear and Danger are currently added directly to the bag as generic entries.
* Drawn entries are removed from the bag and stored in `system.lastDraw`.
* The system currently uses Foundry Application V1 sheet and dialog classes.
---

## Versioning Guidelines

Version numbers use the following general structure:

```text
MAJOR.MINOR.PATCH
```

During Alpha development:

* `MAJOR` remains `0`.
* `MINOR` may increase for new features, significant architecture changes, or data-model changes.
* `PATCH` may increase for fixes, documentation, localization, and smaller compatible improvements.

Examples:

```text
0.1.1
```

A patch-level Alpha update containing localization and documentation improvements.

```text
0.2.0
```

A future Alpha update introducing substantial new functionality or data changes.

Version numbers do not guarantee backward compatibility while the project remains below `1.0.0`.

---

## Changelog Categories

Future releases should use only the applicable sections:

### Added

For new features, files, capabilities, languages, or workflows.

### Changed

For changes to existing behavior, architecture, wording, or data structures.

### Deprecated

For features that remain available but are planned for removal.

### Removed

For removed features, fields, files, or compatibility.

### Fixed

For bug corrections.

### Security

For publicly disclosed security corrections.

### Documentation

For significant documentation additions or restructuring.

Empty categories should normally be omitted from completed release entries.

---

## Release Checklist

Before publishing a new version:

1. Update the version in `prism/system.json`.
2. Move completed entries from `Unreleased` into a versioned section.
3. Add the release date using `YYYY-MM-DD`.
4. Group changes by category.
5. Describe user-visible effects rather than listing only commit messages.
6. Document breaking data or compatibility changes prominently.
7. Update compatibility values when necessary.
8. Verify English and Italian localization.
9. Test the packaged system in Foundry VTT.
10. Create the GitHub release and corresponding tag.
