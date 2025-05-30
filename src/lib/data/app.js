import UIManager from './ui_manager.js';
import { formatTime, estimateCEFR } from './utils.js';

const App = {
    testData: null,
    allQuestions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    score: 0,
    timerInterval: null,
    timeRemaining: 0, 
    totalTestTime: 0, 

    async init() {
        try {
            const response = await fetch('english_test_questions.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.testData = await response.json();
            this.prepareQuestions();
            this.totalTestTime = (this.testData.testSettings?.totalTimeMinutes || 40) * 60;
            this.timeRemaining = this.totalTestTime;
            UIManager.renderStartScreen(this.allQuestions.length, this.totalTestTime / 60);
            this.bindInitialEventListeners();
        } catch (error) {
            console.error("Error loading test data:", error);
            UIManager.displayError("Failed to load test questions. Please try refreshing the page.");
        }
    },

    prepareQuestions() {
        const { vocabulary, grammar, reading_comprehension, listening_comprehension } = this.testData;
        let prepared = [];

        vocabulary.forEach(q => prepared.push({ ...q, questionText: q.question, section: "Vocabulary" }));
        grammar.forEach(q => prepared.push({ ...q, questionText: q.question, section: "Grammar" }));

        reading_comprehension.forEach(passage => {
            passage.questions.forEach(q => {
                prepared.push({
                    ...q,
                    id: q.question_id_in_passage, 
                    questionText: q.question, 
                    passageTitle: passage.passage_title,
                    passageText: passage.passage_text,
                    section: "Reading Comprehension"
                });
            });
        });

        listening_comprehension.forEach(script => {
            script.questions.forEach(q => {
                prepared.push({
                    ...q,
                    id: q.question_id_in_script, 
                    questionText: q.question, 
                    scriptTitle: script.script_title,
                    scriptText: script.script, 
                    audioSrc: script.audioSrc,
                    section: "Listening Comprehension"
                });
            });
        });
        this.allQuestions = prepared;
        this.userAnswers = new Array(this.allQuestions.length).fill(null);
    },

    bindInitialEventListeners() {
        UIManager.startButton.addEventListener('click', () => this.startTest());
        UIManager.retakeTestButton.addEventListener('click', () => this.resetAndStart());
        UIManager.endTestButtonHeader.addEventListener('click', () => this.confirmEndTestEarly());
    },

    startTest() {
        this.currentQuestionIndex = 0;
        this.userAnswers.fill(null);
        this.score = 0;
        this.timeRemaining = this.totalTestTime;
        UIManager.showScreen('test-screen');
        this.displayCurrentQuestion();
        this.startTimer();
        UIManager.updateNavigationButtons(this.currentQuestionIndex, this.allQuestions.length);
    },
    
    resetAndStart() {
        UIManager.cleanupAudio(); 
        UIManager.cleanupReviewAudios();
        UIManager.showScreen('start-screen'); 
        this.init(); 
    },

    displayCurrentQuestion() {
        if (this.currentQuestionIndex < 0 || this.currentQuestionIndex >= this.allQuestions.length) {
            console.error("Invalid question index");
            return;
        }
        
        const question = this.allQuestions[this.currentQuestionIndex];
        UIManager.renderQuestion(
            question,
            this.currentQuestionIndex + 1,
            this.allQuestions.length,
            this.userAnswers[this.currentQuestionIndex]
        );
        UIManager.updateProgress(this.currentQuestionIndex + 1, this.allQuestions.length);
        UIManager.updateNavigationButtons(this.currentQuestionIndex, this.allQuestions.length);
    },

    handleOptionSelect(selectedOptionValue) {
        this.userAnswers[this.currentQuestionIndex] = selectedOptionValue;
    },

    nextQuestion() {
        if (this.currentQuestionIndex < this.allQuestions.length - 1) {
            this.currentQuestionIndex++;
            this.displayCurrentQuestion();
        } else {
            this.confirmSubmit();
        }
    },

    prevQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayCurrentQuestion();
        }
    },

    confirmEndTestEarly() {
        UIManager.showSubmitModal(true, `Time remaining: ${formatTime(this.timeRemaining)}`);
    },

    confirmSubmit() {
        UIManager.showSubmitModal(false, `Time remaining: ${formatTime(this.timeRemaining)}`);
    },

    submitTest() {
        clearInterval(this.timerInterval);
        UIManager.cleanupAudio(); 
        UIManager.cleanupReviewAudios();
        this.calculateScore();
        const cefr = estimateCEFR(this.score, this.allQuestions.length);
        const sectionScores = this.calculateSectionScores();
        UIManager.renderResultsScreen(this.score, this.allQuestions.length, cefr, sectionScores);
        UIManager.showScreen('results-screen');
    },

    calculateScore() {
        this.score = 0;
        this.userAnswers.forEach((answer, index) => {
            if (answer !== null && answer === this.allQuestions[index].answer) {
                this.score++;
            }
        });
    },

    calculateSectionScores() {
        const sectionScores = {};
        const sectionTotals = {};

        this.testData.testSettings.sections.forEach(secName => {
            sectionScores[secName] = 0;
            sectionTotals[secName] = 0;
        });
        
        this.allQuestions.forEach((q, index) => {
            sectionTotals[q.section]++;
            if (this.userAnswers[index] !== null && this.userAnswers[index] === q.answer) {
                sectionScores[q.section]++;
            }
        });
        
        const result = {};
        for (const section in sectionScores) {
            result[section] = {
                score: sectionScores[section],
                total: sectionTotals[section],
                percentage: sectionTotals[section] > 0 ? Math.round((sectionScores[section] / sectionTotals[section]) * 100) : 0
            };
        }
        return result;
    },

    startTimer() {
        UIManager.updateTimerDisplay(this.timeRemaining, this.totalTestTime);
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            UIManager.updateTimerDisplay(this.timeRemaining, this.totalTestTime);
            if (this.timeRemaining <= 0) {
                clearInterval(this.timerInterval);
                alert("Time's up! Submitting your test.");
                this.submitTest();
            }
        }, 1000);
    },

    reviewAnswers() {
        UIManager.renderReviewScreen(this.allQuestions, this.userAnswers);
        UIManager.showScreen('review-screen');
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());

export default App;
