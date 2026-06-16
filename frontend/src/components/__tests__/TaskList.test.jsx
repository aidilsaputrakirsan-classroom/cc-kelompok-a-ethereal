import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import TaskList from "../TaskList";

global.fetch = vi.fn();

const mockShowToast = vi.fn();

describe("TaskList Component", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("menampilkan empty state jika tidak ada task", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify([]),
      json: async () => [],
    });

    render(
      <BrowserRouter>
        <TaskList token="fake-token" showToast={mockShowToast} />
      </BrowserRouter>
    );

    const emptyStateText = await screen.findByText(/belum ada tugas/i, {}, { timeout: 5000 });
    expect(emptyStateText).toBeInTheDocument();
  });

  it("menampilkan daftar task dari API", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify([
        {
          id: 1,
          title: "Tugas Cloud",
          description: "Kerjakan testing frontend",
          deadline: "2026-05-11T10:00:00",
        },
      ]),
      json: async () => [
        {
          id: 1,
          title: "Tugas Cloud",
          description: "Kerjakan testing frontend",
          deadline: "2026-05-11T10:00:00",
        },
      ],
    });

    render(
      <BrowserRouter>
        <TaskList token="fake-token" showToast={mockShowToast} />
      </BrowserRouter>
    );

    const taskTitle = await screen.findByText("Tugas Cloud", {}, { timeout: 5000 });
    expect(taskTitle).toBeInTheDocument();

    const taskDescription = await screen.findByText(/Kerjakan testing frontend/i, {}, { timeout: 5000 });
    expect(taskDescription).toBeInTheDocument();
  });
});