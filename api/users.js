const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { getUser, getUserByUsername, createUser, getAllUsers, deleteUser, updateUser } = require("../db/users");
const { requireAdmin, requireUser, requireUserOrAdmin } = require("./utils");


usersRouter.use((req, res, next)=>{
  console.log("A request is being made to /users");
  next()
});


//tested with incorrect info, and expired token
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

// tested with error and refined password to all 1 if statement
usersRouter.post("/register", async(req, res, next)=>{
  const {username, password, name, state, admin, email, year_born, follower_count, following_count }= req.body;
  try {
    const user =await getUserByUsername(username);


    if (!/(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}/.test(password)) {
      next({
        error:"PasswordRequirementsNotMet",
        message:"Password must contain at least one number, one uppercase letter and be 8 characters long",
        name:"Password Requirements Not Met"
      });
    } else{
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

//tested with error
usersRouter.get("/me", async(req, res, next)=>{
  try {
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

// tested with error
usersRouter.get("/:username", async(req, res, next)=>{
  const username=req.params.username;
  try {
    const user= await getUserByUsername(username);
    if(user){
    res.send(user);}
      else{
        next({
          error:"unknownUser",
          name: "No User by that username",
          message:`no user found bu ma,e of ${username}`,
        });
      }
  } catch (error) {
    next({error, name, message})
  }
});

//tested with errors, fixed requireadmin incase no one is logged in to get the correct error message
usersRouter.get("/", requireAdmin, async (req, res, next)=>{
  try {
    const users= await getAllUsers();
    res.send(users);
  } catch (error) {
    next({message:"error getting users"});
  }
})

//tested with errors
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

//tested with errors, made new middleware for requireuser or admin
usersRouter.patch("/:username", requireUserOrAdmin, async(req, res, next)=>{
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
