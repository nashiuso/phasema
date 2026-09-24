import { describe, it, expect } from "vitest";

describe("entorno", () => {
  it("Node está disponible", () => {
    expect(typeof process.version).toBe("string");
    expect(process.version).toMatch(/^v\d+/);
  });

  it("fetch nativo existe", () => {
    expect(typeof fetch).toBe("function");
  });

  it("Buffer está disponible", () => {
    expect(typeof Buffer).toBe("function");
  });
});
