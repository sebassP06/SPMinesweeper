export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Forward any /api/* request (like /api/all) to the spmines worker
    if (url.pathname.startsWith("/api/")) {
      const targetPath = url.pathname.replace(/^\/api/, "");
      const internalUrl = new URL(targetPath + url.search, request.url);
      return env.SPMINES.fetch(new Request(internalUrl, request));
    }

    // Serve your static HTML/CSS/JS files
    return env.ASSETS.fetch(request);
  }
};