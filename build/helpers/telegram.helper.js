"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Telegram = void 0;
// * That is because @types/input is 404. 
// TODO: Switch to another library in the future.
// @ts-ignore
const input_1 = __importDefault(require("input"));
const fs_1 = require("fs");
const telegram_1 = require("telegram");
const sessions_1 = require("telegram/sessions");
const Logger_1 = require("telegram/extensions/Logger");
const config_1 = require("../config");
class Telegram {
    constructor(apiId, apiHash) {
        const session = new sessions_1.StringSession(config_1.SESSION);
        this.client = new telegram_1.TelegramClient(session, apiId, apiHash, {
            connectionRetries: 5
        });
        this.client.setLogLevel(Logger_1.LogLevel.ERROR);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.start({
                phoneNumber: () => __awaiter(this, void 0, void 0, function* () { return yield input_1.default.text("Please enter your number: "); }),
                password: () => __awaiter(this, void 0, void 0, function* () { return yield input_1.default.text("Please enter your password: "); }),
                phoneCode: () => __awaiter(this, void 0, void 0, function* () { return yield input_1.default.text("Please enter the code you received: "); }),
                onError: (err) => console.log(err),
            });
            const session = this.client.session.save();
            const env = (0, fs_1.readFileSync)(".env", "utf-8");
            const newEnv = env.replace(/SESSION=.*/g, `SESSION=${session}`);
            (0, fs_1.writeFileSync)(".env", newEnv);
        });
    }
}
exports.Telegram = Telegram;
