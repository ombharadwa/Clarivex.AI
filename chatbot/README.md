# Clarivex.AI production chatbot

The chatbot is designed as an open-ended AI assistant rather than a keyword FAQ bot.

## Components

- `api/chat.js` — server-side AI endpoint. The API key is read only from `OPENAI_API_KEY`.
- `chatbot.js` — browser client and conversation-memory layer.

## Deployment

Deploy the repository on a platform that supports serverless Node functions (for example, Vercel-style `/api` functions), then configure:

- `OPENAI_API_KEY` — required secret
- `OPENAI_MODEL` — optional model override; defaults to `gpt-5-mini`

Do **not** put the API key in HTML or browser JavaScript.

## Connecting the existing UI

Load `/chatbot.js` after the existing chatbot markup and replace the current local keyword response call with:

```js
const reply = await window.ClarivexChat.ask(userText);
```

Render `reply` in the existing bot message container. The client retains the latest conversation turns while the server remains responsible for the system instructions and API credentials.

## Design goal

The assistant can answer general questions, technical questions and Clarivex-specific questions. It is instructed not to fabricate company facts and to qualify genuine project enquiries for a consultation.
