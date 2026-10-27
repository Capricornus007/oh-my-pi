import { PROVIDER_APP_NAME, PROVIDER_APP_URL, USER_AGENT } from "@oh-my-pi/pi-utils";

export function getOpenRouterHeaders(): Record<string, string> {
	const headers: Record<string, string> = {
		"User-Agent": USER_AGENT,
		"X-OpenRouter-Categories": "cli-agent",
		"X-OpenRouter-Cache": "true",
		"X-OpenRouter-Cache-TTL": "3600",
	};
	// App attribution; an empty value means "omit the header" (see setProviderIdentity).
	if (PROVIDER_APP_URL) headers["HTTP-Referer"] = PROVIDER_APP_URL;
	if (PROVIDER_APP_NAME) headers["X-OpenRouter-Title"] = PROVIDER_APP_NAME;
	return headers;
}
