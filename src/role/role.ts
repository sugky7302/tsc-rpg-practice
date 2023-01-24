export enum Role {
    Swordsman = '劍士',
    Warlock = '術士',
    Archer = '弓箭手',
    Priest = '牧師',
    Assassin = '刺客',
    Mage = '法師',
    Knight = '騎士',
}

const TEMPLATES: Map<Role, { knowledges: string[]; skills: string[] }> = new Map([
    [
        Role.Swordsman,
        {
            knowledges: ['劍術入門'],
            skills: ['斬擊'],
        },
    ],
    [
        Role.Warlock,
        {
            knowledges: ['黑暗契約'],
            skills: ['詛咒'],
        },
    ],
    [
        Role.Mage,
        {
            knowledges: ['元素導論'],
            skills: ['火球術'],
        },
    ],
]);

export interface IRole {
    roles: Role[];
}

export class RoleTemplate {
    public readonly knowledges: string[];
    public readonly skills: string[];
    constructor(public readonly role: Role) {
        this.knowledges = TEMPLATES.get(role)?.knowledges ?? [];
        this.skills = TEMPLATES.get(role)?.skills ?? [];
    }

    /**
     * 檢查角色是否擁有此職業
     * @param {IRole} pool - 角色裡的職業池
     * @return {boolean} - 是否擁有此職業
     */
    match(pool: IRole): boolean {
        return pool.roles.includes(this.role);
    }
}
