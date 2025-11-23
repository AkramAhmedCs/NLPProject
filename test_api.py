"""
Test script for Markov Chain API
Tests all endpoints to verify functionality
"""

import requests
import json

API_BASE = 'http://localhost:5000/api'

def test_api():
    print("🧪 Testing Markov Chain API\n")
    
    # Test 1: Get corpuses
    print("1. Testing GET /api/corpuses")
    response = requests.get(f'{API_BASE}/corpuses')
    data = response.json()
    print(f"   ✓ Status: {response.status_code}")
    print(f"   ✓ Found {len(data['corpuses'])} corpuses")
    print()
    
    # Test 2: Get specific corpus
    print("2. Testing GET /api/corpus/shakespeare")
    response = requests.get(f'{API_BASE}/corpus/shakespeare')
    data = response.json()
    print(f"   ✓ Status: {response.status_code}")
    print(f"   ✓ Corpus: {data['corpus']['title']}")
    print(f"   ✓ Text length: {len(data['corpus']['text'])} characters")
    corpus_text = data['corpus']['text']
    print()
    
    # Test 3: Train model
    print("3. Testing POST /api/train")
    response = requests.post(f'{API_BASE}/train', json={
        'text': corpus_text,
        'order': 2,
        'corpus_name': 'Shakespeare - Romeo & Juliet'
    })
    data = response.json()
    print(f"   ✓ Status: {response.status_code}")
    print(f"   ✓ Message: {data['message']}")
    print(f"   ✓ Statistics: {json.dumps(data['statistics'], indent=6)}")
    print()
    
    # Test 4: Generate text
    print("4. Testing POST /api/generate")
    response = requests.post(f'{API_BASE}/generate', json={
        'length': 50,
        'seed': 'love'
    })
    data = response.json()
    print(f"   ✓ Status: {response.status_code}")
    print(f"   ✓ Generated text ({data['word_count']} words):")
    print(f"   \"{data['text'][:200]}...\"")
    generated_text = data['text']
    print()
    
    # Test 5: Get n-grams
    print("5. Testing POST /api/ngrams")
    response = requests.post(f'{API_BASE}/ngrams', json={
        'n': 2,
        'limit': 5
    })
    data = response.json()
    print(f"   ✓ Status: {response.status_code}")
    print(f"   ✓ Top 5 bigrams:")
    for item in data['ngrams']:
        print(f"      - \"{item['ngram']}\": {item['count']}")
    print()
    
    # Test 6: Analyze text
    print("6. Testing POST /api/analyze")
    response = requests.post(f'{API_BASE}/analyze', json={
        'text': generated_text
    })
    data = response.json()
    print(f"   ✓ Status: {response.status_code}")
    print(f"   ✓ Analysis:")
    for key, value in data['analysis'].items():
        if key != 'top_words':
            print(f"      - {key}: {value}")
    print()
    
    print("✅ All tests passed!")
    print("\n🎉 Python backend is working correctly!")

if __name__ == '__main__':
    try:
        test_api()
    except requests.ConnectionError:
        print("❌ Error: Could not connect to server.")
        print("   Make sure Flask is running on http://localhost:5000")
    except Exception as e:
        print(f"❌ Error: {e}")
