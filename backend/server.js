import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json()); // read JSON from POST requests

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
