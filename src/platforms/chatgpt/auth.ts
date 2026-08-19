interface PageRequestResult {
  data?: unknown;
  error?: string;
}

export async function fetchInChatGptMainWorld(requestPath: string): Promise<PageRequestResult> {
  try {
    const sessionResponse = await fetch("/api/auth/session", {
      credentials: "include",
      headers: { accept: "application/json" },
    });
    if (!sessionResponse.ok) {
      return { error: `读取登录状态失败（HTTP ${sessionResponse.status}）` };
    }

    const session = (await sessionResponse.json()) as { accessToken?: string };
    const accessToken = session.accessToken;
    if (!accessToken) return { error: "没有获取到访问令牌，请刷新 ChatGPT 页面后重新登录。" };

    const payloadPart = accessToken.split(".")[1];
    if (!payloadPart) return { error: "访问令牌格式无效。" };
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const payload = JSON.parse(atob(padded)) as Record<string, unknown>;
    const authClaims = (payload["https://api.openai.com/auth"] ?? {}) as Record<string, unknown>;
    const accountId = authClaims.chatgpt_account_id;
    if (typeof accountId !== "string") return { error: "没有从登录信息中找到 ChatGPT 账号 ID。" };

    const targetPath = new URL(requestPath, location.origin).pathname;
    const response = await fetch(requestPath, {
      method: "GET",
      credentials: "include",
      headers: {
        accept: "*/*",
        authorization: `Bearer ${accessToken}`,
        "chatgpt-account-id": accountId,
        "oai-language": document.documentElement.lang || navigator.language || "zh-CN",
        "x-openai-target-path": targetPath,
        "x-openai-target-route": targetPath,
      },
    });
    if (!response.ok) return { error: `ChatGPT 接口请求失败（HTTP ${response.status}）` };
    return { data: await response.json() };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}
