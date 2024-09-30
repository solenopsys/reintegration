/* IMPORT */

import boolean from "./boolean";
import _switch from "./switch";
import type { ObservableReadonly, FunctionMaybe, Resolved } from "../types";

/* MAIN */

const ternary = <T, F>(
	when: FunctionMaybe<unknown>,
	valueTrue: T,
	valueFalse: F,
): ObservableReadonly<Resolved<T | F>> => {
	const condition = boolean(when);

	return _switch<boolean, T | F>(condition, [[true, valueTrue], [valueFalse]]);
};

/* EXPORT */

export default ternary;
