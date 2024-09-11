Bun.serve({
    fetch(req) {
        const url = new URL(req.url);
        if (url.pathname === "/") {
            // Serve HTML file
            const htmlContent =  Bun.file("./index.html");
            return new Response(htmlContent, { headers: { 'Content-Type': 'text/html' } });
          }

          if (url.pathname === "/textures/waternormals.jpg") {
            // Serve HTML file
            const jpg =  Bun.file("./waternormals.jpg");
            return new Response(jpg, { headers: { 'Content-Type': 'image/jpeg' } });
          }
      
          if (url.pathname === "/bindle.js") {
            // Serve JS file
            const jsContent =  Bun.file("./bindle.js");
            return new Response(jsContent, { headers: { 'Content-Type': 'application/javascript' } });
          }
        return new Response("404!");
    },
  }); 