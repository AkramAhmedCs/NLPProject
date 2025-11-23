    """API home endpoint"""
    return jsonify({
        'message': 'Markov Chain Text Generator API',
        'version': '1.0',
        'endpoints': {
            'GET /api/corpuses': 'List available corpuses',
            'POST /api/train': 'Train the Markov model',
            'POST /api/generate': 'Generate text',
            'GET /api/statistics': 'Get model statistics',
            'POST /api/ngrams': 'Get n-gram frequencies',
            'POST /api/analyze': 'Analyze text'
        }
    })


@app.route('/api/corpuses', methods=['GET'])
def get_corpuses():
    """Get list of available corpuses"""
    try:
        corpus_list = [
            {
                'key': key,
                'title': data['title'],
                'author': data['author'],
                'word_count': len(data['text'].split())
            }
            for key, data in CORPUSES.items()
        ]
        
        return jsonify({
            'success': True,
            'corpuses': corpus_list
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/corpus/<corpus_key>', methods=['GET'])
def get_corpus(corpus_key):
    """Get a specific corpus text"""
    try:
        if corpus_key not in CORPUSES:
            return jsonify({
                'success': False,
                'error': f'Corpus "{corpus_key}" not found'
            }), 404
        
        corpus = CORPUSES[corpus_key]
        return jsonify({
            'success': True,
            'corpus': corpus
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/train', methods=['POST'])
def train_model():
    """Train the Markov Chain model"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        text = data.get('text')
        order = data.get('order', 2)
        corpus_name = data.get('corpus_name', 'Custom')
        
        if not text:
            return jsonify({
                'success': False,
                'error': 'No text provided'
            }), 400
        
        # Validate order
        if not isinstance(order, int) or order < 1 or order > 10:
            return jsonify({
                'success': False,
                'error': 'Order must be an integer between 1 and 10'
            }), 400
        
        # Train the model
        statistics = markov.train(text, order)
        
        return jsonify({
            'success': True,
            'message': f'Model trained successfully with {corpus_name}',
            'statistics': statistics
        })
        
    except ValueError as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Training failed: {str(e)}'
        }), 500


@app.route('/api/generate', methods=['POST'])
def generate_text():
    """Generate text using the trained model"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        length = data.get('length', 50)
        seed = data.get('seed', None)
        
        # Validate length
        if not isinstance(length, int) or length < 1 or length > 500:
            return jsonify({
                'success': False,
                'error': 'Length must be an integer between 1 and 500'
            }), 400
        
        # Generate text
        generated_text = markov.generate(length, seed)
        
        return jsonify({
            'success': True,
            'text': generated_text,
            'word_count': len(generated_text.split()),
            'seed_used': seed if seed else None
        })
        
    except ValueError as e:
        # Seed word not found in corpus
        return jsonify({
            'success': False,
            'error': str(e),
            'error_type': 'invalid_seed'
        }), 400
    except RuntimeError as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Generation failed: {str(e)}'
        }), 500


@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """Get statistics about the trained model"""
    try:
        if not markov.chain:
            return jsonify({
                'success': False,
                'error': 'Model not trained'
            }), 400
        
        statistics = markov.get_statistics()
        
        return jsonify({
            'success': True,
            'statistics': statistics
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/ngrams', methods=['POST'])
def get_ngrams():
    """Get n-gram frequencies"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        n = data.get('n', 2)
        limit = data.get('limit', 20)
        
        # Validate parameters
        if not isinstance(n, int) or n < 1 or n > 10:
            return jsonify({
                'success': False,
                'error': 'N must be an integer between 1 and 10'
            }), 400
        
        if not isinstance(limit, int) or limit < 1 or limit > 100:
            return jsonify({
                'success': False,
                'error': 'Limit must be an integer between 1 and 100'
            }), 400
        
        if not markov.corpus_text:
            return jsonify({
                'success': False,
                'error': 'Model not trained'
            }), 400
        
        # Get n-grams
        ngrams = markov.get_ngram_frequencies(n, limit)
        
        return jsonify({
            'success': True,
            'ngrams': ngrams
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/analyze', methods=['POST'])
def analyze():
    """Analyze text and return statistics"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        text = data.get('text')
        
        if not text:
            return jsonify({
                'success': False,
                'error': 'No text provided'
            }), 400
        
        # Analyze text
        analysis = analyze_text(text)
        
        return jsonify({
            'success': True,
            'analysis': analysis
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500


if __name__ == '__main__':
    print("🚀 Starting Markov Chain API Server...")
    print("📍 Server running on http://localhost:5000")
    print("📚 Available endpoints:")
    print("   GET  /api/corpuses - List available corpuses")
    print("   GET  /api/corpus/<key> - Get specific corpus")
    print("   POST /api/train - Train the model")
    print("   POST /api/generate - Generate text")
    print("   GET  /api/statistics - Get model stats")
    print("   POST /api/ngrams - Get n-gram frequencies")
    print("   POST /api/analyze - Analyze text")
    print("\n✨ Ready to generate text!")
    
    app.run(debug=True, host='localhost', port=5000)
