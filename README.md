# @pipeworx/mcp-words

MCP server for word synonyms, rhymes, and language tools via Datamuse

## Tools

| Tool | Description |
|------|-------------|
| `find_synonyms` | Find synonyms for a word, ranked by similarity |
| `find_rhymes` | Find words that rhyme with a given word |
| `find_related` | Find related words by relation type (synonyms, antonyms, triggers, etc.) |
| `autocomplete` | Word completion from a prefix |
| `find_words` | Advanced word search by meaning, sound, or spelling |

## Quickstart (Pipeworx Gateway)

```bash
curl -X POST https://gateway.pipeworx.io/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "find_synonyms",
      "arguments": { "word": "happy", "limit": 5 }
    }
  }'
```

## License

MIT
