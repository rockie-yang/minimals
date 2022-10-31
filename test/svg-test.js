import {splitD, describeArc} from "../svg.js";
import test from "../test.js";

test("split simple path d", (assert) => {
    assert([["M", "3.2", ".5"], ["C", "1", "2", "3"]], splitD("M3.2 .5C1,2 3"));
});

test(`an arc start coordinate (30, 50) with radius=60 in range [270deg, 360deg]`, (assert) => {
    assert(`M 30 -10 A 60 60 0 0 0 -30 50`, describeArc(30, 50, 60, 270, 360));
});