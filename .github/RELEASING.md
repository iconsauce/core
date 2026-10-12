# Releasing @iconsauce/core

Internal notes for maintainers. This file is not part of the npm package.

Releases are automated with [semantic-release](https://semantic-release.gitbook.io/) by
[`release.yml`](workflows/release.yml) on every push to `main`. Nothing release-related lives in the
repository: the toolchain is installed and configured at runtime by the workflow.

## Versioning

The next version is computed from the [conventional commits](https://www.conventionalcommits.org/)
since the last tag:

| Commit                                             | Release |
| -------------------------------------------------- | ------- |
| `fix: ...`                                         | patch   |
| `feat: ...`                                        | minor   |
| `feat!: ...` or a `BREAKING CHANGE:` footer        | major   |
| `chore`, `docs`, `ci`, `refactor`, `test`, `build` | none    |

Never bump the version in `package.json` by hand: the pipeline commits it as
`chore(release): <version>`. Renovate updates follow the same rule, a `fix(deps)` ships a patch
release, a `chore(deps)` ships nothing.

## What a push to `main` does

1. Build and tests on Ubuntu and Windows ([`test.yml`](workflows/test.yml)).
2. semantic-release computes the version, commits the bump of `package.json` and
   `package-lock.json`, tags it `v<version>` and creates the GitHub release with the generated notes.
3. The GitHub release triggers [`main.yml`](workflows/main.yml): tests again on the tag, then
   `npm publish` with npm trusted publishing (OIDC). A release created by hand from the GitHub UI
   publishes the same way.

The push of the `chore(release)` commit is skipped by the release workflow, so no loop.

## Repository requirements

- Secret `RELEASE_PUSH_TOKEN`: a fine-grained personal access token of a user in the bypass list
  of the `main` ruleset, scoped to this repository with **Contents: read and write** only. The
  default workflow token cannot be used: the ruleset requires the status checks on every push to
  `main`, a commit pushed directly can never carry them and `github-actions[bot]` cannot bypass
  rules. The token also makes the GitHub release start `main.yml`, which events created by the
  workflow token never do. The `iconsauce` organization rejects fine-grained tokens with a lifetime
  longer than 366 days, so create it with at most one year of validity and rotate it before it
  expires.
- npm trusted publishing configured on npmjs.com for this repository and the workflow `main.yml`.

## Updating the release toolchain

The versions are pinned in the `env` of the `release` job of [`release.yml`](workflows/release.yml)
(`SEMANTIC_RELEASE_VERSION`, `SR_GIT_VERSION`, `CONVENTIONAL_CHANGELOG_VERSION`). Renovate does not
manage them. Keep `conventional-changelog-conventionalcommits` on 9.x until semantic-release ships a
`release-notes-generator` built on `conventional-changelog-writer` 9: the 10.x preset fails at the
release notes step.

## Manual fallback

Run `main.yml` from the Actions tab (`workflow_dispatch`) on a branch or tag to publish the version
currently in its `package.json`.
