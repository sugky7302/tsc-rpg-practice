import IAttack from '../ability/attack';
import { Role } from '../role/role';
import { BasicSword } from '../weapons/basic-sword';
import { BasicWand } from '../weapons/basic-wand';
import { Weapon } from '../weapons/weapon';

export class Character {
    // 在裝備武器的同時被初始化
    private attackRef: IAttack;

    constructor(
        public readonly name: string,
        public readonly role: Role,
        private weaponRef: Weapon
    ) {
        this.attackRef = this.weaponRef.attackStrategy;
    }

    public introduce() {
        console.log(`Hi, I'm ${this.name} the ${this.role}`);
    }

    public attack(target: Character): void {
        this.attackRef.attack(this, target);
    }

    // 替換攻擊策略
    public switchAttackStrategy(type: IAttack) {
        this.attackRef = type;
    }

    /**
     * 角色裝備武器
     * 會檢查角色是否符合武器規定
     * @param {Weapon} weapon - 武器
     */
    public equip(weapon: Weapon) {
        const { availableRoles: roles } = weapon;

        if (roles.length === 0 || roles.includes(this.role)) {
            console.log(`${this.name} has equipped "${weapon.name}"!`);
            this.weaponRef = weapon;
            this.attackRef = this.weaponRef.attackStrategy;
        } else {
            throw new Error(`${this.role} cannot equip ${weapon.name}!`);
        }
    }
}

export class Monster extends Character {
    constructor(public name: string) {
        super(name, Role.Monster, new BasicSword());
    }
}

export class BountyHunter extends Character {
    // 賞金獵人會抓取人質或怪物，所以這裡會是用陣列型別
    public hostages: Character[] = [];

    constructor(name: string) {
        super(name, Role.BountyHunter, new BasicWand());
    }

    /**
     * 捕捉敵人
     * 如果 p 落在成功區間中，表示成功捕獲
     * @param {Character} target - 捕捉目標
     * @param {number} successRate - 捕捉到目標的機率
     */
    public capture(target: Character, successRate: number) {
        const randomNumber = Math.random();
        let message: string;
        let targetTitle = `${target.name} the ${target.role}`;

        if (randomNumber <= successRate) {
            this.hostages.push(target);
            message = `${this.name} has captured ${targetTitle}`;
        } else {
            message = `${this.name} failed to capture ${targetTitle}`;
        }
        console.log(message);
    }

    public sellHostages() {
        const totalPrice = this.hostages.length * 1000;
        const hostagesInfo = this.hostages
            .map((hostage) => `${hostage.name} the ${hostage.role}`)
            .join('\n');
        console.log(
            `${this.name} sells all the hostages, including: ${hostagesInfo}\n\nReceive Gold: $${totalPrice}`
        );
        this.hostages = [];
    }
}
