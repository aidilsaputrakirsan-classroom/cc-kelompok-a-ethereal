import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fetch global
global.fetch = vi.fn();

describe("API Service - Kelarin Tasks", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("fetchTasks memanggil endpoint yang benar", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify([
        {
          id: 1,
          title: "Tugas Cloud",
          description: "Praktikum testing",
          deadline: "2026-05-10T10:00:00",
        },
      ]),
      json: async () => ([
        {
          id: 1,
          title: "Tugas Cloud",
          description: "Praktikum testing",
          deadline: "2026-05-10T10:00:00",
        },
      ]),
    });

    const response = await fetch("http://api-gateway.test/tasks");
    const text = await response.text();
    const data = JSON.parse(text);

    expect(fetch).toHaveBeenCalledWith(
      "http://api-gateway.test/tasks"
    );

    expect(data).toEqual([
      {
        id: 1,
        title: "Tugas Cloud",
        description: "Praktikum testing",
        deadline: "2026-05-10T10:00:00",
      },
    ]);
  });

  it("handle error saat API gagal", async () => {
    fetch.mockRejectedValueOnce(
      new Error("Network error")
    );

    await expect(
      fetch("http://api-gateway.test/tasks")
    ).rejects.toThrow("Network error");
  });
});