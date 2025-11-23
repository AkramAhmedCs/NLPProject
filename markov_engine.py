"""
Markov Chain Text Generator - Python Engine
Supports variable-order Markov models for text generation
"""

import random
import re
from collections import defaultdict, Counter
from typing import List, Dict, Tuple, Optional


class MarkovChain:
    """Markov Chain text generator with configurable order"""
    
    def __init__(self):
        self.chain: Dict[str, List[str]] = defaultdict(list)
        self.order: int = 1
        self.start_words: List[str] = []
        self.corpus_text: str = ''
        self.word_count: int = 0
        self.unique_words: set = set()
        
    def tokenize(self, text: str) -> List[str]:
        """
        Tokenize text into words while preserving punctuation
        
        Args:
            text: Input text to tokenize
            
        Returns:
            List of tokens
        """
        # Remove extra whitespace and split into words
        tokens = text.strip().split()
        # Filter empty strings
        return [word for word in tokens if word]
    
    def is_sentence_start(self, word: str) -> bool:
        """Check if a word marks the start of a sentence"""
        return bool(re.search(r'[.!?]$', word))
    
    def is_sentence_end(self, word: str) -> bool:
        """Check if a word marks the end of a sentence"""
        return bool(re.search(r'[.!?]$', word))
    
    def train(self, text: str, order: int = 2) -> Dict:
        """
        Train the Markov Chain model on a text corpus
        
        Args:
            text: Training text corpus
            order: Order of the Markov chain (1, 2, 3, etc.)
            
        Returns:
            Dictionary with training statistics
            
        Raises:
            ValueError: If corpus is too small for the specified order
        """
        self.chain = defaultdict(list)
        self.start_words = []
        self.order = order
        self.corpus_text = text
        self.unique_words = set()
        
        tokens = self.tokenize(text)
        self.word_count = len(tokens)
        
        if len(tokens) < order + 1:
            raise ValueError(
                f"Corpus too small for order {order}. "
                f"Need at least {order + 1} words, got {len(tokens)}."
            )
        
        # Build the chain
        for i in range(len(tokens) - order):
            # Create the state (n-gram of 'order' words)
            state = ' '.join(tokens[i:i + order])
            next_word = tokens[i + order]
            
            # Track unique words
            for word in tokens[i:i + order]:
                self.unique_words.add(word)
            self.unique_words.add(next_word)
            
            # Store start words (for beginning generation)
            if i == 0 or self.is_sentence_start(tokens[i - 1]):
                self.start_words.append(state)
            
            # Add to chain
            self.chain[state].append(next_word)
        
        # If no start words found, use the first state
        if not self.start_words:
            self.start_words.append(' '.join(tokens[:order]))
        
        return self.get_statistics()
    
    def generate(self, length: int = 50, seed: Optional[str] = None) -> str:
        """
        Generate text using the trained Markov chain
        
        Args:
            length: Approximate number of words to generate
            seed: Optional seed word(s) to start generation
            
        Returns:
            Generated text string
            
        Raises:
            RuntimeError: If model hasn't been trained
            ValueError: If seed word doesn't exist in corpus
        """
        if not self.chain:
            raise RuntimeError("Model not trained. Call train() first.")
        
        # Initialize with seed or random start word
        seed_used = False
        if seed:
            seed_tokens = self.tokenize(seed)
            
            # Check if any seed word exists in the corpus
            seed_words_in_corpus = [word for word in seed_tokens if word.lower() in {w.lower() for w in self.unique_words}]
            
            if not seed_words_in_corpus:
                # Suggest some words from the corpus
                sample_words = list(self.unique_words)[:10] if len(self.unique_words) > 10 else list(self.unique_words)
                raise ValueError(
                    f"Seed word(s) '{seed}' not found in the trained corpus. "
                    f"Try words that exist in the text, such as: {', '.join(sample_words[:5])}"
                )
            
            if len(seed_tokens) >= self.order:
                current_state = ' '.join(seed_tokens[-self.order:])
            else:
                # Pad seed if too short
                padding_state = random.choice(self.start_words)
                padding_tokens = padding_state.split()[:self.order - len(seed_tokens)]
                current_state = ' '.join(padding_tokens + seed_tokens)
            
            # If exact seed state doesn't exist in chain, try to find a state containing the seed
            if current_state not in self.chain:
                # Try to find states that contain the seed word
                matching_states = [state for state in self.chain.keys() 
                                 if any(word.lower() in state.lower() for word in seed_words_in_corpus)]
                if matching_states:
                    current_state = random.choice(matching_states)
                    seed_used = True
                else:
                    current_state = random.choice(self.start_words)
            else:
                seed_used = True
        else:
            current_state = random.choice(self.start_words)
        
        result = current_state.split()
        generated_words = len(result)
        
        # Generate words
        max_iterations = length * 3  # Prevent infinite loops
        iterations = 0
        
        while generated_words < length and iterations < max_iterations:
            iterations += 1
            
            possible_next_words = self.chain.get(current_state, [])
            
            if not possible_next_words:
                # Dead end - start a new sentence
                current_state = random.choice(self.start_words)
                result.append('')  # Add space between sentences
                result.extend(current_state.split())
                generated_words = len(result)
                continue
            
            next_word = random.choice(possible_next_words)
            result.append(next_word)
            generated_words += 1
            
            # Update current state (slide the window)
            state_words = current_state.split()
            state_words.pop(0)
            state_words.append(next_word)
            current_state = ' '.join(state_words)
            
            # Occasionally start new sentences at natural boundaries
            if self.is_sentence_end(next_word) and random.random() > 0.3:
                if generated_words < length - self.order:
                    current_state = random.choice(self.start_words)
        
        return ' '.join(result).strip()
    
    def get_statistics(self) -> Dict:
        """
        Get statistics about the trained model
        
        Returns:
            Dictionary with model statistics
        """
        states = list(self.chain.keys())
        transitions = sum(len(values) for values in self.chain.values())
        
        avg_transitions = transitions / len(states) if states else 0
        vocab_richness = (len(self.unique_words) / self.word_count * 100) if self.word_count > 0 else 0
        
        return {
            'order': self.order,
            'word_count': self.word_count,
            'unique_words': len(self.unique_words),
            'states': len(states),
            'transitions': transitions,
            'average_transitions': round(avg_transitions, 2),
            'vocabulary_richness': round(vocab_richness, 2)
        }
    
    def get_ngram_frequencies(self, n: int = 2, limit: int = 20) -> List[Dict]:
        """
        Get n-gram frequencies from the corpus
        
        Args:
            n: N-gram size
            limit: Maximum number of results
            
        Returns:
            List of dictionaries with ngram and count
        """
        tokens = self.tokenize(self.corpus_text)
        ngram_counts = Counter()
        
        for i in range(len(tokens) - n + 1):
            ngram = ' '.join(tokens[i:i + n])
            ngram_counts[ngram] += 1
        
        return [
            {'ngram': ngram, 'count': count}
            for ngram, count in ngram_counts.most_common(limit)
        ]


def analyze_text(text: str) -> Dict:
    """
    Analyze text and return comprehensive statistics
    
    Args:
        text: Text to analyze
        
    Returns:
        Dictionary with analysis results
    """
    words = text.strip().split()
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    # Remove punctuation for character count
    characters = re.sub(r'\s', '', text)
    
    # Word frequency
    word_freq = Counter()
    unique_words = set()
    
    for word in words:
        normalized = word.lower().strip('.,!?;:')
        unique_words.add(normalized)
        word_freq[normalized] += 1
    
    avg_word_length = sum(len(word) for word in words) / len(words) if words else 0
    avg_sentence_length = len(words) / len(sentences) if sentences else 0
    vocab_richness = (len(unique_words) / len(words) * 100) if words else 0
    
    top_words = [
        {'word': word, 'count': count}
        for word, count in word_freq.most_common(10)
    ]
    
    return {
        'word_count': len(words),
        'sentence_count': len(sentences),
        'character_count': len(characters),
        'unique_words': len(unique_words),
        'average_word_length': round(avg_word_length, 2),
        'average_sentence_length': round(avg_sentence_length, 2),
        'vocabulary_richness': round(vocab_richness, 2),
        'top_words': top_words
    }
