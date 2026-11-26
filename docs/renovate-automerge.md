# Renovate automerge

## Current configuration

`cmc-citizen-frontend` uses `renovate.json` at the repository root, extending the shared HMCTS preset and `local>hmcts/.github//renovate/automerge-all`, which sets `automerge: true` for every update, majors included.

Repo-level settings:

- `timezone`: `Europe/London`.
- `schedule` and `automergeSchedule`: after 7am and before 9am, and after 5pm and before 8pm, every weekday.
- `platformAutomerge`: `false`, so Renovate enforces the configured merge windows instead of queuing GitHub auto-merge.
- `rebaseWhen`: `behind-base-branch`, so Renovate refreshes branches that fall behind `master`.
- `automergeStrategy`: `squash`.
- `prConcurrentLimit`: `5`.

`renovate.json.bak` is a leftover copy from #3730. Renovate doesn't read it; delete it.

Groups, in the order they appear in `packageRules`:

| Group | Matches | Automerge |
|---|---|---|
| All non-major updates | every minor and patch update not taken by a group below | yes |
| Helm chart updates | `helmv3` manager | yes |
| ESLint | `eslint`, `@typescript-eslint/*`, `eslint-*`, `babel-eslint` | yes |
| TypeScript | `typescript`, `@types/*` | yes |
| HMCTS packages | `@hmcts/*` | yes |
| Testing tools | mocha, chai, sinon, nock, nyc, supertest, codeceptjs, webdriverio and their plugins and types | yes |
| opentelemetry stack | `applicationinsights`, `@azure/monitor-opentelemetry`, `@opentelemetry/*` | yes (from the preset) |
| Terraform version | `infrastructure/.terraform-version` | no |
| Jenkins library | `hmcts/cnp-jenkins-library` | yes (from the preset) |

### Group order

When several package rules match, Renovate applies them in order and later values win. "All non-major updates" must stay first, so each named group below it takes its own packages out of the catch-all. Renovate still raises majors on separate branches (for example `renovate/major-typescript`).

Until this was fixed, "All non-major updates" came after the Helm, ESLint, TypeScript, HMCTS and Testing tools groups and replaced their `groupName`. Their minor and patch updates all went into the "All non-major updates" PR, and those groups only received majors: the PR history shows `renovate/major-eslint` and `renovate/major-typescript` branches but no minor ESLint or TypeScript groups. The opentelemetry stack group already came after it, so it worked.

### Major updates automerge

Nothing turns automerge off for majors except the Terraform version, so majors automerge once their checks pass unless a hold below disables them.

## Code-owner review

`CODEOWNERS` assigns `*` to `@hmcts/civil` and `@hmcts/pet`, then lists the files Renovate updates without an owner, so Renovate PRs that only touch them don't need code-owner review: `.nvmrc`, `.pnp.cjs`, `.yarn/**`, `.yarnrc.yml`, `Jenkinsfile_CNP`, `package.json`, `yarn.lock`, `charts/**/Chart.lock`, `charts/**/Chart.yaml`, `docker-compose*.yml`, `infrastructure/.terraform-version`, and `.github/workflows/*.yaml` and `*.yml`.

`Jenkinsfile_nightly_disabled` and `Jenkinsfile_parameterized` use the unpinned `@Library("Infrastructure")`, so Renovate doesn't update them. `Dockerfile` is not exempt, so Docker base image PRs need code-owner approval.

## Merge window and Jenkins availability

PTL Jenkins runs on `cft-ptl-00-aks`, which [`hmcts/auto-shutdown`](https://github.com/hmcts/auto-shutdown) normally stops from 20:00 to 06:30 daily. There is no scheduled weekend startup.

If Renovate updates or rebases a PR while Jenkins is unavailable, the required check can't complete and automerge stays blocked. Branch creation and automerge therefore share the 07:00–09:00 and 17:00–20:00 weekday windows, when Jenkins is online and developer activity is lower. A PR rebased late in the evening window may not finish its build before the 20:00 shutdown; it then merges in a later window.

`platformAutomerge` must stay `false`; otherwise Renovate enables GitHub auto-merge and GitHub can merge whenever checks pass, regardless of `automergeSchedule`.

## Holds

Each hold in `renovate.json` gives its reason in `description`.

| Package | Hold | In use | Reason, in short |
|---|---|---|---|
| `cookie` | majors disabled | 0.7.2 (resolution) | v1 is ESM-only and drops what express 4 uses; upgrade with express 5 |
| `express`, `@types/express` | majors disabled | 4.22.3 | express 5 is a planned migration |
| `govuk-frontend` | majors disabled | 4.10.1 | 5+ moves files under `dist/` and switches to ES modules; planned migration |
| `path-to-regexp` | below 0.2.0 | 0.1.13 (resolution) | express 4 needs 0.1.x; 0.2.x breaks wildcard routes |
| `hmcts/cmc-cookies-manager` | disabled | | archived; Renovate reports a phantom major |
| `connect-redis` | below 9.0.0 | ^7.1.0 | 9+ only supports node-redis v5; the session store uses ioredis |
| `@opentelemetry/instrumentation-http`, `-pg`, `-mysql` (resolutions) | below 0.222.1, 0.74.0, 0.68.0 | 0.222.0, 0.73.0, 0.67.0 | held to the ranges `@azure/monitor-opentelemetry` declares |
| `typescript` | below 5.0.0 | ^3.9.8 | `@typescript-eslint` 5, `tsconfig.json` and ts-node; planned migration |
| `@types/node` | below 25.0.0 | ^24.0.0 | matches the Node 24 Docker base image |
| `@types/config` | below 4.0.0 | ^0.0.41 | version 4 is an empty stub |
| `eslint` | below 9.0.0 | ^8.20.0 | flat config and `@typescript-eslint` 5; planned migration |
| `eslint` (`sass-lint/eslint` resolution) | below 6.0.0 | ^5.0.0 | sass-lint 1.x loads ESLint 5 formatter paths |
| `@typescript-eslint/*` | below 6.0.0 | ^5.30.7 | needs newer TypeScript and ESLint |
| `glob-parent` (resolution) | below 7.0.0 | ^6.0.0 | version 7 is ESM-only; consumers `require()` it |
| `brace-expansion` (resolutions) | majors disabled | 1.1.22, 2.1.8, 5.1.0 | each override must stay on the major its consumers request |

`.nvmrc` says Node 26.13.1 but the Docker base image is `node:24-alpine`, which the `@types/node` hold follows. Align them when the runtime moves.

The `@typescript-eslint` rule's description says TypeScript is held on 3.9, but the `typescript` rule allows up to 4.x.

When a Renovate PR fails the build on every rebase, find the cause and add a hold with its reason rather than leaving the PR open: with `rebaseWhen: behind-base-branch`, a PR that can never pass is rebuilt on every merge to `master`.

## Stalled-queue alert

`civil-service`'s `.github/workflows/renovate-stalled-alert.yml` also checks this repository's open Renovate PRs each weekday morning and reports any older than three days.

## Release freeze

Use a Renovate package rule for a planned release freeze, so the freeze is reviewable and recorded in the repository. Add it as the final item under `packageRules` in `renovate.json`:

```json
{
  "description": "Release freeze: disable Renovate automerge",
  "matchPackageNames": ["*"],
  "automerge": false
}
```

It must stay last: later rules win, and several groups above set `automerge: true`. The rule stops automerge but leaves Renovate opening and rebasing PRs.

### Start a freeze

1. Add the freeze rule in a pull request, with the release or change reference and the intended end date in the description.
2. Merge it before the freeze starts, then run Renovate manually or wait for its next scheduled run.
3. Confirm in the Mend job log that the rule resolves to `automerge: false`, and record that in the release ticket.

### End a freeze

1. Remove the freeze rule through a pull request once the release is approved.
2. Merge it, then run Renovate manually or wait for its next scheduled run.
3. Check that a clean Renovate PR automerges only after all required checks pass.

## Pausing Renovate

Pausing is broader than a release freeze: it also stops new PRs, rebases and PR maintenance.

| | Release freeze (`automerge: false` rule) | Pause |
|---|---|---|
| New PRs and rebases | continue | stop |
| Automerge | stops | stops |
| Renovate's PR queue | stays current; merges are manual | builds up until turned back on |

There are two ways to pause:

- **In the repository:** set `"enabled": false` at the top level of `renovate.json` in a pull request, with the reason and expected end. It takes effect once merged and Renovate next runs. Revert the pull request to turn Renovate back on.
- **In the Mend Developer Portal:** an organisation admin can pause the repository at `https://developer.mend.io/github/hmcts/cmc-citizen-frontend/-/settings`. This takes effect without a merge, so it suits a freeze that has to start straight away. Turn it back on in the portal.

Changing branch protection is not recommended as a routine toggle: it affects all contributors and makes intentional freezes look like authorisation failures.
