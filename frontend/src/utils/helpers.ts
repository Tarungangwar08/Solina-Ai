export const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const calculateEmotionPercentage = (emotionCounts: Record<string, number>): Record<string, number> => {
    const total = Object.values(emotionCounts).reduce((sum, count) => sum + count, 0);
    return Object.fromEntries(
        Object.entries(emotionCounts).map(([emotion, count]) => [
            emotion,
            total > 0 ? (count / total) * 100 : 0,
        ])
    );
};

export const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};