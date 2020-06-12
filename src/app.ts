import * as express from 'express';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import {Request, Response, NextFunction} from 'express';
import routes from './routes';
import logRequest from './middlewares/logRequest';
import * as path from 'path';
import * as os from 'os';

// Create Express server.
const app = express();

// Express configuration
app.set('port', process.env.PORT || 5000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(logRequest);
app.use(express.static(path.join(__dirname, '/../../src/assets')));

app.set('views', path.join(__dirname, '../../src/views'));
app.set('view engine', 'ejs');

app.get('/', (_, res) => {
  res.json({
    data: null,
    message: 'Hooray! Welcome to Common Audio Server!',
  });
});

//* Takes Care of All The Routing
app.use('/api', routes);

app.use('/healthz', (_0: Request, res: Response) => {
  res.send('Ok, Healthy!');
});

app.get('/time', (req, res) => {
  return res.status(200).json({
    time: new Date().getTime(),
  });
});

app.get('/client/stream/', (req: Request, res: Response) => {
  const filepath = path.join(__dirname, '/../../src/views/pages/index.ejs');
  console.log(filepath, 'serving');
  const networkInterfaces: any = os.networkInterfaces();
  console.log(networkInterfaces['wlp3s0']);
  const addr: string = networkInterfaces['wlp3s0'][0]['address'];
  console.log(addr);
  res.render('index', {addr: addr});
});

app.use((_req: Request, _res: Response, next: NextFunction): void => {
  const err = new Error('Page Not Found');
  next(err);
});

app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    res.status(500);
    res.json({
      errors: {
        message: err.message,
        error: {},
      },
    });
  }
);
// console.log(__dirname)
export default app;
