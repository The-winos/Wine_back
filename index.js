require('dotenv').config();
const{PORT=8080}=process.env
const express =require('express');
const server = express();
const apiRouter = require('./api');
const {client}= require('./db/client');
client.connect();

// const morgan= require('morgan');
// server.use(morgan('dev'));
// const cors =require('cors');
// server.use(cors());
// server.use(express.json());

// server.use((req,res, next)=>{
//   console.log("<___Body Logger START____>");
//   console.log(req.method);
//   console.log("____Body Logger END____>");
//   next();
// })

// server.use('/api', apiRouter);

server.listen(PORT,()=>{
  console.log('The server is up on port', PORT)
});
