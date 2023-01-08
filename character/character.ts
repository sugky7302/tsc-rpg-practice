import { Armor } from '../armors/armor';
import { BasicArmor } from '../armors/basicarmor';
import { BasicRobe } from '../armors/basicrobe';
import { Equipment } from '../equipments/equipment';
import { Role } from '../role/role';
import { BasicSword } from '../weapons/basic-sword';
import { BasicWand } from '../weapons/basic-wand';
import { Weapon } from '../weapons/weapon';

export class Character {
    constructor(
        public readonly name: string,
        public readonly role: Role,
        private weaponRef: Weapon,
        private armorRef: Armor
    ) {}

    public introduce() {
        console.log(`Hi, I'm ${this.name} the ${this.role}`);
    }

    public attack(target: Character): void {
        this.weaponRef.attack(this, target);
    }

    /**
     * 角色裝備武器
     * 會檢查角色是否符合武器規定
     * @param {Equipment} equipment - 武器
     */
    public equip(equipment: Equipment) {
        const { availableRoles: roles } = equipment;

        if (roles.length === 0 || roles.includes(this.role)) {
            console.log(`${this.name} has equipped "${equipment.name}"!`);

            if (equipment instanceof Weapon) {
                this.weaponRef = equipment;
            } else if (equipment instanceof Armor) {
                this.armorRef = equipment;
            }
        } else {
            throw new Error(`${this.role} cannot equip ${equipment.name}!`);
        }
    }
}

export class Monster extends Character {
    constructor(public name: string) {
        super(name, Role.Monster, new BasicSword(), new BasicArmor());
    }
}

export class BountyHunter extends Character {
    // 賞金獵人會抓取人質或怪物，所以這裡會是用陣列型別
    public hostages: Character[] = [];

    constructor(name: string) {
        super(name, Role.BountyHunter, new BasicWand(), new BasicRobe());
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
