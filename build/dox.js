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
exports.START = exports.handle_update = exports.check_block = void 0;
const telegram_1 = require("telegram");
const shared_1 = require("./shared");
const keywords = __importStar(require("./keywords"));
function check_block(telegram, config) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield telegram.client.sendMessage(config.target, { message: "ENTER" });
        }
        catch (e) {
            if (e.errorMessage === "YOU_BLOCKED_USER") {
                yield telegram.client.invoke(new telegram_1.Api.contacts.Unblock({ id: config.target }));
                yield telegram.client.sendMessage(config.target, { message: "UNBLOCKED ENTER" });
            }
            else {
                console.error(e);
            }
        }
    });
}
exports.check_block = check_block;
function handle_update(event) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!event.isPrivate)
            return;
        if (shared_1.shared.waiting_message) {
            if (shared_1.shared.waiting_message.target.includes("@")) {
                switch (shared_1.shared.waiting_message.target) {
                    case "@str":
                        if (!keywords.KEYWORDS["@str"].test(event.message.text))
                            return;
                        break;
                    case "@num":
                        if (!keywords.KEYWORDS["@num"].test(event.message.text))
                            return;
                        break;
                    case "@yes":
                        if (!keywords.KEYWORDS["@yes"].test(event.message.text))
                            return;
                        break;
                    case "@no":
                        if (!keywords.KEYWORDS["@no"].test(event.message.text))
                            return;
                        break;
                    default:
                        return;
                }
                yield event.message.reply({ message: shared_1.shared.waiting_message.reply });
                if (shared_1.shared.waiting_message.wait_message) {
                    shared_1.shared.waiting_message = shared_1.shared.waiting_message.wait_message;
                    shared_1.shared.time_since_last_message = 0;
                }
                else {
                    shared_1.shared.waiting_message = undefined;
                }
            }
            else {
                if (event.message.text === shared_1.shared.waiting_message.target) {
                    yield event.message.reply({ message: shared_1.shared.waiting_message.reply });
                    if (shared_1.shared.waiting_message.wait_message) {
                        shared_1.shared.waiting_message = shared_1.shared.waiting_message.wait_message;
                        shared_1.shared.time_since_last_message = 0;
                    }
                    else {
                        shared_1.shared.waiting_message = undefined;
                    }
                }
            }
        }
    });
}
exports.handle_update = handle_update;
function START(telegram, config) {
    return __awaiter(this, void 0, void 0, function* () {
        while (true) {
            try {
                if (shared_1.shared.waiting_message) {
                    if (shared_1.shared.waiting_message.timeout
                        && shared_1.shared.time_since_last_message
                        && (shared_1.shared.time_since_last_message >= shared_1.shared.waiting_message.timeout)) {
                        shared_1.shared.waiting_message = undefined;
                        shared_1.shared.time_since_last_message = 0;
                    }
                    shared_1.shared.time_since_last_message = shared_1.shared.time_since_last_message + 1;
                    yield new Promise((resolve) => setTimeout(resolve, 1 * 1000));
                    continue;
                }
                const message = config.messages.find((message) => message.id === shared_1.shared.last_message + 1);
                if (!message) {
                    shared_1.shared.last_message = 0;
                    continue;
                }
                yield telegram.client.sendMessage(config.target, { message: message.text });
                if (message.wait_message) {
                    shared_1.shared.waiting_message = message.wait_message;
                    shared_1.shared.time_since_last_message = 0;
                }
                shared_1.shared.last_message = message.id;
                yield new Promise((resolve) => setTimeout(resolve, message.delay * 1000));
            }
            catch (e) {
                console.error(e);
            }
        }
    });
}
exports.START = START;
