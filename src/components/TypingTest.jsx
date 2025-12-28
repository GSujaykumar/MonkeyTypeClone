import { useState, useRef, useEffect } from 'react';
import { useTypingGame } from '../hooks/useTypingGame';
import WordDisplay from './WordDisplay';
import Header from './Header';
import Results from './Results';
import { RotateCcw } from 'lucide-react';

const TypingTest = () => {
    const [mode, setMode] = useState('time'); // 'time' or 'words'
    const [timeOption, setTimeOption] = useState(30);
    const [wordOption, setWordOption] = useState(25);

    const {
        timeLeft,
        gameState,
        words,
        currWordIndex,
        currInput,
        stats,
        wpmHistory,
        resetGame,
        handleInput,
        wordHistory
    } = useTypingGame(mode, timeOption, wordOption);

    const inputRef = useRef(null);

    // Focus input on load and game reset
    useEffect(() => {
        if (gameState !== 'finished') {
            inputRef.current?.focus();
        }
    }, [gameState, resetGame]);

    const handleFocus = () => {
        if (gameState !== 'finished') {
            inputRef.current?.focus();
        }
    };

    const handleRestart = () => {
        resetGame();
        inputRef.current?.focus();
    };

    return (
        <div
            className="min-h-screen bg-theme-bg w-full flex flex-col items-center p-8 outline-none transition-colors duration-200"
            onClick={handleFocus}
            tabIndex={-1}
            onKeyDown={(e) => {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    handleRestart();
                }
            }}
        >
            <Header
                timeOption={timeOption}
                setTimeOption={setTimeOption}
                wordOption={wordOption}
                setWordOption={setWordOption}
                mode={mode}
                setMode={setMode}
                timeLeft={timeLeft}
                gameState={gameState}
            />

            <div className="flex-1 w-full max-w-5xl flex flex-col items-center justify-center relative">
                {gameState === 'finished' ? (
                    <Results stats={stats} wpmHistory={wpmHistory} onRestart={handleRestart} />
                ) : (
                    <>
                        {/* Timer visual if not in header */}
                        <div className="w-full text-theme-main text-2xl font-mono mb-4 text-left pl-1 h-8">
                            {gameState === 'running' ? timeLeft : (
                                <span className="text-theme-sub">&nbsp;</span>
                            )}
                        </div>

                        <div className="relative w-full flex justify-center">
                            <WordDisplay
                                words={words}
                                currWordIndex={currWordIndex}
                                currInput={currInput}
                                wordHistory={wordHistory}
                            />

                            {/* Input overlay - needs to be capable of handling spaces. 
                     We use a transparent input. 
                 */}
                            <input
                                ref={inputRef}
                                type="text"
                                className="absolute opacity-0 top-0 left-0 h-full w-full cursor-default"
                                value={currInput}
                                onChange={handleInput}
                                autoFocus
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                            />
                        </div>

                        <div className="mt-12 flex flex-col items-center gap-2 text-theme-sub/50 text-sm">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleRestart(); }}
                                className="p-4 rounded-full hover:bg-theme-text/10 hover:text-theme-text transition-colors group"
                            >
                                <RotateCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-300" />
                            </button>
                            <div className="hidden md:block">
                                <kbd className="bg-theme-sub/20 px-2 py-1 rounded mx-1">Tab</kbd> to restart
                            </div>
                        </div>
                    </>
                )}
            </div>

            <footer className="w-full max-w-5xl text-left text-theme-sub text-xs py-4 mt-auto flex gap-4">
                <span>tab: restart</span>
                <span>esc: unfocus</span>
            </footer>
        </div>
    );
};

export default TypingTest;
