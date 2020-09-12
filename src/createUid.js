
const createUID = (length) => {

    return `${'x'.repeat(length)}`.replace(/[xy]/g, (c) => {
        // eslint-disable-next-line no-mixed-operators
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

}

export default createUID