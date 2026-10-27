import { PROVIDER_APP_NAME, PROVIDER_APP_URL, USER_AGENT } from "@oh-my-pi/pi-utils";

export function getOpenRouterHeaders(): Record<string, string> {
	return {
		"User-Agent": USER_AGENT,
		"HTTP-Referer": PROVIDER_APP_URL,
		"X-OpenRouter-Title": PROVIDER_APP_NAME,
		"X-OpenRouter-Categories": "cli-agent",
		"X-OpenRouter-Cache": "true",
		"X-OpenRouter-Cache-TTL": "3600",
	};
}
