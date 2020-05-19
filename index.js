require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const { Client } = require('pg');
const client = new Client();
client.connect();
let pass;
console.log('retreiving pass from db');
client.query('select * from users where id = 1', (err, ans)=>{
  if(ans.rows[0] && ans.rows[0].password){
    pass = ans.rows[0].password;
    console.log('cached pass on server');
  }
})

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', (req, res)=>{
  res.send('yooooooo welcome to my twisted world');
});

app.post('/api/posts', (req, res)=>{
  const post = req.body;
  console.log('receiving post submission', post);
  if(post.pass === pass){
    console.log('authenticated!');
    client.query(
      'insert into posts(author, body) values ($1, $2)', 
      [post.author, post.body], 
      (err, ans)=>{
        if(err){
          console.log('err', err)
          return res.send('error while posting!');
        }
        console.log(ans);
        return res.send('confirmed!')
      })
  }else{
    console.log('nope');
    return res.send('nope');
  }
});

app.get('/api/posts/:id', (req, res)=>{
  if(req.params.id === '0'){
    console.log('getting most recent post');
    client.query('select * from posts order by id desc limit 1',(err, ans)=>{
      res.json(ans.rows);
    })
  }else{
    console.log('getting id', req.params.id);
    client.query('SELECT * FROM posts WHERE ID = $1', [req.params.id], (err, ans) => {
      res.json(ans.rows);
    })
  }
});

app.listen(port, ()=>console.log(`listening on ${port}`));
