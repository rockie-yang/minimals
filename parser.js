const updateParserState = (state, result, index) => ({...state, result, index});
const updateParserResult = (state, result) => ({...state, result});
const updateParserError = (state, error) => ({...state, error, isError: true});

const Parser = (parserStateTransformerFn) => {
    const run = (targetString) => {
        const initialState = {targetString, index: 0, result: null, error: null, isError: false};
        return parserStateTransformerFn(initialState);
    };

    const map = (fn) => Parser(parserState => {
        const nextState = parserStateTransformerFn(parserState);
        if (nextState.isError) {
            return nextState;
        }
        return updateParserResult(nextState, fn(nextState.result));
    });

    const errorMap = fn => Parser(parserState => {
        const nextState = parserStateTransformerFn(parserState);
        if (!nextState.isError) {
            return nextState;
        }
        return updateParserError(nextState, fn(nextState.error, nextState.index));
    });
    return {
        run,
        map,
        errorMap,
        parserStateTransformerFn
    };
};
const str = s => Parser(parserState => {
    const {targetString, index, isError} = parserState;
    if (isError) {
        return parserState;
    }
    const slicedTarget = targetString.slice(index);
    if (slicedTarget.length === 0) {
        return updateParserError(parserState, `try to match ${s}, but got Unexpected end of input`);
    }
    if (slicedTarget.startsWith(s)) {
        return updateParserState(parserState, s, index + s.length);
    }

    const error = `try to match '${s}', but got '${targetString.slice(index, index + 10)}...'`;
    return updateParserError(parserState, error);
});

const sequenceOf = parsers => Parser(parserState => {
    if (parserState.isError) {
        return parserState;
    }
    let nextState = parserState;
    const results = [];
    for (const parser of parsers) {
        nextState = parser.parserStateTransformerFn(nextState);
        if (nextState.isError) {
            break;
        }
        results.push(nextState.result);
    }

    if (nextState.isError) {
        return updateParserError(parserState, nextState.error);
    } else {
        return updateParserResult(nextState, results);
    }
});

const run = (parser, targetString) => {
    const initialState = {targetString, index: 0, result: null, error: null, isError: false};
    return parser(initialState);
};

const parser = sequenceOf([str("hello").map(result => result.toUpperCase()), str("goodbye")]);
console.log(parser.run("hellogoodbye"));
console.log(parser.run("hello goodbye"));

// const parser = str("hello there");
// console.log(run(parser, "hello there"));
// console.log(run(parser, "This is not correct"));