import { render, screen, fireEvent } from "@testing-library/react";
import Register from "../app/register/page";
import { showToast } from "../hooks/show-toast";

jest.mock("../hooks/show-toast", () => ({
  showToast: jest.fn(),
}));

describe("Register Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all fields correctly", () => {
    render(<Register />);

    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/I agree to the/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i })
    ).toBeInTheDocument();
  });

  it("shows toast if passwords do not match", () => {
    render(<Register />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "654321" },
    });
    fireEvent.click(screen.getByLabelText(/I agree to the/i));

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(showToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Password Mismatch",
      })
    );
  });

  it("does NOT shows toast if terms not agreed", () => {
    render(<Register />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "123456" },
    });

    // Terms checkbox not checked
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    // ✅ Expect showToast to NOT be called
    expect(showToast).not.toHaveBeenCalled();
    
  });

  it("submits form successfully when valid", () => {
    render(<Register />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByLabelText(/I agree to the/i));

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(showToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Account Created",
      })
    );
  });
});
