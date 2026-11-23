const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const implementation = path.join(__dirname, '..', 'validation.js');
// Missing implementation is an assertion failure, not a module-loader error.
const api = fs.existsSync(implementation) ? require(implementation) : {};

const fixtures = {
    fullName: {
        valid: ["Лук'яненко І.І.", 'Лук’яненко І. І.', 'Іваненко-Петренко І.Є.', 'Smith J.D.'],
        invalid: ['', '123456 О.О.', 'Іваненко О.', 'Іваненко О.О', 'Іваненко о.о.', '<b>О.О.</b>']
    },
    phone: {
        valid: ['(000)-000-00-00'],
        invalid: ['', '0000000000', '(000)000-00-00', '(00)-000-00-00', '(000)-000-00-000', '(abc)-000-00-00']
    },
    idCard: {
        valid: ['АБ №123456', 'AB №000001'],
        invalid: ['', 'АБ 123456', 'А №123456', 'АБ №12345', 'АБ №1234567', '12 №123456', 'аб №123456']
    },
    faculty: {
        valid: ['АБВГ', 'ABCD'],
        invalid: ['', 'АБВ', 'АБВГД', 'А1ВГ', 'АБ ВГ', 'абвг']
    },
    birthDate: {
        valid: ['01.01.2000', '29.02.2000', '29.02.2024', '01.01.0099'],
        invalid: ['', '1.1.2000', '2000-01-01', '31.04.2000', '29.02.1900', '29.02.2023', '00.01.2000', '01.13.2000', '01.01.0000']
    }
};

for (const [name, { valid, invalid }] of Object.entries(fixtures)) {
    test(`${name}: accepts valid examples`, () => {
        assert.equal(typeof api.validateField, 'function', 'validation implementation is missing');
        for (const value of valid) assert.equal(api.validateField(name, value), true, value);
    });
    test(`${name}: rejects empty, malformed and out-of-range examples`, () => {
        assert.equal(typeof api.validateField, 'function', 'validation implementation is missing');
        for (const value of invalid) assert.equal(api.validateField(name, value), false, value);
    });
}

test('trims outer whitespace without accepting internal format errors', () => {
    assert.equal(typeof api.validateField, 'function', 'validation implementation is missing');
    assert.equal(api.validateField('phone', '  (000)-000-00-00  '), true);
    assert.equal(api.validateField('phone', '(000)- 000-00-00'), false);
    assert.equal(api.validateField('unknown', 'anything'), false);
});

test('6×6 main diagonal selects only 1, 8, 15, 22, 29 and 36', () => {
    assert.equal(typeof api.getDiagonalNumbers, 'function', 'diagonal implementation is missing');
    assert.deepEqual(api.getDiagonalNumbers(6), [1, 8, 15, 22, 29, 36]);
});
