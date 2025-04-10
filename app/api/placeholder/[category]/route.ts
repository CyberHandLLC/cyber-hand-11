import { NextRequest, NextResponse } from "next/server";

// Generate an SVG placeholder with the category name
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  // Await and destructure the params Promise
  const { category: categoryValue } = await params;
  const category = categoryValue || "placeholder";
  const colors: Record<string, { bg: string; text: string }> = {
    "surf-school": { bg: "#1e7a9d", text: "#ffffff" },
    "ev-charging": { bg: "#3d5467", text: "#ffffff" },
    "fashion-shop": { bg: "#e9d8c6", text: "#333333" },
    "hotel-tourism": { bg: "#1a4567", text: "#ffffff" },
    "tech-solution": { bg: "#323a45", text: "#ffffff" },
    landscape: { bg: "#386641", text: "#ffffff" },
    restaurant: { bg: "#a23535", text: "#ffffff" },
    fitness: { bg: "#2d3142", text: "#ffffff" },
    default: { bg: "#1a2c38", text: "#ffffff" },
  };

  const colorSet = colors[category] || colors["default"];

  const svg = `<svg width="800" height="500" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="500" fill="${colorSet.bg}" />
    <text x="400" y="250" font-family="Arial, sans-serif" font-size="32" fill="${colorSet.text}" text-anchor="middle" dominant-baseline="middle">
      ${category.replace(/-/g, " ").toUpperCase()}
    </text>
    <text x="400" y="300" font-family="Arial, sans-serif" font-size="18" fill="${colorSet.text}" text-anchor="middle" opacity="0.7">
      CyberHand Case Study
    </text>
  </svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
    },
  });
}
