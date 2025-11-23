/**
 * Markov Chain Text Generator
 * Supports variable-order Markov models for text generation
 */

class MarkovChain {
    constructor() {
        this.chain = {};
        this.order = 1;
        this.startWords = [];
        this.corpusText = '';
        this.wordCount = 0;
        this.uniqueWords = new Set();
    }

    /**
     * Tokenize text into words
     * @param {string} text - Input text to tokenize
     * @returns {Array<string>} Array of tokens
     */
    tokenize(text) {
        // Remove extra whitespace and split into words
        // Keep punctuation attached to words for more natural generation
        return text
            .trim()
            .replace(/\s+/g, ' ')
            .split(' ')
            .filter(word => word.length > 0);
    }

    /**
     * Train the Markov Chain model on a text corpus
     * @param {string} text - Training text corpus
     * @param {number} order - Order of the Markov chain (1, 2, 3, etc.)
     */
    train(text, order = 2) {
        this.chain = {};
        this.startWords = [];
        this.order = order;
        this.corpusText = text;
        this.uniqueWords.clear();

        const tokens = this.tokenize(text);
        this.wordCount = tokens.length;

        if (tokens.length < order + 1) {
            throw new Error(`Corpus too small for order ${order}. Need at least ${order + 1} words.`);
        }

        // Build the chain
        for (let i = 0; i < tokens.length - order; i++) {
            // Create the state (n-gram of 'order' words)
            const state = tokens.slice(i, i + order).join(' ');
            const nextWord = tokens[i + order];

            // Track unique words
            tokens.slice(i, i + order).forEach(word => this.uniqueWords.add(word));
            this.uniqueWords.add(nextWord);

            // Store start words (for beginning generation)
            if (i === 0 || this.isStartOfSentence(tokens[i - 1])) {
                this.startWords.push(state);
            }

            // Add to chain
            if (!this.chain[state]) {
                this.chain[state] = [];
            }
            this.chain[state].push(nextWord);
        }

        // If no start words found, use the first state
        if (this.startWords.length === 0) {
            this.startWords.push(tokens.slice(0, order).join(' '));
        }
    }

    /**
     * Check if a word marks the start of a sentence
     * @param {string} word - Word to check
     * @returns {boolean}
     */
    isStartOfSentence(word) {
        return /[.!?]$/.test(word);
    }

    /**
     * Check if a word marks the end of a sentence
     * @param {string} word - Word to check
     * @returns {boolean}
     */
    isEndOfSentence(word) {
        return /[.!?]$/.test(word);
    }

    /**
     * Get a random element from an array
     * @param {Array} arr - Input array
     * @returns {*} Random element
     */
    randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /**
     * Generate text using the trained Markov chain
     * @param {number} length - Approximate number of words to generate
     * @param {string} seed - Optional seed word(s) to start generation
     * @returns {string} Generated text
     */
    generate(length = 50, seed = null) {
        if (Object.keys(this.chain).length === 0) {
            throw new Error('Model not trained. Call train() first.');
        }

        let currentState;
        
        // Initialize with seed or random start word
        if (seed) {
            const seedTokens = this.tokenize(seed);
            if (seedTokens.length >= this.order) {
                currentState = seedTokens.slice(-this.order).join(' ');
            } else {
                // Pad seed if too short
                const padding = this.randomChoice(this.startWords).split(' ').slice(0, this.order - seedTokens.length);
                currentState = [...padding, ...seedTokens].join(' ');
            }
            
            // If seed state doesn't exist in chain, use random start
            if (!this.chain[currentState]) {
                currentState = this.randomChoice(this.startWords);
            }
        } else {
            currentState = this.randomChoice(this.startWords);
        }

        const result = currentState.split(' ');
        let generatedWords = result.length;

        // Generate words
        while (generatedWords < length) {
            const possibleNextWords = this.chain[currentState];
            
            if (!possibleNextWords || possibleNextWords.length === 0) {
                // Dead end - start a new sentence
                currentState = this.randomChoice(this.startWords);
                result.push('');  // Add space between sentences
                result.push(...currentState.split(' '));
                generatedWords = result.length;
                continue;
            }

            const nextWord = this.randomChoice(possibleNextWords);
            result.push(nextWord);
            generatedWords++;

            // Update current state (slide the window)
            const stateWords = currentState.split(' ');
            stateWords.shift();
            stateWords.push(nextWord);
            currentState = stateWords.join(' ');

            // Occasionally start new sentences at natural boundaries
            if (this.isEndOfSentence(nextWord) && Math.random() > 0.3) {
                if (generatedWords < length - this.order) {
                    currentState = this.randomChoice(this.startWords);
                }
            }
        }

        return result.join(' ').replace(/\s+/g, ' ').trim();
    }

    /**
     * Get statistics about the trained model
     * @returns {Object} Model statistics
     */
    getStatistics() {
        const states = Object.keys(this.chain);
        const transitions = states.reduce((sum, state) => sum + this.chain[state].length, 0);

        return {
            order: this.order,
            wordCount: this.wordCount,
            uniqueWords: this.uniqueWords.size,
            states: states.length,
            transitions: transitions,
            averageTransitions: states.length > 0 ? (transitions / states.length).toFixed(2) : 0,
            vocabularyRichness: this.wordCount > 0 ? (this.uniqueWords.size / this.wordCount * 100).toFixed(2) : 0
        };
    }

    /**
     * Get n-gram frequencies
     * @param {number} n - N-gram size
     * @param {number} limit - Maximum number of results
     * @returns {Array} Array of {ngram, count} objects
     */
    getNGramFrequencies(n = 2, limit = 20) {
        const tokens = this.tokenize(this.corpusText);
        const ngramCounts = {};

        for (let i = 0; i <= tokens.length - n; i++) {
            const ngram = tokens.slice(i, i + n).join(' ');
            ngramCounts[ngram] = (ngramCounts[ngram] || 0) + 1;
        }

        return Object.entries(ngramCounts)
            .map(([ngram, count]) => ({ ngram, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }

    /**
     * Export the model as JSON
     * @returns {string} JSON representation of the model
     */
    exportModel() {
        return JSON.stringify({
            chain: this.chain,
            order: this.order,
            startWords: this.startWords,
            corpusText: this.corpusText
        });
    }

    /**
     * Import a model from JSON
     * @param {string} json - JSON representation of the model
     */
    importModel(json) {
        const data = JSON.parse(json);
        this.chain = data.chain;
        this.order = data.order;
        this.startWords = data.startWords;
        this.corpusText = data.corpusText;
        
        // Recalculate statistics
        const tokens = this.tokenize(this.corpusText);
        this.wordCount = tokens.length;
        this.uniqueWords.clear();
        tokens.forEach(word => this.uniqueWords.add(word));
    }
}
