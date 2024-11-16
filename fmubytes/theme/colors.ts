// theme/colors.ts

const brightRed = '#F30406';
const darkPurple = '#2C044B';
const lightGray = '#E4E0E1';
const visibleBlue = '#0A62F3';
const darkRed = '#7B0831';
const lightBlue = '#3FB9E3';
const mediumPurple = '#4C448E';
const darkMagenta = '#510840';
const veryDarkPurple = '#5C0434';
const darkTeal = '#1E596A';

export const colors = {
  // Base
  text: mediumPurple, // Changed from AA_DARK_BLUE to mediumPurple for text color
  textSecondary: '#6B7280', // Assuming this is a standard gray for secondary text
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  surfaceSecondary: '#F3F4F6',
  
  // Brand
  primary: lightBlue,
  primaryDark: darkPurple,
  primaryLight: lightBlue, // Assuming no lighter version was provided, using lightBlue itself
  accent: brightRed,
  
  // UI Elements
  tint: lightBlue,
  icon: '#6B7280', // Standard gray for icons
  tabIconDefault: '#6B7280',
  tabIconSelected: lightBlue,
  border: '#E5E7EB',
  divider: '#E5E7EB',
  
  // Interactive
  buttonPrimary: {
    background: lightBlue,
    text: '#FFFFFF',
    border: 'transparent',
    pressedBackground: darkPurple,
  },
  buttonSecondary: {
    background: 'transparent',
    text: lightBlue,
    border: lightBlue,
    pressedBackground: lightGray,
  },
  
  // Status
  status: {
    success: '#059669', // Emerald
    warning: '#EAB308', // Yellow
    error: brightRed,
    info: lightBlue,
  }
} as const;