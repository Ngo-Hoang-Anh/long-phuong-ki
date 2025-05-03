import { BootServer } from "./bootServer";
import mongoose from "mongoose";
require('dotenv').config('../.env')
mongoose.connect(process.env.DATABASE_URL || "").then(() => {
    console.log("Connect database success.")
    const bootServer = new BootServer();
    bootServer.startSocket();
}).catch((err) => {
    console.log(err)
    console.warn("Connect database failed.")
})