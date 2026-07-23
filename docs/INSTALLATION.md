# Installation Guide

## Overview

This guide explains how to install, update, verify, and remove **PRISM RPG for Foundry Virtual Tabletop**.

The recommended installation method uses the official Foundry manifest URL:

```text
https://github.com/Heldan-oss/PRISM-System/releases/latest/download/system.json
```

The same manifest can be used with:

* A local Foundry VTT installation.
* A self-hosted Foundry VTT server.
* A remote Foundry VTT installation that supports custom manifest URLs.

PRISM RPG for Foundry VTT is currently in Alpha development.

During the Alpha phase:

* Features may be incomplete.
* Interfaces and stored data may change.
* Backward compatibility is not guaranteed.
* Updates may require manual intervention.
* Existing worlds should be backed up before updating.

For source-code setup and contributor workflows, see [`DEVELOPMENT.md`](DEVELOPMENT.md).

---

## Compatibility

The authoritative compatibility information is stored in:

```text
prism/system.json
```

Before installing or updating, check:

* The Foundry VTT compatibility shown in the installation interface.
* The latest [`CHANGELOG.md`](../CHANGELOG.md).
* The notes attached to the latest GitHub Release.

Compatibility outside the versions declared by the manifest is not guaranteed.

---

## Recommended Installation

### Install Using the Manifest URL

1. Start Foundry Virtual Tabletop.
2. Open the **Setup** screen.
3. Select **Game Systems**.
4. Select **Install System**.
5. Paste the following URL into the **Manifest URL** field:

```text
https://github.com/Heldan-oss/PRISM-System/releases/latest/download/system.json
```

6. Select **Install**.
7. Wait for Foundry to download and install the system.
8. Confirm that PRISM appears in the installed game-system list.

Foundry reads the manifest, downloads the matching release package, and installs it as the `prism` system.

The installation should result in:

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

### Remote and Hosted Installations

The same manifest URL can be used on a remote Foundry server, provided that:

* The server can access GitHub.
* The administrator can install custom systems.
* The hosting provider supports manifest-based installation.

Some hosting providers use a custom control panel instead of the standard Foundry Setup screen. In that case, locate the option for installing a custom system or package using a manifest URL.

Consult the provider’s documentation when its installation interface differs from standard Foundry VTT.

---

## Create a PRISM World

After installing the system:

1. Return to the Foundry Setup screen.
2. Select **Game Worlds**.
3. Create a new world.
4. Select PRISM as the game system.
5. Launch the world.
6. Create an Actor of type `character`.
7. Open the Anomaly sheet.
8. Test the sheet and virtual bag before using the world for an important campaign.

The project does not currently provide an automatic conversion tool for worlds created with another game system.

---

## Verify the Installation

After launching a PRISM world, confirm that:

* The world loads without an initialization error.
* An Actor of type `character` can be created.
* The Anomaly sheet opens.
* Traits and Adversities can be added.
* Entries can be added to the virtual bag.
* Draw results appear in chat.
* English and Italian localization work correctly.

The browser developer console should contain:

```text
PRISM | Init
```

The presence of this message confirms that the system entry module started loading.

If the world does not load correctly, check the browser console for additional errors.

---

## Updating the System

Before updating, back up any important PRISM worlds.

### Update Through Foundry

When a newer release is available:

1. Open the Foundry Setup screen.
2. Open **Game Systems**.
3. Locate PRISM.
4. Use the available update or package-update control.
5. Wait for Foundry to download the new release.
6. Restart Foundry when required.
7. Confirm the installed version.
8. Review the release notes and `CHANGELOG.md`.
9. Test the updated system in a test world before opening an important campaign.

The installed system retains its manifest URL, allowing Foundry to check for later releases.

### After an Update

Verify at least:

* World startup.
* Anomaly-sheet rendering.
* Actor data persistence.
* Virtual-bag operations.
* Chat output.
* Inventory.
* English localization.
* Italian localization.

Alpha updates may change stored data or behavior. Do not assume that every older world is automatically compatible with every newer release.

---

## Manual Release Installation

Manifest installation is recommended. Manual installation is available when the Foundry installer cannot access the manifest or when an administrator must manage files directly.

### Download the Release Package

Open the repository’s Releases page:

```text
https://github.com/Heldan-oss/PRISM-System/releases
```

Download the `prism.zip` asset attached to the desired release.

Do not use GitHub’s automatically generated:

```text
Source code (zip)
Source code (tar.gz)
```

Those archives contain the complete repository rather than only the prepared Foundry system package.

### Install the Package

1. Stop Foundry VTT or return to the Setup screen.
2. Back up existing PRISM worlds.
3. Extract `prism.zip`.
4. Copy the extracted `prism/` directory into:

```text
FOUNDRY_USER_DATA/Data/systems/
```

5. Confirm that the final path is:

```text
FOUNDRY_USER_DATA/Data/systems/prism/system.json
```

6. Restart Foundry.
7. Confirm that PRISM appears in the system list.

Do not create a nested structure such as:

```text
Data/systems/prism/prism/system.json
```

Do not copy the complete repository into the systems directory.

---

## Development Installation

Contributors should normally clone the repository and link its `prism/` directory to the Foundry systems directory.

Repository:

```text
https://github.com/Heldan-oss/PRISM-System
```

Runtime system directory:

```text
PRISM-System/prism/
```

Development installations should not use the packaged release files as the working source.

Complete Git, symbolic-link, branch, testing, and development instructions are available in [`DEVELOPMENT.md`](DEVELOPMENT.md).

---

## Backups

Back up important Foundry data before:

* Updating the system.
* Downgrading the system.
* Testing schema or migration changes.
* Replacing a manual installation.
* Removing the system.

At minimum, back up the relevant world directory from:

```text
FOUNDRY_USER_DATA/Data/worlds/
```

Store the backup outside the active Foundry User Data directory.

A useful backup name includes:

* World name.
* PRISM version.
* Foundry VTT version.
* Backup date.

Example:

```text
my-prism-world_prism-0.1.1_foundry-13_2026-07-23
```

Stop Foundry before copying an active world directory whenever possible.

---

## Downgrading

Downgrading to an earlier Alpha release may not be safe.

A newer release may change:

* Actor data.
* Virtual-bag entries.
* Inventory data.
* Localization keys.
* Templates.
* Stored field types.
* Foundry compatibility.

Installing an older package does not automatically reverse data changes made by a newer version.

When a downgrade is necessary:

1. Back up the current world.
2. Review the changelog between the two versions.
3. Prefer restoring a world backup created before the update.
4. Download the required `prism.zip` from the corresponding GitHub Release.
5. Replace the complete system directory.
6. Test the older version in a separate environment.

The project does not currently provide an automatic downgrade migration.

---

## Removing the System

Removing the game system does not automatically delete worlds that use it.

To remove PRISM:

1. Stop Foundry or return to Setup.
2. Back up any PRISM worlds that may be needed later.
3. Open **Game Systems**.
4. Use the uninstall control for PRISM when available.

For a manual installation, remove:

```text
FOUNDRY_USER_DATA/Data/systems/prism/
```

Restart Foundry and confirm that the system no longer appears in the installed-system list.

Do not delete PRISM world directories unless their contents are no longer required and a verified backup exists.

---

## Troubleshooting

### Foundry Rejects the Manifest URL

Confirm that the complete URL is:

```text
https://github.com/Heldan-oss/PRISM-System/releases/latest/download/system.json
```

Also check:

* The server has internet access.
* GitHub is reachable from the Foundry host.
* The URL was copied without additional spaces.
* The latest Release is published and not a draft.
* The Release contains both `system.json` and `prism.zip`.
* The installed Foundry version satisfies the manifest compatibility requirements.

Open the manifest URL in a browser. It should download or display a JSON file.

### Package Download Fails

The manifest contains a version-specific download URL.

Check:

* The matching GitHub Release exists.
* The release tag matches the URL stored in `system.json`.
* The Release contains an asset named exactly `prism.zip`.
* The Release is publicly accessible.
* The remote Foundry server can access GitHub release assets.

### System Does Not Appear After Manual Installation

Confirm that this file exists:

```text
Data/systems/prism/system.json
```

Common incorrect structures include:

```text
Data/systems/prism/prism/system.json
```

and:

```text
Data/systems/PRISM-System/prism/system.json
```

Also confirm that:

* The directory is named `prism`.
* `system.json` contains valid JSON.
* Foundry was restarted.
* The system is located in the configured User Data directory.

### World Does Not Start

Check:

* Foundry compatibility warnings.
* Browser developer-console errors.
* Foundry server logs.
* Whether the installed package is complete.
* Whether all files belong to the same release.
* Whether unrelated modules are interfering.

Test the system in a new world with unrelated modules disabled.

### Anomaly Sheet Does Not Open

Confirm that:

* The Actor type is `character`.
* The console contains `PRISM | Init`.
* The installed package contains:

```text
module/actor-sheet.mjs
templates/actor-character-sheet.hbs
```

* The package was installed as `prism`.
* The system was not partially overwritten with another version.

### Localization Keys Appear Instead of Text

Visible strings such as:

```text
prism.sheet.characterName
```

usually indicate a localization loading problem.

Check:

* The selected Foundry language.
* `lang/en.json`.
* `lang/it.json`.
* The language paths declared in `system.json`.
* Whether Foundry was reloaded after installation or update.

### An Existing World Behaves Differently After Updating

The world may contain data created by an older Alpha version.

Before modifying it further:

1. Create a backup.
2. Review `CHANGELOG.md`.
3. Check the release notes for data changes.
4. Reproduce the behavior in a copied world.
5. Record the previous and current PRISM versions.

---

## Reporting Installation Problems

Use the repository’s Bug Report form for reproducible installation or update problems:

```text
https://github.com/Heldan-oss/PRISM-System/issues/new/choose
```

Before submitting:

* Search existing open and closed Issues.
* Test in a new PRISM world.
* Disable unrelated modules when possible.
* Check the browser console.
* Remove private information from logs and screenshots.

Include:

* PRISM version.
* Foundry VTT version and build.
* Operating system.
* Browser or Foundry desktop client.
* Local, hosted, or remote installation.
* Installation method.
* Steps to reproduce.
* Expected result.
* Actual result.
* Relevant console errors.

Do not publish credentials, access tokens, license keys, private server information, private campaign data, or unauthorized commercial content.

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
