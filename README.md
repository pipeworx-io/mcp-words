# mcp-words

Words MCP — wraps Datamuse API (free, no auth required)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `find_synonyms` | Find synonyms for an English word using the Datamuse word API (rel_syn), ranked by the Datamuse similarity score, with a limit on how many come back (default 10). Returns each candidate word with its score. Answers what another word for a given term is when writing, editing, or paraphrasing English prose. |
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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/words/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Words data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
