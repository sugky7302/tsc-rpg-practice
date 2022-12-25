import { Swordsman } from '../character/swordsman';
import { Warlock } from '../character/warlock';
import { BasicSword } from '../weapons/basic-sword';
import { BasicWand } from '../weapons/basic-wand';
import { Dagger } from '../weapons/dagger';

export function test() {
    const swordsman = new Swordsman('Maxwell');
    const warlock = new Warlock('Martin');

    console.log('Using BasicSword - MeleeAttack:');
    swordsman.attack(warlock);

    swordsman.equip(new Dagger());

    console.log('using Dagger - StabAttack:');
    swordsman.attack(warlock);

    try {
        swordsman.equip(new BasicWand());
    } catch (err) {
        console.log(err);
    }
}
