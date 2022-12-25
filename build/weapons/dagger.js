"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dagger = void 0;
const stabattack_1 = require("../ability/stabattack");
class Dagger {
    name = 'Dagger';
    attackStrategy = new stabattack_1.StabAttack();
    availableRoles = [];
}
exports.Dagger = Dagger;
