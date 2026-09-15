const https = require('https');

https.get('https://api.codingboss.in /herbal/cart/?user_id=10', {
  headers: { 'ngrok-skip-browser-warning': 'true' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("user_id=10", data);
  });
}).on('error', err => console.log(err));

https.get('https://api.codingboss.in /herbal/cart/?user_id=11', {
  headers: { 'ngrok-skip-browser-warning': 'true' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("user_id=11", data);
  });
}).on('error', err => console.log(err));

https.get('https://api.codingboss.in /herbal/cart/?user_id=1', {
  headers: { 'ngrok-skip-browser-warning': 'true' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("user_id=1", data);
  });
}).on('error', err => console.log(err));
