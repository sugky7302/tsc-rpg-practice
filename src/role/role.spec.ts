import { Role, RoleTemplate } from './role';

test('測試職業模板需要擁有哪些基本屬性', () => {
    const roleTemplate = new RoleTemplate(Role.Mage);
    console.log(roleTemplate.role);
    console.log(roleTemplate.knowledges);
    console.log(roleTemplate.skills);

    // Assert
    expect(roleTemplate.match({ roles: [Role.Mage, Role.Knight, Role.Warlock] })).toBe(true);
});
