"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicWand = void 0;
const magicattack_1 = require("../ability/magicattack");
const role_1 = require("../role/role");
class BasicWand {
    name = 'Basic Wand';
    attackStrategy = new magicattack_1.MagicAttack();
    availableRoles = [role_1.Role.Warlock];
}
exports.BasicWand = BasicWand;
