"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swordsman = void 0;
const role_1 = require("../role/role");
const basic_sword_1 = require("../weapons/basic-sword");
const character_1 = require("./character");
class Swordsman extends character_1.Character {
    constructor(name) {
        super(name, role_1.Role.Swordsman, new basic_sword_1.BasicSword());
    }
}
exports.Swordsman = Swordsman;
