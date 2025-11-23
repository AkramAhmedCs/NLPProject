/**
 * Text Analysis Utilities
 * Provides statistical analysis and visualization data
 */

class TextAnalyzer {
  /**
   * Analyze text and return comprehensive statistics
   * @param {string} text - Text to analyze
   * @returns {Object} Analysis results
   */
  static analyzeText(text) {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const characters = text.replace(/\s/g, '');

    const wordFrequency = {};
    const uniqueWords = new Set();

    words.forEach(word => {
      const normalized = word.toLowerCase().replace(/[.,!?;:]/g, '');
      uniqueWords.add(normalized);
      wordFrequency[normalized] = (wordFrequency[normalized] || 0) + 1;
    });

    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const avgSentenceLength = words.length / sentences.length;

    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      characterCount: characters.length,
      uniqueWords: uniqueWords.size,
      averageWordLength: avgWordLength.toFixed(2),
      averageSentenceLength: avgSentenceLength.toFixed(2),
      vocabularyRichness: (uniqueWords.size / words.length * 100).toFixed(2),
      wordFrequency: this.getTopWords(wordFrequency, 10)
    };
  }

  /**
   * Get top N most frequent words
   * @param {Object} wordFrequency - Word frequency map
   * @param {number} n - Number of words to return
   * @returns {Array} Top N words
   */
  static getTopWords(wordFrequency, n = 10) {
    return Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([word, count]) => ({ word, count }));
  }

  /**
   * Compare two texts
   * @param {string} text1 - First text
   * @param {string} text2 - Second text
   * @returns {Object} Comparison results
   */
  static compareTexts(text1, text2) {
    const analysis1 = this.analyzeText(text1);
    const analysis2 = this.analyzeText(text2);

    return {
      original: analysis1,
      generated: analysis2,
      differences: {
        wordCountDiff: analysis2.wordCount - analysis1.wordCount,
        uniqueWordsDiff: analysis2.uniqueWords - analysis1.uniqueWords,
        vocabRichnessDiff: (analysis2.vocabularyRichness - analysis1.vocabularyRichness).toFixed(2),
        avgWordLengthDiff: (analysis2.averageWordLength - analysis1.averageWordLength).toFixed(2)
      }
    };
  }

  /**
   * Calculate readability score (Flesch Reading Ease approximation)
   * @param {string} text - Text to analyze
   * @returns {Object} Readability metrics
   */
  static calculateReadability(text) {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

    if (sentences.length === 0 || words.length === 0) {
      return { score: 0, level: 'Unknown' };
    }

    const syllables = words.reduce((sum, word) => sum + this.countSyllables(word), 0);

    // Flesch Reading Ease formula
    const score = 206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (syllables / words.length);

    let level;
    if (score >= 90) level = 'Very Easy';
    else if (score >= 80) level = 'Easy';
    else if (score >= 70) level = 'Fairly Easy';
    else if (score >= 60) level = 'Standard';
    else if (score >= 50) level = 'Fairly Difficult';
    else if (score >= 30) level = 'Difficult';
    else level = 'Very Difficult';

    return {
      score: Math.max(0, Math.min(100, score)).toFixed(1),
      level: level
    };
  }

  /**
   * Count syllables in a word (approximation)
   * @param {string} word - Word to analyze
   * @returns {number} Syllable count
   */
  static countSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;

    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');

    const syllables = word.match(/[aeiouy]{1,2}/g);
    return syllables ? syllables.length : 1;
  }

  /**
   * Generate visualization data for n-grams
   * @param {Array} ngrams - Array of {ngram, count} objects
   * @returns {Object} Chart-ready data
   */
  static prepareNGramChart(ngrams) {
    return {
      labels: ngrams.map(item => item.ngram),
      data: ngrams.map(item => item.count),
      maxCount: Math.max(...ngrams.map(item => item.count))
    };
  }

  /**
   * Format number with commas
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  static formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * Calculate similarity between two texts using Jaccard similarity
   * @param {string} text1 - First text
   * @param {string} text2 - Second text
   * @returns {number} Similarity score (0-1)
   */
  static calculateSimilarity(text1, text2) {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));

    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return union.size > 0 ? intersection.size / union.size : 0;
  }
}
