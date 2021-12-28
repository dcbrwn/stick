function pipe(input, ...ops) {
    const len = ops.length;
    let result = input;
    for (let i = 0; i < len; i += 1) {
        result = ops[i](result);
    }
    return result;
}
export { pipe };
//# sourceMappingURL=pipe.js.map