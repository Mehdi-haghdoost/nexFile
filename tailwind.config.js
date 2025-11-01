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
                    50: '#EBEFFE',
                    500: '#365AF9',
                },
                error: {
                    400: '#C94653',
                },
                neutral: {
                    50: '#F1F1F3',
                    100: '#BEBEC1',
                    200: '#9F9FA3',
                    300: '#737379',
                    400: '#8B8B9D',
                    500: '#2E2E37',
                    600: '#2A2A32',
                    700: '#212127',
                    800: '#19191E',
                    900: '#131317'
                },
                stroke: {
                    50: '#FCFCFC',
                    100: '#F6F6F7',
                    200: '#F2F2F3',
                    300: '#ECECEE',
                    400: '#E8E8EA',
                    500: '#E1E0E5',
                },

                // dark mode :
                'dark-overlay': 'rgba(255, 255, 255, 0.08)',
            },
            boxShadow: {
                'custom': '0 2px 12px 0 rgba(0, 0, 0, 0.12)',
                'dropdown': '0 0 24px 0 rgba(0, 0, 0, 0.12);',
                'light': '0 4px 8px 0 rgba(0, 0, 0, 0.04)',
                'middle': '0 4px 8px 0 rgba(0, 0, 0, 0.08)',
                'heavy': '0 4px 8px 0 rgba(0, 0, 0, 0.16)',
                // dark shadow :
                'dark-storage': '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
                'dark-dropdown': '0 0 24px 0 rgba(0, 0, 0, 0.30)',
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(0deg, #4C3CC6 0%, #7E60F8 100%)',
                'gradient-success': 'linear-gradient(0deg, #1B8946 0%, #2CAC68 100%)',
                'gradient-error': 'linear-gradient(180deg, #E95858 0%, #B63542 100%)',
            },
            fontFamily: {
                // فونت اصلی پروژه
                'inter': ['Inter', 'sans-serif'],
            }
        }
    }
}