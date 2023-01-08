"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicArmor = void 0;
const role_1 = require("../role/role");
const armor_1 = require("./armor");
class BasicArmor extends armor_1.Armor {
    name = 'Basic Armor';
    availableRoles = [role_1.Role.Swordsman, role_1.Role.BountyHunter];
}
exports.BasicArmor = BasicArmor;
