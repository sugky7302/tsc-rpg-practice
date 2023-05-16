test('建構一個屬性類別', () => {
    const strength = new Attribute('力量', 10);
    expect(strength.name).toBe('力量');
    expect(strength.value).toBe(10);
});

test('兩屬性相加', () => {
    const a = new Attribute('力量', 10);
    const b = new Attribute('力量', 5);
    a.add(b);
    expect(a.name).toBe('力量');
    expect(a.value).toBe(15);

    const f = () => {
        const c = new Attribute('敏捷', 10);
        a.add(c);
    };
    expect(f).toThrowError('兩個屬性的名稱不同，無法相加');
});
