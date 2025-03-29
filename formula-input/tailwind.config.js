module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            transitionProperty: {
                'width': 'width',
                'height': 'height'
            }
        },
    },
    plugins: [],
}