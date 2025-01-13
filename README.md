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

Install the package using npm or yarn:

```
pnpm install bitte-ai-chat
```

### NEAR Integration

You can integrate with NEAR using either the NEAR Wallet Selector or a direct account connection. If you want to be able to send near transacitons through the chat you will need to define at least one of these

#### Using Wallet Selector

```typescript
import { useBitteWallet, Wallet } from "@mintbase-js/react";
import { BitteAiChat } from "bitte-ai-chat";

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

import { useAppKitAccount } from '@reown/appkit/react';
import { useSendTransaction } from 'wagmi';

export default function Chat() {
  const { address } = useAppKitAccount();
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

## Component Props

```typescript
interface BitteAiChatProps {
  agentid: string; // ID of the AI agent to use
  apiUrl: string; // Your API route path (e.g., "/api/chat")
  wallet?: WalletOptions; // Wallet configuration
  options?: {
    agentName?: string; // Custom agent name
    agentImage?: string; // Custom agent image URL
    chatId?: string; // Custom chat ID
  };
}
```

## Available Agents

[Placeholder for agent registry link]

## Creating Custom Agents

[Placeholder for agent creation documentation link]

## Styling

The component has support for dark/light theme. The component will display the colors of the current selected theme in the consumer app.

## Example Projects

- [Bitte AI Chat Boilerplate](placeholder-for-boilerplate-link)
