import express, { response } from "express";
import jsonwebtoken from "jsonwebtoken";
import ValidateJWT from "../helper/validateJWT";
import validateRole from "../helper/validateRole";
import DiscordUser from "../models/DiscordUser";
import User from "../models/User";

const lotteryRouter = express.Router();
