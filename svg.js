import {isAlpha} from "./is.js";


const pathCommands = {
    M: x => y => ({command: "M", x, y}),
    m: dx => dy => ({command: "m", dx, dy}),
    L: x => y => ({command: "L", x, y}),
    l: dx => dy => ({command: "l", dx, dy}),
    H: x => ({command: "H", x}),
    h: dx => ({command: "h", dx}),
    V: y => ({command: "V", y}),
    v: dy => ({command: "v", dy}),
    C: x1 => y1 => x2 => y2 => x => y => ({command: "C", x1, y1, x2, y2, x, y}),
    c: dx1 => dy1 => dx2 => dy2 => dx => dy => ({command: "c", dx1, dy1, dx2, dy2, dx, dy}),
    S: x2 => y2 => x => y => ({command: "S", x2, y2, x, y}),
    s: dx2 => dy2 => dx => dy => ({command: "s", dx2, dy2, dx, dy}),
    Q: x1 => y1 => x => y => ({command: "Q", x1, y1, x, y}),
    q: dx1 => dy1 => dx => dy => ({command: "q", dx1, dy1, dx, dy}),
    T: x => y => ({command: "T", x, y}),
    t: dx => dy => ({command: "t", dx, dy}),
    A: rx => ry => angle => largeArcFlag => sweepFlag => x => y => ({command: "A", rx, ry, angle, largeArcFlag, sweepFlag, x, y}),
    a: rx => ry => angle => largeArcFlag => sweepFlag => dx => dy => ({command: "a", rx, ry, angle, largeArcFlag, sweepFlag, dx, dy}),
    Z: ({command: "Z"}),
    z: ({command: "z"})
};
const splitReg = /([a-zA-Z]|(-?\d*(\.\d+)?))/g;
export const splitD = (d) => {
    const splited = d.match(splitReg).filter((v) => v !== "");
    const commands = [];
    let commandChar = undefined;
    let command = undefined;
    for (const item of splited) {
        if (isAlpha(item)) {
            if (typeof command === "object") {
                commands.push(command);
            }
            if (typeof command === "function") {
                console.log({type: "wrong d or fix implementation", d});
            }
            commandChar = item;
            command = pathCommands[commandChar];

        } else {
            if (typeof command === "object") {
                commands.push(command);
                command = pathCommands[commandChar];
            }
            command = command(Number(item));
        }
    }

    if (typeof command === "object") {
        commands.push(command);
    } else {
        console.log({type: "wrong d or fix implementation", d});
    }
    return commands;
};

const wrapNumber = (n) => ~~(n + Number.EPSILON);

export function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
        x: centerX + wrapNumber(radius * Math.cos(angleInRadians)),
        y: centerY + wrapNumber(radius * Math.sin(angleInRadians)),
    };
}

export function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    const d = ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ");

    return d;
}

function radian(ux, uy, vx, vy) {
    const dot = ux * vx + uy * vy;
    const mod = Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy));
    let rad = Math.acos(dot / mod);
    if ((ux * vy - uy * vx) < 0.0) {
        rad = -rad;
    }
    return rad;
}

//conversion_from_endpoint_to_center_parameterization
//sample :  svgArcToCenterParam(200,200,50,50,0,1,1,300,200)
// x1 y1 rx ry φ fA fS x2 y2
export function svgArcToCenterParam(x1, y1, rx, ry, phi, fA, fS, x2, y2) {
    let cx, cy, startAngle, deltaAngle, endAngle;
    const PIx2 = Math.PI * 2.0;

    if (rx < 0) {
        rx = -rx;
    }
    if (ry < 0) {
        ry = -ry;
    }
    if (rx === 0.0 || ry === 0.0) {
        // invalid arguments
        throw Error("rx and ry can not be 0");
    }

    const s_phi = Math.sin(phi);
    const c_phi = Math.cos(phi);
    const hd_x = (x1 - x2) / 2.0; // half diff of x
    const hd_y = (y1 - y2) / 2.0; // half diff of y
    const hs_x = (x1 + x2) / 2.0; // half sum of x
    const hs_y = (y1 + y2) / 2.0; // half sum of y

    // F6.5.1
    const x1_ = c_phi * hd_x + s_phi * hd_y;
    const y1_ = c_phi * hd_y - s_phi * hd_x;

    // F.6.6 Correction of out-of-range radii
    //   Step 3: Ensure radii are large enough
    const lambda = (x1_ * x1_) / (rx * rx) + (y1_ * y1_) / (ry * ry);
    if (lambda > 1) {
        rx = rx * Math.sqrt(lambda);
        ry = ry * Math.sqrt(lambda);
    }

    const rxry = rx * ry;
    const rxy1_ = rx * y1_;
    const ryx1_ = ry * x1_;
    const sum_of_sq = rxy1_ * rxy1_ + ryx1_ * ryx1_; // sum of square
    if (!sum_of_sq) {
        throw Error("start point can not be same as end point");
    }
    let coe = Math.sqrt(Math.abs((rxry * rxry - sum_of_sq) / sum_of_sq));
    if (fA === fS) {
        coe = -coe;
    }

    // F6.5.2
    const cx_ = (coe * rxy1_) / ry;
    const cy_ = (-coe * ryx1_) / rx;

    // F6.5.3
    cx = c_phi * cx_ - s_phi * cy_ + hs_x;
    cy = s_phi * cx_ + c_phi * cy_ + hs_y;

    const xcr1 = (x1_ - cx_) / rx;
    const xcr2 = (x1_ + cx_) / rx;
    const ycr1 = (y1_ - cy_) / ry;
    const ycr2 = (y1_ + cy_) / ry;

    // F6.5.5
    startAngle = radian(1.0, 0.0, xcr1, ycr1);

    // F6.5.6
    deltaAngle = radian(xcr1, ycr1, -xcr2, -ycr2);
    while (deltaAngle > PIx2) {
        deltaAngle -= PIx2;
    }
    while (deltaAngle < 0.0) {
        deltaAngle += PIx2;
    }
    if (fS === false || fS === 0) {
        deltaAngle -= PIx2;
    }
    endAngle = startAngle + deltaAngle;
    while (endAngle > PIx2) {
        endAngle -= PIx2;
    }
    while (endAngle < 0.0) {
        endAngle += PIx2;
    }

    const outputObj = {
        cx,
        cy,
        startAngle,
        deltaAngle,
        endAngle: endAngle,
        clockwise: fS === true || fS === 1,
    };

    return outputObj;
}


