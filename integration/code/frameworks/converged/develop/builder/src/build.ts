import { mkdirSync, renameSync } from "fs";
import { browserResolvePackage } from "./tools/resolve";
import path, { join } from "path";
//@ts-ignore
import lightningcssPlugin from "@solenopsys/converged-style/plugin";
import { DEFAULT_EXTERNAL } from "./confs";

const start = Bun.nanoseconds();

function existsFile(path: string): Promise<boolean> {
	return Bun.file(path).exists();
}

async function copyFile(source: string, target: string) {
	const file = Bun.file(source);
	await Bun.write(target, file);
}

export async function compileModule(
	rootDir: string,
	path: string,
	distDir: string,
	production = false,
	entry: string,
): Promise<string> {
	const start = Bun.nanoseconds();

	// const ngtscProgram = createCompiler("."+path,cache);
	const outPath = rootDir + "/" + distDir + path;

	const outJsPath = outPath + "/index.js";

	const forse = true;

	let state: string;

	console.log("COMPLILE", outJsPath);

	if (!(await existsFile(outJsPath)) || forse) {
		if (!(await existsFile(outPath))) {
			mkdirSync(outPath, { recursive: true });
		}

		const packagesFile = join(rootDir, path, "/package.json");
		const tsConfigJson: any = await Bun.file(packagesFile).json();
		const entryPoint = join(rootDir, path, entry);
		const packagesFromExternal = tsConfigJson["external"];


	
		const combinedExternal = packagesFromExternal.concat(DEFAULT_EXTERNAL);
		console.log("EXTERNAL",combinedExternal)
		const out: any = await Bun.build({
			sourcemap: "none",
			entrypoints: [entryPoint],
			outdir: outPath,
			minify: production,
			external: [...combinedExternal],
			plugins: [lightningcssPlugin()],
		}).catch((e) => {
			console.log("ERROR BUILD", e);
		});

		if (!out.success) {
			console.log("RES BUILD", out);
		}

		state = "build";
	} else {
		state = "cache";
	}

	const end = Bun.nanoseconds();
	console.log("BUILD (", state, ")", (end - start) / 1000000, outPath);

	return outJsPath;
}

export async function copileLibrary(
	rootDir: string,
	libName: string,
	distDir: string,
): Promise<string> {
	console.log("BUILD LOCAL1");
	let brs = await browserResolvePackage(libName, rootDir);
	console.log("BRS", brs);

	let founded = path.resolve(rootDir, "node_modules", brs);

	const outPath = join(rootDir, `../${distDir}/libraries/`, libName);
	if (!(await existsFile(outPath))) {
		mkdirSync(outPath, { recursive: true });
	}

	const absoluteOutPath = path.resolve(outPath);

	const fileFromCache = absoluteOutPath + "/index.js";

	if (await existsFile(fileFromCache)) {
		const file = Bun.file(fileFromCache);
		const fileContent = await file.arrayBuffer();
		return fileFromCache;
	} else {
		const newPathToFile = join(absoluteOutPath, "index.js");
		console.log("FOUND", founded);
		console.log("TO", newPathToFile);
		await copyFile(founded, newPathToFile);
		return newPathToFile;
	}
}

export async function copileLocalLibrary(
	rootDir: string,
	libName: string,
	distDir: string,
	production = false,
	entry: string,
): Promise<string> {
	const start = Bun.nanoseconds();


	const outPath = rootDir + "/" + distDir + libName;
	console.log("OUTPUT", outPath);

	const outJsPath = outPath + "/index.js";
	const forse = true;
	let state: string;

	if (!(await existsFile(outJsPath)) || forse) {
		if (!(await existsFile(outPath))) {
			mkdirSync(outPath, { recursive: true });
		}

		 const packagesFile = join(rootDir, libName, "/package.json");
		
		 const tsConfigJson: any = await Bun.file(packagesFile).json();
		
		 const entryPoint = join(rootDir, libName, entry);
		 let packagesFromExternal = tsConfigJson["external"];
		 if(!packagesFromExternal){
			 packagesFromExternal=[]
		 }

		 const combinedExternal = packagesFromExternal.concat(DEFAULT_EXTERNAL);
	

		 console.log("ENTRY",entryPoint)
		const out: any = await Bun.build({
			sourcemap: "none",
			entrypoints: [entryPoint],
			outdir: outPath,
			minify: production,
			external: [...combinedExternal],
			plugins: [],
		}).catch((e) => {
			console.log("ERROR BUILD", e);
		});

		if (!out.success) {
			console.log("RES BUILD", out);
		}

		state = "build";
	} else {
		state = "cache";
	}

	const end = Bun.nanoseconds();
	console.log("BUILD (", state, ")", (end - start) / 1000000, outPath);

	return outJsPath;
}

function renameFileToInxexJs(pathToFile: string): string {
	const dir = path.dirname(pathToFile);
	const fileName = path.basename(pathToFile);
	const newPath = dir + "/index.js";
	renameSync(pathToFile, newPath);
	return newPath;
}
