const form = document.getElementById('data-form');
const formStatus = document.getElementById('form-status');
const messages = {
    fullName: 'Введіть прізвище та два великі ініціали: Петренко П.П.',
    phone: 'Введіть телефон у форматі (000)-000-00-00.',
    idCard: 'Введіть дві великі літери та шість цифр: АБ №123456.',
    faculty: 'Введіть рівно чотири великі літери: АБВГ.',
    birthDate: 'Введіть дійсну дату у форматі ДД.ММ.РРРР.'
};

function markField(input, invalid) {
    input.closest('.form-row').classList.toggle('invalid', invalid);
    input.setAttribute('aria-invalid', String(invalid));
    document.getElementById(`${input.id}-error`).textContent = invalid ? messages[input.name] : '';
}

function showResult() {
    const popup = window.open('', 'lab5-result', 'width=520,height=560');
    if (!popup) {
        formStatus.dataset.state = 'error';
        formStatus.textContent = 'Дані коректні, але браузер заблокував вікно. Дозвольте спливні вікна й повторіть перевірку.';
        return;
    }

    // Введення користувача додається тільки як текст, не як HTML.
    popup.opener = null;
    const doc = popup.document;
    doc.documentElement.lang = 'uk';
    const meta = doc.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0';
    const style = doc.createElement('style');
    style.textContent = 'body{font:16px/1.6 Arial,sans-serif;margin:32px;color:#172338}h1{font-size:24px}dt{font-weight:bold;margin-top:16px}dd{margin:2px 0;overflow-wrap:anywhere}';
    doc.head.replaceChildren(meta, style);
    doc.title = 'ЛР5 — введені дані';
    const heading = doc.createElement('h1');
    heading.textContent = 'Введені дані';
    const list = doc.createElement('dl');
    for (const name of Object.keys(messages)) {
        const input = form.elements.namedItem(name);
        const label = doc.createElement('dt');
        label.textContent = document.querySelector(`label[for="${input.id}"]`).textContent;
        const value = doc.createElement('dd');
        value.textContent = input.value.trim();
        list.append(label, value);
    }
    doc.body.replaceChildren(heading, list);
    popup.focus();
    formStatus.dataset.state = 'success';
    formStatus.textContent = 'Усі дані коректні. Результат відкрито в окремому вікні.';
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    let firstInvalid = null;
    for (const name of Object.keys(messages)) {
        const input = form.elements.namedItem(name);
        const invalid = !LabValidation.validateField(name, input.value);
        markField(input, invalid);
        if (invalid && !firstInvalid) firstInvalid = input;
    }
    if (firstInvalid) {
        formStatus.dataset.state = 'error';
        formStatus.textContent = 'Виправте виділені поля. Результат не відкрито.';
        firstInvalid.focus();
        return;
    }
    showResult();
});

form.addEventListener('input', (event) => {
    const input = event.target;
    if (!Object.hasOwn(messages, input.name)) return;
    if (input.hasAttribute('aria-invalid')) {
        markField(input, !LabValidation.validateField(input.name, input.value));
    }
    formStatus.textContent = '';
});

form.addEventListener('reset', () => {
    for (const name of Object.keys(messages)) markField(form.elements.namedItem(name), false);
    formStatus.textContent = '';
    delete formStatus.dataset.state;
});

// Завдання 2. Події призначено тільки клітинці, номер якої дорівнює варіанту.
const SIZE = 6;
const VARIANT = 3;
const tbody = document.querySelector('#color-table tbody');
const picker = document.getElementById('color-picker');
const tableStatus = document.getElementById('table-status');
const cells = [];
for (let row = 0; row < SIZE; row++) {
    const tr = document.createElement('tr');
    for (let column = 0; column < SIZE; column++) {
        const td = document.createElement('td');
        td.textContent = String(row * SIZE + column + 1);
        tr.appendChild(td);
        cells.push(td);
    }
    tbody.appendChild(tr);
}

function paintCell(cell, color) {
    cell.style.backgroundColor = color;
    const rgb = color.slice(1).match(/../g).map(value => parseInt(value, 16));
    const luminance = rgb.map(value => {
        const s = value / 255;
        return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    const brightness = 0.2126 * luminance[0] + 0.7152 * luminance[1] + 0.0722 * luminance[2];
    cell.style.color = brightness > 0.179 ? '#000000' : '#ffffff';
}

const activeCell = cells[VARIANT - 1];
activeCell.classList.add('active-cell');
activeCell.tabIndex = 0;
activeCell.setAttribute('role', 'button');
activeCell.setAttribute('aria-label', 'Клітинка 3, активна. Enter — обраний колір; Shift+Enter — головна діагональ.');
activeCell.addEventListener('mouseenter', () => {
    const color = '#' + Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
    paintCell(activeCell, color);
    tableStatus.textContent = `Наведення: клітинка 3, випадковий колір ${color}.`;
});
activeCell.addEventListener('click', () => {
    paintCell(activeCell, picker.value);
    tableStatus.textContent = `Клік: клітинка 3, колір ${picker.value}.`;
});
activeCell.addEventListener('dblclick', () => {
    for (const number of LabValidation.getDiagonalNumbers(SIZE)) {
        paintCell(cells[number - 1], picker.value);
    }
    tableStatus.textContent = `Подвійний клік: головна діагональ, колір ${picker.value}.`;
});
activeCell.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activeCell.dispatchEvent(new MouseEvent(event.shiftKey ? 'dblclick' : 'click'));
    }
});
