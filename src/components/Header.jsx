import { Keyboard, Palette, Clock, Type } from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

const Header = ({
    timeOption, setTimeOption,
    wordOption, setWordOption,
    mode, setMode,
    timeLeft, gameState
}) => {
    const { theme, setTheme, themes } = useTheme();
    const [showThemes, setShowThemes] = useState(false);

    return (
        <header className="flex flex-col md:flex-row justify-between items-center w-full max-w-5xl py-8 mb-4 md:mb-8 gap-4 select-none">
            <div className="flex items-center gap-2 cursor-pointer group">
                <Keyboard className="text-theme-main w-8 h-8 group-hover:-rotate-12 transition-transform duration-300" />
                <h1 className="text-3xl font-bold text-theme-text font-mono relative">
                    monkeytype
                    <span className="absolute -top-2 -right-2 text-[10px] text-theme-sub opacity-50">clone</span>
                </h1>
            </div>

            {/* Config Bar */}
            <div className={clsx("flex flex-col md:flex-row gap-4 items-center transition-opacity duration-300", { 'opacity-0 pointer-events-none': gameState === 'running' })}>

                {/* Mode & Config */}
                <div className="bg-theme-bg/50 p-1 rounded-lg flex items-center gap-4 text-theme-sub text-sm">
                    {/* Mode Switcher */}
                    <div className="flex gap-2 p-1">
                        <button
                            onClick={() => setMode('time')}
                            className={clsx("flex items-center gap-1 hover:text-theme-text transition-colors", { 'text-theme-main': mode === 'time' })}
                        >
                            <Clock size={14} /> Time
                        </button>
                        <button
                            onClick={() => setMode('words')}
                            className={clsx("flex items-center gap-1 hover:text-theme-text transition-colors", { 'text-theme-main': mode === 'words' })}
                        >
                            <Type size={14} /> Words
                        </button>
                    </div>

                    <div className="w-[2px] h-4 bg-theme-sub/20" />

                    {/* Options */}
                    <div className="flex gap-2 p-1">
                        {mode === 'time' ? (
                            [15, 30, 60, 120].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTimeOption(t)}
                                    className={clsx("hover:text-theme-text transition-colors", { 'text-theme-main': timeOption === t })}
                                >
                                    {t}
                                </button>
                            ))
                        ) : (
                            [10, 25, 50, 100].map(w => (
                                <button
                                    key={w}
                                    onClick={() => setWordOption(w)}
                                    className={clsx("hover:text-theme-text transition-colors", { 'text-theme-main': wordOption === w })}
                                >
                                    {w}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Theme Switcher */}
                <div className="relative">
                    <button
                        onClick={() => setShowThemes(!showThemes)}
                        className="flex items-center gap-2 text-theme-sub hover:text-theme-text transition-colors text-sm"
                    >
                        <Palette size={16} />
                        {themes[theme].label}
                    </button>

                    {showThemes && (
                        <div className="absolute top-full right-0 mt-2 bg-theme-bg border border-theme-sub/20 p-2 rounded-lg grid grid-cols-1 gap-1 min-w-[120px] shadow-xl z-50">
                            {Object.entries(themes).map(([key, t]) => (
                                <button
                                    key={key}
                                    onClick={() => { setTheme(key); setShowThemes(false); }}
                                    className="text-left px-3 py-1 rounded text-sm hover:bg-theme-text/10 text-theme-sub hover:text-theme-text flex items-center gap-2"
                                >
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.main }}></span>
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Timer/Count */}
            {gameState === 'running' && (
                <div className="text-3xl text-theme-main font-bold animate-pulse fixed top-8 left-1/2 -translate-x-1/2 md:static md:transform-none">
                    {timeLeft}
                </div>
            )}
        </header>
    );
};

export default Header;
