/** @type {import('tailwindcss').Config} */
module.exports = {
    Content: [
        './src/**/*.{js,ts,jsx,tsx}',
        './src/app/**/*.{js,ts,jsx,tsx}',
        './src/components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    500: '#4C3CC6',
                },
                information: {
                    500: '#365AF9',
                },
                neutral: {
                    300: '#737379',
                    500: '#2E2E37',
                },
            },

            backgroundImage: {
                'gradient-primary': 'linear-gradient(0deg, #4C3CC6 0%, #7E60F8 100%)',
            },
            fontFamily: {
                // فونت اصلی پروژه
                'inter': ['Inter', 'sans-serif'],
            }
        }
    }
}