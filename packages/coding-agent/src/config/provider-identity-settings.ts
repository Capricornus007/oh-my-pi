/**
 * Wire-visible client identity: the `User-Agent` and the attribution headers omp sends to model
 * providers. Every field is free text; leaving them blank sends omp's own identity
 * (`omp/<version>` plus omp.sh attribution). The local CLI surface, config directories and
 * branding are unaffected either way.
 *
 * Values are sent verbatim. Providers apply their terms of service to whatever identity a client
 * claims, so only set an identity that describes this client honestly.
 */
import { setProviderIdentity } from "@oh-my-pi/pi-utils";
import { combine, effect, register } from "./registry";

export const cfgProviderUserAgent = register({
	id: "provider.userAgent",
	type: "string",
	default: undefined,
	env: "OMP_PROVIDER_USER_AGENT",
	ui: {
		tab: "providers",
		group: "Identity",
		label: "User-Agent",
		description: "User-Agent sent to model providers. Blank sends omp's own (omp/<version>).",
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
		label: "Attribution app name",
		description: "App name in attribution headers (OpenRouter X-OpenRouter-Title, gateway x-title). Blank sends omp.",
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
		label: "Attribution homepage",
		description:
			"Homepage in attribution headers (OpenRouter HTTP-Referer, gateway http-referer). Blank sends https://omp.sh/.",
	},
});

effect(
	combine({
		userAgent: cfgProviderUserAgent,
		appName: cfgProviderAppName,
		appUrl: cfgProviderAppUrl,
	}),
	identity => setProviderIdentity(identity),
);
