"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var serverless_http_1 = __importDefault(require("serverless-http"));
var express_1 = __importDefault(require("express"));
var validateAuth_1 = __importDefault(require("./middlewares/validateAuth"));
var cors_1 = __importDefault(require("cors"));
var connectMongoose_1 = __importDefault(require("./middlewares/connectMongoose"));
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(validateAuth_1.default);
app.use((0, cors_1.default)({
    methods: ["*"],
    origin: ["*"],
    optionsSuccessStatus: 200,
}));
app.use(connectMongoose_1.default);
app.get("/", function (req, res, next) {
    return res.status(200).json({
        message: "Hello world from root!!!!!!",
    });
});
app.get("/hello", function (req, res, next) {
    console.log("hello world");
    return res.status(200).json({
        message: "Hello from path! bruh ".concat(req.currentUser.email),
    });
});
module.exports.handler = (0, serverless_http_1.default)(app);
//# sourceMappingURL=handler.js.map