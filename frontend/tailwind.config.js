/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		"./app/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				// Monochrome color scheme
				border: "hsl(0, 0%, 85%)",
				input: "hsl(0, 0%, 95%)",
				background: "hsl(0, 0%, 100%)",
				foreground: "hsl(0, 0%, 10%)",
				primary: {
					DEFAULT: "hsl(0, 0%, 20%)",  // Dark gray
					foreground: "hsl(0, 0%, 100%)",
				},
				secondary: {
					DEFAULT: "hsl(0, 0%, 96%)",
					foreground: "hsl(0, 0%, 20%)",
				},
				accent: {
					DEFAULT: "hsl(0, 0%, 40%)",  // Medium gray
					foreground: "hsl(0, 0%, 100%)",
				},
				// Dark mode colors
				dark: {
					border: "hsl(0, 0%, 25%)",
					input: "hsl(0, 0%, 15%)",
					background: "hsl(0, 0%, 10%)",
					foreground: "hsl(0, 0%, 95%)",
					primary: {
						DEFAULT: "hsl(0, 0%, 95%)",  // Light gray
						foreground: "hsl(0, 0%, 10%)",
					},
					secondary: {
						DEFAULT: "hsl(0, 0%, 15%)",
						foreground: "hsl(0, 0%, 90%)",
					},
					accent: {
						DEFAULT: "hsl(0, 0%, 60%)",
						foreground: "hsl(0, 0%, 10%)",
					},
				}
			},
			borderRadius: {
				lg: "0.5rem",
				md: "0.375rem",
				sm: "0.25rem",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
			fontFamily: {
				sans: ["var(--font-geist-sans)", "sans-serif"],
				mono: ["var(--font-geist-mono)", "monospace"],
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};