"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const serverless = require("serverless-http");
var serverless_http_1 = __importDefault(require("serverless-http"));
// const express = require("express");
var express_1 = __importDefault(require("express"));
var app = (0, express_1.default)();
app.get("/", function (req, res, next) {
    return res.status(200).json({
        message: "Hello from root!",
    });
});
app.get("/hello", function (req, res, next) {
    return res.status(200).json({
        message: "Hello from path!",
    });
});
app.use(function (req, res, next) {
    return res.status(404).json({
        error: "Not Found",
    });
});
module.exports.handler = (0, serverless_http_1.default)(app);
//# sourceMappingURL=handler.js.map