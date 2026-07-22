# Installation Guide

## Overview

This guide explains how to install, update, verify, back up, and remove **PRISM RPG for Foundry Virtual Tabletop**.

PRISM RPG for Foundry VTT is currently in Alpha development. Installation is primarily intended for developers, testers, and users who understand that:

* Features may be incomplete.
* Stored data may change.
* Existing worlds may require migration.
* Backward compatibility is not guaranteed.
* Development versions may contain unresolved bugs.

Always back up important Foundry VTT data before installing or updating the system.

For project architecture, source-code conventions, and development procedures, see [`DEVELOPMENT.md`](DEVELOPMENT.md).

---

## Table of Contents

* [Compatibility](#compatibility)
* [Before Installing](#before-installing)
* [System Package Structure](#system-package-structure)
* [Locate the Foundry User Data Directory](#locate-the-foundry-user-data-directory)
* [Manual Installation from the Repository](#manual-installation-from-the-repository)
* [Development Installation with Git](#development-installation-with-git)
* [Packaged Release Installation](#packaged-release-installation)
* [Manifest Installation](#manifest-installation)
* [Verify the Installation](#verify-the-installation)
* [Create a PRISM World](#create-a-prism-world)
* [Updating the System](#updating-the-system)
* [Backing Up Foundry Data](#backing-up-foundry-data)
* [Downgrading](#downgrading)
* [Removing the System](#removing-the-system)
* [Troubleshooting](#troubleshooting)
* [Reporting Installation Problems](#reporting-installation-problems)
* [Related Documentation](#related-documentation)

---

## Compatibility

The authoritative Foundry VTT compatibility values are defined in:

```text
prism/system.json
```

The current manifest declares:

```json
{
  "compatibility": {
    "minimum": "12",
    "verified": "13"
  }
}
```

Before installing or updating:

1. Open [`prism/system.json`](../prism/system.json).
2. Check the declared compatibility values.
3. Compare them with the Foundry VTT version in use.
4. Review the latest [`CHANGELOG.md`](../CHANGELOG.md).
5. Review the relevant GitHub release notes, when releases are available.

Compatibility with Foundry VTT versions not declared in `system.json` is not guaranteed.

The `verified` value indicates the version against which the current package has been tested or verified. It does not guarantee that every feature works in every environment.

---

## Before Installing

Before installing the system:

1. Stop the Foundry VTT server or return to the Setup screen.
2. Identify the configured Foundry User Data directory.
3. Back up existing worlds and user data.
4. Remove or rename any older manual installation of the `prism` system.
5. Confirm that the downloaded source comes from the official repository:

```text
https://github.com/Heldan-oss/PRISM-System
```

Do not install files received from an unknown or untrusted source.

Do not overwrite an existing installation while Foundry is actively using the system.

---

## System Package Structure

The repository contains project documentation and GitHub configuration in addition to the Foundry system.

The installable Foundry system is only the:

```text
prism/
```

directory.

The installed system must have this structure:

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

The following path must exist:

```text
Data/systems/prism/system.json
```

Do not install the entire repository as the system directory.

This structure is incorrect:

```text
Data/systems/PRISM-System/prism/system.json
```

This structure is also incorrect:

```text
Data/systems/prism/prism/system.json
```

The directory containing `system.json` must be named:

```text
prism
```

This matches the system identifier declared in the manifest:

```json
{
  "id": "prism"
}
```

---

## Locate the Foundry User Data Directory

Foundry stores installed systems under the configured User Data directory.

The system directory is:

```text
FOUNDRY_USER_DATA/Data/systems/
```

The actual location depends on:

* Operating system.
* Foundry installation method.
* Hosting provider.
* Container or server configuration.
* Any custom User Data path selected by the administrator.

Use the User Data path configured for the Foundry installation rather than assuming that the application installation directory is also the data directory.

Do not place the system inside the Foundry application binaries or program directory unless that directory is also explicitly configured as the User Data location.

For hosted Foundry installations, consult the hosting provider’s file-management documentation.

---

## Manual Installation from the Repository

This method is suitable for Alpha testers who want to install the current source without using Git for updates.

### 1. Download the Repository

Open:

```text
https://github.com/Heldan-oss/PRISM-System
```

Download the repository source as a ZIP archive.

### 2. Extract the Archive

Extract the downloaded archive to a temporary directory.

The extracted repository will contain files similar to:

```text
PRISM-System/
├── docs/
├── prism/
├── README.md
├── CONTRIBUTING.md
├── LICENSE
└── SECURITY.md
```

### 3. Copy the System Directory

Copy only:

```text
PRISM-System/prism/
```

into:

```text
FOUNDRY_USER_DATA/Data/systems/
```

The final directory must be:

```text
FOUNDRY_USER_DATA/Data/systems/prism/
```

### 4. Verify the Result

Confirm that this file exists:

```text
FOUNDRY_USER_DATA/Data/systems/prism/system.json
```

Also confirm that the directory contains:

```text
template.json
lang/
module/
styles/
templates/
```

### 5. Restart Foundry

Restart Foundry VTT or reload the Setup screen.

The system should appear in the list of available game systems.

---

## Development Installation with Git

This method is intended for contributors and testers who want to update the source through Git.

### 1. Clone the Repository

Clone the repository to a normal development directory:

```bash
git clone https://github.com/Heldan-oss/PRISM-System.git
cd PRISM-System
```

The runtime system is located in:

```text
PRISM-System/prism/
```

### 2. Choose a Development Installation Method

You may either:

* Copy the `prism/` directory into Foundry after every change, or
* Link the repository’s `prism/` directory directly into the Foundry systems directory.

A symbolic link or directory junction is recommended for active development.

### Linux or macOS

```bash
ln -s "/path/to/PRISM-System/prism" \
      "/path/to/FOUNDRY_USER_DATA/Data/systems/prism"
```

### Windows PowerShell

```powershell
New-Item `
  -ItemType Junction `
  -Path "C:\path\to\FOUNDRY_USER_DATA\Data\systems\prism" `
  -Target "C:\path\to\PRISM-System\prism"
```

Replace the example paths with the actual local paths.

### 3. Verify the Link

Confirm that Foundry can access:

```text
Data/systems/prism/system.json
```

### 4. Restart or Reload Foundry

Changes to JavaScript, templates, styles, localization files, or the manifest may require:

* Closing and reopening the Actor sheet.
* Reloading the world.
* Reloading the browser.
* Restarting Foundry.
* Returning to Setup after a manifest change.

More detailed contributor setup belongs in [`DEVELOPMENT.md`](DEVELOPMENT.md).

---

## Packaged Release Installation

When packaged releases become available, each release archive should contain a top-level directory named:

```text
prism/
```

with:

```text
prism/
├── system.json
├── template.json
├── lang/
├── module/
├── styles/
└── templates/
```

To install a packaged release:

1. Download the release archive from the official GitHub Releases page.
2. Stop Foundry VTT or return to Setup.
3. Back up existing worlds.
4. Extract the archive.
5. Copy the resulting `prism/` directory into:

```text
FOUNDRY_USER_DATA/Data/systems/
```

6. Replace the previous installation only after confirming that the backup is complete.
7. Restart Foundry.
8. Verify the installed version through `system.json` or the Foundry system list.

Do not merge files from multiple versions manually. Replace the system directory as one complete package unless release instructions explicitly state otherwise.

---

## Manifest Installation

The project does not currently provide a stable manifest URL intended for general installation through Foundry’s package manager.

When a stable manifest becomes available, it will be documented in:

* [`README.md`](../README.md)
* GitHub release notes
* The official repository release page

Until then, do not use unofficial manifest URLs.

A future manifest installation procedure will normally involve:

1. Opening Foundry Setup.
2. Opening the Game Systems installation interface.
3. Providing the official manifest URL.
4. Installing the system.
5. Verifying the installed version.
6. Creating or opening a test world.

This section should be updated when the project publishes an official installable manifest.

---

## Verify the Installation

After installing the system:

1. Start Foundry VTT.
2. Open the Setup screen.
3. Open the list of installed game systems.
4. Confirm that PRISM appears.
5. Check the displayed version.
6. Check for compatibility warnings.
7. Open the browser developer console if an error appears.

The system should load files from:

```text
systems/prism/
```

The JavaScript entry point is:

```text
systems/prism/module/prism.mjs
```

The Actor-sheet template is:

```text
systems/prism/templates/actor-character-sheet.hbs
```

The browser console should display:

```text
PRISM | Init
```

when the system initializes successfully.

The presence of this message does not guarantee that every feature is working, but its absence may indicate that the entry module failed to load.

---

## Create a PRISM World

After verifying that the system is installed:

1. Open Foundry Setup.
2. Create a new world.
3. Select PRISM as the game system.
4. Use a temporary name for the first test world.
5. Launch the world.
6. Create an Actor.
7. Select the `character` Actor type.
8. Open the Actor sheet.
9. Test basic sheet and bag operations.

For an Alpha installation, use a dedicated test world before opening or converting important campaign data.

The current system does not provide a world-conversion tool from another game system.

---

## Updating the System

Always back up Foundry data before updating.

### Manual Installation Update

For a manually installed copy:

1. Stop Foundry or return to Setup.
2. Back up worlds and the existing system directory.
3. Download the new source or release archive.
4. Extract it to a temporary directory.
5. Remove or rename the existing:

```text
Data/systems/prism/
```

6. Copy the new `prism/` directory into:

```text
Data/systems/
```

7. Restart Foundry.
8. Confirm the new version.
9. Test the system in a disposable world.
10. Open an existing backed-up world only after the basic test succeeds.

Do not copy only a few changed files unless the release instructions explicitly require it. Partial updates can leave incompatible files from an older version.

### Git Development Update

For a development clone:

```bash
git checkout main
git pull --ff-only origin main
```

When working from a fork with the original repository configured as `upstream`:

```bash
git checkout main
git fetch upstream
git pull --ff-only upstream main
git push origin main
```

After updating:

1. Restart or reload Foundry.
2. Confirm the version in `prism/system.json`.
3. Review `CHANGELOG.md`.
4. Test the affected workflows.
5. Check the browser console.

Do not pull new commits while you have uncommitted local changes unless you understand how those changes will be preserved or merged.

### Package-Manager Update

When official package-manager updates become available, follow the instructions associated with the release.

Even when Foundry performs the package update automatically, world backups remain the administrator’s responsibility.

---

## Backing Up Foundry Data

Before updating, downgrading, removing, or testing migration-sensitive changes, back up:

* The relevant world directory.
* Important Actor and Item data.
* User data.
* System configuration where appropriate.
* The currently installed `prism/` directory.
* Any custom changes made locally to the system.

At minimum, copy the affected world directory from:

```text
FOUNDRY_USER_DATA/Data/worlds/
```

to a location outside the active Foundry User Data directory.

Do not treat a copy inside the same active directory as the only backup.

A useful backup name includes:

* World name.
* PRISM system version.
* Foundry VTT version.
* Date.

Example:

```text
my-prism-world_prism-0.1.1_foundry-13_2026-07-22
```

Stop Foundry before copying an active world directory whenever possible.

Verify that the backup can be accessed before removing or replacing the original files.

---

## Downgrading

Downgrading to an earlier Alpha version may not be safe.

A newer version may change:

* Actor data.
* Bag entries.
* Inventory entries.
* Localization keys.
* Templates.
* Stored field types.
* Compatibility requirements.

Before downgrading:

1. Read the changelog entries between the versions.
2. Check whether stored data changed.
3. Back up the current world.
4. Prefer restoring a world backup created before the upgrade.
5. Install the older system as a complete package.
6. Test it in a separate environment.

Do not assume that installing an older system version reverses data migrations or schema changes.

The project does not currently provide an automatic downgrade or rollback migration system.

---

## Removing the System

Removing the system files does not automatically delete worlds that use the system.

To remove PRISM RPG for Foundry VTT:

1. Stop Foundry or return to Setup.
2. Back up any PRISM worlds that may be needed later.
3. Confirm that no active world is using the system.
4. Delete or move:

```text
FOUNDRY_USER_DATA/Data/systems/prism/
```

5. Restart Foundry.
6. Confirm that the system no longer appears in the installed-system list.

If the installation uses a symbolic link or junction, remove the link from the Foundry systems directory.

Removing a link should not delete the original repository, but verify the path before running any deletion command.

Do not delete PRISM world directories unless the campaign data is no longer needed and a verified backup exists.

---

## Troubleshooting

## System Does Not Appear in Foundry

Check that:

* The directory is named `prism`.
* `system.json` is directly inside that directory.
* The complete path is:

```text
Data/systems/prism/system.json
```

* `system.json` contains valid JSON.
* The system is installed in the configured User Data directory.
* Foundry was restarted or the Setup page was reloaded.
* The current Foundry version satisfies the manifest compatibility requirements.

A common incorrect installation is:

```text
Data/systems/prism/PRISM-System/prism/system.json
```

Move the inner `prism/` directory to the correct level.

---

## Foundry Reports an Invalid Manifest

Check:

* JSON syntax in `system.json`.
* Missing commas or quotation marks.
* The presence of the required `id`, `title`, and `version` fields.
* File paths listed under `esmodules`, `styles`, and `languages`.
* Whether the file was modified manually.

Restore an unmodified copy from the official repository when necessary.

---

## The World Does Not Start

Check:

* The browser developer console.
* Foundry server logs.
* Compatibility warnings.
* Whether `module/prism.mjs` exists.
* Whether all imported `.mjs` files exist.
* Whether the system was only partially updated.
* Whether unrelated modules are causing the failure.

Test using a new world with additional modules disabled.

---

## The Actor Sheet Does Not Open

Check:

* The Actor type is `character`.
* The browser console contains `PRISM | Init`.
* The template exists at:

```text
systems/prism/templates/actor-character-sheet.hbs
```

* `actor-sheet.mjs` loaded without an import error.
* The installation directory is named `prism`.
* The installed files all come from the same project version.

---

## Styles Are Missing

Check that these files exist:

```text
styles/variables.css
styles/sheet.css
styles/prism.css
```

Also check:

* Browser network errors.
* Manifest stylesheet paths.
* Browser caching.
* Whether the world was reloaded after the update.

A forced browser reload may be useful after stylesheet changes.

---

## Localization Keys Appear Instead of Text

Visible text such as:

```text
prism.sheet.characterName
```

usually indicates a localization problem.

Check:

* `lang/en.json`.
* `lang/it.json`.
* JSON syntax.
* The selected Foundry language.
* The language paths in `system.json`.
* Whether the key exists in both language files.
* Whether the system was reloaded after changing language files.

---

## The System Works in a New World but Not an Existing World

The existing world may contain data created by an older Alpha schema.

Before modifying the world:

1. Make a backup.
2. Review `CHANGELOG.md`.
3. Check for documented data changes.
4. Test the same operation in a copied world.
5. Report the exact previous and current versions.

Do not manually delete stored Actor fields unless the relevant migration or recovery procedure is understood.

---

## An Update Appears to Have No Effect

Check:

* The installed `system.json` version.
* Whether Foundry is loading a different `prism/` directory.
* Whether a symbolic link points to the expected repository.
* Browser caching.
* Whether Foundry was restarted.
* Whether the updated branch was actually checked out.
* Whether local changes prevented the Git update.
* Whether the update was copied into a nested directory.

---

## Permission Errors

Confirm that the operating-system account running Foundry can read:

```text
Data/systems/prism/
```

and all contained files.

For Git links or junctions, confirm that:

* The target exists.
* The target is readable.
* The link was created with the correct path.
* The hosting environment permits links.

For hosted Foundry services, use the provider’s supported upload and permission mechanisms.

---

## Reporting Installation Problems

Use the repository’s Bug Report form when the problem is reproducible and appears to be caused by the PRISM system:

```text
https://github.com/Heldan-oss/PRISM-System/issues/new/choose
```

Before reporting:

1. Search existing Issues.
2. Test in a new world.
3. Disable unrelated modules when possible.
4. Verify the installation structure.
5. Check the browser console.
6. Remove private data from screenshots and logs.

Include:

* PRISM system version or commit.
* Foundry VTT version and build.
* Operating system.
* Browser or Foundry desktop client.
* Installation method.
* Exact installation path, with private account names removed if necessary.
* Steps performed.
* Expected result.
* Actual result.
* Console errors.
* Whether the problem occurs in a new world.
* Whether additional modules are enabled.

Do not publish:

* Passwords.
* Access tokens.
* License keys.
* Session cookies.
* Private server addresses.
* Personal information.
* Commercial PRISM content.
* Private campaign data.

Security vulnerabilities must be reported privately according to [`SECURITY.md`](../SECURITY.md).

---

## Related Documentation

* [Project README](../README.md)
* [Development Guide](DEVELOPMENT.md)
* [Localization Guide](LOCALIZATION.md)
* [Contributing Guidelines](../CONTRIBUTING.md)
* [Security Policy](../SECURITY.md)
* [Changelog](../CHANGELOG.md)
* [License](../LICENSE)
