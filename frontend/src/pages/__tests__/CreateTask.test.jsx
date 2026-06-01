import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import CreateTask from "../CreateTask";

global.fetch = vi.fn();

const mockShowToast = vi.fn();

describe("CreateTask Page", () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.setItem("token", "fake-token");
  });

  it("input title bisa diisi", () => {
    render(
      <BrowserRouter>
        <CreateTask token="fake-token" showToast={mockShowToast} />
      </BrowserRouter>
    );

    const titleInput = screen.getByPlaceholderText(/judul/i);

    fireEvent.change(titleInput, {
      target: { value: "Tugas Praktikum Cloud" },
    });

    expect(titleInput.value).toBe("Tugas Praktikum Cloud");
  });

  it("form submit berjalan saat klik simpan", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        title: "Tugas Baru",
      }),
    });

    render(
      <BrowserRouter>
        <CreateTask token="fake-token" showToast={mockShowToast} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/judul/i), {
      target: { value: "Tugas Baru" },
    });

    fireEvent.change(screen.getByPlaceholderText(/deskripsi/i), {
      target: { value: "Deskripsi tugas" },
    });

    const deadlineInput = screen.getByLabelText(/deadline/i);

    fireEvent.change(deadlineInput, {
      target: { value: "2026-05-11T10:00" },
    });

    fireEvent.click(screen.getByText(/simpan/i));

    expect(fetch).toHaveBeenCalled();
  });
});