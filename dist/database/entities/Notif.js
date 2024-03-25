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
exports.Notif = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Channel_1 = require("./Channel");
let Notif = class Notif {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Notif.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Notif.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Notif.prototype, "acceptEvent", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    __metadata("design:type", User_1.User)
], Notif.prototype, "from", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    __metadata("design:type", User_1.User)
], Notif.prototype, "to", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Channel_1.Channel),
    __metadata("design:type", Channel_1.Channel)
], Notif.prototype, "channel", void 0);
Notif = __decorate([
    (0, typeorm_1.Entity)({ name: "notif" })
], Notif);
exports.Notif = Notif;
//# sourceMappingURL=Notif.js.map