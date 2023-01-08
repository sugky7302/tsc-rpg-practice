import { StabAttack } from '../ability/stabattack';
import { Swordsman } from '../character/swordsman';
import { Warlock } from '../character/warlock';

export function test() {
    const swordsman = new Swordsman('Maxwell');
    const warlock = new Warlock('Martin');

    console.log('Swordsman attacking the warlock: ');
    swordsman.attack(warlock);

    console.log('Warlock attacking the swordsman: ');
    warlock.attack(swordsman);

    // swordsman.switchAttackStrategy(new StabAttack());
    console.log('Using StabAttack:');
    swordsman.attack(warlock);
}
