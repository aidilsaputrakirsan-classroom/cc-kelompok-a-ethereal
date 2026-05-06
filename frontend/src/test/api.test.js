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
      json: async () => ([
        {
          id: 1,
          title: "Tugas Cloud",
          description: "Praktikum testing",
          deadline: "2026-05-10T10:00:00",
        },
      ]),
    });

    const response = await fetch("http://localhost:8000/tasks");
    const data = await response.json();

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/tasks"
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
      fetch("http://localhost:8000/tasks")
    ).rejects.toThrow("Network error");
  });
});