export function formatTime(totalSeconds) {
    if (totalSeconds < 0) totalSeconds = 0;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function estimateCEFR(score, totalQuestions) {
    if (totalQuestions === 0) return 'N/A';
    const percentage = (score / totalQuestions) * 100;

    if (percentage <= 16) return 'A1 (Beginner)';          // 0-10 questions for 60 total
    if (percentage <= 33) return 'A2 (Elementary)';       // 11-20
    if (percentage <= 50) return 'B1 (Intermediate)';     // 21-30
    if (percentage <= 66) return 'B2 (Upper Intermediate)'; // 31-40
    if (percentage <= 83) return 'C1 (Advanced)';         // 41-50
    return 'C2 (Proficiency)';                           // 51-60
}


export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
