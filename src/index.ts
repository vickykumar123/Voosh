import "dotenv/config";
import express from "express";
import {Server} from "./classes/server";

const app = express();

// Abstracted
const server = new Server(app);
server.config();
server.connect();
server.router();
server.globalError();
