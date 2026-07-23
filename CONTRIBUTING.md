# Contributing to PRISM RPG for Foundry VTT

Thank you for your interest in contributing to **PRISM RPG for Foundry Virtual Tabletop**.

This is an unofficial, fan-made Foundry VTT implementation of PRISM RPG. Contributions are welcome from developers, testers, translators, technical writers, designers, and players.

This document explains how to:

* Report bugs.
* Propose features.
* Work with Issues and Discussions.
* Create branches.
* Submit Pull Requests.
* Test changes.
* Participate in review.
* Contribute legally redistributable content.

For the complete documentation index, see the [README](README.md#documentation).

> [!IMPORTANT]
> Contributions must not reproduce or redistribute copyrighted PRISM publications, commercial artwork, proprietary layouts, unauthorized fonts, or substantial portions of the original rules text.

---

## Table of Contents

* [Ways to Contribute](#ways-to-contribute)
* [Issues, Discussions, and Planning](#issues-discussions-and-planning)
* [Reporting Bugs](#reporting-bugs)
* [Suggesting Features](#suggesting-features)
* [Before Starting Work](#before-starting-work)
* [External Contributor Workflow](#external-contributor-workflow)
* [Invited Collaborator Workflow](#invited-collaborator-workflow)
* [Branch Naming](#branch-naming)
* [Commit Messages](#commit-messages)
* [Contribution Requirements](#contribution-requirements)
* [Testing](#testing)
* [Pull Requests](#pull-requests)
* [Review and Merge](#review-and-merge)
* [After Merge](#after-merge)
* [Release Responsibilities](#release-responsibilities)
* [Licensing and Third-Party Content](#licensing-and-third-party-content)
* [Community and Security](#community-and-security)

---

## Ways to Contribute

Contributions may include:

* Reporting reproducible bugs.
* Proposing focused features.
* Testing Alpha releases.
* Fixing defects.
* Improving the Anomaly sheet.
* Improving Traits, Adversities, Fear, Danger, or Signs.
* Improving virtual-bag behavior.
* Improving chat messages.
* Improving accessibility.
* Improving documentation.
* Correcting translations.
* Adding new languages.
* Improving Foundry compatibility.
* Refactoring focused areas of the code.
* Improving development or release tooling.

Not every contribution requires code.

Useful contributions also include:

* Clear reproduction steps.
* Test results.
* Screenshots.
* Translation reviews.
* Documentation corrections.
* Focused technical analysis.

---

## Issues, Discussions, and Planning

### Issues

Use Issues for concrete work that can be implemented, tested, and completed.

Examples:

* A reproducible bug.
* A defined feature.
* A documentation change.
* A localization change.
* A focused refactor.
* A compatibility improvement.

### Discussions

Use [GitHub Discussions](https://github.com/Heldan-oss/PRISM-System/discussions) for:

* General questions.
* Installation help.
* Community support.
* Early ideas.
* Proposals whose behavior is not yet defined.
* Architectural or gameplay discussions requiring feedback.

Once a Discussion produces a clear and actionable result, create or link a corresponding Issue.

### Project and Milestones

The maintainers use the GitHub Project and milestones to plan work.

Contributors do not need to create duplicate Project items.

Normally:

1. Create or identify the repository Issue.
2. A maintainer adds it to the Project.
3. A maintainer assigns a milestone when the work is planned for a release.
4. The Issue moves through the Project as work progresses.

A milestone is planning information. It does not create a branch or publish a release.

Do not assign a version or milestone to a contribution without maintainer agreement.

---

## Reporting Bugs

Use the repository’s Bug Report form:

```text
https://github.com/Heldan-oss/PRISM-System/issues/new/choose
```

A bug is a reproducible case where existing functionality does not behave as intended.

Examples:

* The Anomaly sheet does not open.
* Actor data is lost.
* A draw produces the wrong result.
* A localization key appears instead of text.
* A supported workflow throws a JavaScript error.
* The release manifest or package cannot be installed.

Before reporting:

* Search open and closed Issues.
* Test in a new PRISM world.
* Disable unrelated modules when possible.
* Record the PRISM and Foundry versions.
* Check the browser console.
* Remove private data from logs and screenshots.

Do not use a public Issue for an exploitable security vulnerability. Follow [`SECURITY.md`](SECURITY.md).

---

## Suggesting Features

Use the Feature Request form:

```text
https://github.com/Heldan-oss/PRISM-System/issues/new/choose
```

A feature request covers:

* New gameplay behavior.
* A missing mechanic.
* An improvement to an existing workflow.
* Interface or styling improvements.
* New content support.
* Localization.
* Documentation.
* Development tooling.

Describe:

* The current problem or limitation.
* The expected user behavior.
* The relevant gameplay context.
* Suggested completion criteria, when known.

Use a Discussion first when the proposal:

* Is still vague.
* Has several competing solutions.
* Changes the data model significantly.
* Introduces a breaking workflow.
* Requires broad community feedback.
* Involves uncertain content or licensing rights.

Submitting a feature request does not guarantee implementation.

Maintainers may:

* Accept it.
* Narrow its scope.
* Split it into smaller Issues.
* Defer it.
* Assign it to another release.
* Reject it when it is outside project scope.

---

## Before Starting Work

Before implementing a contribution:

1. Read the [README](README.md).
2. Search existing [Issues](https://github.com/Heldan-oss/PRISM-System/issues).
3. Search existing [Pull Requests](https://github.com/Heldan-oss/PRISM-System/pulls).
4. Confirm that the work is not already in progress.
5. Read the relevant documentation.
6. Comment on or create the related Issue.
7. Wait for scope confirmation when the change is large or risky.

Prior approval is strongly recommended when a change:

* Adds a gameplay mechanic.
* Changes Actor data.
* Changes virtual-bag rules.
* Changes Foundry compatibility.
* Introduces a dependency.
* Adds a compendium.
* Adds third-party content.
* Changes installation or packaging.
* Requires data migration.
* Reorganizes a significant part of the codebase.

Minor spelling and documentation corrections usually do not require prior discussion.

---

## External Contributor Workflow

External contributors should work from a fork.

The protected `main` branch does not accept direct community pushes.

### 1. Fork and Clone

Fork:

```text
https://github.com/Heldan-oss/PRISM-System
```

Clone your fork:

```bash
git clone https://github.com/YOUR-USERNAME/PRISM-System.git
cd PRISM-System
```

### 2. Add the Original Repository

```bash
git remote add upstream https://github.com/Heldan-oss/PRISM-System.git
git remote -v
```

Expected remotes:

```text
origin    https://github.com/YOUR-USERNAME/PRISM-System.git
upstream  https://github.com/Heldan-oss/PRISM-System.git
```

### 3. Synchronize `main`

```bash
git checkout main
git fetch upstream
git pull --ff-only upstream main
git push origin main
```

Do not implement changes directly on `main`.

### 4. Create a Branch

```bash
git checkout -b feature/short-description
```

Examples:

```bash
git checkout -b feature/add-bag-validation
git checkout -b bugfix/fix-empty-draw
git checkout -b docs/update-readme
git checkout -b i18n/update-italian-labels
```

Each branch should address one coherent change.

### 5. Commit and Push

Stage relevant files:

```bash
git add path/to/file
```

Commit:

```bash
git commit -m "feat: add virtual bag validation"
```

Push:

```bash
git push -u origin feature/add-bag-validation
```

### 6. Open a Pull Request

Use:

```text
Base repository: Heldan-oss/PRISM-System
Base branch: main

Head repository: YOUR-USERNAME/PRISM-System
Compare branch: YOUR-BRANCH-NAME
```

Complete the Pull Request template.

When the Pull Request fully resolves an Issue, include:

```text
Closes #123
```

---

## Invited Collaborator Workflow

Collaborators with Write or Maintain access may clone the original repository directly:

```bash
git clone https://github.com/Heldan-oss/PRISM-System.git
cd PRISM-System
```

They must still:

1. Update `main`.
2. Create a dedicated branch.
3. Push the branch.
4. Open a Pull Request.
5. Obtain the required approval.
6. Resolve blocking conversations.

Example:

```bash
git checkout main
git pull --ff-only origin main
git checkout -b feature/improve-anomaly-sheet
git push -u origin feature/improve-anomaly-sheet
```

Write access does not authorize direct pushes to `main`.

---

## Branch Naming

Use lowercase names with hyphens.

| Prefix      | Purpose                        |
| ----------- | ------------------------------ |
| `feature/`  | New functionality              |
| `bugfix/`   | Bug correction                 |
| `hotfix/`   | Urgent production correction   |
| `docs/`     | Documentation                  |
| `i18n/`     | Localization                   |
| `refactor/` | Internal restructuring         |
| `test/`     | Tests or test tooling          |
| `chore/`    | Maintenance                    |
| `release/`  | Maintainer release preparation |

Examples:

```text
feature/add-bag-limits
bugfix/fix-chat-label
hotfix/prevent-data-loss
docs/update-installation
i18n/add-french
refactor/extract-draw-service
test/add-bag-tests
chore/update-workflows
```

The `release/` prefix is reserved for maintainer-led release preparation.

Avoid vague names:

```text
new-stuff
changes
test123
final
my-branch
```

---

## Commit Messages

Recommended format:

```text
type: short description
```

| Type       | Purpose                     |
| ---------- | --------------------------- |
| `feat`     | New functionality           |
| `fix`      | Bug correction              |
| `docs`     | Documentation               |
| `refactor` | Internal restructuring      |
| `style`    | Visual or formatting change |
| `i18n`     | Localization                |
| `test`     | Tests                       |
| `chore`    | Maintenance or release work |
| `perf`     | Performance improvement     |

Examples:

```text
feat: enforce virtual bag composition limits
fix: preserve inventory values before drawing
docs: update manifest installation steps
style: improve anomaly sheet spacing
i18n: revise English bag messages
refactor: extract bag validation
chore: prepare release 0.2.0
```

Avoid:

```text
Updates
Various fixes
Work in progress
Final version
Fixed everything
```

The repository normally uses squash merging, so Pull Request commits may be combined into one commit on `main`.

---

## Contribution Requirements

Every contribution must:

* Address one primary problem.
* Follow the current repository structure.
* Avoid unrelated formatting and refactoring.
* Use existing Foundry document-update patterns.
* Validate user-controlled values.
* Preserve existing data unless a documented change is required.
* Localize user-facing text.
* Update documentation when behavior changes.
* Remove temporary debugging output.
* Avoid exposing private information.
* Avoid unauthorized third-party material.

Detailed architecture and data rules are documented in:

```text
docs/DEVELOPMENT.md
```

Localization rules are documented in:

```text
docs/LOCALIZATION.md
```

### User-Facing Changes

When changing the interface:

* Update English and Italian.
* Test translated labels.
* Include screenshots for meaningful visual changes.
* Preserve keyboard focus.
* Consider contrast and text size.
* Avoid communicating state through color alone.

### Data Changes

A data-changing Pull Request must explain:

* Added properties.
* Changed properties.
* Removed or renamed properties.
* Existing-world impact.
* Migration behavior.
* Backward compatibility.
* Testing performed.

Do not silently rename or delete stored fields.

### Changelog

Add notable changes under:

```md
## [Unreleased]
```

Use an appropriate category:

```md
### Added
### Changed
### Fixed
### Removed
### Security
```

Do not create the final versioned changelog section unless the Pull Request is specifically preparing a release.

Do not include internal changes that have no meaningful user, contributor, compatibility, or security impact.

### Dependencies

A new dependency requires an explanation of:

* Purpose.
* License.
* Maintenance status.
* Security implications.
* Package-size impact.
* Build impact.
* Contributor impact.

Avoid dependencies for trivial behavior.

---

## Testing

Manual testing is required until automated checks are introduced.

Before requesting review:

* Confirm that the system loads.
* Test the affected workflow.
* Test invalid and boundary states.
* Check the browser console.
* Test with unrelated modules disabled when possible.
* Test English and Italian when visible text changes.
* Test existing Actor data when stored data changes.
* Reload Foundry and repeat the workflow.
* Record the Foundry version and build.

Do not claim that a change was tested when it was not.

Use a dedicated test world rather than an important campaign.

Detailed testing procedures are in [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md).

---

## Pull Requests

### Title

Use the commit-message style:

```text
feat: enforce virtual bag limits
fix: prevent invalid bag entries
docs: update release instructions
```

### Description

Complete the Pull Request template.

Explain:

* What changed.
* Why it is needed.
* How it works.
* How it was tested.
* Whether data changed.
* Whether migration is required.
* Whether documentation changed.
* Whether localization changed.
* Known limitations.

Link the relevant Issue:

```text
Closes #123
```

Use `Closes`, `Fixes`, or `Resolves` only when the Issue is fully addressed.

### Scope

Good scope:

```text
Prevent duplicate Traits from being added to the virtual bag.
```

Poor scope:

```text
Rewrite the bag, redesign the sheet, change the data model,
update every translation, and reorganize documentation.
```

Split large work into smaller Pull Requests when practical.

### Draft Pull Requests

Use a Draft Pull Request when:

* The implementation is incomplete.
* Early feedback is needed.
* Testing is pending.
* A migration needs review.
* The work is too large to review only after completion.

Mark it ready only when it can be meaningfully reviewed and tested.

---

## Review and Merge

Pull Requests targeting `main` require approval from an authorized maintainer.

Review may request:

* Code changes.
* Additional validation.
* Additional tests.
* Documentation updates.
* Localization updates.
* Reduced scope.
* Conflict resolution.
* Removal of unauthorized content.

All blocking conversations must be resolved before merge.

Accepted Pull Requests are normally merged through **squash merge**.

Example final commit:

```text
feat: enforce virtual bag limits (#42)
```

Direct pushes and force pushes to `main` are blocked by repository rules.

An external contributor cannot approve and merge their own change.

---

## Updating a Pull Request

Apply review changes to the same branch:

```bash
git add .
git commit -m "fix: address review feedback"
git push
```

The existing Pull Request updates automatically.

When `main` has changed significantly:

```bash
git fetch upstream
git rebase upstream/main
```

After rebasing a fork branch:

```bash
git push --force-with-lease origin YOUR-BRANCH-NAME
```

Use `--force-with-lease`, not `--force`.

Do not open a new Pull Request for each review revision.

---

## After Merge

External contributors should synchronize their fork:

```bash
git checkout main
git fetch upstream
git pull --ff-only upstream main
git push origin main
```

Delete the local branch:

```bash
git branch -d YOUR-BRANCH-NAME
```

Delete the remote branch:

```bash
git push origin --delete YOUR-BRANCH-NAME
```

Start each contribution from an updated `main`.

---

## Release Responsibilities

Publishing releases is reserved for repository maintainers.

A normal contribution should not:

* Change `prism/system.json` version.
* Change the version-specific `download` URL.
* Create a release branch.
* Create a Git tag.
* Upload `prism.zip`.
* Upload the release `system.json`.
* Publish a GitHub Release.
* Close a release milestone.

Exceptions require explicit maintainer instruction.

Maintainer release preparation includes:

* Finalizing `CHANGELOG.md`.
* Updating the manifest version and download URL.
* Validating compatibility.
* Packaging `prism.zip`.
* Uploading release assets.
* Publishing the tag and Release.
* Testing installation from the public manifest.

The complete release procedure is documented in [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md#release-process).

---

## Licensing and Third-Party Content

The repository software is licensed under [`LICENSE`](LICENSE).

By submitting a contribution, you confirm that:

* You created it or have the right to submit it.
* It may be distributed under the repository license.
* It does not contain unauthorized third-party material.
* Required attribution is included.
* It may be modified and redistributed if accepted.

Do not submit:

* Scans of PRISM publications.
* Commercial PDF content.
* Substantial published rules text.
* Unauthorized artwork.
* Proprietary layouts.
* Unauthorized logos.
* Fonts without redistribution rights.
* Assets extracted from paid products.
* Code copied from another package without permission.

Third-party material must identify:

* Author or rights-holder.
* Source.
* License.
* Required attribution.
* Redistribution permission.

Public availability does not automatically grant redistribution rights.

---

## Community and Security

### Questions and Support

Use [GitHub Discussions](https://github.com/Heldan-oss/PRISM-System/discussions) for:

* General questions.
* Installation help.
* Community discussion.
* Ideas that are not yet actionable.

Use [GitHub Issues](https://github.com/Heldan-oss/PRISM-System/issues) for:

* Reproducible bugs.
* Concrete feature requests.
* Defined technical work.

### Security

Do not report security vulnerabilities through public Issues or Discussions.

Follow the private reporting process in [`SECURITY.md`](SECURITY.md).
