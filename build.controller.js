const { exec } = require("child_process");
const buildController = {
  rebuildFrontend: (req, res, next)=>{
    console.log('rebuilding frontend!')
    exec("cd ../home && ./update.sh", (error, stdout, stderr) =>{
      if(error || stderr){
        return next({err, stderr})
      }
      res.locals.message = stdout;
      next();
    })
  }
}

module.exports = {buildController}
