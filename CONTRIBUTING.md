# Contributing to PRISM RPG for Foundry VTT

Thank you for your interest in contributing to **PRISM RPG for Foundry Virtual Tabletop**.

This is an unofficial, community-developed Foundry VTT implementation of PRISM RPG. Contributions are welcome from developers, testers, translators, technical writers, designers, and players.

This document is the authoritative guide for:

* Proposing changes.
* Working with forks and branches.
* Writing commits.
* Submitting Pull Requests.
* Participating in reviews.
* Contributing legally redistributable content.

For the complete project documentation index, see the [README](README.md#documentation).

> [!IMPORTANT]
> This project is unofficial. Contributing to this repository does not grant permission to reproduce or redistribute copyrighted PRISM publications, artwork, commercial assets, or substantial portions of the original rules text.

---

## Table of Contents

* [Ways to Contribute](#ways-to-contribute)
* [Before You Begin](#before-you-begin)
* [Reporting Bugs](#reporting-bugs)
* [Suggesting Features](#suggesting-features)
* [External Contributor Workflow](#external-contributor-workflow)
* [Invited Collaborator Workflow](#invited-collaborator-workflow)
* [Branch Naming](#branch-naming)
* [Commit Messages](#commit-messages)
* [Contribution Requirements](#contribution-requirements)
* [Testing Requirements](#testing-requirements)
* [Pull Request Guidelines](#pull-request-guidelines)
* [Review and Merge Process](#review-and-merge-process)
* [Updating a Pull Request](#updating-a-pull-request)
* [After a Pull Request Is Merged](#after-a-pull-request-is-merged)
* [Licensing of Contributions](#licensing-of-contributions)
* [Community, Support, and Security](#community-support-and-security)

---

## Ways to Contribute

Contributions may include:

* Reporting reproducible bugs.
* Testing Alpha versions.
* Fixing defects.
* Improving the Anomaly sheet.
* Improving tag creation and management.
* Improving the virtual bag workflow.
* Improving chat messages.
* Adding gameplay-support features.
* Improving accessibility or responsive layouts.
* Improving documentation.
* Correcting translations.
* Adding new languages.
* Improving Foundry VTT compatibility.
* Refactoring existing code.

Not every contribution needs to include code.

Clear bug reports, testing results, documentation corrections, screenshots, translation reviews, and focused design proposals are also useful.

---

## Before You Begin

Before starting work:

1. Read the project [README](README.md).
2. Search existing [Issues](https://github.com/Heldan-oss/PRISM-System/issues).
3. Search open and closed [Pull Requests](https://github.com/Heldan-oss/PRISM-System/pulls).
4. Confirm that another contributor is not already working on the same change.
5. Read the documentation relevant to the proposed change.
6. Open an Issue before beginning a large or potentially breaking change.

A preliminary Issue or Discussion is strongly recommended when a contribution:

* Introduces a new gameplay workflow.
* Changes Actor, Item, world, or system data.
* Renames or removes stored properties.
* Changes how tags are represented.
* Changes the virtual bag behavior.
* Changes Foundry VTT compatibility.
* Introduces a new dependency.
* Reorganizes a significant part of the project.
* Adds third-party assets or content.
* May affect existing worlds.

Small spelling corrections and minor documentation improvements generally do not require prior discussion.

Opening an Issue before major work allows the scope and implementation approach to be reviewed before significant effort is invested.

---

## Reporting Bugs

Use the repository’s:

**[Bug Report form](https://github.com/Heldan-oss/PRISM-System/issues/new/choose)**

Search existing open and closed Issues before submitting a new report.

Bug reports should not be submitted as Pull Requests unless the Pull Request already contains a tested correction for a clearly documented problem.

Do not report security vulnerabilities through public Issues. Follow the private process described in [SECURITY.md](SECURITY.md).

---

## Suggesting Features

Use the repository’s:

**[Feature Request form](https://github.com/Heldan-oss/PRISM-System/issues/new/choose)**

Feature requests should describe a concrete problem, gameplay need, or difficult workflow before proposing a technical solution.

Discuss major, breaking, architectural, or data-model changes before beginning implementation.

Submitting a feature request does not guarantee that it will be accepted or implemented. Maintainers may reject, defer, narrow, or reshape proposals based on:

* Project scope.
* Technical risk.
* Foundry VTT compatibility.
* Data compatibility.
* Maintainability.
* Legal restrictions.
* Available development resources.

---

# External Contributor Workflow

External contributors should work from a fork and submit changes through a Pull Request.

The protected `main` branch does not accept direct community pushes.

## 1. Fork the Repository

Open:

```text
https://github.com/Heldan-oss/PRISM-System
```

Select **Fork** and create a copy under your GitHub account.

Your fork will normally be available at:

```text
https://github.com/YOUR-USERNAME/PRISM-System
```

---

## 2. Clone Your Fork

Replace `YOUR-USERNAME` with your GitHub username:

```bash
git clone https://github.com/YOUR-USERNAME/PRISM-System.git
cd PRISM-System
```

---

## 3. Add the Original Repository as `upstream`

Your fork is normally configured as `origin`.

Add the original repository as `upstream`:

```bash
git remote add upstream https://github.com/Heldan-oss/PRISM-System.git
```

Verify the remotes:

```bash
git remote -v
```

Expected structure:

```text
origin    https://github.com/YOUR-USERNAME/PRISM-System.git
upstream  https://github.com/Heldan-oss/PRISM-System.git
```

---

## 4. Synchronize `main`

Before starting new work:

```bash
git checkout main
git fetch upstream
git pull --ff-only upstream main
git push origin main
```

Do not implement changes directly on `main`.

---

## 5. Create a Dedicated Branch

Create a branch from the updated `main` branch:

```bash
git checkout -b feature/short-description
```

Examples:

```bash
git checkout -b feature/improve-tag-draw
```

```bash
git checkout -b bugfix/prevent-empty-tags
```

```bash
git checkout -b docs/update-installation-guide
```

Each branch should address one coherent change.

---

## 7. Commit Your Changes

Stage only the relevant files:

```bash
git add path/to/file
```

Create a clear commit:

```bash
git commit -m "feat: improve virtual bag draw workflow"
```

Multiple focused commits are acceptable.

Avoid temporary messages such as:

```text
fix
test
updates
final version
really final
```

The repository normally uses squash merging, so accepted Pull Request commits may be combined into one commit on `main`.

---

## 8. Synchronize Before Opening the Pull Request

Fetch the latest upstream changes:

```bash
git fetch upstream
git rebase upstream/main
```

Resolve any conflicts locally and test the system again.

When a previously pushed branch has been rebased, update the fork with:

```bash
git push --force-with-lease origin YOUR-BRANCH-NAME
```

Use `--force-with-lease`, not `--force`.

Never force-push to the original repository’s `main` branch.

---

## 9. Push Your Branch

```bash
git push -u origin YOUR-BRANCH-NAME
```

Example:

```bash
git push -u origin feature/improve-tag-draw
```

---

## 10. Open a Pull Request

Create the Pull Request using:

```text
Base repository: Heldan-oss/PRISM-System
Base branch: main

Head repository: YOUR-USERNAME/PRISM-System
Compare branch: YOUR-BRANCH-NAME
```

Complete the Pull Request template and provide enough information for maintainers to understand, test, and review the change.

---

# Invited Collaborator Workflow

Invited collaborators with repository Write or Maintain access may clone the original repository directly:

```bash
git clone https://github.com/Heldan-oss/PRISM-System.git
cd PRISM-System
```

They must still:

1. Update `main`.
2. Create a dedicated branch.
3. Push the branch.
4. Open a Pull Request.
5. Wait for the required approval.
6. Resolve all blocking review conversations.

Example:

```bash
git checkout main
git pull origin main
git checkout -b feature/improve-anomaly-sheet
git push -u origin feature/improve-anomaly-sheet
```

Write or Maintain access does not authorize direct pushes to `main`.

The normal Pull Request workflow applies to maintainers and collaborators unless a repository administrator uses an emergency bypass.

---

# Branch Naming

Use lowercase branch names with hyphens between words.

| Prefix      | Purpose                     |
| ----------- | --------------------------- |
| `feature/`  | New functionality           |
| `bugfix/`   | Bug correction              |
| `hotfix/`   | Urgent correction           |
| `docs/`     | Documentation               |
| `i18n/`     | Localization or translation |
| `refactor/` | Internal restructuring      |
| `test/`     | Testing changes             |
| `chore/`    | Maintenance or tooling      |

Examples:

```text
feature/add-tag-preview
bugfix/fix-chat-result
hotfix/prevent-data-loss
docs/update-user-guide
i18n/add-french-localization
refactor/simplify-bag-service
test/add-tag-utility-tests
chore/update-development-tools
```

Avoid vague names such as:

```text
new-stuff
test123
final
my-branch
```

---

# Commit Messages

Use concise and descriptive commit messages.

Recommended format:

```text
type: short description
```

| Type       | Purpose                                           |
| ---------- | ------------------------------------------------- |
| `feat`     | New functionality                                 |
| `fix`      | Bug correction                                    |
| `docs`     | Documentation                                     |
| `refactor` | Internal change without intended behavior changes |
| `style`    | Visual or formatting change                       |
| `i18n`     | Localization                                      |
| `test`     | Testing                                           |
| `chore`    | Maintenance, dependencies, or tooling             |
| `perf`     | Performance improvement                           |

Examples:

```text
feat: add tag selection preview
fix: prevent duplicate tags in the virtual bag
docs: document manual installation
refactor: extract chat message builder
style: improve anomaly sheet spacing
i18n: add missing Italian labels
test: cover empty bag validation
chore: update development tools
```

Avoid:

```text
Updated files
Various fixes
Work in progress
Fixed everything
```

---

# Contribution Requirements

Every contribution must follow these essential rules:

* Keep the change focused on one primary purpose.
* Follow the existing project structure and conventions.
* Avoid unrelated refactoring or formatting.
* Explain significant architectural changes.
* Do not hard-code user-facing text that should be localized.
* Update documentation when behavior changes.
* Document changes to stored data.
* Explain any new dependency.
* Remove temporary debugging code.
* Do not expose private or sensitive data.
* Do not submit content that cannot legally be redistributed.

Detailed architecture, coding, debugging, and data-management requirements belong in:

**[Development Guide](docs/DEVELOPMENT.md)**

Localization-specific rules belong in:

**[Localization Guide](docs/LOCALIZATION.md)**

---

## Focused Changes

A Pull Request should solve one primary problem.

Good scope:

```text
Prevent empty tags from being added to the virtual bag.
```

Poor scope:

```text
Rewrite the virtual bag, redesign the Anomaly sheet, rename stored data,
change every translation, and reorganize unrelated documentation.
```

Large changes should be divided into smaller Pull Requests when practical.

Avoid reformatting an entire file while changing a small piece of behavior. Formatting-only changes should normally be submitted separately.

---

## User-Facing Changes

When adding or changing user-facing behavior:

* Use the localization system.
* Update English and Italian when applicable.
* Check labels and messages inside the actual interface.
* Include screenshots for meaningful visual changes.
* Consider keyboard navigation and accessibility.
* Document incomplete translations or known interface limitations.

The detailed localization process is documented in [`docs/LOCALIZATION.md`](docs/LOCALIZATION.md).

---

## Data Changes

Changes to Actor, Item, world, or system data must be clearly documented.

The Pull Request must explain:

* Which properties are added.
* Which properties are changed.
* Which properties are renamed or removed.
* Whether existing worlds are affected.
* Whether a migration is required.
* Whether the change is backward compatible.
* How the behavior was tested.

Do not silently rename or remove stored properties.

During Alpha development, data structures may change, but the effects of those changes must still be documented.

---

## Dependencies

Do not add a new runtime or development dependency without explaining:

* Why it is needed.
* Why the existing project cannot provide the same behavior.
* Its license.
* Its maintenance status.
* Its effect on package size or packaging.
* Its security implications.

Avoid adding dependencies for trivial functionality.

---

## Assets and Third-Party Content

Contributors must have the legal right to submit every included file.

Do not submit:

* Scans or copies of the PRISM rulebook.
* Commercial PDF content.
* Substantial portions of published rules text.
* Published artwork without permission.
* Proprietary layouts.
* Unauthorized logos.
* Fonts without redistribution rights.
* Assets extracted from paid products.
* Code or assets copied from another Foundry package without permission.

Third-party content must include:

* Author or rights-holder.
* Source.
* License.
* Required attribution.
* Confirmation that redistribution is permitted.

The maintainers may reject or remove content whose licensing status is unclear.

---

# Testing Requirements

Until automated checks are introduced, contributors are responsible for meaningful manual testing.

Before opening a Pull Request:

* Confirm that the PRISM system loads in Foundry VTT.
* Test the affected workflow.
* Test relevant empty or invalid states.
* Check the browser developer console.
* Test with unrelated modules disabled when possible.
* Test English and Italian when user-facing text changes.
* Verify existing data when the change affects Actor, Item, or world data.
* Reload Foundry VTT and repeat the affected operation.

Do not mark an untested change as tested.

Complete setup, testing, and debugging instructions belong in the [Development Guide](docs/DEVELOPMENT.md).

---

# Pull Request Guidelines

## Pull Request Title

Use the same style as commit messages:

```text
feat: improve virtual bag draw workflow
```

```text
fix: prevent empty tags from being selected
```

```text
docs: add manual installation instructions
```

---

## Pull Request Description

Use the repository’s Pull Request template.

The description must provide enough information to understand:

* What changed.
* Why the change is needed.
* How it was implemented.
* How it was tested.
* Whether stored data is affected.
* Whether migration is required.
* Whether documentation or localization was updated.
* Any known limitations.

When the Pull Request completely resolves an Issue, include:

```text
Closes #123
```

Use `Closes`, `Fixes`, or `Resolves` only when the Issue is fully addressed.

---

## Minimum Review Checklist

Before requesting review, confirm that:

* The change has a focused scope.
* The branch was created from an updated `main`.
* The system loads successfully.
* The affected workflow was tested.
* Documentation and localization were updated when required.
* No temporary, private, generated, or unauthorized content is included.

The complete submission checklist is included automatically in the Pull Request template.

---

## Draft Pull Requests

Use a Draft Pull Request when:

* The implementation is incomplete.
* Early architectural feedback is needed.
* Testing is still pending.
* A migration requires discussion.
* The work is too large to review only after completion.

Mark the Pull Request as ready for review only when it is complete enough to evaluate and test.

---

# Review and Merge Process


Pull Requests require approval from an authorized repository maintainer before merging into the main.

Review may include:

* Questions about implementation choices.
* Requests for code changes.
* Requests for additional tests.
* Requests for documentation.
* Requests for localization updates.
* Requests to reduce the scope.
* Requests to resolve merge conflicts.
* Requests to remove unauthorized content.

All blocking review conversations must be resolved before merge.

New commits may invalidate an earlier approval and require another review.

External contributors cannot approve and merge their own changes into `main`.

Accepted Pull Requests are normally merged using **squash merging**.

Example final commit:

```text
feat: add virtual tag bag workflow (#42)
```

Merge commits and rebase merges are not part of the normal repository workflow.

Direct pushes and force pushes to `main` are blocked by repository rules.

---

# Updating a Pull Request

When changes are requested:

1. Modify the same branch.
2. Test the updated behavior.
3. Commit the changes.
4. Push the branch again.

Example:

```bash
git add .
git commit -m "fix: address pull request review"
git push
```

The existing Pull Request updates automatically.

Do not open a new Pull Request for every review revision.

When the target branch has changed significantly:

```bash
git fetch upstream
git rebase upstream/main
```

After resolving conflicts:

```bash
git push --force-with-lease origin YOUR-BRANCH-NAME
```

Resolve review conversations only after the concern has been addressed or an agreement has been reached.

---

# After a Pull Request Is Merged

Update your local fork:

```bash
git checkout main
git fetch upstream
git pull --ff-only upstream main
git push origin main
```

Delete the completed local branch:

```bash
git branch -d YOUR-BRANCH-NAME
```

Delete the remote branch:

```bash
git push origin --delete YOUR-BRANCH-NAME
```

Begin each new contribution from an updated `main` branch.

---

# Licensing of Contributions

The repository source code is licensed under the terms described in [`LICENSE`](LICENSE).

By submitting a contribution, you confirm that:

* You created the contribution or have the legal right to submit it.
* The contribution may be distributed under the repository license.
* The contribution does not knowingly contain unauthorized third-party material.
* Required notices and attributions have been provided.
* An accepted contribution may be modified and redistributed under the repository license.

The repository license applies to the submitted software contribution. It does not transfer ownership of PRISM RPG, Foundry Virtual Tabletop, or third-party intellectual property.

---

# Community, Support, and Security

## Security

Do not report security vulnerabilities through public Issues.

Follow the private reporting process described in:

**[Security Policy](SECURITY.md)**

## Questions and Support

For questions that are not reproducible bugs or concrete feature requests, consult:

* [GitHub Discussions](https://github.com/Heldan-oss/PRISM-System/discussions)
* [GitHub Issues](https://github.com/Heldan-oss/PRISM-System/issues)

Thank you for helping improve PRISM RPG for Foundry Virtual Tabletop.
