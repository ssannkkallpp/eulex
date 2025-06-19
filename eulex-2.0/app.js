// EULEX 2.0 - Enhanced Learning Experience
class EULEXApp {
    constructor() {
        this.currentStory = null;
        this.currentWordIndex = 0;
        this.words = [];
        this.sentences = [];
        this.currentSentenceIndex = 0;
        this.speechSynthesis = window.speechSynthesis;
        this.voices = [];
        this.selectedVoice = null;
        this.speechRate = 1.0;
        this.isPlaying = false;
        this.settings = this.loadSettings();
        this.languageManager = window.languageManager;
        
        this.init();
    }

    init() {
        this.loadVoices();
        this.setupEventListeners();
        this.renderStoryGrid();
        this.applySettings();
        
        // Show language selection modal on first visit
        if (!localStorage.getItem('eulex-language-selected')) {
            this.showLanguageModal();
        } else {
            this.languageManager.updateUI();
        }
    }

    loadSettings() {
        const defaultSettings = {
            voice: 'default',
            fontSize: 18,
            theme: 'light',
            speechRate: 1.0,
            autoPlay: false
        };
        
        try {
            const saved = localStorage.getItem('eulex-settings');
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch (error) {
            console.warn('Failed to load settings:', error);
            return defaultSettings;
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('eulex-settings', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Failed to save settings:', error);
        }
    }

    applySettings() {
        // Apply font size
        document.documentElement.style.fontSize = `${this.settings.fontSize}px`;
        
        // Apply theme
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        if (this.settings.theme !== 'light') {
            document.body.classList.add(`theme-${this.settings.theme}`);
        }
        
        // Apply speech rate
        this.speechRate = this.settings.speechRate;
        document.getElementById('speedSlider').value = this.speechRate;
        document.getElementById('speedValue').textContent = `${this.speechRate}x`;
    }

    loadVoices() {
        // Wait for voices to load
        if (this.speechSynthesis.onvoiceschanged !== undefined) {
            this.speechSynthesis.onvoiceschanged = () => {
                this.voices = this.speechSynthesis.getVoices();
                this.populateVoiceSelect();
            };
        }
        
        // Try to get voices immediately
        this.voices = this.speechSynthesis.getVoices();
        if (this.voices.length > 0) {
            this.populateVoiceSelect();
        }
    }

    populateVoiceSelect() {
        const voiceSelect = document.getElementById('voiceSelect');
        voiceSelect.innerHTML = '';
        
        this.voices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${voice.name} (${voice.lang})`;
            voiceSelect.appendChild(option);
        });
        
        // Set default voice
        if (this.settings.voice !== 'default') {
            voiceSelect.value = this.settings.voice;
        }
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('nextWordBtn').addEventListener('click', () => this.nextWord());
        document.getElementById('prevWordBtn').addEventListener('click', () => this.prevWord());
        document.getElementById('nextSentenceBtn').addEventListener('click', () => this.nextSentence());
        document.getElementById('prevSentenceBtn').addEventListener('click', () => this.prevSentence());
        
        // Audio controls
        document.getElementById('playPauseBtn').addEventListener('click', () => this.playCurrentWord());
        document.getElementById('playSentenceBtn').addEventListener('click', () => this.playCurrentSentence());
        
        // Settings
        document.getElementById('settingsBtn').addEventListener('click', () => this.showSettings());
        document.getElementById('closeSettings').addEventListener('click', () => this.hideSettings());
        document.getElementById('helpBtn').addEventListener('click', () => this.showHelp());
        document.getElementById('closeHelp').addEventListener('click', () => this.hideHelp());
        
        // Back to stories
        document.getElementById('backToStories').addEventListener('click', () => this.showStorySelection());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Settings controls
        document.getElementById('speedSlider').addEventListener('input', (e) => {
            this.speechRate = parseFloat(e.target.value);
            this.settings.speechRate = this.speechRate;
            document.getElementById('speedValue').textContent = `${this.speechRate}x`;
            this.saveSettings();
        });
        
        document.getElementById('voiceSelect').addEventListener('change', (e) => {
            this.settings.voice = e.target.value;
            this.saveSettings();
        });
        
        document.getElementById('fontSizeSlider').addEventListener('input', (e) => {
            const fontSize = parseInt(e.target.value);
            this.settings.fontSize = fontSize;
            document.getElementById('fontSizeValue').textContent = `${fontSize}px`;
            document.documentElement.style.fontSize = `${fontSize}px`;
            this.saveSettings();
        });
        
        // Theme buttons
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.target.dataset.theme;
                this.settings.theme = theme;
                this.applySettings();
                this.saveSettings();
            });
        });

        // Language selection
        document.getElementById('startApp')?.addEventListener('click', () => {
            this.hideLanguageModal();
            this.languageManager.updateUI();
        });
        
        document.getElementById('languageSelect')?.addEventListener('change', (e) => {
            this.languageManager.setLanguage(e.target.value);
        });
        
        // Language button in header
        document.getElementById('languageBtn')?.addEventListener('click', () => {
            this.showLanguageModal();
        });
    }

    handleKeyPress(e) {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.nextWord();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextWord();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.prevWord();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.prevSentence();
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.nextSentence();
                break;
            case 'KeyP':
                e.preventDefault();
                this.playCurrentWord();
                break;
            case 'KeyS':
                e.preventDefault();
                this.playCurrentSentence();
                break;
        }
    }

    renderStoryGrid() {
        const storyGrid = document.getElementById('storyGrid');
        storyGrid.innerHTML = '';
        
        this.getStories().forEach(story => {
            const card = this.createStoryCard(story);
            storyGrid.appendChild(card);
        });
    }

    createStoryCard(story) {
        const card = document.createElement('div');
        card.className = 'story-card bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300';
        
        card.innerHTML = `
            <div class="flex items-start justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-800">${story.title}</h3>
                <span class="difficulty-badge difficulty-${story.difficulty}">${story.difficulty}</span>
            </div>
            <p class="text-gray-600 text-sm mb-4">${story.description}</p>
            <div class="flex items-center justify-between text-xs text-gray-500">
                <span>${story.wordCount} words</span>
                <span>Est. ${story.readingTime} min</span>
            </div>
        `;
        
        card.addEventListener('click', () => this.loadStory(story));
        return card;
    }

    getStories() {
        return [
            {
                id: 'hare-tortoise',
                title: 'The Hare and the Tortoise',
                difficulty: 'beginner',
                description: 'A classic fable about the race between a fast hare and a slow tortoise.',
                wordCount: 89,
                readingTime: 2,
                content: `Once there lived in a forest a hare and a tortoise. The hare was very proud of his speed. He made fun of the tortoise for his slow speed. The tortoise challenged the hare to have a race with him. The hare accepted the challenge. The race started. The crow was the referee. The hare ran very fast. The tortoise was left much behind. The hare stopped to take rest under a tree. He fell asleep. The tortoise passed him and reached the winning post. The hare woke up and ran as fast as he could. He saw that the tortoise was already there at the winning post. He had won the race.`
            },
            {
                id: 'astronomer',
                title: 'The Ambitious Astronomer',
                difficulty: 'beginner',
                description: 'A story about an astronomer who learns an important lesson about observation.',
                wordCount: 67,
                readingTime: 2,
                content: `There lived an astronomer who was very much involved in his observations. He often used to look up at the sky at night and start observing the stars. Once, as he walked looking up at the stars, his leg slipped and he fell into a ditch. He started shouting. A passer-by, who heard his shouts, helped him out of the ditch and asked, "How did you fall into this ditch?" The astronomer replied, "I was so engrossed in my observations that I did not notice the ditch". The passer-by asked, "How do you expect to discover things when you fail to take note of things under your nose?" The astronomer walked away with a sad face.`
            },
            {
                id: 'honesty',
                title: 'Honesty is the Best Policy',
                difficulty: 'intermediate',
                description: 'A moral story about the consequences of dishonesty in business.',
                wordCount: 95,
                readingTime: 3,
                content: `A milkman became very wealthy through callous means. He had to cross a river daily to reach the city where his customers lived. He mixed the water of the river generously with the milk that he sold for a good profit. One day he went around collecting the dues in order to celebrate the wedding of his son. With the large amount thus collected he purchased plenty of rich clothes and glittering gold ornaments. But while crossing the river the boat capsized and all his costly purchases were swallowed by the river. The milk vendor was speechless with grief. At that time he heard a voice that came from the river, "Do not weep. What you have lost is only the illicit gains you earned through cheating your customers."`
            },
            {
                id: 'drought-georgia',
                title: 'The Drought Hits Georgia',
                difficulty: 'intermediate',
                description: 'A news-style story about a serious drought affecting Georgia.',
                wordCount: 156,
                readingTime: 4,
                content: `The state of Georgia is in the midst of a major drought. Experts predict that, unless it rains cats and dogs real soon, the whole city of Atlanta will have no drinking water in four months. Lake Lanier, the source of Atlanta's water delivery system, is now at only 20 percent of its usual level. To make matters worse, when Georgia water officials tried to block the flow of the Chattahoochee River southward to Alabama and Florida, those states threatened Georgia with lawsuits. They claimed that they were just as desperate for and entitled to that river water as Georgia was. The Georgia Civil Air Patrol has been trying to seed the clouds overhead for the last six months, to no avail. State officials asked the local Cherokee Indians to do a rain dance. The Indians told them they would do a rain dance when the state returned all the land that it stole from the Cherokees. Officials hired the nation's number one water finder. He found a still for making whiskey. Finally, the governor himself held a press conference on the steps of the state capitol building. He asked all the media to bow their heads, raised his hands to heaven, and prayed. "Lord, we are asking for relief, not for us, but for the sick and the young in this state. Thank you, oh most powerful Lord". The Georgia Association of Atheists immediately sued the governor for conducting prayer sessions on state property.`
            },
            {
                id: 'bicycle',
                title: 'The Story of the Bicycle',
                difficulty: 'advanced',
                description: 'An informative text about the history and development of the bicycle.',
                wordCount: 198,
                readingTime: 5,
                content: `You may be surprised to learn that the humble bicycle was invented several years later than the railway locomotive! But the two-wheeler has come a long way since the day it was invented by a Scottish blacksmith, Kirkpatrick MacMillan, back (it is said) in 1839. MacMillan developed his bike from an older wheeled vehicle, called a "hobby horse". This was a wooden horse with two wheels. The rider sat on the horse, and pushed the vehicle along with his feet. It was not a very fast or safe vehicle, since it had no steering and no brakes. MacMillan, nicknamed Mad Pate, modified the hobby horse, by adding a system of articulated bars. The rider could push the bars back and forwards with his feet, and make the back wheel go round. He could also steer the bike, as the front wheel could be turned. To demonstrate his invention, he cycled 60 miles to Glasgow! It must have been a terrible journey, on the roads of the day! Pate's bike did not have rubber tyres or springs. Mad Pate was not recognised in his time, but other people became interested in bicycles. Twenty-five years later, a Frenchman called Pierre Lallemant designed and patented the first bicycle with rotary pedals; and in 1876, H.J.Lawson added another basic feature, "chain-drive". Other features, such as rubber tyres and gears, have appeared since then; but the basic bicycle has not changed. Since then the bicycle has had a magnificent fortune. Today, it is probably the most common form of transport in the world, especially in the Third World; and non-polluting and easy to ride, it has a big future as the town vehicle of tomorrow. Thanks Pate!`
            },
            {
                id: 'internet-poem',
                title: 'The Internet',
                difficulty: 'poem',
                description: 'A humorous poem about the addictive nature of the internet.',
                wordCount: 89,
                readingTime: 2,
                content: `It is the deadliest trap I swear
Makes me sometimes come up for air
An ocean whose tides never seem to ebb
Everyone calls it the worldwide web.

It beckons the aimless wanderer
With many delicious bits and bytes
And even the more discerning surfer
Can google down to useful sites.

The television is not alone to blame
The internet is all the same
While the former cooked us on the couch
The latter merely makes us slouch

This might well be the age
But the medium is not the message
Said my father times umpteen
Having played his games off the screen`
            }
        ];
    }

    loadStory(story) {
        this.currentStory = story;
        this.currentWordIndex = 0;
        this.currentSentenceIndex = 0;
        
        // Parse content into words and sentences
        this.parseContent(story.content);
        
        // Update UI
        this.showReadingInterface();
        this.updateStoryInfo();
        this.renderText();
        this.highlightCurrentWord();
        this.updateProgress();
        
        // Auto-play first word if enabled
        if (this.settings.autoPlay) {
            setTimeout(() => this.playCurrentWord(), 500);
        }
    }

    parseContent(content) {
        // Split into sentences first
        this.sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        // Split into words
        this.words = content.split(/\s+/).filter(word => word.trim().length > 0);
        
        // Find sentence boundaries for words
        this.wordSentenceMap = [];
        let sentenceIndex = 0;
        let wordCount = 0;
        
        this.sentences.forEach((sentence, idx) => {
            const sentenceWords = sentence.split(/\s+/).filter(word => word.trim().length > 0);
            sentenceWords.forEach(() => {
                this.wordSentenceMap.push(idx);
            });
        });
    }

    showReadingInterface() {
        document.getElementById('storySelection').classList.add('hidden');
        document.getElementById('readingInterface').classList.remove('hidden');
    }

    showStorySelection() {
        document.getElementById('readingInterface').classList.add('hidden');
        document.getElementById('storySelection').classList.remove('hidden');
    }

    updateStoryInfo() {
        document.getElementById('storyTitle').textContent = this.currentStory.title;
        document.getElementById('wordCount').textContent = `${this.words.length} words`;
        document.getElementById('currentPosition').textContent = `${this.currentWordIndex + 1} / ${this.words.length}`;
        document.getElementById('readingTime').textContent = `Est. ${this.currentStory.readingTime} min`;
    }

    renderText() {
        const storyText = document.getElementById('storyText');
        storyText.innerHTML = '';
        
        this.words.forEach((word, index) => {
            const wordSpan = document.createElement('span');
            const cleanWord = this.cleanWord(word);
            const syllables = this.getSyllables(cleanWord);
            
            wordSpan.className = 'word-clickable inline-block mx-1 my-1 px-1 py-1 rounded';
            wordSpan.dataset.index = index;
            wordSpan.dataset.word = cleanWord;
            wordSpan.dataset.syllables = syllables;
            
            // Handle punctuation and formatting
            if (word.includes('\n')) {
                wordSpan.innerHTML = word.replace('\n', '<br>');
            } else {
                wordSpan.textContent = word;
            }
            
            wordSpan.addEventListener('click', () => this.jumpToWord(index));
            storyText.appendChild(wordSpan);
        });
    }

    cleanWord(word) {
        return word.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
    }

    getSyllables(word) {
        if (!word || word.length < 2) return word;
        
        // Enhanced syllable splitting algorithm
        const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
        const twoConsonants = ['sh', 'wh', 'th', 'ch', 'cr', 'ss', 'ck', 'di', 'lk', 'bl', 'br', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr', 'pl', 'pr', 'sc', 'sk', 'sl', 'sm', 'sn', 'sp', 'st', 'sw', 'tr', 'tw'];
        const threeConsonants = ['rkn', 'thn', 'thw', 'chn', 'shn', 'rdm', 'lkm', 'str', 'spr', 'scr'];
        const neverSplit = ['tch', 'dge', 'phth'];
        
        word = word.toLowerCase();
        const letters = word.split('');
        const vMask = new Array(letters.length).fill(0);
        
        // Mark vowels
        letters.forEach((letter, i) => {
            if (vowels.includes(letter)) {
                vMask[i] = 1;
            }
        });
        
        // Apply syllable splitting rules
        let pV = -1;
        for (let i = 0; i < vMask.length; i++) {
            if (vMask[i] === 1) {
                if (pV !== -1 && i - pV > 1) {
                    const consonantCount = i - pV - 1;
                    
                    if (consonantCount === 1) {
                        vMask[i - 1] = 2; // Split after first consonant
                    } else if (consonantCount === 2) {
                        const pair = letters.slice(i - 2, i).join('');
                        if (twoConsonants.includes(pair)) {
                            vMask[i - 2] = 2; // Split after first consonant of pair
                        } else {
                            vMask[i - 1] = 2; // Split after second consonant
                        }
                    } else if (consonantCount >= 3) {
                        const triple = letters.slice(i - 3, i).join('');
                        if (threeConsonants.includes(triple)) {
                            vMask[i - 1] = 2; // Split after third consonant
                        } else if (neverSplit.some(pattern => triple.includes(pattern))) {
                            vMask[i - 3] = 2; // Split after first consonant
                        } else {
                            vMask[i - 2] = 2; // Split after second consonant
                        }
                    }
                }
                pV = i;
            }
        }
        
        // Build syllable string
        let result = '';
        for (let i = 0; i < letters.length; i++) {
            if (vMask[i] === 2 && i !== 0) {
                result += '-';
            }
            result += letters[i];
        }
        
        return result;
    }

    highlightCurrentWord() {
        // Remove previous highlights
        document.querySelectorAll('.word-current').forEach(el => {
            el.classList.remove('word-current');
            el.classList.add('word-highlight');
        });
        
        // Highlight current word
        const currentWordElement = document.querySelector(`[data-index="${this.currentWordIndex}"]`);
        if (currentWordElement) {
            currentWordElement.classList.remove('word-highlight');
            currentWordElement.classList.add('word-current');
            
            // Scroll to word if needed
            currentWordElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Update current word display
        const currentWord = this.words[this.currentWordIndex];
        const cleanWord = this.cleanWord(currentWord);
        const syllables = this.getSyllables(cleanWord);
        
        document.getElementById('currentWord').textContent = cleanWord;
        this.updateSyllableWidget(syllables);
        
        // Update current sentence
        this.currentSentenceIndex = this.wordSentenceMap[this.currentWordIndex] || 0;
    }

    updateSyllableWidget(syllables) {
        const syllableDisplay = document.getElementById('syllableDisplay');
        syllableDisplay.innerHTML = '';
        
        if (syllables && syllables.includes('-')) {
            const syllableParts = syllables.split('-');
            syllableParts.forEach((syllable, index) => {
                const syllableSpan = document.createElement('span');
                syllableSpan.className = 'syllable';
                syllableSpan.textContent = syllable;
                syllableSpan.addEventListener('click', () => this.speakSyllable(syllable));
                syllableDisplay.appendChild(syllableSpan);
                
                // Add separator between syllables (except after the last one)
                if (index < syllableParts.length - 1) {
                    const separator = document.createElement('span');
                    separator.className = 'syllable-separator';
                    separator.textContent = '•';
                    syllableDisplay.appendChild(separator);
                }
            });
        } else {
            // Single syllable word
            const syllableSpan = document.createElement('span');
            syllableSpan.className = 'syllable';
            syllableSpan.textContent = syllables;
            syllableSpan.addEventListener('click', () => this.speakSyllable(syllables));
            syllableDisplay.appendChild(syllableSpan);
        }
    }

    speakSyllable(syllable) {
        this.speakText(syllable);
        
        // Visual feedback
        const syllableElement = event.target;
        syllableElement.style.transform = 'scale(1.1)';
        syllableElement.style.background = 'rgba(255, 255, 255, 1)';
        
        setTimeout(() => {
            syllableElement.style.transform = 'scale(1)';
            syllableElement.style.background = 'rgba(255, 255, 255, 0.7)';
        }, 200);
    }

    updateProgress() {
        const progress = ((this.currentWordIndex + 1) / this.words.length) * 100;
        document.getElementById('progressBar').style.width = `${progress}%`;
        document.getElementById('progressPercent').textContent = `${Math.round(progress)}%`;
        document.getElementById('currentPosition').textContent = `${this.currentWordIndex + 1} / ${this.words.length}`;
    }

    nextWord() {
        if (this.currentWordIndex < this.words.length - 1) {
            this.currentWordIndex++;
            this.highlightCurrentWord();
            this.updateProgress();
            this.playCurrentWord();
        }
    }

    prevWord() {
        if (this.currentWordIndex > 0) {
            this.currentWordIndex--;
            this.highlightCurrentWord();
            this.updateProgress();
            this.playCurrentWord();
        }
    }

    nextSentence() {
        const currentSentence = this.wordSentenceMap[this.currentWordIndex];
        let nextSentenceStart = this.currentWordIndex;
        
        // Find start of next sentence
        for (let i = this.currentWordIndex + 1; i < this.words.length; i++) {
            if (this.wordSentenceMap[i] > currentSentence) {
                nextSentenceStart = i;
                break;
            }
        }
        
        if (nextSentenceStart !== this.currentWordIndex) {
            this.currentWordIndex = nextSentenceStart;
            this.highlightCurrentWord();
            this.updateProgress();
        }
    }

    prevSentence() {
        const currentSentence = this.wordSentenceMap[this.currentWordIndex];
        let prevSentenceStart = this.currentWordIndex;
        
        // Find start of previous sentence
        for (let i = this.currentWordIndex - 1; i >= 0; i--) {
            if (this.wordSentenceMap[i] < currentSentence) {
                prevSentenceStart = i;
                break;
            }
        }
        
        if (prevSentenceStart !== this.currentWordIndex) {
            this.currentWordIndex = prevSentenceStart;
            this.highlightCurrentWord();
            this.updateProgress();
        }
    }

    jumpToWord(index) {
        if (index >= 0 && index < this.words.length) {
            this.currentWordIndex = index;
            this.highlightCurrentWord();
            this.updateProgress();
            this.playCurrentWord();
        }
    }

    playCurrentWord() {
        if (this.isPlaying) {
            this.speechSynthesis.cancel();
            this.isPlaying = false;
            this.updatePlayButton();
            return;
        }
        
        const currentWord = this.cleanWord(this.words[this.currentWordIndex]);
        this.speakText(currentWord);
    }

    playCurrentSentence() {
        const sentence = this.sentences[this.currentSentenceIndex];
        if (sentence) {
            this.speakText(sentence);
        }
    }

    updatePlayButton() {
        const playBtn = document.getElementById('playPauseBtn');
        const icon = playBtn.querySelector('i');
        const text = playBtn.querySelector('span');
        
        if (this.isPlaying) {
            icon.className = 'fas fa-pause mr-3 text-xl';
            text.textContent = 'Pause';
        } else {
            icon.className = 'fas fa-volume-up mr-3 text-xl';
            text.textContent = 'Hear Word';
        }
    }

    speakText(text) {
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.cancel();
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice
        if (this.voices.length > 0) {
            const voiceIndex = parseInt(this.settings.voice) || 0;
            utterance.voice = this.voices[voiceIndex] || this.voices[0];
        }
        
        // Set properties
        utterance.rate = this.speechRate;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Event handlers
        utterance.onstart = () => {
            this.isPlaying = true;
            this.updatePlayButton();
        };
        
        utterance.onend = () => {
            this.isPlaying = false;
            this.updatePlayButton();
        };
        
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            this.isPlaying = false;
            this.updatePlayButton();
        };
        
        this.speechSynthesis.speak(utterance);
    }

    showLanguageModal() {
        const modal = document.getElementById('languageModal');
        if (modal) {
            modal.style.display = 'flex';
            // Populate language selector
            this.populateLanguageSelector();
        }
    }
    
    hideLanguageModal() {
        const modal = document.getElementById('languageModal');
        if (modal) {
            modal.style.display = 'none';
            localStorage.setItem('eulex-language-selected', 'true');
        }
    }
    
    populateLanguageSelector() {
        const languageSelects = document.querySelectorAll('#languageSelect, #settingsLanguageSelect');
        const languages = this.languageManager.getAvailableLanguages();
        
        languageSelects.forEach(select => {
            select.innerHTML = '';
            languages.forEach(lang => {
                const option = document.createElement('option');
                option.value = lang.code;
                option.textContent = lang.name;
                select.appendChild(option);
            });
            select.value = this.languageManager.currentLanguage;
        });
    }
    
    showSettings() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.classList.remove('hidden');
            this.populateLanguageSelector();
            this.populateVoiceSelect();
            this.updateSettingsDisplay();
        }
    }
    
    hideSettings() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
    
    showHelp() {
        const modal = document.getElementById('helpModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }
    
    hideHelp() {
        const modal = document.getElementById('helpModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
    
    updateSettingsDisplay() {
        const speedSlider = document.getElementById('speedSlider');
        const fontSizeSlider = document.getElementById('fontSizeSlider');
        const voiceSelect = document.getElementById('voiceSelect');
        
        if (speedSlider) speedSlider.value = this.settings.speechRate;
        if (fontSizeSlider) fontSizeSlider.value = this.settings.fontSize;
        if (voiceSelect && this.settings.voice !== 'default') voiceSelect.value = this.settings.voice;
        
        this.updateSpeed(this.settings.speechRate);
        this.updateFontSize(this.settings.fontSize);
    }
    
    updateSpeed(speed) {
        this.settings.speechRate = parseFloat(speed);
        const speedValue = document.getElementById('speedValue');
        if (speedValue) {
            speedValue.textContent = `${speed}x`;
        }
        this.saveSettings();
    }
    
    updateFontSize(size) {
        this.settings.fontSize = parseInt(size);
        const fontSizeValue = document.getElementById('fontSizeValue');
        if (fontSizeValue) {
            fontSizeValue.textContent = `${size}px`;
        }
        
        const storyText = document.getElementById('storyText');
        if (storyText) {
            storyText.style.fontSize = `${size}px`;
        }
        this.saveSettings();
    }
    
    updateVoice(voiceName) {
        this.settings.voice = voiceName;
        this.saveSettings();
    }
    
    setTheme(theme) {
        this.settings.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update theme button states
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === theme) {
                btn.classList.add('active');
            }
        });
        
        this.saveSettings();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EULEXApp();
}); 