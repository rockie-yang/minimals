export const first = (array) => array && array[0];
export const last = (array) => array && array[array.length - 1];

export const lastn = (n) => (array) => array && array.length > n && array.slice(array.length - n);
export const last2 = lastn(2);

export const uniq = arr => [...new Set(arr)];
export const range = (begin, end, step = 1) =>
    Array((end - begin) / step)
        .fill(0)
        .map((_, i) => begin + i * step);

export const diff = array => array.map((v0, i) => {
    const v1 = i < (array.length - 1) ? array[i + 1] : array.at(-1);
    return [v1[0] - v0[0], v1[1] - v0[1]];
});

export const chunk = (arr, size = 2) => {
    return range(0, arr.length, size).map(start => arr.slice(start, start + size));
};

// const ar = "22 12 18 12 15 21 9 3 6 12 2 12".split(" ");
// console.log(chunk(ar, 2));