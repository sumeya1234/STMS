/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "error-container": "#ffdad6",
                "surface-container-low": "#eff4ff",
                "outline-variant": "#bbcabf",
                "tertiary-container": "#fc7c78",
                "on-tertiary-fixed": "#410005",
                "surface-tint": "#006c49",
                "on-surface-variant": "#3c4a42",
                "on-error-container": "#93000a",
                "surface-container-lowest": "#ffffff",
                "surface-container-high": "#dce9ff",
                "primary-fixed": "#6ffbbe",
                "on-secondary-fixed": "#002117",
                "surface-container-highest": "#d3e4fe",
                "on-primary-fixed": "#002113",
                "on-primary": "#ffffff",
                "on-tertiary-fixed-variant": "#842225",
                "on-primary-fixed-variant": "#005236",
                "surface": "#f8f9ff",
                "secondary": "#2b6954",
                "on-secondary-container": "#306d58",
                "inverse-surface": "#213145",
                "surface-bright": "#f8f9ff",
                "inverse-primary": "#4edea3",
                "on-primary-container": "#00422b",
                "on-tertiary-container": "#711419",
                "on-surface": "#0b1c30",
                "on-secondary-fixed-variant": "#0b513d",
                "surface-variant": "#d3e4fe",
                "tertiary-fixed-dim": "#ffb3af",
                "tertiary": "#a43a3a",
                "secondary-container": "#adedd3",
                "primary": "#006c49",
                "secondary-fixed-dim": "#95d3ba",
                "primary-container": "#10b981",
                "on-background": "#0b1c30",
                "secondary-fixed": "#b0f0d6",
                "background": "#f8f9ff",
                "on-secondary": "#ffffff",
                "tertiary-fixed": "#ffdad7",
                "primary-fixed-dim": "#4edea3",
                "on-error": "#ffffff",
                "outline": "#6c7a71",
                "on-tertiary": "#ffffff",
                "error": "#ba1a1a",
                "surface-container": "#e5eeff",
                "surface-dim": "#cbdbf5",
                "inverse-on-surface": "#eaf1ff",
                // Map logical primary numbers just in case my components use them
                primary: {
                    50: '#ecfeff',
                    100: '#cffafe',
                    500: '#10b981', // Mapped to their primary-container
                    600: '#006c49', // Mapped to their primary
                    900: '#00422b', // Mapped to on-primary
                }
            },
            fontFamily: {
                "label-sm": ["Plus Jakarta Sans", "sans-serif"],
                "body-lg": ["Plus Jakarta Sans", "sans-serif"],
                "h3": ["Plus Jakarta Sans", "sans-serif"],
                "button": ["Plus Jakarta Sans", "sans-serif"],
                "h1": ["Plus Jakarta Sans", "sans-serif"],
                "body-md": ["Plus Jakarta Sans", "sans-serif"],
                "h2": ["Plus Jakarta Sans", "sans-serif"],
                "sans": ["Plus Jakarta Sans", "sans-serif"], // default override
            }
        },
    },
    plugins: [],
}
