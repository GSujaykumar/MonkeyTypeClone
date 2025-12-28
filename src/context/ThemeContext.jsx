import { createContext, useContext, useEffect, useState } from 'react';
import { themes } from '../utils/themes';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved && themes[saved] ? saved : 'dark';
    });

    useEffect(() => {
        const t = themes[theme];
        const root = document.documentElement;

        root.style.setProperty('--bg-color', t.bg);
        root.style.setProperty('--main-color', t.main);
        root.style.setProperty('--caret-color', t.caret);
        root.style.setProperty('--sub-color', t.sub);
        root.style.setProperty('--text-color', t.text);
        root.style.setProperty('--error-color', t.error);

        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
