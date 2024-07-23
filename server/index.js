const express = require('express');
const cors = require('cors');
const app = express();
const { scanDirectory } = require('./file-scan.js');
const path = require('path');

const clientBuildPath = path.join(__dirname, '../client/build');
console.log('Client build path:-', clientBuildPath);
app.use(express.static(clientBuildPath));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
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

app.get('*', (req, res) => { 
  res.sendFile(path.join(clientBuildPath, 'index.html'));
})
const PORT = 9090;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
