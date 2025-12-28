import { useState, useEffect, useCallback, useRef } from 'react';
import { generateWords } from '../utils/words';

export const useTypingGame = (mode, timeOption, wordOption) => {
    const [timeLeft, setTimeLeft] = useState(timeOption);
    const [gameState, setGameState] = useState('idle'); // idle, running, finished

    // Word-based engine
    const [words, setWords] = useState([]);
    const [currWordIndex, setCurrWordIndex] = useState(0);
    const [currInput, setCurrInput] = useState('');
    const [wordHistory, setWordHistory] = useState([]);

    const [stats, setStats] = useState({ wpm: 0, accuracy: 0, correctChars: 0, errorChars: 0 });
    const [wpmHistory, setWpmHistory] = useState([]);

    const intervalRef = useRef(null);
    const startTimeRef = useRef(0);

    // Stats Calculation
    const calculateStats = useCallback((final = false) => {
        // Calculate Time Elapsed
        let timeElapsed;
        if (mode === 'time') {
            timeElapsed = timeOption - timeLeft;
        } else {
            // In words mode, timeLeft tracks elapsed seconds
            timeElapsed = timeLeft;
        }

        const minutes = Math.max(timeElapsed, 0.5) / 60;

        let correctChars = 0;
        let errorChars = 0;
        let spaces = 0;

        // History
        wordHistory.forEach(stat => {
            correctChars += stat.correctChars;
            errorChars += (stat.totalChars - stat.correctChars);
            spaces++; // correct word = space
        });

        // Current Input (only if running)
        if (!final && words[currWordIndex]) {
            const currentTarget = words[currWordIndex];
            const len = Math.min(currInput.length, currentTarget.length);
            for (let i = 0; i < len; i++) {
                if (currInput[i] === currentTarget[i]) correctChars++;
                else errorChars++;
            }
            if (currInput.length > currentTarget.length) {
                errorChars += (currInput.length - currentTarget.length);
            }
        }

        const totalChars = correctChars + errorChars + spaces;
        // WPM = (all typed / 5) / min
        const wpm = Math.round(((correctChars + spaces) / 5) / minutes);
        const accuracy = totalChars > 0 ? Math.round(((correctChars + spaces) / totalChars) * 100) : 100;

        setStats({ wpm, accuracy, correctChars: correctChars + spaces, errorChars });
        return { wpm, accuracy };
    }, [wordHistory, currInput, currWordIndex, words, timeLeft, mode, timeOption]);

    const endGame = useCallback(() => {
        clearInterval(intervalRef.current);
        setGameState('finished');
        calculateStats(true); // Final stats
    }, [calculateStats]);

    // Initialize/Reset
    const resetGame = useCallback(() => {
        clearInterval(intervalRef.current);
        setGameState('idle');

        // Default 100 for time mode, or wordOption for words mode
        const effectiveCount = mode === 'words' ? wordOption : 300;

        setWords(generateWords(effectiveCount).split(' '));
        setCurrWordIndex(0);
        setCurrInput('');
        setWordHistory([]);
        setStats({ wpm: 0, accuracy: 0, correctChars: 0, errorChars: 0 });
        setWpmHistory([]);

        if (mode === 'time') {
            setTimeLeft(timeOption);
        } else {
            setTimeLeft(0); // In words mode, this acts as elapsed time
        }
    }, [mode, timeOption, wordOption]);

    useEffect(() => {
        resetGame();
    }, [resetGame]);

    // Timer Logic
    const startTimer = () => {
        startTimeRef.current = Date.now();
        intervalRef.current = setInterval(() => {
            if (mode === 'time') {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        endGame();
                        return 0;
                    }
                    return prev - 1;
                });
            } else {
                // Words mode: increment timer (timeLeft here acts as elapsed)
                setTimeLeft(prev => prev + 1);
            }
        }, 1000);
    };

    const handleInput = useCallback((e) => {
        if (gameState === 'finished') return;

        const value = e.target.value;
        const char = value.slice(-1);

        // Start game
        if (gameState === 'idle') {
            setGameState('running');
            startTimer();
        }

        if (char === ' ') {
            const targetWord = words[currWordIndex];
            const inputTrimmed = value.trim();

            let wCorrect = 0;
            const len = Math.min(inputTrimmed.length, targetWord.length);
            for (let i = 0; i < len; i++) {
                if (inputTrimmed[i] === targetWord[i]) wCorrect++;
            }

            setWordHistory(prev => [...prev, {
                word: targetWord,
                input: inputTrimmed,
                correctChars: wCorrect,
                totalChars: inputTrimmed.length,
                isCorrect: inputTrimmed === targetWord
            }]);

            setCurrWordIndex(prev => {
                const newIndex = prev + 1;
                // Check Win Condition for Words Mode
                if (mode === 'words' && newIndex >= wordOption) {
                    endGame();
                }
                return newIndex;
            });
            setCurrInput('');
            return;
        }

        setCurrInput(value);
    }, [gameState, currWordIndex, words, mode, wordOption, endGame, wordOption]); // Added wordOption to deps

    // Live stats update
    useEffect(() => {
        if (gameState === 'running') {
            calculateStats();
        }
    }, [currInput, wordHistory, timeLeft, gameState, calculateStats]);

    // History Recording
    useEffect(() => {
        if (gameState === 'running') {
            const timeElapsed = mode === 'time' ? timeOption - timeLeft : timeLeft;
            if (timeElapsed > 0) {
                setWpmHistory(prev => {
                    const lastEntry = prev[prev.length - 1];
                    // throttle to once per second roughly
                    if (!lastEntry || lastEntry.time !== timeElapsed) {
                        return [...prev, { time: timeElapsed, wpm: stats.wpm, errors: stats.errorChars }];
                    }
                    return prev;
                });
            }
        }
    }, [timeLeft, gameState, stats.wpm, stats.errorChars, mode, timeOption]);

    return {
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
    };
};
