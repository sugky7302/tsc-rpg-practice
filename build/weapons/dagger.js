"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dagger = void 0;
const stabattack_1 = require("../ability/stabattack");
const weapon_1 = require("./weapon");
class Dagger extends weapon_1.Weapon {
    name = 'Dagger';
    attackStrategy = new stabattack_1.StabAttack();
    availableRoles = [];
}
exports.Dagger = Dagger;
