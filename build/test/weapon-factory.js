"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = void 0;
const swordsman_1 = require("../character/swordsman");
const warlock_1 = require("../character/warlock");
const factory_1 = require("../weapons/factory");
function test() {
    let swordsman = new swordsman_1.Swordsman('Maxwell');
    let warlock = new warlock_1.Warlock('Martin');
    const weaponFactory = new factory_1.WeaponFactory();
    console.log('Using BasicSword - MeleeAttack:');
    swordsman.attack(warlock);
    const dagger = weaponFactory.createWeapon(factory_1.Weapons.Dagger);
    swordsman.equip(dagger);
    console.log('Using Dagger - StabAttack:');
    swordsman.attack(warlock);
}
exports.test = test;
