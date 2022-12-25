"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = void 0;
const swordsman_1 = require("../character/swordsman");
const warlock_1 = require("../character/warlock");
const basic_wand_1 = require("../weapons/basic-wand");
const dagger_1 = require("../weapons/dagger");
function test() {
    const swordsman = new swordsman_1.Swordsman('Maxwell');
    const warlock = new warlock_1.Warlock('Martin');
    console.log('Using BasicSword - MeleeAttack:');
    swordsman.attack(warlock);
    swordsman.equip(new dagger_1.Dagger());
    console.log('using Dagger - StabAttack:');
    swordsman.attack(warlock);
    try {
        swordsman.equip(new basic_wand_1.BasicWand());
    }
    catch (err) {
        console.log(err);
    }
}
exports.test = test;
