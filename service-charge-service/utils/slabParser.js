exports.parseSlabs = (slabString, amount) => {
    const slabs = slabString.split('/');
    for (let slab of slabs) {
        const [min, max, rateStr] = slab.split('_');
        const minAmt = parseFloat(min);
        const maxAmt = parseFloat(max);
        const rate = parseFloat(rateStr);

        if (amount >= minAmt && amount <= maxAmt) {
            return { rate };
        }
    }
    return null;
};
