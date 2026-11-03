import fs from 'fs';

const ids = ['1255', '1243', '1269'];
ids.forEach(id => {
  const p = `dist/product/${id}/index.html`;
  if (fs.existsSync(p)) {
    const html = fs.readFileSync(p, 'utf8');
    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
    const descMatch = html.match(/<meta property="og:description" content="([^"]+)"/);
    const imgMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
    const urlMatch = html.match(/<meta property="og:url" content="([^"]+)"/);
    const typeMatch = html.match(/<meta property="og:type" content="([^"]+)"/);
    const twCard = html.match(/<meta name="twitter:card" content="([^"]+)"/);

    console.log(`=== Product ${id} ===`);
    console.log('Title:      ', titleMatch ? titleMatch[1] : 'NOT FOUND');
    console.log('Description:', descMatch ? descMatch[1] : 'NOT FOUND');
    console.log('Image:      ', imgMatch ? imgMatch[1] : 'NOT FOUND');
    console.log('URL:        ', urlMatch ? urlMatch[1] : 'NOT FOUND');
    console.log('Type:       ', typeMatch ? typeMatch[1] : 'NOT FOUND');
    console.log('Twitter Card:', twCard ? twCard[1] : 'NOT FOUND');
  } else {
    console.log(`File not found: ${p}`);
  }
});
