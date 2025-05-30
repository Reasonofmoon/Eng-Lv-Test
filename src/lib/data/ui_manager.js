import App from './app.js';
import { formatTime } from './utils.js';

const UIManager = {
    startScreen: document.getElementById('start-screen'),
    testScreen: document.getElementById('test-screen'),
    resultsScreen: document.getElementById('results-screen'),
    reviewScreen: document.getElementById('review-screen'),

    totalQuestionsInfo: document.getElementById('total-questions-info'),
    testDurationInfo: document.getElementById('test-duration-info'),
    startButton: document.getElementById('start-test-button'),
    
    testHeader: document.getElementById('test-header'),
    sectionNameDisplay: document.getElementById('section-name'),
    timerDisplay: document.getElementById('timer'),
    progressText: document.getElementById('progress-text'),
    progressBar: document.getElementById('progress-bar'),
    endTestButtonHeader: document.getElementById('end-test-button-header'),

    questionContainer: document.getElementById('question-container'),
    prevButton: document.getElementById('prev-question-button'),
    nextButton: document.getElementById('next-question-button'),

    totalScoreDisplay: document.getElementById('total-score'),
    cefrLevelDisplay: document.getElementById('cefr-level'),
    sectionScoresChartContainer: document.getElementById('section-scores-chart'),
    reviewAnswersButton: document.getElementById('review-answers-button'),
    retakeTestButton: document.getElementById('retake-test-button'),
    
    reviewQuestionsContainer: document.getElementById('review-questions-container'),
    backToResultsButton: document.getElementById('back-to-results-button'),

    submitModal: document.getElementById('submit-modal'),
    modalMessage: document.getElementById('modal-message'),
    modalTimerInfo: document.getElementById('modal-timer-info'),
    cancelSubmitButton: document.getElementById('cancel-submit-button'),
    confirmSubmitButton: document.getElementById('confirm-submit-button'),

    currentAudio: null,
    currentReviewAudios: [],

    init() {
        this.prevButton.addEventListener('click', () => App.prevQuestion());
        this.nextButton.addEventListener('click', () => App.nextQuestion());
        this.cancelSubmitButton.addEventListener('click', () => this.hideSubmitModal());
        this.confirmSubmitButton.addEventListener('click', () => {
            this.hideSubmitModal();
            App.submitTest();
        });
        this.reviewAnswersButton.addEventListener('click', () => App.reviewAnswers());
        this.backToResultsButton.addEventListener('click', () => {
            this.cleanupReviewAudios();
            this.showScreen('results-screen');
        });
    },

    getSVG(type) {
        const svgs = {
            play: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
            pause: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
            replay: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" /></svg>',
        };
        return svgs[type] || '';
    },

    cleanupAudio() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.removeAttribute('src');
            this.currentAudio.load();
            this.currentAudio = null;
        }
    },
    
    cleanupReviewAudios() {
        this.currentReviewAudios.forEach(audio => {
            if (audio) {
                audio.pause();
                audio.removeAttribute('src');
                audio.load();
            }
        });
        this.currentReviewAudios = [];
    },

    createAudioPlayer(audioSrc, uniqueId, isForReview = false) {
        const playerContainer = document.createElement('div');
        playerContainer.className = 'audio-player-container my-4 p-4 bg-gray-100 rounded-lg shadow flex items-center space-x-3';
        
        const audio = new Audio(audioSrc);
        if (isForReview) {
            this.currentReviewAudios.push(audio);
        } else {
            this.currentAudio = audio;
        }

        const playPauseBtn = document.createElement('button');
        playPauseBtn.className = 'bg-[#4A90E2] text-white p-2 rounded-full hover:bg-[#357ABD] transition-colors focus:outline-none';
        playPauseBtn.innerHTML = this.getSVG('play');
        
        const seekBar = document.createElement('input');
        seekBar.type = 'range';
        seekBar.value = '0';
        seekBar.max = '100';
        seekBar.className = 'w-full h-2 bg-gray-300 rounded-full appearance-none cursor-pointer';
        seekBar.style.setProperty('--thumb-color', '#50E3C2'); 
        seekBar.style.setProperty('--track-color', '#50E3C2');

        const currentTimeDisplay = document.createElement('span');
        currentTimeDisplay.className = 'text-xs text-gray-600';
        currentTimeDisplay.textContent = '0:00';

        const durationDisplay = document.createElement('span');
        durationDisplay.className = 'text-xs text-gray-600';
        durationDisplay.textContent = '0:00';

        const replayBtn = document.createElement('button');
        replayBtn.title = 'Replay';
        replayBtn.className = 'text-gray-500 hover:text-[#4A90E2] transition-colors p-1 focus:outline-none';
        replayBtn.innerHTML = this.getSVG('replay');

        audio.addEventListener('loadedmetadata', () => {
            durationDisplay.textContent = formatTime(audio.duration);
            seekBar.max = audio.duration;
        });

        audio.addEventListener('timeupdate', () => {
            currentTimeDisplay.textContent = formatTime(audio.currentTime);
            seekBar.value = audio.currentTime;
        });

        audio.addEventListener('ended', () => {
            playPauseBtn.innerHTML = this.getSVG('play');
            seekBar.value = '0';
            audio.currentTime = 0;
        });

        playPauseBtn.addEventListener('click', () => {
            if (audio.paused || audio.ended) {
                audio.play();
                playPauseBtn.innerHTML = this.getSVG('pause');
            } else {
                audio.pause();
                playPauseBtn.innerHTML = this.getSVG('play');
            }
        });

        seekBar.addEventListener('input', () => {
            audio.currentTime = parseFloat(seekBar.value);
        });

        replayBtn.addEventListener('click', () => {
            audio.currentTime = 0;
            audio.play();
            playPauseBtn.innerHTML = this.getSVG('pause');
        });
        
        playerContainer.appendChild(playPauseBtn);
        playerContainer.appendChild(seekBar);
        playerContainer.appendChild(currentTimeDisplay);
        playerContainer.appendChild(document.createTextNode('/'));
        playerContainer.appendChild(durationDisplay);
        playerContainer.appendChild(replayBtn);
        
        return playerContainer;
    },

    showScreen(screenId) {
        [this.startScreen, this.testScreen, this.resultsScreen, this.reviewScreen].forEach(s => s.classList.add('hidden'));
        document.getElementById(screenId).classList.remove('hidden');
        window.scrollTo(0, 0);
    },

    renderStartScreen(totalQuestions, testDuration) {
        this.totalQuestionsInfo.textContent = totalQuestions;
        this.testDurationInfo.textContent = testDuration;
        this.showScreen('start-screen');
    },

    updateTimerDisplay(timeRemaining, totalTime) {
        this.timerDisplay.textContent = formatTime(timeRemaining);
        this.timerDisplay.classList.remove('timer-warning', 'timer-critical');
        if (timeRemaining <= totalTime * 0.1) { 
            this.timerDisplay.classList.add('timer-critical');
        } else if (timeRemaining <= totalTime * 0.25) { 
            this.timerDisplay.classList.add('timer-warning');
        }
    },

    updateProgress(current, total) {
        this.progressText.textContent = `Question ${current}/${total}`;
        const percentage = (current / total) * 100;
        this.progressBar.style.width = `${percentage}%`;
    },

    updateNavigationButtons(currentIndex, totalQuestions) {
        this.prevButton.disabled = currentIndex === 0;
        this.prevButton.classList.toggle('opacity-50', currentIndex === 0);
        this.prevButton.classList.toggle('cursor-not-allowed', currentIndex === 0);

        if (currentIndex === totalQuestions - 1) {
            this.nextButton.textContent = 'Submit Test';
            this.nextButton.classList.replace('bg-[#4A90E2]', 'bg-[#F5A623]'); 
            this.nextButton.classList.replace('hover:bg-[#357ABD]', 'hover:bg-[#d98e1f]');
        } else {
            this.nextButton.textContent = 'Next';
            this.nextButton.classList.replace('bg-[#F5A623]', 'bg-[#4A90E2]');
            this.nextButton.classList.replace('hover:bg-[#d98e1f]', 'hover:bg-[#357ABD]');
        }
    },
    
    renderQuestion(questionData, qNum, totalQs, selectedAnswer) {
        this.questionContainer.innerHTML = ''; 
        this.sectionNameDisplay.textContent = questionData.section;

        if (questionData.section !== "Listening Comprehension") {
            this.cleanupAudio(); 
        }


        let questionHeaderHTML = `<h2 class="text-xl md:text-2xl font-semibold mb-2 text-gray-800">Question ${qNum} of ${totalQs}</h2>`;
        
        let questionBodyHTML = '';

        if (questionData.section === "Reading Comprehension") {
            questionBodyHTML = `
                <div class="md:flex md:space-x-6">
                    <div class="md:w-1/2 mb-4 md:mb-0 max-h-[300px] md:max-h-[500px] overflow-y-auto p-3 border rounded-lg bg-gray-50">
                        <h3 class="text-lg font-semibold text-[#4A90E2] mb-2">${questionData.passageTitle}</h3>
                        <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">${questionData.passageText}</p>
                    </div>
                    <div class="md:w-1/2">
                        <p class="text-lg text-gray-700 mb-4 leading-relaxed">${questionData.questionText}</p>
                        <div class="space-y-3">
                            ${this.generateOptionsHTML(questionData.options, selectedAnswer, questionData.id)}
                        </div>
                    </div>
                </div>`;
        } else if (questionData.section === "Listening Comprehension") {
            this.cleanupAudio(); 
            const audioPlayerElement = this.createAudioPlayer(questionData.audioSrc, `${questionData.id}_${qNum}_main`, false);
            
            const listeningQuestionContent = document.createElement('div');
            listeningQuestionContent.innerHTML = `
                <p class="text-lg text-gray-700 mb-4 leading-relaxed">${questionData.questionText || "Listen to the audio and answer the question."}</p>
                <p class="text-sm text-gray-500 mb-1">Audio: ${questionData.scriptTitle || 'Audio Clip'}</p>
            `;
            listeningQuestionContent.appendChild(audioPlayerElement);
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'space-y-3 mt-4';
            optionsDiv.innerHTML = this.generateOptionsHTML(questionData.options, selectedAnswer, questionData.id);
            listeningQuestionContent.appendChild(optionsDiv);
            questionBodyHTML = listeningQuestionContent.innerHTML; 
        } else { 
            questionBodyHTML = `
                <p class="text-lg text-gray-700 mb-6 leading-relaxed">${questionData.questionText}</p>
                <div class="space-y-3">
                    ${this.generateOptionsHTML(questionData.options, selectedAnswer, questionData.id)}
                </div>`;
        }
        this.questionContainer.innerHTML = questionHeaderHTML + questionBodyHTML;

        if (questionData.section === "Listening Comprehension") {
             const tempContainer = document.createElement('div');
             tempContainer.innerHTML = questionBodyHTML;
             const audioPlayerPlaceholder = tempContainer.querySelector('.audio-player-container');
             if (audioPlayerPlaceholder && audioPlayerPlaceholder.parentNode) {
                const actualPlayer = this.createAudioPlayer(questionData.audioSrc, `${questionData.id}_${qNum}_main_final`, false);
                audioPlayerPlaceholder.parentNode.replaceChild(actualPlayer, audioPlayerPlaceholder);
             }
             this.questionContainer.innerHTML = questionHeaderHTML + tempContainer.innerHTML;
        }


        this.attachOptionListeners(questionData.id);
    },
        
    generateOptionsHTML(options, selectedAnswer, questionIdPrefix) {
        return options.map((opt, index) => {
            const optionValue = opt.substring(0,1); 
            const isSelected = selectedAnswer === optionValue;
            return `
                <div data-value="${optionValue}" class="question-option border-2 border-gray-300 p-4 rounded-lg text-gray-700 hover:border-[#4A90E2] ${isSelected ? 'selected' : ''}">
                    ${opt}
                </div>`;
        }).join('');
    },

    attachOptionListeners(questionIdPrefix) {
        const options = this.questionContainer.querySelectorAll('.question-option');
        options.forEach(optElement => {
            optElement.addEventListener('click', () => {
                options.forEach(sib => sib.classList.remove('selected', 'transform', 'translate-y-[-2px]', 'shadow-md'));
                optElement.classList.add('selected', 'transform', 'translate-y-[-2px]', 'shadow-md');
                App.handleOptionSelect(optElement.dataset.value);
            });
        });
    },

    renderResultsScreen(score, totalQuestions, cefr, sectionScores) {
        this.totalScoreDisplay.textContent = `${score} / ${totalQuestions}`;
        this.cefrLevelDisplay.textContent = cefr;
        this.sectionScoresChartContainer.innerHTML = '';
        
        for (const section in sectionScores) {
            const data = sectionScores[section];
            const barId = section.toLowerCase().replace(/\s+/g, '-') + '-bar';
            const chartHTML = `
                <div class="text-left">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-gray-700 font-medium">${section}</span>
                        <span class="text-sm font-semibold text-[#4A90E2]">${data.score}/${data.total} (${data.percentage}%)</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-5 shadow-inner overflow-hidden">
                        <div id="${barId}" class="bg-[#50E3C2] h-5 rounded-full transition-all duration-1000 ease-out text-xs text-white flex items-center justify-center" style="width: 0%;">
                           ${data.percentage > 10 ? data.percentage + '%' : ''}
                        </div>
                    </div>
                </div>
            `;
            this.sectionScoresChartContainer.innerHTML += chartHTML;

            setTimeout(() => {
                const barElement = document.getElementById(barId);
                if (barElement) {
                    barElement.style.width = `${data.percentage}%`;
                }
            }, 100); 
        }
    },
    
    renderReviewScreen(allQuestions, userAnswers) {
        this.reviewQuestionsContainer.innerHTML = '';
        this.cleanupReviewAudios();

        allQuestions.forEach((q, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === q.answer;
            
            let questionDisplayHTML = `<p class="font-semibold text-lg text-gray-800">${index + 1}. ${q.questionText || q.question}</p>`;
            
            if (q.section === "Reading Comprehension") {
                questionDisplayHTML = `
                    <div class="mb-2 p-3 border rounded-md bg-gray-50 max-h-48 overflow-y-auto">
                        <h4 class="text-sm font-semibold text-[#4A90E2]">${q.passageTitle} (Passage Excerpt)</h4>
                        <p class="text-xs text-gray-600 leading-snug whitespace-pre-line">${q.passageText.substring(0,200)}...</p>
                    </div>
                    <p class="font-semibold text-lg text-gray-800">${index + 1}. ${q.questionText}</p>
                `;
            }
            
            let audioPlayerHTML = '';
            if (q.section === "Listening Comprehension") {
                 questionDisplayHTML = `
                    <div class="mb-2 p-3 border rounded-md bg-gray-50">
                        <h4 class="text-sm font-semibold text-[#4A90E2]">${q.scriptTitle}</h4>
                    </div>
                    <p class="font-semibold text-lg text-gray-800">${index + 1}. ${q.questionText}</p>
                `;
                const audioPlayerElement = this.createAudioPlayer(q.audioSrc, `${q.id}_review_${index}`, true);
                audioPlayerHTML = `<div id="audio_player_review_${index}"></div>`;
            }

            const optionsHTML = q.options.map(optText => {
                const optValue = optText.substring(0,1);
                let optClasses = "question-option border-2 border-gray-300 p-3 rounded-md text-sm ";
                if (optValue === q.answer) {
                    optClasses += "correct "; 
                }
                if (optValue === userAnswer) { 
                    if (!isCorrect) { 
                        optClasses += "incorrect ";
                    } else { 
                        optClasses += "selected "; 
                    }
                }
                 return `<div class="${optClasses}">${optText}</div>`;
            }).join('');

            const reviewItemHTML = `
                <div class="p-4 border rounded-lg shadow-sm bg-white">
                    ${questionDisplayHTML}
                    ${audioPlayerHTML}
                    <div class="my-3 space-y-2">${optionsHTML}</div>
                    <p class="text-sm mt-2">
                        Your Answer: <span class="font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}">${userAnswer || 'Not Answered'}</span>
                        | Correct Answer: <span class="font-semibold text-green-600">${q.answer}</span>
                    </p>
                    ${q.explanation ? `<div class="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800"><strong>Explanation:</strong> ${q.explanation}</div>` : ''}
                     ${q.section === "Listening Comprehension" && q.scriptText ? `<div class="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800 max-h-40 overflow-y-auto"><strong>Script:</strong><br><span class="whitespace-pre-line">${q.scriptText}</span></div>` : ''}\n                </div>`;
            this.reviewQuestionsContainer.innerHTML += reviewItemHTML;

            if (q.section === "Listening Comprehension") {
                const placeholder = this.reviewQuestionsContainer.querySelector(`#audio_player_review_${index}`);
                if(placeholder) {
                    const playerElement = this.createAudioPlayer(q.audioSrc, `${q.id}_review_${index}_final`, true);
                    placeholder.appendChild(playerElement);
                }
            }
        });
    },

    showSubmitModal(isEarlyExit, timerInfo) {
        this.modalMessage.textContent = isEarlyExit ? 
            "Are you sure you want to end the test? Your progress will be scored." :
            "Are you sure you want to submit your test? You cannot change your answers after submission.";
        this.modalTimerInfo.textContent = timerInfo;
        this.submitModal.classList.remove('hidden');
        this.submitModal.classList.add('flex');
    },

    hideSubmitModal() {
        this.submitModal.classList.add('hidden');
        this.submitModal.classList.remove('flex');
    },

    displayError(message) {
        this.startScreen.innerHTML = `<div class="text-center text-red-500 p-8">${message}</div>`;
        this.showScreen('start-screen');
    }
};

UIManager.init(); 

export default UIManager;

