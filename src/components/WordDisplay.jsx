import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

const WordDisplay = ({ words, currWordIndex, currInput, wordHistory }) => {
    const containerRef = useRef(null);
    const activeRef = useRef(null);

    // Auto-scroll logic: keep active word in view
    useEffect(() => {
        if (activeRef.current && containerRef.current) {
            const container = containerRef.current;
            const active = activeRef.current;

            const containerTop = container.offsetTop;
            const activeTop = active.offsetTop;

            // If active word moves to a new line (offset changes), scroll
            // Simple heuristic: just ensure it's visible. 
            // Or simpler: Transform translate Y based on line height.
            // For now, let's just ensure we scroll the overflowing text if valid.
            // Actually, monkeytype hides previous lines. 
            // Let's implement partial scrolling later if requested. 
            // For now, basic scrollIntoView if outside.
        }
    }, [currWordIndex]);


    return (
        <div
            ref={containerRef}
            className={clsx(
                "flex flex-wrap text-2xl md:text-3xl font-mono leading-relaxed select-none w-full max-w-5xl h-48 overflow-hidden content-start gap-y-2",
            )}
        >
            {words.map((word, wIndex) => {
                let chars = word.split('');
                const isPast = wIndex < currWordIndex;
                const isActive = wIndex === currWordIndex;

                // If past, validation comes from history
                // If active, validation comes from currInput
                // If future, just gray

                let displayChars = chars;
                let extraChars = [];

                if (isActive) {
                    // Check for extra chars typed
                    if (currInput.length > word.length) {
                        const extra = currInput.slice(word.length);
                        extraChars = extra.split('');
                    }
                } else if (isPast) {
                    const hist = wordHistory[wIndex];
                    if (hist && hist.input.length > word.length) {
                        const extra = hist.input.slice(word.length);
                        extraChars = extra.split('');
                    }
                }

                return (
                    <div
                        key={wIndex}
                        ref={isActive ? activeRef : null}
                        className={clsx("mr-4 relative flex mb-2", {
                            // 'opacity-50': isPast // Optional fade for past words
                        })}
                    >
                        {/* Standard Chars */}
                        {displayChars.map((char, cIndex) => {
                            let state = 'pending'; // pending, correct, error

                            if (isPast) {
                                const hist = wordHistory[wIndex];
                                if (hist) {
                                    if (cIndex < hist.input.length) {
                                        state = hist.input[cIndex] === char ? 'correct' : 'error';
                                    } else {
                                        state = 'missing'; // Missed chars in past word? usually shown as error or ignored
                                    }
                                }
                            } else if (isActive) {
                                if (cIndex < currInput.length) {
                                    state = currInput[cIndex] === char ? 'correct' : 'error';
                                }
                            }

                            // Caret Logic
                            const isCaret = isActive && cIndex === currInput.length;

                            return (
                                <span key={cIndex} className="relative">
                                    {isCaret && (
                                        <motion.div
                                            layoutId="caret"
                                            className="absolute -left-1 top-0 bottom-0 w-[3px] bg-theme-caret rounded-full"
                                            initial={{ opacity: 1 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.12, ease: "linear" }}
                                        />
                                    )}
                                    <span className={clsx({
                                        'text-theme-text': state === 'correct',
                                        'text-theme-error': state === 'error' || state === 'missing',
                                        'text-theme-sub': state === 'pending',
                                    })}>
                                        {char}
                                    </span>

                                </span>
                            );
                        })}

                        {/* Extra Chars (always errors) */}
                        {extraChars.map((char, eIndex) => {
                            // If active, this is the cursor position potentially
                            const realIndex = word.length + eIndex;
                            const isCaret = isActive && realIndex === currInput.length;

                            return (
                                <span key={`extra-${eIndex}`} className="relative text-theme-error/70">
                                    {isCaret && (
                                        <motion.div
                                            layoutId="caret"
                                            className="absolute -left-1 top-0 bottom-0 w-[3px] bg-theme-caret rounded-full"
                                            initial={{ opacity: 1 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.12, ease: "linear" }}
                                        />
                                    )}
                                    {char}
                                </span>
                            )
                        })}

                        {/* Trailing Caret if at very end of word (and no extras) */}
                        {isActive && currInput.length === word.length && extraChars.length === 0 && (
                            <motion.div
                                layoutId="caret"
                                className="absolute -right-1 top-0 bottom-0 w-[3px] bg-theme-caret rounded-full"
                                initial={{ opacity: 1 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.12, ease: "linear" }}
                            />
                        )}

                    </div>
                );
            })}
        </div>
    );
};

export default WordDisplay;
