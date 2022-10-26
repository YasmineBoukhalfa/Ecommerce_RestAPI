const router = require("express").Router();

const User = require("../models/User");
const cryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

//register

router.post("/register", async (req, res) => {
   //new User = new model 
   const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: cryptoJs.AES.encrypt(req.body.password, process.env.PASSWORD_SEC).toString(),

   });

   try {
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
   } catch (error) {
      res.status(500).json(error);
   }

})

//login

router.post("/login", async(req, res) => {
   try {
      //User model
      const user = await User.findOne(
         {
            username: req.body.username
         }
         );
      
      //if no user then err code
      if (!user) { return res.status(401).json(" nom d'utilisateur incorrect");}

      //decrypter mon mot de passe 
      const hashedpassword = cryptoJs.AES.decrypt(
         user.password, 
         process.env.PASSWORD_SEC
         );

      const Originalpassword = hashedpassword.toString(cryptoJs.enc.Utf8);

      //if password =! our request then it a wrong password

      if((Originalpassword)!== (req.body.password)) {
         res.status(401).json("mot de passe incorrect!!!");}

//jwt

const accesToken = jwt.sign({
   id:user._id,
   isAdmin: user.isAdmin
}, process.env.JWT_SEC, {expiresIn:"3d"});

         const {password, ...others} = user._doc;


      //if everything is OK then return user
      return res.status(200).json({...others, accesToken});


   } catch (error) {
      return res.status(500).json(error);

   } 
})







module.exports = router;