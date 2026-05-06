import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Header from "../Header";

describe("Header Component", () => {
  it("menampilkan nama aplikasi Kelarin", () => {
    render(<Header onLogout={() => {}} />);

    expect(screen.getByText(/Kelarin/i)).toBeInTheDocument();
  });

  it("menampilkan text Ethereal Team Workspace", () => {
    render(<Header onLogout={() => {}} />);

    expect(
      screen.getByText(/Ethereal Team Workspace/i)
    ).toBeInTheDocument();
  });

  it("menampilkan tombol Logout", () => {
    render(<Header onLogout={() => {}} />);

    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  it("menjalankan fungsi logout saat tombol logout diklik", () => {
    const mockLogout = vi.fn();

    render(<Header onLogout={mockLogout} />);

    const logoutButton = screen.getByText(/Logout/i);
    logoutButton.click();

    expect(mockLogout).toHaveBeenCalled();
  });
});