require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const { Client } = require('pg');
const client = new Client();
client.connect();
let pass;
console.log('retreiving pass from db');
client.query('select * from users where id = 1', (err, ans)=>{
  if(ans && ans.rows[0] && ans.rows[0].password){
    pass = ans.rows[0].password;
    console.log('cached pass on server');
  }
})

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static('../home/build'));
//app.get('/', express.static('../home/build'));

app.use((err, req, res, next)=>{
  console.error(err.stack);
  res.status(500).send(err);
});

const authController = (req, res, next)=>{
  console.log('receiving password', req.body.pass);
  if(req.body.pass !== pass){
    return next("auth error!");
  }else{
    console.log('auth success');
    return next();
  }
}

app.post('/api/posts', authController, (req, res)=>{
  const post = req.body;
  client.query(
    'insert into posts(author, title, body) values ($1, $2, $3)', 
    [post.author, post.title, post.body], 
    (err, ans)=>{
      if(err){
        return next('error while posting!');
      }
      console.log(ans);
      return res.send('confirmed!')
    })
});

app.get('/api/posts/:id', (req, res)=>{
  console.log('retrieving');
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
