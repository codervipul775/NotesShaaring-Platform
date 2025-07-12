const nlp = require('compromise');

/**
 * Extracts 3-7 ranked keywords from note content using NLP.
 * @param {Object} params
 * @param {string} params.title - The note's title
 * @param {string} params.description - The note's description
 * @param {string} [params.summary] - Optional summary
 * @param {string} [params.text] - Optional full text
 * @returns {string[]} Array of 3-7 keywords, ranked by relevance
 */
function extractKeywords({ title = '', description = '', summary = '', text = '' }) {
  const content = [title, description, summary, text].filter(Boolean).join(' ');
  if (!content.trim()) return [];
  const doc = nlp(content);
  let terms = doc.nouns().out('frequency'); 
  const stopwords = new Set([
    ...nlp.world().words.topk(100).map(w => w.word), 
    'note', 'notes', 'title', 'description', 'summary', 'text', 'etc', 'thing', 'things', 'stuff', 'page', 'file', 'document', 'user', 'author', 'upload', 'download', 'read', 'write', 'see', 'show', 'get', 'set', 'use', 'data', 'info', 'information', 'content', 'subject', 'topic', 'keywords', 'keyword'
  ]);

  const keywords = [];
  for (const t of terms) {
    const word = t.normal.trim().toLowerCase();
    if (
      word.length < 3 ||
      stopwords.has(word) ||
      keywords.includes(word)
    ) continue;
    keywords.push(word);
    if (keywords.length >= 7) break;
  }
  if (keywords.length < 3) {
    const allTerms = doc.terms().out('array');
    for (const word of allTerms) {
      const w = word.trim().toLowerCase();
      if (w.length < 3 || stopwords.has(w) || keywords.includes(w)) continue;
      keywords.push(w);
      if (keywords.length >= 7) break;
    }
  }

  return keywords.slice(0, 7);
}

module.exports = { extractKeywords };
if (require.main === module) {
  const tests = [
    {
      input: {
        title: 'Introduction to Quantum Computing',
        description: 'This note covers the basics of quantum bits, superposition, and entanglement.',
      },
      expect: ['quantum computing', 'quantum bits', 'superposition', 'entanglement']
    },
    {
      input: {
        title: 'Photosynthesis',
        description: 'Process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water.'
      },
      expect: ['photosynthesis', 'green plants', 'organisms', 'sunlight', 'carbon dioxide', 'water']
    },
    {
      input: {
        title: 'Short',
        description: 'A very short note.'
      },
      expect: []
    },
    {
      input: {
        title: 'Machine Learning Algorithms',
        description: 'Overview of supervised and unsupervised learning, neural networks, and decision trees.'
      },
      expect: ['machine learning algorithms', 'supervised learning', 'unsupervised learning', 'neural networks', 'decision trees']
    }
  ];

  for (const { input, expect } of tests) {
    const result = extractKeywords(input);
    console.log('Input:', input);
    console.log('Extracted:', result);
    console.log('---');
  }
} 