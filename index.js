require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const { Client } = require('pg');
const client = new Client();
const blogController = require('./blog.controller')(client);
const authControllerB = require('./auth.controller');
/*
client.connect();
let pass;
console.log('retreiving pass from db');
client.query('select * from users where id = 1', (err, ans)=>{
  if(ans && ans.rows[0] && ans.rows[0].password){
    pass = ans.rows[0].password;
    console.log('cached pass on server');
  }
})
*/

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static('../home/build'));

app.use((err, req, res, next)=>{
  console.error(err.stack);
  res.send(err);
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

app.get('/aaa', authControllerB.validateAuth);
app.post('/api/posts', authController, blogController.create);

app.get('/api/posts/:id', blogController.readById);
app.post('/api/posts/:id', authController, blogController.updateById);

app.listen(port, ()=>console.log(`listening on ${port}`));
