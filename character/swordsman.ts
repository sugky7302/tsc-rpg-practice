import { BasicArmor } from '../armors/basicarmor';
import { Role } from '../role/role';
import { BasicSword } from '../weapons/basic-sword';
import { Character } from './character';

export class Swordsman extends Character {
    constructor(name: string) {
        super(name, Role.Swordsman, new BasicSword(), new BasicArmor());
    }
}
