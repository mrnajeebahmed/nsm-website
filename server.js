// Startup file for cPanel "Setup Node.js App" (Phusion Passenger) and other
// hosts that run `node server.js`. Serves the prebuilt Next.js app in .next/.
const { createServer } = require('http');
const next = require('next');

const port = Number(process.env.PORT) || 3000;
const app = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => handle(req, res)).listen(port, () => {
      console.log(`NSM website listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start NSM website', err);
    process.exit(1);
  });
