import fs from "fs";
import {parse} from "svg-parser";
import path from "path";
import {splitD} from "../svg.js";

const range = (begin, end, step = 1) =>
    Array((end - begin) / step)
        .fill(0)
        .map((_, i) => begin + i * step);

const chunk = (arr, size = 2) =>
    range(0, arr.length, size).map(start => arr.slice(start, start + size));

const ar = "22 12 18 12 15 21 9 3 6 12 2 12".split(" ");
console.log(chunk(ar, 2));

const iconPath = "../../feather/icons";
const files = fs.readdirSync(iconPath);
// console.log(files);

console.log(parse);


const distillers = {
    svg: () => console.log("svg is ignored"),
    polyline: (obj) => {
        const s = obj.properties.points;
        const points = chunk(s.split(/[ ,]/));
        return {tagName: "polyline", points};
    },
    path: (obj) => {
        const d = obj.properties.d;
        const points = splitD(d);
        return {tagName: "path", points};
    }, polygon: (obj) => {
        const s = obj.properties.points;
        const points = chunk(s.split(/[ ,]/));
        return {tagName: "polygon", points};
    },
    line: (obj) => ({tagName: "line", ...obj.properties}),
    circle: (obj) => ({tagName: "circle", ...obj.properties}),
    rect: (obj) => ({tagName: "rect", ...obj.properties}),
    ellipse: (obj) => ({tagName: "ellipse", ...obj.properties}),
};

function distill(obj, results = []) {
    if (obj.tagName) {
        const distilller = distillers[obj.tagName];
        if (distilller) {
            const result = distilller(obj);
            console.log(result);
            result && results.push(result);
        } else {
            console.log("tag not supported", obj.tagName);
        }
    }
    obj.children.forEach(child => distill(child, results));
    return results;
}

// console.log(JSON.stringify(result, null, 4));

const processSVG = (file) => {
    const content = fs.readFileSync(path.join(iconPath, file), "utf-8");
    const hast = parse(content);
    console.log(`distill ${file}`, hast);
    const results = distill(hast);
    contents[file] = results;

};
const contents = {};
files.forEach(processSVG);
// processSVG("youtube.svg");
console.log(JSON.stringify(contents, null, 4));
