import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Results = ({ stats, wpmHistory, onRestart }) => {
    const { wpm, accuracy, correctChars, errorChars } = stats;
    const { theme, themes } = useTheme();
    const currentTheme = themes[theme];

    console.log('Results render:', { stats, historyLength: history?.length, history });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl w-full flex flex-col gap-8"
        >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col">
                    <span className="text-3xl text-theme-sub font-bold">wpm</span>
                    <span className="text-6xl text-theme-main font-bold">{wpm}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-3xl text-theme-sub font-bold">acc</span>
                    <span className="text-6xl text-theme-main font-bold">{accuracy}%</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xl text-theme-sub font-bold">characters</span>
                    <span className="text-4xl text-theme-text font-bold">
                        {correctChars}/<span className="text-theme-error">{errorChars}</span>
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xl text-theme-sub font-bold">time</span>
                    <span className="text-4xl text-theme-text font-bold">{wpmHistory.length}s</span>
                </div>
            </div>

            <div className="h-64 md:h-80 w-full bg-theme-bg/50 rounded-lg p-4 custom-chart">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={wpmHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.sub} opacity={0.3} vertical={false} />
                        <XAxis dataKey="time" stroke={currentTheme.sub} />
                        <YAxis stroke={currentTheme.sub} />
                        <Tooltip
                            contentStyle={{ backgroundColor: currentTheme.bg, borderColor: currentTheme.main, color: currentTheme.text }}
                            itemStyle={{ color: currentTheme.text }}
                            cursor={{ stroke: currentTheme.sub, strokeWidth: 1 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="wpm"
                            stroke={currentTheme.main}
                            strokeWidth={3}
                            dot={{ r: 4, fill: currentTheme.main }}
                            activeDot={{ r: 6, fill: currentTheme.main }}
                        />
                        <Line
                            type="monotone"
                            dataKey="errors"
                            stroke={currentTheme.error}
                            strokeWidth={2}
                            dot={{ r: 3, fill: currentTheme.error }}
                            activeDot={{ r: 5, fill: currentTheme.error }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="flex justify-center mt-8">
                <button
                    onClick={onRestart}
                    className="px-8 py-3 bg-theme-text text-theme-bg font-bold rounded hover:bg-theme-main transition-colors text-xl"
                >
                    Next Test
                </button>
            </div>
        </motion.div>
    );
};

export default Results;
