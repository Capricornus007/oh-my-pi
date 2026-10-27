# Provider identity (User-Agent and attribution headers)

omp sends a `User-Agent` on every request to a model provider, plus app-attribution headers on the
gateways that read them. This page covers the defaults and how to change them.

## What is sent

| Field | Where it appears | Default |
|---|---|---|
| User-Agent | every provider request | `omp/<version>` |
| App name | OpenRouter `X-OpenRouter-Title`, Vercel AI Gateway `x-title` | `omp` |
| Homepage | OpenRouter `HTTP-Referer`, Vercel AI Gateway `http-referer` | `https://omp.sh/` |

Attribution headers are only applied where the gateway documents them, and never overwrite a header
the caller already set (a provider entry in `models.yml`, a per-model `headers:` block, or a
request-level override).

## The one-word form

`provider.identity` takes a product token. That single word replaces every wire-visible field:

```yaml
# ~/.omp/agent/config.yml
provider:
  identity: mycli
```

```sh
omp config set provider.identity mycli     # same thing from the CLI
OMP_PROVIDER_IDENTITY=mycli omp            # or just for one invocation
```

A token expands to:

- User-Agent — `<token>/<version> (<platform>; <runtime>; <arch>)`, e.g. `mycli/18.13.1 (linux; bun/1.4.2; x64)`
- attribution app name — `<token>`
- attribution homepage — omitted (no `omp.sh` left on the wire), unless the token is `omp` itself

Everything blank → omp's own identity, exactly as before.

## Full control

Three overrides, each used verbatim and each winning over the token:

| Setting | Environment variable | Blank means |
|---|---|---|
| `provider.userAgent` | `OMP_PROVIDER_USER_AGENT` | use `provider.identity`, else `omp/<version>` |
| `provider.appName` | `OMP_PROVIDER_APP_NAME` | use the token, else `omp` |
| `provider.appUrl` | `OMP_PROVIDER_APP_URL` | omit the header (token set) / `https://omp.sh/` (nothing set) |

All four are also in the settings panel (`/config` → Providers → Identity). Changes apply
immediately: `USER_AGENT`, `PROVIDER_APP_NAME` and `PROVIDER_APP_URL` from `@oh-my-pi/pi-utils` are
live bindings, so already-imported modules observe the new values.

Local surfaces — the `omp` binary name, `~/.omp` config directory, CLI help, branding — are not
affected by any of these settings.

## Which name to use

Use a token that describes this client truthfully: your own tool's name, or `omp`. Provider terms of
service apply to whatever identity a client claims, and a provider that trusts a name it did not
issue takes the risk on its side; claiming to be another product can breach those terms and is
outside what this setting is for. Packaging or wrapping omp? Name your build.

## Implementation

- `packages/utils/src/dirs.ts` — `ProviderIdentity` (`identity`, `userAgent`, `appName`, `appUrl`),
  `getProviderIdentity()`, `setProviderIdentity()`, the token expansion, and the live
  `USER_AGENT` / `PROVIDER_APP_NAME` / `PROVIDER_APP_URL` bindings.
- `packages/coding-agent/src/config/provider-identity-settings.ts` — the four settings and the
  `effect` that pushes the combined value into `setProviderIdentity()`.
- Empty values omit the header: `setHeaderIfAbsent()` skips blanks and `getOpenRouterHeaders()`
  adds the attribution headers conditionally.
