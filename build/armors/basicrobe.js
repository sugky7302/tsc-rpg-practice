"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicRobe = void 0;
const role_1 = require("../role/role");
const armor_1 = require("./armor");
class BasicRobe extends armor_1.Armor {
    name = 'Basic Robe';
    availableRoles = [role_1.Role.Warlock];
}
exports.BasicRobe = BasicRobe;
