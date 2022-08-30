"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const serverless = require("serverless-http");
var serverless_http_1 = __importDefault(require("serverless-http"));
// const express = require("express");
var express_1 = __importDefault(require("express"));
var validateAuth_1 = __importDefault(require("./middlewares/validateAuth"));
var app = (0, express_1.default)();
app.use(validateAuth_1.default);
app.get("/", function (req, res, next) {
    return res.status(200).json({
        message: "Hello world from root!",
    });
});
app.get("/hello", function (req, res, next) {
    console.log("hello world");
    return res.status(200).json({
        message: "Hello from path! bruh",
    });
});
module.exports.handler = (0, serverless_http_1.default)(app);
//# sourceMappingURL=handler.js.map