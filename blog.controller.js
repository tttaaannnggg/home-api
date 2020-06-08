
const create = (client)=>(req,res,next)=>{
  const post = req.body;
  console.log('posting', post);
  client.query(
    'insert into posts(author, title, body) values ($1, $2, $3)', 
    [post.author, post.title, post.body], 
    (err, ans)=>{
      if(err){
        return next('error while posting!');
      }
      console.log(ans);
      return res.status(200).json({confirmed: true})
    })
}

const read = (client)=>(req,res,next)=>{
  console.log('retrieving');
  if(req.params.id === '0'){
    console.log('getting most recent post');
    client.query('select * from posts order by id desc limit 1',(err, ans)=>{
      if(err){
        req.status(404)
        return next(err);
      }
      res.json(ans.rows);
    })
  }else{
    console.log('getting id', req.params.id);
    client.query('SELECT * FROM posts WHERE ID = $1', [req.params.id], (err, ans) => {
      if(err){
        req.status(404)
        return next(err);
      }
      res.json(ans.rows);
    })
  }
}

module.exports = client => ({
  create: create(client),
  readById: read(client)
})
