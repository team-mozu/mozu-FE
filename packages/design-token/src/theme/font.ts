const fontToCss = (weight: number, size: number, lineHeight: number) => {
  return {
    fontWeight: `${weight}px`,
    fontSize: `${size}px`,
    lineHeight: `${lineHeight}px`,
  };
};

export const font = {
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
};
