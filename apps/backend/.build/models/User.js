"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var UserSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    uid: {
        type: String,
        required: true,
    },
    gate: {
        type: String,
        enum: ["AND", "OR", "NOR", "NOT"],
        default: null,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    userName: {
        type: String,
    },
    year: {
        type: Number,
        required: true,
    },
    role: {
        type: String,
        enum: ["Player", "Admin", "Agency"],
    },
    activated: {
        type: Boolean,
        default: false,
    },
    id: {
        type: String,
        required: true,
    },
    discordId: {
        type: String,
    },
    discordToken: {
        type: String,
    },
});
var User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
//# sourceMappingURL=User.js.map