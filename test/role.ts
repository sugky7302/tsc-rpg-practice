import { MeleeAttack } from '../ability/meleeattack';
import { BountyHunter, Character, Monster } from '../character/character';
import { Swordsman } from '../character/swordsman';
import { Warlock } from '../character/warlock';
import { Role } from '../role/role';

let a: Character = new Character('abc', Role.Highwayman, new MeleeAttack());
let b: Character = new Swordsman('jsq');
let c: Character = new Warlock('12qiw');

const bountyHunter = new BountyHunter('Maxwell');

const wantedCharacter = new Character('Martin', Role.Highwayman, new MeleeAttack());

const wantedMonster = new Monster('Eikthyrnir');

bountyHunter.capture(wantedCharacter, 1);
bountyHunter.capture(wantedMonster, 0.5);
bountyHunter.capture(a, 0.01);

bountyHunter.sellHostages();
