import { Role } from '../role/role';
import { BasicWand } from '../weapons/basic-wand';
import { Character } from './character';

export class Warlock extends Character {
    constructor(name: string) {
        super(name, Role.Warlock, new BasicWand());
    }
}
