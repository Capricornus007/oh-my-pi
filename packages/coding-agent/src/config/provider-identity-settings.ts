/**
 * Wire-visible client identity: the `User-Agent` and the attribution headers omp sends to model
 * providers.
 *
 * One word is enough — `provider.identity` takes a product token (`pi`, `omp`, `mycli`) and expands
 * it to `<token>/<version> (<platform>; <runtime>; <arch>)` plus the same token as the attribution
 * app name; a set token never falls back to omp's attribution homepage. `provider.userAgent` /
 * `provider.appName` / `provider.appUrl` remain for full control and win over the token. With
 * everything blank, omp sends its own identity. The local CLI surface, config directories and
 * branding are unaffected either way.
 *
 * Values are sent verbatim. Providers apply their terms of service to whatever identity a client
 * claims, so use a token that describes this client honestly.
 */
import { setProviderIdentity } from "@oh-my-pi/pi-utils";
import { combine, effect, register } from "./registry";

export const cfgProviderIdentity = register({
	id: "provider.identity",
	type: "string",
	default: undefined,
	env: "OMP_PROVIDER_IDENTITY",
	ui: {
		tab: "providers",
		group: "Identity",
		label: "Identity",
		description:
			"Product token sent to model providers, e.g. omp or mycli. Blank sends omp's own identity. Everything below overrides it.",
	},
});

export const cfgProviderUserAgent = register({
	id: "provider.userAgent",
	type: "string",
	default: undefined,
	env: "OMP_PROVIDER_USER_AGENT",
	ui: {
		tab: "providers",
		group: "Identity",
		label: "User-Agent override",
		description: "Exact User-Agent string. Blank uses Identity above (or omp's own omp/<version>).",
	},
});

export const cfgProviderAppName = register({
	id: "provider.appName",
	type: "string",
	default: undefined,
	env: "OMP_PROVIDER_APP_NAME",
	ui: {
		tab: "providers",
		group: "Identity",
		label: "Attribution app name override",
		description:
			"App name in attribution headers (OpenRouter X-OpenRouter-Title, gateway x-title). Blank uses Identity above.",
	},
});

export const cfgProviderAppUrl = register({
	id: "provider.appUrl",
	type: "string",
	default: undefined,
	env: "OMP_PROVIDER_APP_URL",
	ui: {
		tab: "providers",
		group: "Identity",
		label: "Attribution homepage override",
		description:
			"Homepage in attribution headers (OpenRouter HTTP-Referer, gateway http-referer). Blank omits the header unless Identity is unset.",
	},
});

effect(
	combine({
		identity: cfgProviderIdentity,
		userAgent: cfgProviderUserAgent,
		appName: cfgProviderAppName,
		appUrl: cfgProviderAppUrl,
	}),
	identity => setProviderIdentity(identity),
);
