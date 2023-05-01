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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Restriction = void 0;
const typeorm_1 = require("typeorm");
const Channel_1 = require("./Channel");
let Restriction = class Restriction {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Restriction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Restriction.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Restriction.prototype, "end", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Channel_1.Channel),
    __metadata("design:type", Channel_1.Channel)
], Restriction.prototype, "banChannel", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Channel_1.Channel),
    __metadata("design:type", Channel_1.Channel)
], Restriction.prototype, "muteChannel", void 0);
Restriction = __decorate([
    (0, typeorm_1.Entity)({ name: "restrictions" })
], Restriction);
exports.Restriction = Restriction;
//# sourceMappingURL=Restriction.js.map