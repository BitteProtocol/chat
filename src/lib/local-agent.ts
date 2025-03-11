import { BitteToolResult } from "../types";

interface ToolCall<NAME extends string, ARGS> {
  toolCallId: string;
  toolName: NAME;
  args: ARGS;
}

interface LocalAgent {
  spec: {
    servers?: { url: string }[];
    paths: Record<string, any>;
  };
}

interface LocalToolCallProps {
  localAgent: LocalAgent;
  toolCall: ToolCall<string, unknown>;
  metadata?: Record<string, unknown>;
}

export const executeLocalToolCall = async ({
  localAgent,
  toolCall,
  metadata,
}: LocalToolCallProps): Promise<BitteToolResult | undefined> => {
  const baseUrl = localAgent.spec.servers?.[0]?.url;
  if (!baseUrl) return undefined;

  const { toolPath, httpMethod } = findToolPathAndMethod(
    localAgent,
    toolCall.toolName
  );

  if (!toolPath || !httpMethod) {
    console.error("Tool path or method not found for:", toolCall.toolName);
    return undefined;
  }

  try {
    const args = toolCall.args ? JSON.parse(JSON.stringify(toolCall.args)) : {};
    const { url, remainingArgs } = buildUrlWithParams(baseUrl, toolPath, args);
    
    const { options } = buildRequestOptions({
      httpMethod,
      remainingArgs,
      metadata,
    });

    const finalUrl =
      httpMethod === "GET" ? handleQueryParams(url, remainingArgs) : url;

    const response = await fetch(finalUrl, options);

    if (!response.ok) {
      throw new Error(
        `HTTP error during tool execution: ${response.status} ${response.statusText}`
      );
    }

    const result = await parseResponse(response);

    return {
      data: {
        result,
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error executing tool call:", errorMessage);
    return {
      error: errorMessage,
    };
  }
};

export const findToolPathAndMethod = (
  localAgent: LocalAgent,
  toolName: string
): { toolPath?: string; httpMethod?: string } => {
  let toolPath: string | undefined;
  let httpMethod: string | undefined;

  Object.entries(localAgent.spec.paths).forEach(
    ([path, pathObj]: [string, any]) => {
      Object.entries(pathObj).forEach(([method, methodObj]: [string, any]) => {
        if (methodObj.operationId === toolName) {
          toolPath = path;
          httpMethod = method.toUpperCase();
        }
      });
    }
  );

  return { toolPath, httpMethod };
};

export const buildUrlWithParams = (
  baseUrl: string,
  toolPath: string,
  args: any
): { url: string; remainingArgs: any } => {
  let url = `${baseUrl}${toolPath}`;
  const remainingArgs = { ...args };

  url = url.replace(/\{(\w+)\}/g, (_, key) => {
    if (remainingArgs[key] === undefined) {
      throw new Error(`Missing required path parameter: ${key}`);
    }
    const value = remainingArgs[key];
    delete remainingArgs[key];
    return encodeURIComponent(String(value));
  });

  return { url, remainingArgs };
};

export const buildRequestOptions = ({
  httpMethod,
  remainingArgs,
  metadata,
}: {
  httpMethod: string;
  remainingArgs: any;
  metadata?: Record<string, unknown>;
}): { options: RequestInit } => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(metadata ? { "mb-metadata": JSON.stringify(metadata) } : {}),
  };

  const fetchOptions: RequestInit = {
    method: httpMethod,
    headers,
  };

  if (httpMethod !== "GET") {
    fetchOptions.body = JSON.stringify(remainingArgs);
  }

  return { options: fetchOptions };
};

export const handleQueryParams = (url: string, remainingArgs: any): string => {
  if (Object.keys(remainingArgs).length === 0) return url;

  const queryParams = new URLSearchParams();
  Object.entries(remainingArgs)
    .filter(([_, value]) => value != null)
    .forEach(([key, value]) => queryParams.append(key, String(value)));

  const queryString = queryParams.toString();
  if (queryString) {
    url += (url.includes("?") ? "&" : "?") + queryString;
  }
  return url;
};

export const parseResponse = async (response: Response): Promise<any> => {
  const contentType = response.headers.get("Content-Type") || "";
  return contentType.includes("application/json")
    ? response.json()
    : contentType.includes("text")
      ? response.text()
      : response.blob();
};
