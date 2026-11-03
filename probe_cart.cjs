const https = require('https');

https.get('https://affecting-tingling-duke.ngrok-free.dev/herbal/cart/?user_id=10', {
  headers: { 'ngrok-skip-browser-warning': 'true' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("user_id=10", data);
  });
}).on('error', err => console.log(err));

https.get('https://affecting-tingling-duke.ngrok-free.dev/herbal/cart/?user_id=11', {
  headers: { 'ngrok-skip-browser-warning': 'true' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("user_id=11", data);
  });
}).on('error', err => console.log(err));

https.get('https://affecting-tingling-duke.ngrok-free.dev/herbal/cart/?user_id=1', {
  headers: { 'ngrok-skip-browser-warning': 'true' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("user_id=1", data);
  });
}).on('error', err => console.log(err));
