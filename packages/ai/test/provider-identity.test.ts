import { afterEach, describe, expect, it } from "bun:test";
import {
	getProviderIdentity,
	PROVIDER_APP_NAME,
	PROVIDER_APP_URL,
	setProviderIdentity,
	USER_AGENT,
} from "@oh-my-pi/pi-utils";
import { getOpenRouterHeaders } from "../src/utils/openrouter-headers";

afterEach(() => setProviderIdentity());

describe("provider identity", () => {
	it("defaults to omp's own identity", () => {
		const headers = getOpenRouterHeaders();
		expect(headers["User-Agent"]).toMatch(/^omp\/\d+\.\d+\.\d+/);
		expect(headers["X-OpenRouter-Title"]).toBe("omp");
		expect(headers["HTTP-Referer"]).toBe("https://omp.sh/");
		expect(getProviderIdentity()).toEqual({});
	});

	it("sends configured values verbatim", () => {
		setProviderIdentity({
			userAgent: "acme-cli/2.1 (linux; bun/1.4.2; x64)",
			appName: "Acme",
			appUrl: "https://acme.example/",
		});
		const headers = getOpenRouterHeaders();
		expect(headers["User-Agent"]).toBe("acme-cli/2.1 (linux; bun/1.4.2; x64)");
		expect(headers["X-OpenRouter-Title"]).toBe("Acme");
		expect(headers["HTTP-Referer"]).toBe("https://acme.example/");
	});

	it("expands a product token to the detailed UA and the same app name", () => {
		// The one-word form: `provider.identity: acme-cli`.
		setProviderIdentity({ identity: "acme-cli" });
		const headers = getOpenRouterHeaders();
		expect(headers["User-Agent"]).toMatch(/^acme-cli\/\d+\.\d+\.\d+ \(/);
		expect(headers["X-OpenRouter-Title"]).toBe("acme-cli");
		expect(headers["HTTP-Referer"]).toBeUndefined();
	});

	it("keeps omp's homepage only when the token is omp itself", () => {
		setProviderIdentity({ identity: "omp" });
		const headers = getOpenRouterHeaders();
		expect(headers["User-Agent"]).toMatch(/^omp\/\d+\.\d+\.\d+ \(/);
		expect(headers["X-OpenRouter-Title"]).toBe("omp");
		expect(headers["HTTP-Referer"]).toBe("https://omp.sh/");
	});

	it("lets the explicit overrides win over the token", () => {
		setProviderIdentity({
			identity: "acme-cli",
			userAgent: "acme/1.0",
			appName: "Acme",
			appUrl: "https://acme.example/",
		});
		const headers = getOpenRouterHeaders();
		expect(headers["User-Agent"]).toBe("acme/1.0");
		expect(headers["X-OpenRouter-Title"]).toBe("Acme");
		expect(headers["HTTP-Referer"]).toBe("https://acme.example/");
	});

	it("covers every header from the User-Agent alone", () => {
		// One setting, no omp attribution left on the wire: app name derived from the
		// product token, homepage omitted instead of falling back to omp.sh.
		setProviderIdentity({ userAgent: "acme-cli/2.1 (linux; bun/1.4.2; x64)" });
		const headers = getOpenRouterHeaders();
		expect(headers["User-Agent"]).toBe("acme-cli/2.1 (linux; bun/1.4.2; x64)");
		expect(headers["X-OpenRouter-Title"]).toBe("acme-cli");
		expect(headers["HTTP-Referer"]).toBeUndefined();
		expect(PROVIDER_APP_NAME).toBe("acme-cli");
		expect(PROVIDER_APP_URL).toBe("");
	});

	it("lets explicit app name and homepage win over the derivation", () => {
		setProviderIdentity({ userAgent: "acme-cli/2.1", appName: "Acme CLI", appUrl: "https://acme.example/" });
		const headers = getOpenRouterHeaders();
		expect(headers["X-OpenRouter-Title"]).toBe("Acme CLI");
		expect(headers["HTTP-Referer"]).toBe("https://acme.example/");
	});

	it("falls back per field when a field is blank", () => {
		setProviderIdentity({ userAgent: "   ", appName: "", appUrl: "https://acme.example/" });
		const headers = getOpenRouterHeaders();
		expect(headers["User-Agent"]).toMatch(/^omp\//);
		expect(headers["User-Agent"]).toBe(USER_AGENT);
		expect(headers["X-OpenRouter-Title"]).toBe("omp");
		expect(headers["HTTP-Referer"]).toBe("https://acme.example/");
	});

	it("restores omp's identity when reset", () => {
		setProviderIdentity({ userAgent: "acme-cli/2.1" });
		setProviderIdentity();
		const headers = getOpenRouterHeaders();
		expect(headers["User-Agent"]).toBe(USER_AGENT);
		expect(headers["X-OpenRouter-Title"]).toBe("omp");
		expect(headers["HTTP-Referer"]).toBe("https://omp.sh/");
	});
});
