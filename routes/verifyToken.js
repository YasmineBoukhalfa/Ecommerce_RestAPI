const jwt = require ("jsonwebtoken");

const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.token
    if(authHeader){
        const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err,user)=>{
    if(err) res.status(403).json("TOKEN NON VALIDE");
    req.user =user;
    next();
})
    } else {
        return res.status(401).json("tu n'es pas authentifié");
    }
}

const verifyTokenAuthorization = (req,res,next)=>{
  verifyToken(req,res,()=>{
    if(req.user.id === req.params.id|| req.user.isAdmin){
    next();
    }else{
        res.status(403).json("tu n'es pas authorisé pour faire ça")
    }
  })  
}


const verifyTokenAndAdmin = (req,res,next)=>{
    verifyToken(req,res,()=>{
      if( req.user.isAdmin){
      next()
      }else{
          res.status(403).json("tu n'es pas authorisé pour faire çaaa")
      }
    })  ;
  };

//exporter les fonctions 
module.exports = {verifyToken,
     verifyTokenAuthorization,
    verifyTokenAndAdmin}