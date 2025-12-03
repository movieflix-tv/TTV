const express = require('express');


app.post('/api/config', ensureAuth, (req, res) => {
// body: { logoUrl, siteName }
const cfg = readConfig();
cfg.logoUrl = req.body.logoUrl || cfg.logoUrl;
cfg.siteName = req.body.siteName || cfg.siteName;
writeConfig(cfg);
res.json({ ok: true });
});


// Stream endpoint (proxy) - similar a lo anterior
function parseMegaLink(link) {
try {
const url = new URL(link);
const parts = url.pathname.split('/');
const type = parts[1];
const id = parts[2];
const key = url.hash ? url.hash.slice(1) : '';
return { type, id, key };
} catch (e) {
return null;
}
}


app.get('/stream', async (req, res) => {
const { url } = req.query;
if (!url) return res.status(400).send('Falta parámetro url');
const parsed = parseMegaLink(url);
if (!parsed || parsed.type !== 'file') return res.status(400).send('Enlace MEGA inválido');


const { id, key } = parsed;
const file = new File({ key, id, name: id });


try {
await new Promise((resolve, reject) => file.loadAttributes(err => err ? reject(err) : resolve()));
const totalSize = file.size;
const rangeHeader = req.headers.range;
res.setHeader('Accept-Ranges', 'bytes');


if (!rangeHeader) {
res.writeHead(200, { 'Content-Length': totalSize, 'Content-Type': 'video/mp4' });
const stream = file.createReadStream();
stream.on('error', e => { console.error('Stream err', e); try{res.end()}catch(e){} });
stream.pipe(res);
return;
}


const ranges = rangeParser(totalSize, rangeHeader)[0];
if (!ranges) return res.status(416).send('Range Not Satisfiable');
const start = ranges.start, end = ranges.end;
const chunkSize = (end - start) + 1;
res.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${totalSize}`, 'Content-Length': chunkSize, 'Content-Type': 'video/mp4' });
const stream = file.createReadStream({ start, end });
stream.on('error', e => { console.error('Stream err', e); try{res.end()}catch(e){} });
stream.pipe(res);
} catch (err) {
console.error('Error MEGA', err);
res.status(500).send('Error al acceder a MEGA');
}
});


// Serve static
app.use(express.static('public'));


app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT} (o en la URL de Render)`));