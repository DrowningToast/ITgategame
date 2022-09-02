"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var validateRole_1 = __importDefault(require("../helper/validateRole"));
var Transaction_1 = __importDefault(require("../models/Transaction"));
var User_1 = __importDefault(require("../models/User"));
var userRouter = express_1.default.Router();
/**
 * @path /user/:uid
 * @param Agency
 * @description Get user of specific uid
 * @param
 */
userRouter.get("/:uid", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, validateRole_1.default)(req === null || req === void 0 ? void 0 : req.currentUser, ["Agency"])];
            case 1:
                _a.sent();
                return [4 /*yield*/, User_1.default.find({
                        uid: req.params.uid,
                    })];
            case 2:
                user = _a.sent();
                return [2 /*return*/, res.status(200).send(user)];
            case 3:
                e_1 = _a.sent();
                return [2 /*return*/, res.status(e_1 === null || e_1 === void 0 ? void 0 : e_1.code).send(e_1.message)];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @path /user/all
 * @perm Agency
 * @description Get all users information
 */
userRouter.get("/all", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, validateRole_1.default)(req.currentUser, ["Agency"])];
            case 1:
                _a.sent();
                return [4 /*yield*/, User_1.default.find({})];
            case 2:
                users = _a.sent();
                return [2 /*return*/, res.status(200).send(users)];
            case 3:
                e_2 = _a.sent();
                res.status(401).send(e_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @description Get information about self account
 * @path /user/
 */
userRouter.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _, e_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, validateRole_1.default)(req.currentUser)];
            case 1:
                user = _b.sent();
                return [4 /*yield*/, User_1.default.findOne({
                        uid: user.uid,
                    })];
            case 2:
                _ = _b.sent();
                return [2 /*return*/, res.status(200).send(_)];
            case 3:
                e_3 = _b.sent();
                res.status((_a = e_3.code) !== null && _a !== void 0 ? _a : 500).send(e_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @description Create a user that never exists before
 * @path /user/
 */
userRouter.post("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _, response, e_4;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, validateRole_1.default)(req.currentUser)];
            case 1:
                user = (_d.sent());
                if (user === null || user === void 0 ? void 0 : user._id)
                    return [2 /*return*/, res.status(401).send("The user already exists in the database")];
                _ = new User_1.default({
                    uid: user.uid,
                    email: user.email,
                    id: (_a = user.email) === null || _a === void 0 ? void 0 : _a.split("@")[0],
                    year: parseInt("".concat((_b = user.email) === null || _b === void 0 ? void 0 : _b.split("@")[0][0]).concat((_c = user.email) === null || _c === void 0 ? void 0 : _c.split("@")[0][1])) - 45,
                });
                return [4 /*yield*/, _.save()];
            case 2:
                response = _d.sent();
                res.send(response);
                return [3 /*break*/, 4];
            case 3:
                e_4 = _d.sent();
                res.status(500).send(e_4);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @description Verify the user gate
 */
userRouter.post("/verify", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, response, transaction, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, (0, validateRole_1.default)(req.currentUser)];
            case 1:
                user = _a.sent();
                if (!user.activated)
                    return [2 /*return*/, res.status(400).send("The user has already verify")];
                return [4 /*yield*/, User_1.default.findOneAndUpdate({ uid: user.uid }, {
                        // First starting income
                        balance: 50,
                        activated: true,
                        gate: req.body.gate,
                        username: req.body.userName,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                    })];
            case 2:
                response = _a.sent();
                transaction = new Transaction_1.default({
                    target: response === null || response === void 0 ? void 0 : response._id,
                    value: 50,
                    type: "New",
                });
                return [4 /*yield*/, transaction.save()];
            case 3:
                _a.sent();
                res.send(response);
                return [3 /*break*/, 5];
            case 4:
                e_5 = _a.sent();
                res.status(500).send("Something went wrong");
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
/**
 * @description Edit user data
 */
userRouter.patch("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var requester, response, e_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, validateRole_1.default)(req.currentUser)];
            case 1:
                requester = _a.sent();
                return [4 /*yield*/, User_1.default.findOneAndUpdate({
                        uid: requester.uid,
                        activated: true,
                    })];
            case 2:
                response = _a.sent();
                return [2 /*return*/, res.status(200).send(__assign({}, response))];
            case 3:
                e_6 = _a.sent();
                res.status(500).send("Something went wrong");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = userRouter;
//# sourceMappingURL=User.js.map