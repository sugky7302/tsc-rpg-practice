"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swordsman = void 0;
const basicarmor_1 = require("../armors/basicarmor");
const role_1 = require("../role/role");
const basic_sword_1 = require("../weapons/basic-sword");
const character_1 = require("./character");
class Swordsman extends character_1.Character {
    constructor(name) {
        super(name, role_1.Role.Swordsman, new basic_sword_1.BasicSword(), new basicarmor_1.BasicArmor());
    }
}
exports.Swordsman = Swordsman;
