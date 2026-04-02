/**
 * Words MCP — wraps Datamuse API (free, no auth required)
 *
 * Tools:
 * - find_synonyms: Find synonyms for a word
 * - find_rhymes: Find rhyming words
 * - find_related: Find related words by relation type
 * - autocomplete: Word completion from a prefix
 * - find_words: Advanced word search by meaning, sound, or spelling
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://api.datamuse.com';

interface DatamuseWord {
  word: string;
  score: number;
  tags?: string[];
}

function shapeWord(w: DatamuseWord) {
  return { word: w.word, score: w.score };
}

const tools: McpToolExport['tools'] = [
  {
    name: 'find_synonyms',
    description: 'Find synonyms for a word, ranked by similarity score.',
    inputSchema: {
      type: 'object',
      properties: {
        word: {
          type: 'string',
          description: 'The word to find synonyms for',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return (default: 10)',
        },
      },
      required: ['word'],
    },
  },
  {
    name: 'find_rhymes',
    description: 'Find words that rhyme with a given word, ranked by score.',
    inputSchema: {
      type: 'object',
      properties: {
        word: {
          type: 'string',
          description: 'The word to find rhymes for',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return (default: 10)',
        },
      },
      required: ['word'],
    },
  },
  {
    name: 'find_related',
    description:
      'Find words related to a given word by a specific relation type. Relation types: "syn" (synonyms), "ant" (antonyms), "rhy" (rhymes), "trg" (triggers/associated words), "jja" (adjectives for a noun), "jjb" (nouns for an adjective).',
    inputSchema: {
      type: 'object',
      properties: {
        word: {
          type: 'string',
          description: 'The word to find related words for',
        },
        relation: {
          type: 'string',
          description:
            'Relation type: "syn" (synonyms), "ant" (antonyms), "rhy" (rhymes), "trg" (associated words), "jja" (adjectives for noun), "jjb" (nouns for adjective). Default: "trg"',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return (default: 10)',
        },
      },
      required: ['word'],
    },
  },
  {
    name: 'autocomplete',
    description:
      'Get word completions from a prefix. Useful for autocomplete and spelling suggestions.',
    inputSchema: {
      type: 'object',
      properties: {
        prefix: {
          type: 'string',
          description: 'The prefix to autocomplete (e.g. "hel" returns "hello", "help", etc.)',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return (default: 10)',
        },
      },
      required: ['prefix'],
    },
  },
  {
    name: 'find_words',
    description:
      'Advanced word search. Find words matching a combination of meaning, pronunciation, and spelling constraints.',
    inputSchema: {
      type: 'object',
      properties: {
        meaning_like: {
          type: 'string',
          description: 'Find words with meaning similar to this phrase (e.g. "ocean")',
        },
        sounds_like: {
          type: 'string',
          description: 'Find words that sound like this word (approximate pronunciation)',
        },
        spelled_like: {
          type: 'string',
          description: 'Find words spelled like this pattern (use * as wildcard, e.g. "b*ttle")',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return (default: 10)',
        },
      },
      required: [],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'find_synonyms':
      return findSynonyms(args.word as string, (args.limit as number) ?? 10);
    case 'find_rhymes':
      return findRhymes(args.word as string, (args.limit as number) ?? 10);
    case 'find_related':
      return findRelated(
        args.word as string,
        (args.relation as string) ?? 'trg',
        (args.limit as number) ?? 10,
      );
    case 'autocomplete':
      return autocomplete(args.prefix as string, (args.limit as number) ?? 10);
    case 'find_words':
      return findWords(
        args.meaning_like as string | undefined,
        args.sounds_like as string | undefined,
        args.spelled_like as string | undefined,
        (args.limit as number) ?? 10,
      );
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function findSynonyms(word: string, limit: number) {
  const params = new URLSearchParams({ rel_syn: word, max: String(limit) });
  const res = await fetch(`${BASE_URL}/words?${params}`);
  if (!res.ok) throw new Error(`Datamuse error: ${res.status}`);

  const data = (await res.json()) as DatamuseWord[];
  return { word, results: data.map(shapeWord) };
}

async function findRhymes(word: string, limit: number) {
  const params = new URLSearchParams({ rel_rhy: word, max: String(limit) });
  const res = await fetch(`${BASE_URL}/words?${params}`);
  if (!res.ok) throw new Error(`Datamuse error: ${res.status}`);

  const data = (await res.json()) as DatamuseWord[];
  return { word, results: data.map(shapeWord) };
}

async function findRelated(word: string, relation: string, limit: number) {
  const validRelations = ['syn', 'ant', 'rhy', 'trg', 'jja', 'jjb'];
  if (!validRelations.includes(relation)) {
    throw new Error(`Invalid relation type "${relation}". Must be one of: ${validRelations.join(', ')}`);
  }
  const params = new URLSearchParams({ [`rel_${relation}`]: word, max: String(limit) });
  const res = await fetch(`${BASE_URL}/words?${params}`);
  if (!res.ok) throw new Error(`Datamuse error: ${res.status}`);

  const data = (await res.json()) as DatamuseWord[];
  return { word, relation, results: data.map(shapeWord) };
}

async function autocomplete(prefix: string, limit: number) {
  const params = new URLSearchParams({ s: prefix, max: String(limit) });
  const res = await fetch(`${BASE_URL}/sug?${params}`);
  if (!res.ok) throw new Error(`Datamuse error: ${res.status}`);

  const data = (await res.json()) as DatamuseWord[];
  return { prefix, results: data.map(shapeWord) };
}

async function findWords(
  meaningLike: string | undefined,
  soundsLike: string | undefined,
  spelledLike: string | undefined,
  limit: number,
) {
  if (!meaningLike && !soundsLike && !spelledLike) {
    throw new Error('At least one of meaning_like, sounds_like, or spelled_like is required');
  }

  const params = new URLSearchParams({ max: String(limit) });
  if (meaningLike) params.set('ml', meaningLike);
  if (soundsLike) params.set('sl', soundsLike);
  if (spelledLike) params.set('sp', spelledLike);

  const res = await fetch(`${BASE_URL}/words?${params}`);
  if (!res.ok) throw new Error(`Datamuse error: ${res.status}`);

  const data = (await res.json()) as DatamuseWord[];
  return { results: data.map(shapeWord) };
}

export default { tools, callTool } satisfies McpToolExport;
