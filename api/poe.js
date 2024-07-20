import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export const config = {
  runtime: 'edge',
  api: {
    bodyParser: false,
  },
};

// Replace with your actual Poe API key
const POE_API_KEY = process.env.POE_API_KEY || '';

function convertRole(role) {
  return role === 'assistant' ? 'bot' : role;
}

async function* getBotResponse(messages, botName) {
  const url = 'https://api.poe.com/chat/';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${POE_API_KEY}`,
  };

  const body = JSON.stringify({
    bot: botName,
    messages: messages.map(msg => ({
      role: convertRole(msg.role),
      content: msg.content,
    })),
  });

  const response = await fetch(url, { method: 'POST', headers, body });
  const reader = response.body.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield new TextDecoder().decode(value);
  }
}

function constructSSEEvent(chunk, model, fullResponse, done = false) {
  if (done) {
    return `data: [DONE]\n\n`;
  }

  const response = {
    id: `chatcmpl-${fullResponse.length}`,
    object: 'chat.completion.chunk',
    created: Date.now(),
    model: model,
    choices: [
      {
        index: 0,
        delta: {
          content: chunk,
        },
        finish_reason: null,
      },
    ],
  };

  return `data: ${JSON.stringify(response)}\n\n`;
}

export default async function handler(req) {
  // 设置 CORS 头部
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // 对 OPTIONS 请求做出快速响应
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers });
  }

  if (req.method !== 'POST') {
    return new NextResponse('Method Not Allowed', { status: 405, headers });
  }

  try {
    const body = await req.json();
    const { model, messages, stream } = body;

    if (stream) {
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          let fullResponse = '';
          for await (const partial of getBotResponse(messages, model)) {
            fullResponse += partial;
            controller.enqueue(encoder.encode(constructSSEEvent(partial, model, fullResponse)));
          }
          controller.enqueue(encoder.encode(constructSSEEvent('', model, fullResponse, true)));
          controller.close();
        },
      });

      return new NextResponse(readable, {
        headers: {
          ...headers,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      let fullResponse = '';
      for await (const partial of getBotResponse(messages, model)) {
        fullResponse += partial;
      }

      const response = {
        id: `chatcmpl-${fullResponse.length}`,
        object: 'chat.completion',
        created: Date.now(),
        model: model,
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: fullResponse,
            },
            finish_reason: 'stop',
          },
        ],
        usage: {
          prompt_tokens: messages.reduce((acc, msg) => acc + msg.content.split(' ').length, 0),
          completion_tokens: fullResponse.split(' ').length,
          total_tokens: messages.reduce((acc, msg) => acc + msg.content.split(' ').length, 0) + fullResponse.split(' ').length,
        },
      };

      return new NextResponse(JSON.stringify(response), {
        status: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      status: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }
}