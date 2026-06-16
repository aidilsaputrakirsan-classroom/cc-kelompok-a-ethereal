import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import Header from "../Header";

describe("Header Component", () => {
  it("menampilkan nama aplikasi Kelarin", () => {
    render(
      <BrowserRouter>
        <Header onLogout={() => {}} />
      </BrowserRouter>
    );

    expect(
      screen.getByText(/Kelarin/i)
    ).toBeInTheDocument();
  });

  it("menampilkan text Ethereal Team Workspace", () => {
    render(
      <BrowserRouter>
        <Header onLogout={() => {}} />
      </BrowserRouter>
    );

    expect(
      screen.getByText(
        /Ethereal Team Workspace/i
      )
    ).toBeInTheDocument();
  });

  it("menampilkan tombol Logout", () => {
    render(
      <BrowserRouter>
        <Header onLogout={() => {}} />
      </BrowserRouter>
    );

    expect(
      screen.getByText((content, node) => 
        node.nodeType === 1 && node.children.length === 0 && node.textContent.toLowerCase().includes("logout")
      )
    ).toBeInTheDocument();
  });

  it("menampilkan tombol Status", () => {
    render(
      <BrowserRouter>
        <Header onLogout={() => {}} />
      </BrowserRouter>
    );

    expect(
      screen.getByText(/Status/i)
    ).toBeInTheDocument();
  });

  it("menjalankan fungsi logout saat tombol logout diklik", () => {
    const mockLogout = vi.fn();

    render(
      <BrowserRouter>
        <Header onLogout={mockLogout} />
      </BrowserRouter>
    );

    const logoutButton =
      screen.getByText((content, node) => 
        node.nodeType === 1 && node.children.length === 0 && node.textContent.toLowerCase().includes("logout")
      );

    logoutButton.click();

    expect(mockLogout).toHaveBeenCalled();
  });
});