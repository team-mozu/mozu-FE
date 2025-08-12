import { vi } from "vitest";

vi.mock("../../packages/design-token/src/theme/color", () => {
  return {
    color: {
      black: "#000000",
      white: "#FFFFFF",
      orange: {
        50: "#FFF7ED",
        100: "#FFEDD5",
        200: "#FED7AA",
        300: "#FDBA74",
        400: "#FB923C",
        500: "#F97316",
        600: "#EA580C",
        700: "#C2410C",
        800: "#9A3412",
        900: "#7C2D12",
        950: "#431407",
      },
      zinc: {
        50: "#FAFAFA",
        100: "#F4F4F5",
        200: "#E4E4E7",
        300: "#D4D4D8",
        400: "#A1A1AA",
        500: "#71717A",
        600: "#52525B",
        700: "#3F3F46",
        800: "#27272A",
        900: "#18181B",
        950: "#09090B",
      },
      blue: {
        50: "#EFF6FF",
        100: "#DBEAFE",
        200: "#BFDBFE",
        300: "#93C5FD",
        400: "#60A5FA",
        500: "#3B82F6",
        600: "#2563EB",
        700: "#1D4ED8",
        800: "#1E40AF",
        900: "#1E3A8A",
        950: "#172554",
      },
      green: {
        50: "#F0FDF4",
        100: "#DCFCE7",
        200: "#BBF7D0",
        300: "#86EFAC",
        400: "#4ADE80",
        500: "#22C55E",
        600: "#16A34A",
        700: "#15803D",
        800: "#166534",
        900: "#14532D",
        950: "#052E16",
      },
      yellow: {
        50: "#FEFCE8",
        100: "#FEF9C3",
        200: "#FEF08A",
        300: "#FDE047",
        400: "#FACC15",
        500: "#EAB308",
        600: "#CA8A04",
        700: "#A16207",
        800: "#854D0E",
        900: "#713F12",
        950: "#422006",
      },
      red: {
        50: "#FEF2F2",
        100: "#FEE2E2",
        200: "#FECACA",
        300: "#FCA5A5",
        400: "#F87171",
        500: "#EF4444",
        600: "#DC2626",
        700: "#B91C1C",
        800: "#991B1B",
        900: "#7F1D1D",
        950: "#450A0A",
      },
    },
  };
});

vi.mock("../../packages/design-token/src/theme/font", () => {
  const fontToCss = (weight: number, size: number, lineHeight: number) => {
    return {
      fontFamily: "Pretendard",
      fontWeight: weight,
      fontSize: `${size}px`,
      lineHeight: `${lineHeight}px`,
    };
  };

  return {
    font: {
      h1: fontToCss(600, 40, 48),
      h2: fontToCss(600, 36, 42),
      h3: fontToCss(600, 28, 36),
      h4: fontToCss(500, 24, 32),
      t1: fontToCss(600, 20, 24),
      t2: fontToCss(500, 20, 24),
      t3: fontToCss(500, 18, 20),
      t4: fontToCss(400, 18, 20),
      b1: fontToCss(500, 16, 20),
      b2: fontToCss(400, 16, 20),
      l1: fontToCss(500, 14, 18),
      l2: fontToCss(400, 14, 18),
    },
  };
});
