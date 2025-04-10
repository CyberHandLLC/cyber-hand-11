/**
 * @fileoverview Tests for the Icons component
 *
 * This file tests the Icons component, which is implemented as a Server Component.
 * For Server Components, we test the rendered output rather than interactive behavior.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { CheckIcon, ArrowRightIcon, Icons } from "@/components/ui/icons";

describe("Icon Components", () => {
  /**
   * Test case: Expected use - Icon components render correctly
   */
  test("renders individual icon components with default props", () => {
    // Render the CheckIcon component
    const { container: checkContainer } = render(<CheckIcon />);

    // Verify SVG was rendered
    const checkSvg = checkContainer.querySelector("svg");
    expect(checkSvg).toBeInTheDocument();
    expect(checkSvg).toHaveAttribute("width", "24"); // Default md size
    expect(checkSvg).toHaveAttribute("height", "24");
  });

  /**
   * Test case: Edge case - Icon with custom size and className
   */
  test("renders icon with custom size and className", () => {
    const { container } = render(
      <ArrowRightIcon size="lg" className="text-primary custom-class" />
    );

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "32"); // lg size = 32px
    expect(svg).toHaveAttribute("height", "32");
    expect(svg).toHaveClass("text-primary");
    expect(svg).toHaveClass("custom-class");
  });

  /**
   * Test case: Expected use - Icons object exports all icon components
   */
  test("exports all icon components through Icons object", () => {
    // Check that common icons are exported
    expect(Icons.Check).toBeDefined();
    expect(Icons.ArrowRight).toBeDefined();
    expect(Icons.Mail).toBeDefined();
    expect(Icons.Phone).toBeDefined();

    // Render a couple icons from the Icons object
    const { container } = render(<Icons.Check />);
    expect(container.querySelector("svg")).toBeInTheDocument();

    const { container: container2 } = render(<Icons.Mail />);
    expect(container2.querySelector("svg")).toBeInTheDocument();
  });

  /**
   * Test case: Edge case - Icon with numeric size
   */
  test("renders icon with numeric size", () => {
    const { container } = render(<CheckIcon size={48} />);

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "48");
    expect(svg).toHaveAttribute("height", "48");
  });
});
