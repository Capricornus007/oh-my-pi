import { setProviderIdentity, type ProviderIdentity } from "@oh-my-pi/pi-utils";
import { effect, register } from "./registry";

/** Values of the `provider.identity` setting. */
export const PROVIDER_IDENTITY_VALUES = ["pi", "omp"] as const;

/**
 * How omp presents itself to model providers on the wire. `pi` (default) sends
 * pi's User-Agent (`pi/<version> (<platform>; <runtime>; <arch>)`) and pi's
 * attribution headers (OpenRouter title/referer, gateway `x-title`); `omp`
 * presents omp's own identity. The local CLI surface, config directories and
 * branding are unaffected either way.
 */
export const cfgProviderIdentity = register({
	id: "provider.identity",
	type: "enum",
	values: PROVIDER_IDENTITY_VALUES,
	default: "pi",
	ui: {
		tab: "providers",
		group: "Identity",
		label: "Provider Identity",
		description: "Identity presented to model providers. pi sends pi's User-Agent and attribution headers; omp sends omp's own.",
		options: [
			{
				value: "pi",
				label: "pi",
				description: "Requests look exactly like pi's: pi/<version> User-Agent, pi.dev attribution",
			},
			{
				value: "omp",
				label: "omp",
				description: "Requests identify as omp/<version> with omp.sh attribution",
			},
		],
	},
});

effect(cfgProviderIdentity, mode => setProviderIdentity(mode as ProviderIdentity));
