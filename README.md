# @iconsauce/core

Includes only the SVG icons matched in your code and generates a CSS icon font set.

### Examples

In this example you have all the **almost 7.000** [Google Material Design Icons](https://fonts.google.com/icons) collected by [material-design-icons-updated](https://github.com/stramel/material-design-icons-updated), but you'll be able to include only the icons you effectively use inside your code:

```jsx
const MyComponent = () => {

  const icon = 'miu/filled/warning'

  return <section className={ icon }>
    <div className="grid desktop:grid-cols-4 miu/filled/add-chart tablet:grid-cols-2 grid-cols-1 desktop:gap-6 gap-12 desktop:auto-rows-fr desktop:items-end">
      <i className="miu/filled/info"/>
      <span className='bg-adjust-tone-01/24 miu/filled/error'/>
      <div>
        <footer title="miu/filled/close"></footer>
      </div>
    </div>
  </section>
}
export default MyComponent
```

### Output

```css
@font-face {
  font-family: "iconsauce";
  src: url("data:font/truetype;charset=utf-8;base64,A...Z") format("truetype");
}

[class^="miu/"], [class*=" miu/"] {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-family: "iconsauce" !important;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
}

.miu\/filled\/add-chart::before { content: "\ea02" }
.miu\/filled\/close::before { content: "\ea03" }
.miu\/filled\/error::before { content: "\ea04" }
.miu\/filled\/info::before { content: "\ea05" }
.miu\/filled\/warning::before { content: "\ea08" }
```

---

## Config

Since v2.0.0 the configuration loader previously published as `@iconsauce/config`
is part of this package: `IconsauceConfig` and the `Config` type are exported
directly from `@iconsauce/core`.

Place config file in the root of your node project:

```js
module.exports = {
  content: [
    './static/**/*.{html,htm}',
    './templates/**/*.{js,jsx,ts,tsx}',
    './data/**/*.{json}',
    './layouts/**/*.{js}',
  ],
  fontSize: '24px',
  plugin: [
    require('@iconsauce/material-icons'),
  ],
}
```

For more info visit [Configuration wiki][config]

[config]: https://github.com/iconsauce/docs/wiki/Configuration
---

## Release

Releases are automated with [semantic-release](https://semantic-release.gitbook.io/) by
`.github/workflows/release.yml` on every push to `main`. Nothing release-related lives in the
repository: the toolchain is installed and configured at runtime by the workflow.

### Versioning

The next version is computed from the [conventional commits](https://www.conventionalcommits.org/)
since the last tag:

| Commit                                   | Release |
| ---------------------------------------- | ------- |
| `fix: ...`                               | patch   |
| `feat: ...`                              | minor   |
| `feat!: ...` or a `BREAKING CHANGE:` footer | major   |
| `chore`, `docs`, `ci`, `refactor`, `test`, `build` | none    |

Never bump the version in `package.json` by hand: the pipeline commits it as
`chore(release): <version>`. Renovate updates follow the same rule, a `fix(deps)` ships a patch
release, a `chore(deps)` ships nothing.

### What a push to `main` does

1. Build and tests on Ubuntu and Windows (`test.yml`).
2. semantic-release computes the version, commits the bump of `package.json` and
   `package-lock.json`, tags it `v<version>` and creates the GitHub release with the generated notes.
3. The GitHub release triggers `main.yml`: tests again on the tag, then `npm publish` with npm
   trusted publishing (OIDC). A release created by hand from the GitHub UI publishes the same way.

The push of the `chore(release)` commit is skipped by the release workflow, so no loop.

### Repository requirements

- Secret `RELEASE_PUSH_TOKEN`: a fine-grained personal access token of a user in the bypass list
  of the `main` ruleset, scoped to this repository with **Contents: read and write** only. The
  default workflow token cannot be used: the ruleset requires the status checks on every push to
  `main`, a commit pushed directly can never carry them and `github-actions[bot]` cannot bypass
  rules. The token also makes the GitHub release start `main.yml`, which events created by the
  workflow token never do. Rotate it before it expires.
- npm trusted publishing configured on npmjs.com for this repository and the workflow `main.yml`.

### Updating the release toolchain

The versions are pinned in the `env` of the `release` job of `.github/workflows/release.yml`
(`SEMANTIC_RELEASE_VERSION`, `SR_GIT_VERSION`, `CONVENTIONAL_CHANGELOG_VERSION`). Renovate does not
manage them. Keep `conventional-changelog-conventionalcommits` on 9.x until semantic-release ships a
`release-notes-generator` built on `conventional-changelog-writer` 9: the 10.x preset fails at the
release notes step.

### Manual fallback

Run `main.yml` from the Actions tab (`workflow_dispatch`) on a branch or tag to publish the version
currently in its `package.json`.
