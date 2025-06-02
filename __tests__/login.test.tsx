import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../app/login/page";

jest.mock("../hooks/show-toast", () => ({
  showToast: jest.fn(),
}));

describe("Login Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders login form fields", () => {
    render(<Login />);

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign In/ })).toBeInTheDocument();
  });

  it("don`t shows error toast if email is missing", () => {
    const { getByLabelText, getByRole } = render(<Login />);
    const showToast = require("../hooks/show-toast").showToast;

    fireEvent.change(getByLabelText(/^Password$/i), {
      target: { value: "password123" },
    });
    fireEvent.click(getByRole("button", { name: /Sign In/ }));

    expect(showToast).not.toHaveBeenCalled();
  });

  it("don`t shows error toast if password is missing", () => {
    const { getByLabelText, getByRole } = render(<Login />);
    const showToast = require("../hooks/show-toast").showToast;

    fireEvent.change(getByLabelText(/Email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(getByRole("button", { name: /Sign In/ }));

    expect(showToast).not.toHaveBeenCalled();
  });

  it("shows success toast on valid login", () => {
    const { getByLabelText, getByRole } = render(<Login />);
    const showToast = require("../hooks/show-toast").showToast;

    fireEvent.change(getByLabelText(/Email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(getByLabelText(/^Password$/i), {
      target: { value: "password123" },
    });

    fireEvent.click(getByRole("button", { name: /Sign In/ }));

    expect(showToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Login Successful",
        description: "Welcome back to EduSpark!",
      })
    );
  });

  it("does NOT submit if fields are empty", () => {
    const { getByRole } = render(<Login />);
    const showToast = require("../hooks/show-toast").showToast;

    fireEvent.click(getByRole("button", { name: /Sign In/ }));

    expect(showToast).not.toHaveBeenCalled();
  });
});
