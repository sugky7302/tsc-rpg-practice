"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = void 0;
const stabattack_1 = require("../ability/stabattack");
const swordsman_1 = require("../character/swordsman");
const warlock_1 = require("../character/warlock");
function test() {
    const swordsman = new swordsman_1.Swordsman('Maxwell');
    const warlock = new warlock_1.Warlock('Martin');
    console.log('Swordsman attacking the warlock: ');
    swordsman.attack(warlock);
    console.log('Warlock attacking the swordsman: ');
    warlock.attack(swordsman);
    swordsman.switchAttackStrategy(new stabattack_1.StabAttack());
    console.log('Using StabAttack:');
    swordsman.attack(warlock);
}
exports.test = test;
