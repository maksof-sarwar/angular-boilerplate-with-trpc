import compression from 'compression';
import cookie from 'cookie-parser';
import cors from 'cors';
import express, { Express, Router } from 'express';
import { existsSync } from 'fs';
import { createServer } from 'http';
import { join } from 'path';
import { renderTrpcPanel } from 'trpc-panel';
import { appRouter } from './api/router';
import { createContext } from './api/context';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
const PORT = process.env.PORT || 9001;

class Server {
  static instance: Server;
  app: Express | undefined = undefined;
  constructor() {
    try {
      Server.instance = this;
      this.app = express();
      this.init(this.app);
    } catch (err: any) {
      console.error(err?.message);
      process.exit(1);
    }
  }

  private async init(app: Express) {
    const server = createServer(app);
    const router = Router();
    app.use(compression());
    app.use(cookie());
    app.use(
      cors({
        origin: '*',
        credentials: true,
      })
    );
    app.use('/api', router);
    app.use('*', (req, res) => res.sendStatus(404));
    this.setupRouter(router);
    server.listen(PORT, () => {
      console.log(`🚀 [server] is running on port : ${PORT}`);
    });
  }

  private setupRouter(router: Router) {
    router.get('/logs', (_, res) => {
      const file = join(__dirname, '..', 'logs.txt');
      return existsSync(file) ? res.sendFile(file) : res.sendStatus(404);
    });
    router.get('/health', async (_, res) => {
      return res.status(200).send({ status: 'OK' });
    });
    router.get('/docs', (req, res) => {
      const domain = `${req.protocol}://${req.get('host')}`;
      return res.status(200).send(
        renderTrpcPanel(appRouter, {
          url: `${domain}/api/trpc`,
        })
      );
    });
    router.use(
      '/trpc',
      createExpressMiddleware({
        router: appRouter,
        createContext,
        onError:
          process.env.NODE_ENV === 'development'
            ? ({ error, req }) => {
                console.error(
                  `❌ tRPC failed on url => ${req.url} message => ${error.message}`
                );
              }
            : undefined,
      })
    );
  }
}

export default Server;
