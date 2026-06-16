import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import Header from "../Header";

describe("Header Component", () => {
  it("menampilkan nama aplikasi Kelarin", async () => {
    render(
      <BrowserRouter>
        <Header onLogout={() => {}} />
      </BrowserRouter>
    );

    const appName = await screen.findByText(/Kelarin/i, {}, { timeout: 5000 });
    expect(appName).toBeInTheDocument();
  });

  it("menampilkan text Ethereal Team Workspace", async () => {
    render(
      <BrowserRouter>
        <Header onLogout={() => {}} />
      </BrowserRouter>
    );

    const workspaceText = await screen.findByText(/Ethereal Team Workspace/i, {}, { timeout: 5000 });
    expect(workspaceText).toBeInTheDocument();
  });

  it("menampilkan tombol Logout", async () => {
    render(
      <BrowserRouter>
        <Header onLogout={() => {}} />
      </BrowserRouter>
    );

    const logoutButton = await screen.findByRole("button", { name: /logout/i }, { timeout: 5000 });
    expect(logoutButton).toBeInTheDocument();
  });

  it("menampilkan tombol Status", async () => {
    render(
      <BrowserRouter>
        <Header onLogout={() => {}} />
      </BrowserRouter>
    );

    const statusLink = await screen.findByRole("link", { name: /status/i }, { timeout: 5000 });
    expect(statusLink).toBeInTheDocument();
  });

  it("menjalankan fungsi logout saat tombol logout diklik", async () => {
    const mockLogout = vi.fn();

    render(
      <BrowserRouter>
        <Header onLogout={mockLogout} />
      </BrowserRouter>
    );

    const logoutButton = await screen.findByRole("button", { name: /logout/i }, { timeout: 5000 });
    expect(logoutButton).toBeInTheDocument();

    logoutButton.click();

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    }, { timeout: 5000 });
  });
});