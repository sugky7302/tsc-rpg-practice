import { MagicAttack } from '../ability/magicattack';
import { Role } from '../role/role';
import { Weapon } from './weapon';

export class BasicWand implements Weapon {
    public readonly name = 'Basic Wand';
    public attackStrategy = new MagicAttack();
    public availableRoles = [Role.Warlock];
}
