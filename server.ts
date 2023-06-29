/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
import '@angular/localize/init';
import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';
import * as dotEnv from 'dotenv';
import * as morgan from 'morgan';
import RouteManager from 'server/routes/RouteManager';
import { refreshAccess } from 'server/middlewares/refreshToken.middleware';
import * as cors from 'cors';
import { deserializeUser } from 'server/middlewares/deserializeUser.middleware';
import * as http from 'http';
import { Server } from 'socket.io';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import 'localstorage-polyfill';
import * as path from 'path';
import DB from 'server/models/engine/DBStorage';
global['localStorage'] = localStorage;
dotEnv.config();

// The Express app is exported so that it can be used by serverless Functions.
export function App(): http.Server {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server);
  const distFolder = join(process.cwd(), 'dist/evaluation-system-app/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';

  // Synchronize DB
  DB.sync({ alter: false });

  // setup middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));
  app.use(cors({ allowedHeaders: ['x-access', 'x-refresh', 'authorization'] }));
  app.use(refreshAccess);
  app.use(deserializeUser);

  new RouteManager(app);

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  app.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
    })
  );

  app.set('view engine', 'html');
  app.set('views', distFolder);

  // statuc folder
  app.use(express.static(path.join(__dirname, '../../../public/')));

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  app.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );

  // All regular routes use the Universal engine
  app.get('*', (req, res) => {
    res.render(indexHtml, {
      req,
      res,
      providers: [
        { provide: APP_BASE_HREF, useValue: req.baseUrl },
        { provide: REQUEST, useValue: req },
        { provide: RESPONSE, useValue: res },
      ],
    });
  });

  // Socket connection
  io.on('connection', (socket) => {
    console.log('Opened connection');
    socket.on('connected', () => {
      console.log('connected');
    });
    socket.on('disconnect', () => {
      console.log('disconnected');
    });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = App();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
