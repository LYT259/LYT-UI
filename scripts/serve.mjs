import http from 'node:http';
import { readFile, stat, realpath } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = await realpath(resolve(process.argv[2] || 'dist'));
const port = Number(process.env.PORT || 4173);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.mjs':'text/javascript', '.json':'application/json', '.svg':'image/svg+xml', '.md':'text/plain; charset=utf-8' };
http.createServer(async (req,res) => {
 try {
  let path = resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (path !== root && !path.startsWith(root+sep)) throw new Error('outside root');
  if ((await stat(path)).isDirectory()) path = resolve(path,'index.html');
  path = await realpath(path);
  if (!path.startsWith(root+sep)) throw new Error('outside root');
  res.writeHead(200, {'Content-Type':types[extname(path)] || 'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  res.end(await readFile(path));
 } catch {res.writeHead(404);res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`Serving at http://127.0.0.1:${port}`));
