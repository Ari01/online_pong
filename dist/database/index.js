"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Secret = exports.Conversation = exports.DirectMessage = exports.Restriction = exports.Game = exports.ChanMessage = exports.Channel = exports.Notif = exports.TypeORMSession = exports.User = exports.entities = void 0;
const User_1 = require("./entities/User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
const Session_1 = require("./entities/Session");
Object.defineProperty(exports, "TypeORMSession", { enumerable: true, get: function () { return Session_1.TypeORMSession; } });
const Notif_1 = require("./entities/Notif");
Object.defineProperty(exports, "Notif", { enumerable: true, get: function () { return Notif_1.Notif; } });
const Channel_1 = require("./entities/Channel");
Object.defineProperty(exports, "Channel", { enumerable: true, get: function () { return Channel_1.Channel; } });
const ChanMessage_1 = require("./entities/ChanMessage");
Object.defineProperty(exports, "ChanMessage", { enumerable: true, get: function () { return ChanMessage_1.ChanMessage; } });
const Game_1 = require("./entities/Game");
Object.defineProperty(exports, "Game", { enumerable: true, get: function () { return Game_1.Game; } });
const Restriction_1 = require("./entities/Restriction");
Object.defineProperty(exports, "Restriction", { enumerable: true, get: function () { return Restriction_1.Restriction; } });
const DirectMessages_1 = require("./entities/DirectMessages");
Object.defineProperty(exports, "DirectMessage", { enumerable: true, get: function () { return DirectMessages_1.DirectMessage; } });
const Conversation_1 = require("./entities/Conversation");
Object.defineProperty(exports, "Conversation", { enumerable: true, get: function () { return Conversation_1.Conversation; } });
const Secret_1 = require("./entities/Secret");
Object.defineProperty(exports, "Secret", { enumerable: true, get: function () { return Secret_1.Secret; } });
exports.entities = [
    User_1.User,
    Session_1.TypeORMSession,
    Notif_1.Notif,
    Channel_1.Channel,
    ChanMessage_1.ChanMessage,
    Game_1.Game,
    Restriction_1.Restriction,
    DirectMessages_1.DirectMessage,
    Conversation_1.Conversation,
    Secret_1.Secret,
];
//# sourceMappingURL=index.js.map