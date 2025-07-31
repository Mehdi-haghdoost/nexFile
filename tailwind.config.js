/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
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
                    400: '#8B8B9D',
                    500: '#2E2E37',
                    600: '#2A2A32',
                    800: '#19191E',
                },
                stroke: {
                    500: '#E1E0E5',
                },
            },
            boxShadow: {
                'custom': '0 2px 12px 0 rgba(0, 0, 0, 0.12)',
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