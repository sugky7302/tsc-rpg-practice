import IAttack from '../ability/attack';
import { Role } from '../role/role';

export interface Weapon {
    readonly name: string;

    /*
     * 允許哪些職業能夠使用
     * 如果是「空」表示都可以用
     */
    availableRoles: Role[];

    // 綁定的基礎攻擊方式
    attackStrategy: IAttack;
}
