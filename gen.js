export const id = v => () => v;
export const pick1 = ([a, b], aProbability = 0.5) => () => Math.random() < aProbability ? a : b;
export const onOff = (scale, onProbability = 0.5) => () => pick1([1, 0], onProbability) * Math.random() * scale;

export const randomGen = ([aScale, bScale, spikeScale], [aProbability = 0.1, spikeProbability = 0.005]) => () => {
    const [v, r] = [Math.random(), Math.random()];
    if (r < aProbability) {
        return v * aScale;
    } else if (r > (1 - spikeProbability)) {
        return v * spikeScale;
    } else {
        return v * bScale;
    }
};


const base = [59.404213, 17.956957];


import {range} from "./fp.js";

const gen = randomGen([0.0001, 0.0001, 0.1], [0.1, 0.1]);
const positions = range(0, 20).map(_ => [base[0] + gen(), base[1] + gen()]);
range(0, 10).reduce((acc, curr) => {
    const v = [acc[0] + gen(), acc[1] + gen()];
    positions.push(v);
    return v;
}, base);

const diffs = positions.map((v0, i, arr) => {
    const v1 = i < (arr.length - 1) ? arr[i + 1] : arr.at(-1);
    return [v1[0] - v0[0], v1[1] - v0[1]];
});


console.log(positions);

console.log(diffs);
// console.log(movingPositions);