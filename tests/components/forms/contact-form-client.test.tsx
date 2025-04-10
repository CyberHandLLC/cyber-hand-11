/**
 * @fileoverview Tests for the ContactFormClient component
 *
 * This file contains tests for the ContactFormClient component, covering:
 * - Expected use: Form renders properly and can be filled out
 * - Edge case: Validation handling with empty fields
 * - Failure case: Server error handling
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactFormClient } from "@/components/forms/contact-form-client";
import * as contactFormActions from "@/lib/actions/contact-form";

// We're using a global mock for the theme context
jest.mock("@/lib/theme-context");

// Mock the server action
jest.mock("@/lib/actions/contact-form", () => ({
  submitContactForm: jest.fn(),
  FormData: jest.requireActual("@/lib/actions/contact-form").FormData,
  FormResponse: jest.requireActual("@/lib/actions/contact-form").FormResponse,
}));

const mockAvailableServices = ["Web Development", "Digital Marketing", "UI/UX Design"];

describe("ContactFormClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test case: Expected use - form renders and submits successfully
   */
  test("renders the form and handles successful submission", async () => {
    // Mock successful form submission
    (contactFormActions.submitContactForm as jest.Mock).mockResolvedValue({
      success: true,
      message: "Form submitted successfully",
    });

    // Setup user events
    const user = userEvent.setup();

    // Render the component
    render(<ContactFormClient availableServices={mockAvailableServices} initialService="" />);

    // Fill out the form
    await user.type(screen.getByLabelText(/Name/i), "John Doe");
    await user.type(screen.getByLabelText(/Email/i), "john@example.com");
    await user.type(screen.getByLabelText(/Message/i), "This is a test message");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /Send Message/i }));

    // Wait for submission to complete
    await waitFor(() => {
      expect(contactFormActions.submitContactForm).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        company: "",
        message: "This is a test message",
        service: "",
      });
    });

    // Check that success message is displayed
    expect(await screen.findByText("Message Sent!")).toBeInTheDocument();
  });

  /**
   * Test case: Edge case - form validation with empty fields
   */
  test("validates required fields and shows error messages", async () => {
    // Mock validation error response
    (contactFormActions.submitContactForm as jest.Mock).mockResolvedValue({
      success: false,
      errors: {
        name: ["Name is required"],
        email: ["Email is required"],
        message: ["Message must be at least 10 characters"],
      },
      message: "Please check the form for errors",
    });

    // Setup user events
    const user = userEvent.setup();

    // Render the component
    const { container } = render(
      <ContactFormClient availableServices={mockAvailableServices} initialService="" />
    );

    // Find and click the submit button
    const submitButton = container.querySelector('button[type="submit"]');
    if (!submitButton) throw new Error("Submit button not found");
    await user.click(submitButton);

    // Wait for the form submission and validation
    await waitFor(() => {
      expect(contactFormActions.submitContactForm).toHaveBeenCalled();
    });

    // Check for validation error messages (using more flexible queries)
    await waitFor(() => {
      const errorMessages = [
        "Please check the form for errors",
        "Name is required",
        "Email is required",
        "Message must be at least 10 characters",
      ];

      errorMessages.forEach((message) => {
        // Convert NodeList to Array using Array.from instead of spread operator
        const errorElement = Array.from(container.querySelectorAll("p")).find((p) =>
          p.textContent?.includes(message)
        );
        expect(errorElement).toBeTruthy();
      });
    });
  });

  /**
   * Test case: Failure case - server error handling
   */
  test("handles server errors gracefully", async () => {
    // Mock server error response
    (contactFormActions.submitContactForm as jest.Mock).mockResolvedValue({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });

    // Setup user events
    const user = userEvent.setup();

    // Render the component
    render(<ContactFormClient availableServices={mockAvailableServices} initialService="" />);

    // Fill out and submit the form
    await user.type(screen.getByLabelText(/Name/i), "John Doe");
    await user.type(screen.getByLabelText(/Email/i), "john@example.com");
    await user.type(screen.getByLabelText(/Message/i), "This is a test message");
    await user.click(screen.getByRole("button", { name: /Send Message/i }));

    // Check that error message is displayed
    await waitFor(() => {
      expect(
        screen.getByText("An unexpected error occurred. Please try again later.")
      ).toBeInTheDocument();
    });

    // Form should still be visible (not replaced with success message)
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
  });
});
