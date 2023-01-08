import { MeleeAttack } from '../ability/meleeattack';
import { Role } from '../role/role';
import { Weapon } from './weapon';

export class BasicSword extends Weapon {
    public readonly name = 'Basic Sword';
    public attackStrategy = new MeleeAttack();
    public availableRoles = [Role.Swordsman, Role.Highwayman];
}
