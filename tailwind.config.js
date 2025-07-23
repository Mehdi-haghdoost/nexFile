/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
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
                stroke: {
                    500: '#E1E0E5',
                },
            },

            backgroundImage: {
                'gradient-primary': 'linear-gradient(0deg, #4C3CC6 0%, #7E60F8 100%)',
                'gradient-primary': 'linear-gradient(0deg, #4C3CC6 18.54%, #7E60F8 100%)',
                 'gradient-success': 'linear-gradient(0deg, #1B8946 0%, #2CAC68 100%)',
            },
            fontFamily: {
                // فونت اصلی پروژه
                'inter': ['Inter', 'sans-serif'],
            }
        }
    }
}