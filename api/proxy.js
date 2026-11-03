export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, ngrok-skip-browser-warning');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const rawPath = req.query.path || '';
    const pathStr = Array.isArray(rawPath) ? rawPath.join('/') : String(rawPath);

    // Extract query params, excluding 'path'
    const queryParams = new URLSearchParams();
    for (const [key, val] of Object.entries(req.query)) {
      if (key !== 'path') {
        if (Array.isArray(val)) {
          val.forEach(v => queryParams.append(key, v));
        } else if (val !== undefined && val !== null) {
          queryParams.append(key, val);
        }
      }
    }

    let pathOnly = pathStr;
    if (pathStr.includes('?')) {
      const parts = pathStr.split('?');
      pathOnly = parts[0];
      const inlineQuery = new URLSearchParams(parts[1]);
      for (const [k, v] of inlineQuery.entries()) {
        queryParams.append(k, v);
      }
    }

    let cleanPath = pathOnly.replace(/^\/+/, '');
    if (cleanPath.startsWith('herbal/')) {
      cleanPath = cleanPath.slice(7);
    }

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    let targetUrl;
    if (cleanPath.startsWith('media/')) {
      targetUrl = `http://179.197.251.47:30080/${cleanPath}${queryString}`;
    } else {
      targetUrl = `http://179.197.251.47:30080/herbal/${cleanPath}${queryString}`;
    }

    // Critical: Override Host and X-Forwarded-Host to pass Django ALLOWED_HOSTS check
    const headers = {
      'host': '179.197.251.47:30080',
      'x-forwarded-host': '179.197.251.47:30080',
      'ngrok-skip-browser-warning': 'true'
    };

    if (req.headers['content-type']) {
      headers['content-type'] = req.headers['content-type'];
    }
    if (req.headers['authorization']) {
      headers['authorization'] = req.headers['authorization'];
    }
    if (req.headers['accept']) {
      headers['accept'] = req.headers['accept'];
    }

    const options = {
      method: req.method,
      headers
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (req.body !== undefined && req.body !== null) {
        if (typeof req.body === 'object') {
          options.body = JSON.stringify(req.body);
        } else {
          options.body = String(req.body);
        }
      } else {
        // Fallback to reading raw stream if body was not pre-parsed
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        if (chunks.length > 0) {
          options.body = Buffer.concat(chunks);
        }
      }
    }

    const response = await fetch(targetUrl, options);
    const contentType = response.headers.get('content-type') || 'application/json';

    res.status(response.status);
    res.setHeader('Content-Type', contentType);

    const buffer = Buffer.from(await response.arrayBuffer());
    return res.send(buffer);
  } catch (error) {
    console.error('Vercel proxy error:', error);
    return res.status(502).json({
      success: false,
      message: 'Proxy error connecting to backend service',
      error: error.message
    });
  }
}
