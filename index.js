if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}
const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const { Client } = require('pg');
const client = new Client();
client.connect();

app.use(bodyParser.json())
app.use(cors());

app.get('/', (req, res)=>{
  res.send(process.env);
});

app.post('/api/posts', (req, res)=>{
  console.log(req.body);
  res.send(req.body);
});

app.get('/api/posts/:id', (req, res)=>{
  console.log('getting id', req.params.id);
  client.query('SELECT * FROM posts WHERE ID = $1', [req.params.id], (err, ans) => {
    res.json(ans.rows);
  })
});

app.listen(port, ()=>console.log(`listening on ${port}`));
