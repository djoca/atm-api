let stored = new Map();
stored.set(2, 10);
stored.set(5, 1);
stored.set(10, 5);
stored.set(20, 5);
stored.set(50, 5);

function getBills() {
    return stored;
}

function saveBills(bills) {
    stored = bills;
}

export { getBills, saveBills };