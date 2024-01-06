import { loggingMiddleware } from '@monorepo/shared-be';
import Express from 'express';

const app = Express();

app.use(loggingMiddleware(`other-microservice`));

app.get('/', (req, res) => {
  res.json({ status: 'ok', url: req.url });
});

app.get('/proxy', async (req, res, next) => {
  try {
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
