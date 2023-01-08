import { MeleeAttack } from '../ability/meleeattack';
import { BasicArmor } from '../armors/basicarmor';
import { BountyHunter, Character, Monster } from '../character/character';
import { Swordsman } from '../character/swordsman';
import { Warlock } from '../character/warlock';
import { Role } from '../role/role';
import { BasicSword } from '../weapons/basic-sword';

let a: Character = new Character('abc', Role.Highwayman, new BasicSword(), new BasicArmor());
let b: Character = new Swordsman('jsq');
let c: Character = new Warlock('12qiw');

const bountyHunter = new BountyHunter('Maxwell');

const wantedCharacter = new Character(
    'Martin',
    Role.Highwayman,
    new BasicSword(),
    new BasicArmor()
);

const wantedMonster = new Monster('Eikthyrnir');

bountyHunter.capture(wantedCharacter, 1);
bountyHunter.capture(wantedMonster, 0.5);
bountyHunter.capture(a, 0.01);

bountyHunter.sellHostages();
