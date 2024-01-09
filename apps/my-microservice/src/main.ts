import { loggingMiddleware } from '@monorepo/shared-be';
import { MyThing, myThing } from '@monorepo/shared-types';
import Express from 'express';

const config = {
  port: process.env.PORT || 3000,
  other: {
    host: process.env.OTHER_HOST || 'http://localhost:4000',
  },
};

const app = Express();

app.use(loggingMiddleware(`my-microservice`));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
})

app.get('/', (req, res) => {
  const thing: MyThing = myThing;
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}}`;
  res.json({ status: 'ok', timestamp: new Date().toISOString(), url, thing });
});

app.get('/proxy', async (req, res, next) => {
  try {
    if (req.query.error) {
      throw new Error('Error from my-microservice');
    }
    const response = await (await fetch(config.other.host)).json();
    res.json({ status: 'ok', timestamp: new Date().toISOString(), path: req.path, response });
  } catch (error) {
    next(error);
  }
});

app.use(((err, req, res, next) => {
  if (!err) {
    res.status(404).json({ status: 'error', error: 'Not found' });
  } else {
    res.status(500).json({ status: 'error', error: err.message });
  }
}) as Express.ErrorRequestHandler);

app.listen(config.port);
console.log(`my-microservice listening on port ${config.port}`);
