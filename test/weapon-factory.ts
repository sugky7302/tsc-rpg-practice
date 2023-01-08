import { Swordsman } from '../character/swordsman';
import { Warlock } from '../character/warlock';
import { WeaponFactory, Weapons } from '../weapons/factory';

export function test() {
    let swordsman = new Swordsman('Maxwell');
    let warlock = new Warlock('Martin');

    const weaponFactory = new WeaponFactory();

    console.log('Using BasicSword - MeleeAttack:');
    swordsman.attack(warlock);

    const dagger = weaponFactory.createWeapon(Weapons.Dagger);
    swordsman.equip(dagger);

    console.log('Using Dagger - StabAttack:');
    swordsman.attack(warlock);
}
