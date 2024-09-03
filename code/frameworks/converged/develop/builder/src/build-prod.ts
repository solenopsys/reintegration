import { expect } from "bun:test";
import { compileModule } from "./build";
import { readdirSync, openSync, fstatSync } from "fs";
import { uploadFileFoIpfs } from "./tools/ipfs";
import { copileLibrary } from "./build";
import { CORE_LIBS, PRO_DIST } from "./confs";
import { extractModules } from "./tools/bs";
import {getDirs} from "./tools/dirs";
import { REMOTE_HOST, REMOTE_HOST_PINNING,REMOTE_PREFEIX } from "./confs";


process.chdir("../");

const packagesDirs = getDirs("./packages/solenopsys/");

// console.log("PACKAGES", packagesDirs);

//const dir = "/packages/solenopsys/lt-website/";





async function compileModules() {
	for (const dir of packagesDirs) {
		const clearDir = dir.replace(".", "");

		console.log("COMPILE", dir);
		await compileModule("./", clearDir, PRO_DIST, true,"src/index.tsx");
	}
}



async function injectHash(fullDistDir: string) {
	const js = `${fullDistDir}/index.js`;
	console.log("FULL DISTR", js);
	const hash: string = await uploadFileFoIpfs(js);
	const hashFile = `${fullDistDir}/hash.txt`;
	await Bun.write(hashFile, hash);
}

async function compileCoreLibs() {
	for (const lib of CORE_LIBS) {
		copileLibrary("./configuration", lib, PRO_DIST);
	}
}

async function scanDirs() {
	const packages = getDirs(`./${PRO_DIST}/packages/solenopsys/`);
	const libaries = getDirs(`./${PRO_DIST}/libraries/@solenopsys/`);
	const all = packages.concat(libaries);
	for (const dir of all) {
		await injectHash(dir);
	}
}




async function buildAll() {
	await compileModules();
	await compileCoreLibs();
	//await scanDirs();
}

let start = Bun.nanoseconds();


buildAll().then(() => {
	const end = Bun.nanoseconds();
	console.log("DONE ", (end - start) / 1000000000, "s");
});
