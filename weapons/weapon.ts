import IAttack from '../ability/attack';
import { Character } from '../character/character';
import { Equipment } from '../equipments/equipment';
import { Equipments } from '../equipments/factory';
import { Role } from '../role/role';

export abstract class Weapon implements Equipment {
    abstract readonly name: string;
    public type = Equipments.Weapon;

    /*
     * 允許哪些職業能夠使用
     * 如果是「空」表示都可以用
     */
    abstract availableRoles: Role[];

    // 綁定的基礎攻擊方式
    abstract attackStrategy: IAttack;

    // 更換攻擊策略
    public switchAttackStrategy(type: IAttack) {
        this.attackStrategy = type;
    }

    /**
     * 藉由 attackStrategy 參考點呼叫 attack 方法
     * @param {Character} self - 攻擊者
     * @param {Character} target - 目標
     */
    public attack(self: Character, target: Character) {
        this.attackStrategy.attack(self, target);
    }
}
