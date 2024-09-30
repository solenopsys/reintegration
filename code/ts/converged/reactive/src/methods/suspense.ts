/* IMPORT */

import boolean from "./boolean";
import effect from "./effect";
import get from "./get";
import Suspense from "../objects/suspense";
import type { SuspenseFunction, FunctionMaybe } from "../types";

/* MAIN */

const suspense = <T>(
	when: FunctionMaybe<unknown>,
	fn: SuspenseFunction<T>,
): T => {
	const suspense = new Suspense();
	const condition = boolean(when);
	const toggle = () => suspense.toggle(get(condition));

	effect(toggle, { sync: true });

	return suspense.wrap(fn);
};

/* EXPORT */

export default suspense;
