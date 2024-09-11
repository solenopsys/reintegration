
import {loadRecursive,objectToPaths} from "../tools/objects";

async function genMd(dir: string, name: string) {
	let yamlObject = loadRecursive(dir + "/" + name);
	let paths = objectToPaths(yamlObject);
	console.log("PATHS", paths);
	 let out = "";

	async function loadFile(dir: string) {
		let file = dir+".md" ;
		let data: string = await Bun.file(file).text();
		return "\n" + data + "\n";
	}

	for (const path in paths) {
		out += await loadFile(dir+"/"+ name+ "/" + path);
	}

	// console.log("OUT", name);
	const outDir = "generated/md/";
	await Bun.write(outDir + name + ".md", out);
}

const dir = "content/topics/EN/technologies";

await genMd(dir, "combinatorics");
await genMd(dir, "converged");
await genMd(dir, "detonation");
