let stored = [
    { value: 2, quantity: 10 },
    { value: 5, quantity: 1 },
    { value: 10, quantity: 5 },
    { value: 20, quantity: 5 },
    { value: 50, quantity: 5 }
];

function getBills() {
    return stored;
}

function saveBills(bills) {
    stored = bills;
}

function getBill(value) {
    return stored.filter((v) => v.value == value)[0];
}

export { getBills, getBill, saveBills };