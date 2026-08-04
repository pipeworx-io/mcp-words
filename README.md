# mcp-words

Words MCP — wraps Datamuse API (free, no auth required)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `find_synonyms` | Find synonyms for a word, ranked by similarity score. |
| `find_rhymes` | Find words that rhyme with a given word, ranked by score. |
| `find_related` | Find words related to a given word by a specific relation type. Relation types: "syn" (synonyms), "ant" (antonyms), "rhy" (rhymes), "trg" (triggers/associated words), "jja" (adjectives for a noun), "jjb" (nouns for an adjective). |
| `autocomplete` | Return word completions for a given prefix string using the Datamuse suggestion endpoint. Takes a prefix (e.g., "hel") and returns matching words ranked by score (e.g., "hello", "help", "helpless"). |
| `find_words` | Advanced word search. Find words matching a combination of meaning, pronunciation, and spelling constraints. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "words": {
      "url": "https://gateway.pipeworx.io/words/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Words data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
