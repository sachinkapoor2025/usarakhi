const { createServer, proxy } = require('aws-serverless-express');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, conf: { distDir: '.next' } });
const handle = app.getRequestHandler();

let server;

async function getServer() {
  if (!server) {
    await app.prepare();
    server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });
  }
  return server;
}

module.exports.handler = async (event, context) => {
  const server = await getServer();
  return proxy(server, event, context);
};