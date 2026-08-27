# Publishing typed-css-modules-next to npm

This repository is configured to publish the public, unscoped npm package `typed-css-modules-next`. The first release must be published manually. After that, the included GitHub Actions workflow can publish tagged releases without a long-lived npm token.

## Prerequisites

1. Create an [npm account](https://www.npmjs.com/signup) and verify its email address.
2. Enable two-factor authentication (2FA). npm requires 2FA or an appropriately configured granular access token for publishing; interactive publishing with 2FA is recommended for the first release.
3. Make sure the intended release is committed and pushed to `https://github.com/baevm/typed-css-modules-next`.
4. Use a supported Node.js version. The package supports Node.js 18 or newer; a current Node.js LTS release is recommended for publishing.

Never commit an npm access token or a user-level `.npmrc` file to this repository.

## First release: 1.0.0

Package names are global and are not reserved until publishing succeeds. Check the name again immediately before publishing:

```sh
npm view typed-css-modules-next name version
```

An `E404 Not Found` response means no public package currently uses the name. This was the registry response on August 27, 2026.

Log in and verify the active account:

```sh
npm login
npm whoami
```

From the repository root, install exactly the locked dependencies and run all checks:

```sh
npm ci
npm run check
```

Inspect the tarball contents without publishing:

```sh
npm pack --dry-run
npm publish --dry-run
```

The preview should contain `package.json`, `README.md`, `PUBLISHING.md`, `LICENSE.txt`, and compiled files under `lib/`. It should not contain source fixtures, tests, coverage, or credentials. The `prepack` script builds `lib/` automatically.

Publish the unscoped public package:

```sh
npm publish
```

npm will request a 2FA code when required. The repository's `publishConfig.access` is already set to `public`, so no additional access flag is needed.

Verify the result:

```sh
npm view typed-css-modules-next name version dist-tags repository
npm install --global typed-css-modules-next
tcm-next --version
```

Also inspect `https://www.npmjs.com/package/typed-css-modules-next`. Published versions are immutable; fixes require a new version.

## Enable secure GitHub Actions publishing

Trusted publishing can only be configured after the package exists on npm.

1. Open the package on npm, then go to **Settings → Trusted publishing**.
2. Add GitHub Actions as the trusted publisher.
3. Enter GitHub owner `baevm`, repository `typed-css-modules-next`, and workflow filename `publish.yml`.
4. Leave the environment blank unless you also add the same protected GitHub environment to the workflow.
5. Allow the `npm publish` action and save the configuration.
6. After confirming a trusted release works, set **Publishing access** to require 2FA and disallow traditional tokens.

The workflow at `.github/workflows/publish.yml` uses OpenID Connect (OIDC), so it does not need an `NPM_AUTH_TOKEN` GitHub secret. For public repositories, trusted publishing also creates npm provenance automatically. npm currently requires npm CLI 11.5.1 or newer and Node.js 22.14.0 or newer for trusted publishing; the workflow installs the current npm 11 release on Node.js 24.

After manually publishing `1.0.0`, you may create and push its matching tag. The workflow detects that the version already exists and exits without publishing it again:

```sh
git tag v1.0.0
git push origin v1.0.0
```

## Publish later versions

Choose the semantic version bump that matches the change:

- `patch` for backward-compatible fixes (`1.0.0` → `1.0.1`)
- `minor` for backward-compatible features (`1.0.0` → `1.1.0`)
- `major` for breaking changes (`1.0.0` → `2.0.0`)

On a clean `master` branch, run the checks and create the version commit and tag:

```sh
npm ci
npm run check
npm version patch
git push origin master --follow-tags
```

Replace `patch` with `minor` or `major` as appropriate. The pushed `v<version>` tag starts the publish workflow. It verifies that the tag exactly matches the version in `package.json`, runs all checks, and publishes through npm trusted publishing.

If a workflow fails before npm accepts the package, fix the cause and rerun the same workflow. If npm already accepted that version, increment the version before publishing another build.

Official references:

- [Creating and publishing unscoped public packages](https://docs.npmjs.com/creating-and-publishing-unscoped-public-packages/)
- [Trusted publishing for npm packages](https://docs.npmjs.com/trusted-publishers/)
- [Requiring 2FA for package publishing](https://docs.npmjs.com/requiring-2fa-for-package-publishing-and-settings-modification/)
