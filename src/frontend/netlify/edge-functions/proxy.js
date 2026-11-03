export default async (request, context) => {
  const url = new URL(request.url);
  
  // 1. Build the target destination URL on Render, preserving the path and query parameters
  const targetUrl = "https://spminesweeper.onrender.com";
  
  // 2. Clone the incoming request headers
  const headers = new Headers(request.headers);
  
  // 3. Securely inject your private Netlify environment variable
  const apiKey = Deno.env.get("MY_PRIVATE_KEY") || "";
  headers.set("X-API-Key", apiKey);

  // 4. Forward the exact request details to Render
  return fetch(targetUrl, {
    method: request.method,
    headers: headers,
    body: request.body
  });
};

// 5. Run this function on every single incoming route
export const config = { path: "/https://benevolent-otter-499988.netlify.app/*" };
