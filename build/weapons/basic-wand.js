"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicWand = void 0;
const magicattack_1 = require("../ability/magicattack");
const role_1 = require("../role/role");
const weapon_1 = require("./weapon");
class BasicWand extends weapon_1.Weapon {
    name = 'Basic Wand';
    attackStrategy = new magicattack_1.MagicAttack();
    availableRoles = [role_1.Role.Warlock];
}
exports.BasicWand = BasicWand;
