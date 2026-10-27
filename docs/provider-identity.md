# Provider identity (User-Agent and attribution headers)

omp sends a `User-Agent` and, on gateways that read them, app-attribution headers on every request
to a model provider. This page covers what is sent by default and how to change it.

## What is sent

| Field | Where it appears | Default |
|---|---|---|
| User-Agent | every provider request | `omp/<version>` |
| App name | OpenRouter `X-OpenRouter-Title`, Vercel AI Gateway `x-title` | `omp` |
| Homepage | OpenRouter `HTTP-Referer`, Vercel AI Gateway `http-referer` | `https://omp.sh/` |

Attribution headers are only applied where the gateway documents them, and never overwrite a header
the caller (a provider entry in `models.yml`, a per-model `headers:` block, or a request-level
override) already set.

## Changing it

Three settings, all free text, all defaulting to the values above when blank:

| Setting | Environment variable |
|---|---|
| `provider.userAgent` | `OMP_PROVIDER_USER_AGENT` |
| `provider.appName` | `OMP_PROVIDER_APP_NAME` |
| `provider.appUrl` | `OMP_PROVIDER_APP_URL` |

```yaml
# ~/.omp/agent/config.yml
provider:
  userAgent: acme-cli/2.1 (linux; bun/1.4.2; x64)
  appName: Acme
  appUrl: https://acme.example/
```

Or from the settings panel (`/config` → Providers → Identity), from the CLI
(`omp config set provider.appName Acme`), or per-invocation with the environment variables. Changes
apply immediately: `USER_AGENT`, `PROVIDER_APP_NAME` and `PROVIDER_APP_URL` from
`@oh-my-pi/pi-utils` are live bindings, so already-imported modules observe the new values.

Values are sent verbatim, whitespace-trimmed. A blank field falls back to omp's own value for that
field only. Local surfaces — the `omp` binary name, `~/.omp` config directory, CLI help, branding —
are not affected by these settings.

## What to put there

Set an identity that describes this client truthfully — normally your own app or tool name, so the
gateway's dashboard and rate-limit accounting show the real caller. Provider terms of service apply
to whatever identity a client claims; claiming to be a different product can breach them and is
outside what this setting is for. If you are packaging or wrapping omp, name your build, not the
project you wrapped.

## Implementation

- `packages/utils/src/dirs.ts` — `ProviderIdentity`, `getProviderIdentity()`, `setProviderIdentity()`,
  and the live `USER_AGENT` / `PROVIDER_APP_NAME` / `PROVIDER_APP_URL` bindings.
- `packages/coding-agent/src/config/provider-identity-settings.ts` — the three settings and the
  `effect` that pushes the combined value into `setProviderIdentity()`.
- `packages/utils/src/dirs.ts` defaults stay omp's; nothing is hard-coded per provider.
