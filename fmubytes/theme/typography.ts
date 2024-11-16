// theme/typography.ts
export const typography = {
    // Display - Large, bold headlines
    display1: {
      fontFamily: 'Inter',
      fontSize: 48,
      fontWeight: '700',
      lineHeight: 56,
    },
    display2: {
      fontFamily: 'Inter',
      fontSize: 40,
      fontWeight: '700',
      lineHeight: 48,
    },
  
    // Headings
    h1: {
      fontFamily: 'Inter',
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 40,
    },
    h2: {
      fontFamily: 'Inter',
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
    },
    h3: {
      fontFamily: 'Inter',
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    },
    h4: {
      fontFamily: 'Inter',
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 24,
    },
  
    // Body text
    bodyLarge: {
      fontFamily: 'Inter',
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 28,
    },
    bodyLargeBold: {
      fontFamily: 'Inter',
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 28,
    },
    body: {
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    },
    bodyBold: {
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
    },
    bodySmall: {
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
    bodySmallBold: {
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 20,
    },
  
    // Interactive elements
    button: {
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
    },
    buttonSmall: {
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 20,
    },
    link: {
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
      textDecorationLine: 'underline',
    },
  
    // Supporting text
    caption: {
      fontFamily: 'Inter',
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
    },
    captionBold: {
      fontFamily: 'Inter',
      fontSize: 12,
      fontWeight: '600',
      lineHeight: 16,
    },
    overline: {
      fontFamily: 'Inter',
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 16,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
  
    // Variants
    italic: {
      fontFamily: 'InterItalic',
    },
  } as const;