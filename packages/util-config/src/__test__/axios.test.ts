import { describe, expect, it } from "vitest";
import { instance } from "../utils/apis/axios";

describe("axios instance", () => {
  it("should be created", () => {
    expect(instance).toBeDefined();
  });
});
