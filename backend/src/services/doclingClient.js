const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');

async function parseWithDocling(filePath) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  const res = await fetch('http://127.0.0.1:5005/parse', {
    method: 'POST',
    body: form,
    headers: form.getHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

module.exports = { parseWithDocling }; 