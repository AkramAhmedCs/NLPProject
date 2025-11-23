/**
 * Main Application Controller - API Version
 * Manages UI state and communicates with Python Flask backend
 */

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Global state
const state = {
  currentCorpus: null,
  currentCorpusKey: '',
  currentCorpusName: '',
  isTrained: false,
  lastGeneratedText: '',
  currentOrder: 2,
  isLoading: false
};

// DOM Elements
const elements = {
  // Corpus tabs
  corpusTabs: document.querySelectorAll('.tab-btn'),
  tabContents: document.querySelectorAll('.tab-content'),
  corpusCards: document.querySelectorAll('.corpus-card'),
  customTextarea: document.getElementById('custom-text'),
  useCustomBtn: document.getElementById('use-custom-btn'),
  uploadArea: document.getElementById('upload-area'),
  fileInput: document.getElementById('file-input'),
  browseBtn: document.getElementById('browse-btn'),
  corpusInfo: document.getElementById('corpus-info'),
  selectedCorpusName: document.getElementById('selected-corpus-name'),
  corpusWordCount: document.getElementById('corpus-word-count'),

  // Configuration
  orderSelect: document.getElementById('order-select'),
  trainBtn: document.getElementById('train-btn'),
  modelStatus: document.getElementById('model-status'),
  statusText: document.getElementById('status-text'),

  // Generation
  lengthSlider: document.getElementById('length-slider'),
  lengthValue: document.getElementById('length-value'),
  seedInput: document.getElementById('seed-input'),
  generateBtn: document.getElementById('generate-btn'),
  outputWrapper: document.getElementById('output-wrapper'),
  outputBox: document.getElementById('output-box'),
  copyBtn: document.getElementById('copy-btn'),

  // Analysis
  analysisTabs: document.querySelectorAll('.analysis-tab-btn'),
  analysisTabContents: document.querySelectorAll('.analysis-tab-content'),
  statOrder: document.getElementById('stat-order'),
  statWords: document.getElementById('stat-words'),
  statUnique: document.getElementById('stat-unique'),
  statStates: document.getElementById('stat-states'),
  statTransitions: document.getElementById('stat-transitions'),
  statVocab: document.getElementById('stat-vocab'),
  ngramSize: document.getElementById('ngram-size'),
  showNgramsBtn: document.getElementById('show-ngrams-btn'),
  ngramList: document.getElementById('ngram-list'),
  comparisonGrid: document.getElementById('comparison-grid'),

  // Error notification
  errorNotification: document.getElementById('error-notification'),
  errorMessage: document.getElementById('error-message'),
  errorClose: document.getElementById('error-close')
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
  checkServerConnection();
  console.log('Markov Chain Text Generator initialized (API Mode)');
});

// Check server connection
async function checkServerConnection() {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/`);
    const data = await response.json();
    console.log('✅ Connected to server:', data.message);
  } catch (error) {
    console.error('❌ Could not connect to server. Make sure Flask is running on http://localhost:5000');
    showError('Cannot connect to server. Please start the Flask backend.');
  }
}

// Event Listeners
function initializeEventListeners() {
  // Corpus selection tabs
  elements.corpusTabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab));
  });

  // Corpus cards
  elements.corpusCards.forEach(card => {
    card.addEventListener('click', () => selectCorpus(card.dataset.corpus));
  });

  // Custom text
  elements.useCustomBtn.addEventListener('click', useCustomText);

  // File upload
  elements.browseBtn.addEventListener('click', () => elements.fileInput.click());
  elements.fileInput.addEventListener('change', handleFileSelect);
  elements.uploadArea.addEventListener('click', () => elements.fileInput.click());

  // Drag and drop
  elements.uploadArea.addEventListener('dragover', handleDragOver);
  elements.uploadArea.addEventListener('dragleave', handleDragLeave);
  elements.uploadArea.addEventListener('drop', handleDrop);

  // Configuration
  elements.orderSelect.addEventListener('change', updateOrder);
  elements.trainBtn.addEventListener('click', trainModel);

  // Generation
  elements.lengthSlider.addEventListener('input', updateLengthValue);
  elements.generateBtn.addEventListener('click', generateText);
  elements.copyBtn.addEventListener('click', copyToClipboard);

  // Analysis
  elements.analysisTabs.forEach(tab => {
    tab.addEventListener('click', () => switchAnalysisTab(tab));
  });
  elements.showNgramsBtn.addEventListener('click', showNGrams);

  // Error notification close
  elements.errorClose.addEventListener('click', hideError);
}

// Utility Functions
function showError(message) {
  elements.errorMessage.innerHTML = message;
  elements.errorNotification.style.display = 'flex';

  // Auto-hide after 10 seconds
  setTimeout(() => {
    hideError();
  }, 10000);
}

function hideError() {
  elements.errorNotification.style.display = 'none';
}

function showLoading(button, isLoading) {
  if (isLoading) {
    button.dataset.originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<span class="btn-icon">⏳</span> Loading...';
  } else {
    button.disabled = false;
    if (button.dataset.originalText) {
      button.innerHTML = button.dataset.originalText;
    }
  }
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Tab Switching
function switchTab(clickedTab) {
  const tabName = clickedTab.dataset.tab;

  elements.corpusTabs.forEach(tab => tab.classList.remove('active'));
  clickedTab.classList.add('active');

  elements.tabContents.forEach(content => {
    content.classList.remove('active');
    if (content.id === `${tabName}-tab`) {
      content.classList.add('active');
    }
  });
}

function switchAnalysisTab(clickedTab) {
  const tabName = clickedTab.dataset.analysisTab;

  elements.analysisTabs.forEach(tab => tab.classList.remove('active'));
  clickedTab.classList.add('active');

  elements.analysisTabContents.forEach(content => {
    content.classList.remove('active');
    if (content.id === `${tabName}-tab`) {
      content.classList.add('active');
    }
  });
}

// Corpus Selection
async function selectCorpus(corpusKey) {
  try {
    showLoading(elements.trainBtn, true);

    // Fetch corpus from API
    const response = await fetch(`${API_BASE_URL}/corpus/${corpusKey}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    const corpus = data.corpus;
    state.currentCorpus = corpus.text;
    state.currentCorpusKey = corpusKey;
    state.currentCorpusName = corpus.title;
    state.isTrained = false;

    // Update UI
    elements.corpusCards.forEach(card => {
      card.classList.remove('selected');
      if (card.dataset.corpus === corpusKey) {
        card.classList.add('selected');
      }
    });

    showCorpusInfo();
    enableTrainButton();
    resetModelStatus();

    showLoading(elements.trainBtn, false);
  } catch (error) {
    showLoading(elements.trainBtn, false);
    showError('Failed to load corpus: ' + error.message);
  }
}

function useCustomText() {
  const text = elements.customTextarea.value.trim();

  if (text.length < 50) {
    showError('Please enter at least 50 characters of text for better results.');
    return;
  }

  state.currentCorpus = text;
  state.currentCorpusKey = 'custom';
  state.currentCorpusName = 'Custom Text';
  state.isTrained = false;

  elements.corpusCards.forEach(card => card.classList.remove('selected'));

  showCorpusInfo();
  enableTrainButton();
  resetModelStatus();
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    readFile(file);
  }
}

function handleDragOver(event) {
  event.preventDefault();
  elements.uploadArea.classList.add('drag-over');
}

function handleDragLeave(event) {
  event.preventDefault();
  elements.uploadArea.classList.remove('drag-over');
}

function handleDrop(event) {
  event.preventDefault();
  elements.uploadArea.classList.remove('drag-over');

  const file = event.dataTransfer.files[0];
  if (file && file.type === 'text/plain') {
    readFile(file);
  } else {
    showError('Please upload a .txt file');
  }
}

function readFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;

    if (text.length < 50) {
      showError('File is too small. Please use a file with at least 50 characters.');
      return;
    }

    state.currentCorpus = text;
    state.currentCorpusKey = 'upload';
    state.currentCorpusName = file.name;
    state.isTrained = false;

    elements.corpusCards.forEach(card => card.classList.remove('selected'));

    showCorpusInfo();
    enableTrainButton();
    resetModelStatus();
  };
  reader.readAsText(file);
}

function showCorpusInfo() {
  const wordCount = state.currentCorpus.split(/\s+/).filter(w => w).length;

  elements.corpusInfo.style.display = 'flex';
  elements.selectedCorpusName.textContent = state.currentCorpusName;
  elements.corpusWordCount.textContent = formatNumber(wordCount);
}

// Model Configuration
function updateOrder() {
  state.currentOrder = parseInt(elements.orderSelect.value);
  if (state.isTrained) {
    resetModelStatus();
  }
}

function enableTrainButton() {
  elements.trainBtn.disabled = false;
}

async function trainModel() {
  if (!state.currentCorpus) {
    showError('Please select a corpus first');
    return;
  }

  try {
    showLoading(elements.trainBtn, true);

    // Call API to train model
    const response = await fetch(`${API_BASE_URL}/train`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: state.currentCorpus,
        order: state.currentOrder,
        corpus_name: state.currentCorpusName
      })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    state.isTrained = true;

    // Update UI
    elements.trainBtn.innerHTML = '✓ Model Trained';
    elements.modelStatus.style.display = 'block';
    elements.statusText.textContent = `Model trained with order ${state.currentOrder}`;
    elements.statusText.previousElementSibling.classList.add('active');

    // Enable generation
    elements.generateBtn.disabled = false;
    elements.showNgramsBtn.disabled = false;

    // Show statistics
    updateStatistics(data.statistics);

    // Re-enable train button
    setTimeout(() => {
      elements.trainBtn.innerHTML = '<span class="btn-icon">🔄</span> Retrain Model';
      elements.trainBtn.disabled = false;
    }, 1000);

  } catch (error) {
    showLoading(elements.trainBtn, false);
    showError('Training failed: ' + error.message);
  }
}

function resetModelStatus() {
  state.isTrained = false;
  elements.trainBtn.innerHTML = '<span class="btn-icon">🎓</span> Train Model';
  elements.modelStatus.style.display = 'none';
  elements.generateBtn.disabled = true;
  elements.showNgramsBtn.disabled = true;
  elements.outputWrapper.style.display = 'none';
}


// Text Generation
function updateLengthValue() {
  elements.lengthValue.textContent = elements.lengthSlider.value;
}

async function generateText() {
  if (!state.isTrained) {
    showError('Please train the model first');
    return;
  }

  try {
    showLoading(elements.generateBtn, true);

    const length = parseInt(elements.lengthSlider.value);
    const seed = elements.seedInput.value.trim() || null;

    // Call API to generate text
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        length: length,
        seed: seed
      })
    });

    const data = await response.json();

    if (!data.success) {
      // Check if it's a seed word error
      if (data.error_type === 'invalid_seed') {
        // Format the error message nicely with suggestions
        const errorText = data.error;
        const suggestionMatch = errorText.match(/such as: (.+)$/);

        let formattedMessage = errorText;
        if (suggestionMatch) {
          const baseMessage = errorText.substring(0, suggestionMatch.index);
          const suggestions = suggestionMatch[1];
          formattedMessage = `${baseMessage}<br><br><strong>Try these words instead:</strong> ${suggestions}`;
        }

        showError(formattedMessage);
      } else {
        throw new Error(data.error);
      }
      showLoading(elements.generateBtn, false);
      return;
    }

    const generatedText = data.text;
    state.lastGeneratedText = generatedText;

    // Display output
    elements.outputWrapper.style.display = 'block';
    elements.outputBox.textContent = generatedText;

    // Update comparison
    await updateComparison();

    // Scroll to output
    elements.outputWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    showLoading(elements.generateBtn, false);

  } catch (error) {
    showLoading(elements.generateBtn, false);
    showError('Generation failed: ' + error.message);
  }
}

function copyToClipboard() {
  const text = elements.outputBox.textContent;
  navigator.clipboard.writeText(text).then(() => {
    const originalText = elements.copyBtn.innerHTML;
    elements.copyBtn.innerHTML = '<span class="btn-icon">✓</span> Copied!';
    setTimeout(() => {
      elements.copyBtn.innerHTML = originalText;
    }, 2000);
  });
}


// Statistics & Analysis
function updateStatistics(stats) {
  elements.statOrder.textContent = stats.order;
  elements.statWords.textContent = formatNumber(stats.word_count);
  elements.statUnique.textContent = formatNumber(stats.unique_words);
  elements.statStates.textContent = formatNumber(stats.states);
  elements.statTransitions.textContent = formatNumber(stats.transitions);
  elements.statVocab.textContent = `${stats.vocabulary_richness}%`;
}

async function showNGrams() {
  if (!state.isTrained) return;

  try {
    const n = parseInt(elements.ngramSize.value);

    // Call API to get n-grams
    const response = await fetch(`${API_BASE_URL}/ngrams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        n: n,
        limit: 20
      })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    const ngrams = data.ngrams;

    if (ngrams.length === 0) {
      elements.ngramList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No n-grams found</p>';
      return;
    }

    const maxCount = Math.max(...ngrams.map(item => item.count));

    elements.ngramList.innerHTML = ngrams.map((item, index) => {
      const percentage = (item.count / maxCount) * 100;
      return `
                <div class="ngram-item" style="animation: fadeIn 0.3s ease ${index * 0.05}s both;">
                    <div style="flex: 1;">
                        <div class="ngram-text">"${item.ngram}"</div>
                        <div class="ngram-bar" style="width: ${percentage}%;"></div>
                    </div>
                    <div class="ngram-count">${item.count}</div>
                </div>
            `;
    }).join('');

  } catch (error) {
    showError('Failed to get n-grams: ' + error.message);
  }
}

async function updateComparison() {
  if (!state.lastGeneratedText) return;

  try {
    // Analyze original corpus
    const originalResponse = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: state.currentCorpus
      })
    });

    const originalData = await originalResponse.json();

    // Analyze generated text
    const generatedResponse = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: state.lastGeneratedText
      })
    });

    const generatedData = await generatedResponse.json();

    if (!originalData.success || !generatedData.success) {
      throw new Error('Analysis failed');
    }

    const originalAnalysis = originalData.analysis;
    const generatedAnalysis = generatedData.analysis;

    elements.comparisonGrid.innerHTML = `
            <div class="comparison-section">
                <h4>📚 Original Corpus</h4>
                <div class="comparison-stat">
                    <span>Word Count:</span>
                    <strong>${formatNumber(originalAnalysis.word_count)}</strong>
                </div>
                <div class="comparison-stat">
                    <span>Unique Words:</span>
                    <strong>${formatNumber(originalAnalysis.unique_words)}</strong>
                </div>
                <div class="comparison-stat">
                    <span>Avg Word Length:</span>
                    <strong>${originalAnalysis.average_word_length}</strong>
                </div>
                <div class="comparison-stat">
                    <span>Vocabulary Richness:</span>
                    <strong>${originalAnalysis.vocabulary_richness}%</strong>
                </div>
            </div>
            
            <div class="comparison-section">
                <h4>✨ Generated Text</h4>
                <div class="comparison-stat">
                    <span>Word Count:</span>
                    <strong>${formatNumber(generatedAnalysis.word_count)}</strong>
                </div>
                <div class="comparison-stat">
                    <span>Unique Words:</span>
                    <strong>${formatNumber(generatedAnalysis.unique_words)}</strong>
                </div>
                <div class="comparison-stat">
                    <span>Avg Word Length:</span>
                    <strong>${generatedAnalysis.average_word_length}</strong>
                </div>
                <div class="comparison-stat">
                    <span>Vocabulary Richness:</span>
                    <strong>${generatedAnalysis.vocabulary_richness}%</strong>
                </div>
            </div>
        `;

  } catch (error) {
    console.error('Comparison failed:', error);
  }
}
