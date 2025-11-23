# Markov Chain Text Generator 🔗

An interactive NLP tool that uses higher-order Markov Chains for text generation and analysis. Built with **Python Flask backend** and a modern web frontend.

## Features

- 🐍 **Python-powered Markov Chain** engine with variable order support (1st-4th order)
- 🌐 **REST API** for training, generation, and analysis
- 📚 **Pre-loaded corpuses**: Shakespeare, Alice in Wonderland, Tech Blog, Social Media, Sci-Fi
- ✨ **Interactive text generation** with configurable parameters
- 📊 **Statistical analysis**: n-grams, vocabulary richness, model metrics
- 🎨 **Modern dark UI** with smooth animations and premium design

## Architecture

```
Frontend (HTML/CSS/JS) ←→ Flask REST API ←→ Python Markov Chain Engine
```

## Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- A modern web browser

### Setup

1. **Install Python dependencies:**

```bash
pip install -r requirements.txt
```

That's it! The requirements are minimal:
- Flask (web framework)
- flask-cors (CORS support)

## Running the Application

### 1. Start the Flask Backend

```bash
python app.py
```

You should see:
```
🚀 Starting Markov Chain API Server...
📍 Server running on http://localhost:5000
✨ Ready to generate text!
```

### 2. Open the Frontend

Open `index.html` in your web browser:

**Option A - Direct File:**
```
file:///C:/Users/Akram/OneDrive/Desktop/stochasticProject/index.html
```

**Option B - Simple HTTP Server (Python):**
```bash
# In a new terminal, in the project directory
python -m http.server 8000
```
Then open: `http://localhost:8000`

## Usage

### Quick Start

1. **Select a Corpus**: Click on any pre-loaded corpus (e.g., "Romeo & Juliet")
2. **Configure Model**: Choose Markov Chain order (2nd order recommended)
3. **Train Model**: Click "Train Model" button
4. **Generate Text**: Adjust length, optionally add seed words, click "Generate Text"
5. **Analyze**: Explore statistics, n-grams, and comparison tabs

### Custom Text

You can use your own text in three ways:

1. **Paste Text**: Click "Custom Text" tab and paste your text
2. **Upload File**: Click "Upload File" tab and select a `.txt` file
3. **Drag & Drop**: Drag a text file onto the upload area

### API Endpoints

The Flask backend provides these REST API endpoints:

#### GET /api/corpuses
List all available pre-loaded corpuses.

**Response:**
```json
{
  "success": true,
  "corpuses": [
    {
      "key": "shakespeare",
      "title": "Shakespeare - Romeo and Juliet",
      "author": "William Shakespeare",
      "word_count": 542
    },
    ...
  ]
}
```

#### GET /api/corpus/:key
Get a specific corpus text.

#### POST /api/train
Train the Markov Chain model.

**Request:**
```json
{
  "text": "your corpus text here...",
  "order": 2,
  "corpus_name": "My Corpus"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Model trained successfully",
  "statistics": {
    "order": 2,
    "word_count": 542,
    "unique_words": 234,
    "states": 456,
    "transitions": 678,
    "vocabulary_richness": 43.17
  }
}
```

#### POST /api/generate
Generate text from the trained model.

**Request:**
```json
{
  "length": 50,
  "seed": "to be"
}
```

**Response:**
```json
{
  "success": true,
  "text": "to be or not to be, that is the question...",
  "word_count": 50
}
```

#### POST /api/ngrams
Get n-gram frequency analysis.

**Request:**
```json
{
  "n": 2,
  "limit": 20
}
```

**Response:**
```json
{
  "success": true,
  "ngrams": [
    {"ngram": "to be", "count": 15},
    {"ngram": "of the", "count": 12},
    ...
  ]
}
```

#### POST /api/analyze
Analyze text statistics.

**Request:**
```json
{
  "text": "text to analyze..."
}
```

## Project Structure

```
stochasticProject/
├── app.py                 # Flask API server
├── markov_engine.py       # Python Markov Chain engine
├── corpuses.py            # Sample text corpuses
├── requirements.txt       # Python dependencies
├── index.html             # Frontend HTML
├── styles.css             # Premium CSS styling
├── app.js                 # Frontend JavaScript (API client)
└── README.md              # This file
```

## How It Works

### Markov Chain Algorithm

1. **Training**: The algorithm analyzes the input text and builds a state transition matrix
   - For order N, it looks at sequences of N words
   - Tracks what word typically follows each N-word sequence
   - Records sentence start positions

2. **Generation**: Creates new text by walking through the state chain
   - Starts with a random (or seed) N-word sequence
   - Probabilistically selects the next word based on training data
   - Slides the window forward and repeats
   - Handles dead ends by starting new sentences

3. **Higher Orders = More Coherence**:
   - 1st order: Next word depends on 1 previous word (less coherent)
   - 2nd order: Next word depends on 2 previous words (good balance)
   - 3rd order: Next word depends on 3 previous words (more coherent)
   - 4th order: Next word depends on 4 previous words (most coherent, needs more data)

## Troubleshooting

### "Cannot connect to server"

Make sure the Flask server is running:
```bash
python app.py
```

### CORS Errors

The Flask server has CORS enabled. If you still see CORS errors, try running the frontend on a local HTTP server instead of opening it directly as a file.

### Port Already in Use

If port 5000 is already in use, you can change it in `app.py`:
```python
app.run(debug=True, host='localhost', port=5001)  # Change port
```

Then update the API URL in `app.js`:
```javascript
const API_BASE_URL = 'http://localhost:5001/api';
```

## Technologies Used

### Backend
- **Python 3.8+**: Core language
- **Flask**: Lightweight web framework
- **flask-cors**: Cross-origin resource sharing

### Frontend
- **HTML5**: Semantic structure
- **CSS3**: Modern styling with gradients, animations
- **Vanilla JavaScript**: No frameworks, pure ES6+
- **Fetch API**: RESTful communication

### Algorithm
- **Markov Chains**: N-gram based text generation
- **Python Collections**: Efficient data structures
- **Regular Expressions**: Text processing

## Performance

- Training is near-instant for corpuses under 10,000 words
- Generation typically takes < 100ms
- Supports corpuses up to 100,000+ words efficiently

## Future Enhancements

- [ ] Model persistence (save/load trained models)
- [ ] More corpuses (user submissions)
- [ ] Advanced temperature control
- [ ] Beam search for better generation
- [ ] Integration with NLTK for better tokenization
- [ ] Multiple model comparison
- [ ] Export generated text to file

## License

MIT License - feel free to use for learning and projects!

## Credits

Built with ❤️ using Python and modern web technologies.

Sample texts are in the public domain or used for educational purposes.
