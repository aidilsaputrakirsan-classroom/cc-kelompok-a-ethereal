import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import Header from "../Header";

// Mock JWT Tokens
const adminToken = "header.eyJyb2xlIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsIm5hbWUiOiJBZG1pbiBVc2VyIn0=.signature";
const memberToken = "header.eyJyb2xlIjoibWVtYmVyIiwiZW1haWwiOiJtZW1iZXJAZ21haWwuY29tIiwibmFtZSI6Ik1lbWJlciBVc2VyIn0=.signature";

describe("Header Component", () => {
  it("menampilkan nama aplikasi Kelarin", async () => {
    render(
      <BrowserRouter>
        <Header token={memberToken} onLogout={() => {}} />
      </BrowserRouter>
    );

    const appName = await screen.findByText(/Kelarin/i, {}, { timeout: 10000 });
    expect(appName).toBeInTheDocument();
  }, 30000);

  it("menampilkan tombol Logout", async () => {
    render(
      <BrowserRouter>
        <Header token={memberToken} onLogout={() => {}} />
      </BrowserRouter>
    );

    const logoutButton = await screen.findByRole("button", { name: /logout/i }, { timeout: 10000 });
    expect(logoutButton).toBeInTheDocument();
  }, 30000);

  it("menampilkan tombol Status untuk Admin", async () => {
    render(
      <BrowserRouter>
        <Header token={adminToken} onLogout={() => {}} />
      </BrowserRouter>
    );

    const statusLink = await screen.findByRole("link", { name: /status/i }, { timeout: 10000 });
    expect(statusLink).toBeInTheDocument();
  }, 30000);

  it("TIDAK menampilkan tombol Status untuk Member biasa", async () => {
    render(
      <BrowserRouter>
        <Header token={memberToken} onLogout={() => {}} />
      </BrowserRouter>
    );

    const statusLink = screen.queryByRole("link", { name: /status/i });
    expect(statusLink).not.toBeInTheDocument();
  }, 30000);

  it("menjalankan fungsi logout saat tombol logout diklik", async () => {
    const mockLogout = vi.fn();

    render(
      <BrowserRouter>
        <Header token={memberToken} onLogout={mockLogout} />
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