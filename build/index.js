"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("telegram/events");
const dox = __importStar(require("./dox"));
const telegram_helper_1 = require("./helpers/telegram.helper");
const cfg = __importStar(require("./config"));
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const telegram = new telegram_helper_1.Telegram(cfg.API_ID, cfg.API_HASH);
        const config = cfg.CONFIG;
        let id = 0;
        config.messages = config.messages.map((message) => {
            id += 1;
            message.id = id;
            return message;
        });
        return { telegram, config };
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const { telegram, config } = yield init();
        telegram.client.addEventHandler(dox.handle_update, new events_1.NewMessage({}));
        yield telegram.start();
        yield dox.check_block(telegram, config);
        yield dox.START(telegram, config);
    });
}
main();
