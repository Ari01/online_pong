"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChanMessage = void 0;
const typeorm_1 = require("typeorm");
const Channel_1 = require("./Channel");
const User_1 = require("./User");
let ChanMessage = class ChanMessage {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ChanMessage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ChanMessage.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Channel_1.Channel),
    __metadata("design:type", Channel_1.Channel)
], ChanMessage.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    __metadata("design:type", User_1.User)
], ChanMessage.prototype, "from", void 0);
ChanMessage = __decorate([
    (0, typeorm_1.Entity)({ name: "chanMessages" })
], ChanMessage);
exports.ChanMessage = ChanMessage;
//# sourceMappingURL=ChanMessage.js.map