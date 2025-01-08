/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    container: {
      padding: '2rem',
    },
    extend: {
      colors: {
        light: {
          headerBg: "#E9D9FF",   // Light Lavender (soft background for header)
          headerText: "#4C2C92",  // Dark Violet (for text on header)
          primary: "#9B8AFF",     // Light Violet (primary color for buttons and highlights)
          secondary: "#D6B7FF",   // Pastel Lavender (for secondary elements)
          accent: "#FF9EFF",      // Soft Pinkish Violet (for call-to-actions)
          background: "#F9F9FF",  // Very Light Violet (for the page background)
          text: "#4C4C4C", 
          white:"#ffffff",  // Charcoal Gray (for readability on light background)
        }
        ,
        dark: {
          headerBg: "#2E1A47",   // Deep Violet (header background for dark mode)
          headerText: "#E3DFFF",  // Soft Lavender (light text on dark header)
          primary: "#9B8AFF",     // Light Violet (primary color for buttons and highlights)
          secondary: "#D6B7FF",   // Pastel Lavender (for secondary elements)
          accent: "#FF9EFF",      // Soft Pinkish Violet (for highlights)
          background: "#1A0A3C",  // Dark Violet (for the dark mode background)
          text: "#E0E0E0",        // Light Gray (for text on dark background)
        }  
      },
    },
  },
  plugins: [],
}

