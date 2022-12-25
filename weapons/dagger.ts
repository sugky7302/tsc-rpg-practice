import { StabAttack } from '../ability/stabattack';
import { Role } from '../role/role';
import { Weapon } from './weapon';

export class Dagger implements Weapon {
    public readonly name = 'Dagger';
    public attackStrategy = new StabAttack();
    public availableRoles = [];
}
