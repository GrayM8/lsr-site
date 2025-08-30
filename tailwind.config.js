/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/app/**/*.{ts,tsx,js,jsx,mdx}",
        "./src/components/**/*.{ts,tsx,js,jsx,mdx}",
        "./src/pages/**/*.{ts,tsx,js,jsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                lsr: {
                    orange: "#bf5700",   // UT orange vibe
                    charcoal: "#262626", // dark gray
                },
            },
        },
    },
    plugins: [],
}