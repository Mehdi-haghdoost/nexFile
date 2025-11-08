import { useState, useEffect } from 'react';

/**
 * Custom hook to detect and track dark mode changes
 * @returns {boolean} isDarkMode - Current dark mode state
 */
const useDarkModeCanvas = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const checkDarkMode = () => {
            const isDark = document.documentElement.classList.contains('dark');
            setIsDarkMode(isDark);
        };

        // بررسی اولیه
        checkDarkMode();

        // نظارت بر تغییرات کلاس dark
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    return isDarkMode;
};

export default useDarkModeCanvas;