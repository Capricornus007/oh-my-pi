import { afterEach, describe, expect, it } from "bun:test";
import { getProviderIdentity, setProviderIdentity, USER_AGENT } from "@oh-my-pi/pi-utils";
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
		expect(USER_AGENT).toBe("acme-cli/2.1 (linux; bun/1.4.2; x64)");
	});

	it("falls back to omp per field when a field is blank", () => {
		setProviderIdentity({ userAgent: "   ", appName: "", appUrl: "https://acme.example/" });
		const headers = getOpenRouterHeaders();
		expect(headers["User-Agent"]).toMatch(/^omp\//);
		expect(headers["User-Agent"]).toBe(USER_AGENT);
		expect(headers["X-OpenRouter-Title"]).toBe("omp");
		expect(headers["HTTP-Referer"]).toBe("https://acme.example/");
	});

	it("restores omp's identity when reset", () => {
		setProviderIdentity({ appName: "Acme" });
		setProviderIdentity();
		expect(getOpenRouterHeaders()["X-OpenRouter-Title"]).toBe("omp");
	});
});
