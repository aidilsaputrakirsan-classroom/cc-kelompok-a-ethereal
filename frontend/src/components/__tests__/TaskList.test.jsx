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

    const { container } = render(
      <BrowserRouter>
        <TaskList token="fake-token" showToast={mockShowToast} />
      </BrowserRouter>
    );

    // Wait 200ms for state/effects to process
    await new Promise((resolve) => setTimeout(resolve, 200));
    console.log("DEBUG [TaskList.test.jsx]:", container.innerHTML);

    const emptyStateText = await screen.findByText(/belum ada tugas/i, {}, { timeout: 10000 });
    expect(emptyStateText).toBeInTheDocument();
  }, 30000);

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

    const taskTitle = await screen.findByText("Tugas Cloud", {}, { timeout: 10000 });
    expect(taskTitle).toBeInTheDocument();

    const taskDescription = await screen.findByText(/Kerjakan testing frontend/i, {}, { timeout: 10000 });
    expect(taskDescription).toBeInTheDocument();
  }, 30000);
});