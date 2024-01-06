import { loggingMiddleware } from '@monorepo/shared-be';
import { MyThing, myThing } from '@monorepo/shared-types';
import Express from 'express';

const app = Express();

app.use(loggingMiddleware(`my-microservice`));

app.get('/', (req, res) => {
  const thing: MyThing = myThing;
  res.json({ status: 'ok', url: req.url, thing });
});

app.get('/proxy', async (req, res, next) => {
  try {
    if (req.query.error) {
      throw new Error('Error from my-microservice');
    }
    const response = await (await fetch('http://localhost:3001')).json();
    res.json({ status: 'ok', path: req.path, response });
  } catch (error) {
    next(error);
  }
});

app.use(((err, req, res, next) => {
  res.status(500).json({ status: 'error', error: err.message });
}) as Express.ErrorRequestHandler);

app.listen(3000);
