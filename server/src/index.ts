import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Backend server is running!');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
