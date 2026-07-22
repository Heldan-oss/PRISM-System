# Security Policy

## Overview

The security of **PRISM RPG for Foundry Virtual Tabletop** is taken seriously.

This document explains:

* Which versions currently receive security-related fixes.
* Which problems should be reported privately.
* How to submit a security report.
* What information should be included.
* What reporters can expect after submitting a report.
* Which problems should instead be reported as ordinary bugs.

> [!IMPORTANT]
> PRISM RPG for Foundry VTT is currently an Alpha project maintained on a best-effort basis. Security reports are welcome, but response and remediation times cannot be guaranteed.

---

## Supported Versions

The project is currently under active Alpha development.

| Version                             | Security support          |
| ----------------------------------- | ------------------------- |
| Latest published release            | Best-effort support       |
| Current `main` branch               | Best-effort investigation |
| Older Alpha releases                | Not normally supported    |
| Development or feature branches     | Not supported             |
| Modified forks or unofficial builds | Not supported             |

Security fixes will normally target:

1. The current development version.
2. The latest published release, when a release exists and a compatible fix is practical.

Older versions may remain vulnerable after a correction is released.

Users should update to the latest supported version and review release notes before upgrading an existing world.

---

## Reporting a Vulnerability

Do **not** report security vulnerabilities through public GitHub Issues, Discussions, Pull Requests, comments, or other public channels.

Use GitHub’s private vulnerability reporting system:

[Report a security vulnerability privately](https://github.com/Heldan-oss/PRISM-System/security/advisories/new)

A private report allows maintainers and reporters to discuss the issue without immediately disclosing technical details publicly.

If private vulnerability reporting is temporarily unavailable, open a public Issue containing only a request for a private security contact.

Do not include:

* Vulnerability details.
* Exploit code.
* Screenshots containing sensitive data.
* Credentials or access tokens.
* Private campaign information.
* Instructions that could be used to exploit affected users.

---

## What Should Be Reported Privately

A problem should be reported privately when it could reasonably affect the confidentiality, integrity, or availability of a Foundry VTT installation, its users, or its stored data.

When uncertain whether a problem has security implications, report it privately first.

---

## What Is Usually Not a Security Vulnerability

The following problems should normally use the public Bug Report form:

* Visual defects.
* Incorrect spacing, colors, or layout.
* Translation errors.
* Broken labels or missing localization keys.
* Ordinary JavaScript errors without a security impact.
* A sheet failing to render.
* Incorrect tag selection or drawing behavior.
* Chat formatting problems.
* Gameplay-rule errors.
* Installation problems that do not expose sensitive information.
* Compatibility problems with a Foundry VTT version.
* Performance problems that cannot be intentionally exploited.
* Data migration defects that affect only the reporting user’s own backup or test data.
* Feature requests.
* General support questions.

Public bug reports can be submitted through:

[GitHub Issues](https://github.com/Heldan-oss/PRISM-System/issues/new/choose)

If an apparently ordinary bug is later found to have security implications, maintainers may move further discussion to a private security advisory.

---

## Information to Include

A useful security report should include as much of the following information as possible.

### Summary

Provide a concise explanation of the vulnerability and its possible impact.

### Affected Version

Include:

* PRISM system version.
* Foundry VTT version and build.
* Browser or Foundry desktop client.
* Operating system.
* Relevant enabled modules.

### Vulnerability Type

Describe the general category, such as:

* Permission bypass.
* Unauthorized data access.
* Code execution.
* Sensitive-data exposure.
* Unsafe dependency.
* Package or update compromise.

### Reproduction Steps

Provide a complete sequence that allows maintainers to reproduce the problem in a controlled test environment.

Include:

1. Required user role.
2. Required Actor, Item, world, or system state.
3. Relevant configuration.
4. Exact actions or requests.
5. Observed result.

### Expected Security Boundary

Explain which permission, restriction, validation, or trust boundary should have prevented the behavior.


---

## Sensitive Information

Before submitting logs, screenshots, exports, databases, or other files, remove:

* Foundry license keys.
* Passwords.
* Session cookies.
* Authentication tokens.
* API keys.
* Webhook URLs.
* Private server addresses.
* Personal information.
* Private campaign content.
* Commercial PRISM materials.
* Data belonging to other users.

Do not upload an entire Foundry user-data directory or world unless specifically requested through the private advisory and carefully reviewed first.

Use synthetic or test data whenever possible.

---

## Report Handling Process

Security reports are handled on a best-effort basis.

The expected process is:

1. The report is received privately.
2. A maintainer reviews whether the issue is reproducible and security-relevant.
3. Additional information may be requested.
4. The impact and affected versions are evaluated.
5. A correction or mitigation is developed when practical.
6. The correction is tested.
7. A release or update is prepared when necessary.
8. Public disclosure may occur after a correction or mitigation is available.

A submitted report may be closed when:

* It cannot be reproduced.
* It does not present a security risk.
* It affects only an unsupported or modified version.
* It is caused entirely by another project or module.
* It requires behavior outside the project’s intended threat model.
* It lacks enough information to investigate after clarification has been requested.
* The reported behavior is already documented and accepted.

No specific acknowledgement, correction, release, or disclosure timeline is guaranteed.

---
---

## Security Research Expectations

Security testing must be conducted responsibly.

Do not:

* Test systems you do not own or have explicit permission to assess.
* Access, modify, download, or delete another person’s data.
* Disrupt public or production Foundry instances.
* Use social engineering.
* Attempt credential theft.
* Introduce malware.
* Persist access after confirming a vulnerability.
* Perform destructive testing.
* Publish vulnerability details before coordination.

Testing should use a local or explicitly authorized Foundry VTT environment with disposable test data.

This policy does not authorize activity that would otherwise be unlawful or violate third-party terms, licenses, or acceptable-use policies.

---

## Bug Bounty

This project does not currently operate a paid bug-bounty program.

Submitting a report does not create an entitlement to:

* Payment.
* Compensation.
* Merchandise.
* Public credit.
* A specific response time.
* A specific correction timeline.

Responsible reports are nevertheless appreciated.

---

## Security Updates

Security-related changes may be distributed through:

* A new GitHub release.
* An updated Foundry VTT system package.
* A corrected manifest.
* A commit to the `main` branch.
* A GitHub Security Advisory.
* Release notes or upgrade instructions.

Users should:

* Keep Foundry VTT and the PRISM system updated.
* Install systems and modules only from trusted sources.
* Review update information before upgrading.
* Back up world and user data.
* Restrict administrator access.
* Avoid installing unknown or modified packages in production environments.

---

## Scope of This Policy

This policy applies to the source code and release artifacts maintained in:

[Heldan-oss/PRISM-System](https://github.com/Heldan-oss/PRISM-System)

It does not provide security support for:

* The original PRISM RPG.
* Foundry Virtual Tabletop itself.
* Third-party Foundry modules.
* Modified forks.
* Unofficial distributions.
* Hosting providers.
* User-created macros.
* Custom world scripts.
* Third-party integrations not maintained by this repository.

---

## Related Documents

* [README](README.md)
* [Contributing Guidelines](CONTRIBUTING.md)
* [License](LICENSE)

Thank you for reporting security problems responsibly.
