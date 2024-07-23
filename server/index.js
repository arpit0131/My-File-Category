const express = require('express');
const cors = require('cors');
const app = express();
const { scanDirectory } = require('./file-scan.js');

app.use(cors());
app.use(express.json());

app.post('/scan', async (req, res) => {
  const { dirPath } = req.body;
  if (!dirPath) {
    res
      .status(400)
      .send({ success: false, message: 'Directory path is required' });
    return;
  }

  await scanDirectory(dirPath, res);
});
app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = 9090;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
