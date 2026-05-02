/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#006c49',
                    container: '#10b981',
                    fixed: '#6ffbbe',
                    'on-fixed': '#002113'
                },
                secondary: {
                    DEFAULT: '#2b6954',
                    container: '#adedd3',
                    fixed: '#b0f0d6'
                },
                priority: {
                    high: '#EF4444', // Red
                    medium: '#F59E0B', // Yellow
                    low: '#10B981' // Green
                },
                surface: {
                    DEFAULT: '#f8f9ff',
                    on: '#0b1c30',
                    'on-variant': '#3c4a42',
                    dim: '#cbdbf5',
                    bright: '#f8f9ff',
                    container: '#e5eeff',
                    variant: '#d3e4fe',
                    completed: '#9CA3AF'
                },
                background: '#f8f9ff'
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                'button': '9999px',
                'card': '0.5rem',
                'feature': '1rem'
            },
            boxShadow: {
                'ambient': '0 4px 20px rgba(73, 75, 214, 0.04)',
            }
        },
    },
    plugins: [],
    darkMode: 'class'
}
