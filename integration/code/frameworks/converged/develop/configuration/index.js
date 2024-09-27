async function loadModule() {
	console.log("LOAD MODULE");
}

loadModule();

import { init } from "@solenopsys/ui-state";

function resFunc(res) {
	console.log("OK");
}

function errFunc(e) {
	console.log("ERR", e);
}
init(entry).then(resFunc).catch(errFunc);
