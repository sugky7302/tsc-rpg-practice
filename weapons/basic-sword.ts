import { MeleeAttack } from '../ability/meleeattack';
import { Role } from '../role/role';
import { Weapon } from './weapon';

export class BasicSword implements Weapon {
    public readonly name = 'Basic Sword';
    public attackStrategy = new MeleeAttack();
    public availableRoles = [Role.Swordsman, Role.Highwayman];
}
