const LRU = require("./db.cache");
const cache = new LRU(10);

const create = client => (req, res, next) => {
  cache.delete(0);
  const post = req.body;
  console.log("posting", post);
  client.query(
    "insert into posts(author, title, body) values ($1, $2, $3)",
    [post.author, post.title, post.body],
    (err, ans) => {
      if (err) {
        return next("error while posting!");
      }
      console.log(ans);
      return res.status(200).json({ confirmed: true });
    }
  );
};

const read = client => (req, res, next) => {
  console.log("retrieving");
  const cached = cache.get(req.params.id);
  if (cached) {
    console.log("retrieving cached post", req.params.id);
    return res.json(cached);
  }
  if (req.params.id === "0") {
    console.log("getting most recent post");
    client.query("select * from posts order by id desc limit 1", (err, ans) => {
      if (err) {
        res.status(404);
        return next(err);
      }
      cache.set(req.params.id, ans.rows);
      res.json(ans.rows);
    });
  } else {
    console.log("getting id", req.params.id);
    client.query(
      "SELECT * FROM posts WHERE ID = $1",
      [req.params.id],
      (err, ans) => {
        if (err) {
          res.status(404);
          return next(err);
        }
        cache.set(req.params.id, ans.rows);
        res.json(ans.rows);
      }
    );
  }
};

const update = client => (req, res, next) => {
  const { author, title, body } = req.body;
  console.log("updating post with id", req.params.id);
  cache.delete(req.params.id);
  client.query(
    "UPDATE posts set author = $1, title = $2, body = $3 where id = $4 ",
    [author, title, body, req.params.id],
    (err, ans) => {
      if (err) {
        res.status(404);
        return next(err);
      }
      return res.json(ans);
    }
  );
};

module.exports = client => ({
  create: create(client),
  readById: read(client),
  updateById: update(client)
});
