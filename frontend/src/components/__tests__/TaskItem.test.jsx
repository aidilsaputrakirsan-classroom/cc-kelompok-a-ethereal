import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TaskItem from "../TaskItem";

const mockTask = {
  id: 1,
  title: "Tugas Cloud Computing",
  description: "Mengerjakan praktikum testing frontend",
  deadline: "2026-05-10T10:00:00",
};

describe("TaskItem Component", () => {
  it("menampilkan judul dan deskripsi task", () => {
    render(
      <TaskItem
        task={mockTask}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );

    expect(
      screen.getByText("Tugas Cloud Computing")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Mengerjakan praktikum testing frontend")
    ).toBeInTheDocument();
  });

  it("memanggil onEdit saat tombol Edit diklik", () => {
    const handleEdit = vi.fn();

    render(
      <TaskItem
        task={mockTask}
        onEdit={handleEdit}
        onDelete={() => {}}
      />
    );

    const editButton = screen.getByText(/edit/i);
    fireEvent.click(editButton);

    expect(handleEdit).toHaveBeenCalledWith(mockTask);
  });

  it("memanggil onDelete saat tombol Delete diklik", () => {
    const handleDelete = vi.fn();

    // mock confirm agar otomatis true
    window.confirm = vi.fn(() => true);

    render(
      <TaskItem
        task={mockTask}
        onEdit={() => {}}
        onDelete={handleDelete}
      />
    );

    const deleteButton = screen.getByText(/delete|hapus/i);
    fireEvent.click(deleteButton);

    expect(handleDelete).toHaveBeenCalledWith(mockTask.id);
  });
});