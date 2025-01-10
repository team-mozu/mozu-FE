const fontToCss = (weight: string, size: number, lineHeight: number) => {
  return {
    fontFamily: 'Pretendard',
    fontWeight: weight,
    fontSize: `${size}px`,
    fontWeight: `${weight}`,
    lineHeight: `${lineHeight}px`,
  };
};

export const font = {
  h1: fontToCss('bold', 40, 48),
  h2: fontToCss('bold', 36, 42),
  h3: fontToCss('bold', 28, 36),
  h4: fontToCss('medium', 24, 32),
  t1: fontToCss('bold', 20, 24),
  t2: fontToCss('medium', 20, 24),
  t3: fontToCss('medium', 18, 20),
  t4: fontToCss('normal', 18, 20),
  b1: fontToCss('medium', 16, 20),
  b2: fontToCss('normal', 18, 20),
  l1: fontToCss('medium', 14, 18),
  l2: fontToCss('normal', 14, 18),
};

export const FontWeight = {
  bold: '700',
  medium: '500',
  regular: '400',
};
