//
// identity
// I := λa.a
const I = a => a;

console.log({
    description: "identity of any value is itself",
    result: I(3)
});
console.log({
    description: "identity of identity is identity",
    result: I(I)
});

//
// mocking bird, ω
// M := λf.ff
//
const M = f => f(f);

console.log({
    description: "mocking bird of identity is itself",
    result: M(I)
});

// we can not call mocking bird of mocking bird, it will cause stackoverflow
// M(M)

//
// Kestrel, first, const
// K := λab.a

const K = a => b => a;
console.log({
    description: "Kestrel only take the first one and ignore the second",
    result: K(K)(M)
});

//
// Kite, second
// KI :=  λab.b
// const KI = a => b => b
const KI = K(I);

console.log({
    description: "Kite only take the second argument and ignore the first",
    result: KI(M)(3)
});

// combinators are functions with no free variable

//
// Cardinal
// C :=  λfab.fba
// flip argument
const C = f => a => b => f(b)(a);

console.log({
    description: "flip argument. Kite take the first argument, Cardinal reverse it take the second",
    result: C(K)(I)(M)
});

// C(K) === KI === doing flip

const T = K;  // True
const F = KI; // False

T.inspect = T.toString = () => "T / K";
F.inspect = F.toString = () => "F / KI";
console.log({
    description: "True",
    result: T.toString()
});

//
// NOT := λp.pFT
// negation
const not = p => p(F)(T);

console.log({
    description: "not True, shall be False",
    result: String(not(T))
});
console.log({
    description: "not False, shall be True",
    result: String(not(F))
});

//
// AND := λpq.pqF
// conjunction
const and = p => q => p(q)(p);
console.log({
    description: "T and T shall be T",
    result: String(and(T)(T))
});
console.log({
    description: "T and F shall be F",
    result: String(and(T)(F))
});
console.log({
    description: "F and T shall be F",
    result: String(and(F)(T))
});

// OR :=  λpq.ppq
const or = p => q => p(p)(q);
console.log({
    description: "T or T shall be T",
    result: String(or(T)(T))
});
console.log({
    description: "T or F shall be T",
    result: String(or(T)(F))
});
console.log({
    description: "F or T shall be T",
    result: String(or(F)(T))
});
console.log({
    description: "F or F shall be F",
    result: String(or(F)(F))
});

const n0 = f => a => a;
const n1 = f => a => f(a);
const n2 = f => a => f(f(a));

const succ = n => f => a => f(n(f)(a));

console.log({
    description: "successor of n0 shall be n1",
    result: succ(n0)(I)(1) === n1(I)(1)
});

const jsnum = n => n(x => x + 1)(0);
console.log({
    description: "n0 shall be 0",
    result: jsnum(n0)
});
console.log({
    description: "n2 shall be 2",
    result: jsnum(n2)
});

console.log({
    description: "succ(n2) shall be 3",
    result: jsnum(succ(n2))
});