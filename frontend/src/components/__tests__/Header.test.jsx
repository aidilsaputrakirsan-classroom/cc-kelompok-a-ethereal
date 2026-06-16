import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import Header from "../Header";

describe("Header Component", () => {
  it("menampilkan nama aplikasi Kelarin", async () => {
    render(
      <BrowserRouter>
        <Header token="fake-token" onLogout={() => {}} />
      </BrowserRouter>
    );

    const appName = await screen.findByText(/Kelarin/i, {}, { timeout: 10000 });
    expect(appName).toBeInTheDocument();
  }, 30000);

  it("menampilkan text Ethereal Team Workspace", async () => {
    render(
      <BrowserRouter>
        <Header token="fake-token" onLogout={() => {}} />
      </BrowserRouter>
    );

    const workspaceText = await screen.findByText(/Ethereal Team Workspace/i, {}, { timeout: 10000 });
    expect(workspaceText).toBeInTheDocument();
  }, 30000);

  it("menampilkan tombol Logout", async () => {
    const { container } = render(
      <BrowserRouter>
        <Header token="fake-token" onLogout={() => {}} />
      </BrowserRouter>
    );
    console.log("DEBUG [Header.test.jsx]:", container.innerHTML);

    const logoutButton = await screen.findByRole("button", { name: /logout/i }, { timeout: 10000 });
    expect(logoutButton).toBeInTheDocument();
  }, 30000);

  it("menampilkan tombol Status", async () => {
    render(
      <BrowserRouter>
        <Header token="fake-token" onLogout={() => {}} />
      </BrowserRouter>
    );

    const statusLink = await screen.findByRole("link", { name: /status/i }, { timeout: 10000 });
    expect(statusLink).toBeInTheDocument();
  }, 30000);

  it("menjalankan fungsi logout saat tombol logout diklik", async () => {
    const mockLogout = vi.fn();

    render(
      <BrowserRouter>
        <Header token="fake-token" onLogout={mockLogout} />
      </BrowserRouter>
    );

    const logoutButton = await screen.findByRole("button", { name: /logout/i }, { timeout: 10000 });
    expect(logoutButton).toBeInTheDocument();

    logoutButton.click();

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    }, { timeout: 10000 });
  }, 30000);
});