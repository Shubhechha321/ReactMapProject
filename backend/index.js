const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const server = http.createServer(app);
const pinRoute = require("./routes/pins");
const userRoute = require("./routes/users");

dotenv.config();

app.use(express.json());

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("MongoDB connected!");
}).catch(err=>console.log(err));

const PORT = 8800;

app.use("/api/pins", pinRoute);
app.use("/api/users", userRoute);

server.listen(PORT, ()=>console.log(`Server running on port ${PORT}`)); 
