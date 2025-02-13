# Bitte AI Chat

## Introduction

The **Bitte AI Chat** component is a React component that enables AI-powered chat interactions in your application. It supports both **NEAR Protocol** and **EVM blockchain** interactions through wallet integrations, allowing users to interact with smart contracts and perform transactions directly through the chat interface.

> 🔑 Before you begin, make sure you have:
>
> - A **Bitte API Key** - [Get yours here](placeholder-link-for-api-key)

---

## Quick Start

1. [Configure Wallet Integration](#wallet-integration)
2. [Setup the API Route](#api-route-setup)
3. [Add the Chat Component](#basic-usage)

## Wallet Integration

We recommend installing the package using pnpm or yarn:

```
pnpm install @bitte-ai/chat
```

or

```
yarn add @bitte-ai/chat
```


if you are using npm and find issues, you can use the current command:

```
npm install @bitte-ai/chat --legacy-peer-deps
```

### NEAR Integration

You can integrate with NEAR using either the NEAR Wallet Selector or a direct account connection. If you want to be able to send near transacitons through the chat you will need to define at least one of these

#### Using Wallet Selector

```typescript
import { useBitteWallet, Wallet } from "@bitte-ai/react";
import { BitteAiChat } from "@bitte-ai/chat";
import "@bitte-ai/chat/dist/index.css";


export default function Chat() {
  const { selector } = useBitteWallet();
  const [wallet, setWallet] = useState<Wallet>();

  useEffect(() => {
    const fetchWallet = async () => {
      const walletInstance = await selector.wallet();
      setWallet(walletInstance);
    };
    if (selector) fetchWallet();
  }, [selector]);

  return (
    <BitteAiChat
      agentid="your-agent-id"
      apiUrl="/api/chat"
      wallet={{ near: { wallet } }}
    />
  );
}
```

#### Using Direct Account

```typescript
import { Account } from "near-api-js";
// get near account instance from near-api-js by instantiating a keypair
<BitteAiChat
  agentid="your-agent-id"
  apiUrl="/api/chat"
  wallet={{ near: { account: nearAccount } }}
/>
```

### EVM Integration

EVM integration uses WalletConnect with wagmi hooks:

```typescript

import { useSendTransaction, useAccount } from 'wagmi';

export default function Chat() {
  const { address } = useAccount();
  const { sendTransaction } = useSendTransaction();

  return (
    <BitteAiChat
      agentid="your-agent-id"
      apiUrl="/api/chat"
      wallet={{
        evm: {
          sendTransaction,
          address
        }
      }}
    />
  );
}
```

## API Route Setup

Create an API route in your Next.js application to proxy requests to the Bitte API to not expose your key:

```typescript
import type { NextRequest } from "next/server";

const { BITTE_API_KEY, BITTE_API_URL = "https://wallet.bitte.ai/api/v1/chat" } =
  process.env;

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export const POST = async (req: NextRequest): Promise<Response> => {
  const requestInit: RequestInit & { duplex: "half" } = {
    method: "POST",
    body: req.body,
    headers: {
      Authorization: `Bearer ${BITTE_API_KEY}`,
    },
    duplex: "half",
  };

  const upstreamResponse = await fetch(BITTE_API_URL, requestInit);
  const headers = new Headers(upstreamResponse.headers);
  headers.delete("Content-Encoding");

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers,
  });
};
```

## History API Route Setup

Create an API route in your Next.js application that will allow your app if you want to save chat context when signing a transaction after getting redirected to the wallet.

```typescript
import { type NextRequest, NextResponse } from 'next/server';

const { BITTE_API_KEY, BITTE_API_URL = 'https://wallet.bitte.ai/api/v1' } =
  process.env;

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const url = `${BITTE_API_URL}/history?id=${id}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${BITTE_API_KEY}`,
    },
  });

  const result = await response.json();

  return NextResponse.json(result);
};
```

## Component Props

```typescript
interface BitteAiChatProps {
  agentid: string; // ID of the AI agent to use
  apiUrl: string; // Your API route path (e.g., "/api/chat")
  historyApiUrl?: string; // Your history API route to keep context when signing transactions
  wallet?: WalletOptions; // Wallet configuration
  colors?: ChatComponentColors;
  options?: {
    agentName?: string; // Custom agent name
    agentImage?: string; // Custom agent image URL
    chatId?: string; // Custom chat ID
    prompt?: string // Custom Initial prompt
  };
  welcomeMessageComponent?: JSX.Element; // Custom Welcome Message to be displayed when the chat loads
  mobileInputExtraButton?: JSX.Element // Custom Button to add in mobile next to 'Send'
}
```

## Available Agents

[Agent registry](https://www.bitte.ai/registry)

## Creating Custom Agents

[Make Agent](https://docs.bitte.ai/agents/introduction)

## Styling

The component can be customized using the `colors` prop:

```typescript
type ChatComponentColors = {
  generalBackground?: string; // Chat container background
  messageBackground?: string; // Message bubble background
  textColor?: string; // Text color
  buttonColor?: string; // Button color
  borderColor?: string; // Border color
};
```

## Example Projects

- [Bitte AI Chat Boilerplate](placeholder-for-boilerplate-link)
