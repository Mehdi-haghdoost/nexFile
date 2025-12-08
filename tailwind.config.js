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
                    50: '#F5F3FF',
                    400: '#8B7BF8',
                    500: '#4C3CC6',
                    600: '#3D2FA0',
                    900: '#1F1850',
                },
                information: {
                    50: '#EBEFFE',
                    500: '#365AF9',
                },
                error: {
                    400: '#C94653',
                },
                success: {
                    400: '#2CAC68',
                    500: '#1B8946',
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
                'dark-overlay': 'rgba(255, 255, 255, 0.08)',
                'dark-border': 'rgba(255, 255, 255, 0.12)',
                'primary-border': '#4C3CC6',
                'primary-bg': 'rgba(76, 60, 198, 0.08)',
            },
            borderColor: {
                'dark-white-70': 'rgba(255, 255, 255, 0.70)',
            },
            boxShadow: {
                'custom': '0 2px 12px 0 rgba(0, 0, 0, 0.12)',
                'dropdown': '0 0 24px 0 rgba(0, 0, 0, 0.12)',
                'light': '0 4px 8px 0 rgba(0, 0, 0, 0.04)',
                'middle': '0 4px 8px 0 rgba(0, 0, 0, 0.08)',
                'heavy': '0 4px 8px 0 rgba(0, 0, 0, 0.16)',
                'dark-storage': '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
                'dark-dropdown': '0 0 24px 0 rgba(0, 0, 0, 0.30)',
                'dark-panel': '0 2px 14px 0 rgba(0, 0, 0, 0.20)',
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(0deg, #4C3CC6 0%, #7E60F8 100%)',
                'gradient-success': 'linear-gradient(0deg, #1B8946 0%, #2CAC68 100%)',
                'gradient-error': 'linear-gradient(180deg, #E95858 0%, #B63542 100%)',
                'dark-gradient': 'linear-gradient(180deg, #242426 0%, #202022 100%)',
                'dark-neutral-gradient': 'linear-gradient(180deg, #737377 0%, #414144 100%)',
                'dark-gradient-hover':'linear-gradient(180deg, #2A2A32 0%, #1E1E22 100%)',
            },
            fontFamily: {
                'inter': ['Inter', 'sans-serif'],
            }
        }
    },
    plugins: [],
}