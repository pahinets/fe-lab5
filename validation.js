// Варіант 3: рядки 1, 4, 5, 6, 7 таблиці 2.
const LabValidation = (() => {
    const patterns = {
        fullName: /^[А-ЯІЇЄҐA-Zа-яіїєґa-z]+(?:['’ʼ-][А-ЯІЇЄҐA-Zа-яіїєґa-z]+)* [А-ЯІЇЄҐA-Z]\. ?[А-ЯІЇЄҐA-Z]\.$/u,
        phone: /^\(\d{3}\)-\d{3}-\d{2}-\d{2}$/,
        idCard: /^[А-ЯІЇЄҐA-Z]{2} №\d{6}$/u,
        faculty: /^[А-ЯІЇЄҐA-Z]{4}$/u,
        birthDate: /^(0[1-9]|[12]\d|3[01])\.(0[1-9]|1[0-2])\.(?!0000)\d{4}$/
    };

    function validateField(name, value) {
        const text = value.trim();
        if (!Object.hasOwn(patterns, name) || !patterns[name].test(text)) {
            return false;
        }
        if (name !== 'birthDate') return true;

        // Регулярний вираз перевіряє формат; календар — кількість днів у місяці.
        const [day, month, year] = text.split('.').map(Number);
        const leapYear = year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
        const days = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return day <= days[month - 1];
    }

    function getDiagonalNumbers(size) {
        return Array.from({ length: size }, (_, row) => row * size + row + 1);
    }

    return { validateField, getDiagonalNumbers };
})();

// Той самий код перевіряється в Node.js без сторонніх бібліотек.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LabValidation;
}
