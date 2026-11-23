const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const examples = {
    fullName: 'Петренко П.П.',
    phone: '(000)-000-00-00',
    idCard: 'АБ №123456',
    faculty: 'АБВГ',
    birthDate: '01.01.2000'
};

test('form placeholders use neutral fictional examples', () => {
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    for (const [id, value] of Object.entries(examples)) {
        const input = html.match(new RegExp(`<input id="${id}"[^>]+>`))[0];
        assert.ok(input.includes(`placeholder="${value}"`), `${id} must use its neutral example`);
    }
});

test('validation messages and README use the same neutral examples', () => {
    const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
    const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
    for (const key of ['fullName', 'phone', 'idCard', 'faculty']) {
        assert.ok(script.includes(examples[key]), `message for ${key}`);
    }
    for (const value of Object.values(examples)) {
        assert.ok(readme.includes(`\`${value}\``), 'README example');
    }
});
