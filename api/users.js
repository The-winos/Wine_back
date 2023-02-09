const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { getUser, getUserByUsername, createUser, getAllUsers, deleteUser, updateUser } = require("../db/users");
const { requireAdmin, requireUser } = require("./utils");


usersRouter.use((req, res, next)=>{
  console.log("A request is being made to /users");
  next()
});

usersRouter.post("/login", async(req, res, next)=>{
  const {username, password}= req.body;
  try {
    const user=await getUser({username, password});
    if (user){
      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn:"1w",
      });
      res.send({
        token,
        user,
        message: "You're logged in!",
      });
    }else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or Password is Incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);

  }
});

usersRouter.post("/register", async(req, res, next)=>{
  const {username, password, name, state, admin, email, year_born, follower_count, following_count }= req.body;
  try {
    const user =await getUserByUsername(username);

    if (password.length<8){
      next({
        error:"PasswordTooShort",
        message:"Password must be 8 characters long",
        name:"Password too Short"
      })
    }
    else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      next({
        error:"PasswordRequirementsNotMet",
        message:"Password must contain at least one number and one uppercase letter",
        name:"Password Requirements Not Met"
      });


  }  else{
        const newUser= await createUser({
          username, password, name, state, admin, email, year_born, follower_count, following_count
        });
        const token =jwt.sign(newUser, process.env.JWT_SECRET, {expiresIn:"1w",});
        res.send({
          message: "Thank you for registering!",
          token,
          user:newUser,
        })
      }
    }catch ({name, message}) {
        next({name, message});

  }
});

usersRouter.get("/me", async(req, res, next)=>{
  try {
console.log(req.user, "heree")
    if(req.user){

      res.send(req.user);
    }else{
      next({
        error:"unauthorized",
        name: "Invalid credentials",
        message:"You must be logged in",
      });
    }

  } catch (error) {
    console.error(error);
    next();
  }
});

usersRouter.get("/:username", async(req, res, next)=>{
  const username=req.params.username;
  console.log(username, "anything?")
  try {
    const user= await getUserByUsername(username);
    res.send(user);

  } catch (error) {
    next({message:"No user by this username."})
  }
});

usersRouter.get("/", requireAdmin, async (req, res, next)=>{
  try {
    const users= await getAllUsers();
    res.send(users);
  } catch (error) {
    next({message:"error getting users"});
  }
})

usersRouter.delete("/:username", requireAdmin, async (req, res, next)=>{
  try {
    const {username}= req.params;
    const user =await getUserByUsername(username);
    const deletedUser = deleteUser(user.id);
    res.send(deletedUser);
  } catch ({name, message, error}) {
    next({
      name: "UnfoundUser",
      message:"Couldn't find that username",
      error:"errorDeletingUser"
    });

  }
});

usersRouter.patch("/:username", requireUser || requireAdmin, async(req, res, next)=>{
  const {username}=req.params;
  const updateFields= req.body;
  try {
    const originalUser= await getUserByUsername(username);
    if(originalUser){
      const updatedUser= await updateUser(originalUser.id, updateFields);
      res.send(updatedUser);
    }else{
      next({
        name: "UserDoesNotExist",
        message: `User ${username} not found`,
        Error: "User does not exist",
      })
    }
  } catch ({name, message, error}) {
    next({name, message, error});

  }
});

module.exports=usersRouter;
