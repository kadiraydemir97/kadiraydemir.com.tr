/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                ubuntu: {
                    orange: '#E95420',
                    "warm-grey": '#AEA79F',
                    "cool-grey": '#333333',
                    "light-grey": '#F7F7F7',
                    header: '#1C1C1C',
                    dock: 'rgba(29, 29, 29, 0.9)',
                }
            },
            fontFamily: {
                ubuntu: ['Ubuntu', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
