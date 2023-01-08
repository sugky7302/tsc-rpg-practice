"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicSword = void 0;
const meleeattack_1 = require("../ability/meleeattack");
const role_1 = require("../role/role");
const weapon_1 = require("./weapon");
class BasicSword extends weapon_1.Weapon {
    name = 'Basic Sword';
    attackStrategy = new meleeattack_1.MeleeAttack();
    availableRoles = [role_1.Role.Swordsman, role_1.Role.Highwayman];
}
exports.BasicSword = BasicSword;
