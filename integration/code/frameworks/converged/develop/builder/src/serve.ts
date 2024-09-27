import { existsSync, readdirSync, fstatSync, openSync } from "fs";
import { join } from "path";
import { compileModule, copileLibrary,copileLocalLibrary } from "./build";
import { indexBuild } from "./tools/html";
import { extractBootstrapsDirs } from "./tools/dirs";
import { REMOTE_HOST, REMOTE_HOST_PINNING } from "./confs";

process.chdir("../");
const CONF_DIR = "./configuration";

async function jsToResponse(jsFile: string) {
	console.log("JS TO RESPONSE", jsFile);
	// todo it hotfi bun bug
	const headers = {
		"Content-Type": "application/javascript",
	};
	const file = await Bun.file(jsFile).arrayBuffer();
	return new Response(file, { headers });
}

async function indexResponse(
	dirPath: string,
	dirBs: string,
): Promise<Response> {
	const htmlContent: string = await indexBuild(dirPath, dirBs);

	return new Response(htmlContent, {
		headers: {
			"Content-Type": "text/html",
		},
	});
}

function fileResponse(filePath: string): Response {
	if (existsSync(filePath)) {
		const file = Bun.file(filePath);
		return new Response(file);
	} else {
		console.log("Not found", filePath);
		return new Response("Not Found", { status: 404 });
	}
}

async function remoteResponse(host: string, path: string): Promise<Response> {
	const remoteUrl = host + path;
	console.log("REMOTE URL", remoteUrl);
	const data = await fetch(remoteUrl);
	const buffer = await data.arrayBuffer();
	return new Response(buffer, {
		headers: {
			"Content-Type": "application/json",
		},
	});
}

interface HendlerFunc {
	(req: { path: string }): Promise<Response>;
}

function startServer(
	rootDir: string,
	name: string,
	bsDir: string,
	port: number,
) {
	const hendlers: { [key: string]: HendlerFunc } = {};

	hendlers["/library/*"] = async (req: { path: string }) => {
		let libName = req.path.replace("/library/", "").replace(".mjs", "");
		let libNameCompile = req.path.replace("/library/", "/libraries/").replace(".mjs", "");

	
		//const 	jsPath= await copileLibrary(join(rootDir, "configuration"), libName, "dist")
		const jsPath = await copileLocalLibrary(rootDir, libNameCompile, "dist", false, "/src/index.ts")
		
		// local
		return jsToResponse(jsPath);
	};
	hendlers["/packages/*"] = async (req: { path: string }) => {
		const jsPath = await compileModule(rootDir, req.path, "dist", false, "/src/index.tsx");
		return jsToResponse(jsPath);
	};

	hendlers["/dag*"] = async (req: { path: string }) => {
		return await remoteResponse(REMOTE_HOST, req.path);
	};

	hendlers["/cached*"] = async (req: { path: string }) => {
		return await remoteResponse(REMOTE_HOST, req.path);
	};
	hendlers["/ipfs*"] = async (req: { path: string }) => {
		return await remoteResponse(REMOTE_HOST, req.path);
	};

	hendlers["/ipns*"] = async (req: { path: string }) => {
		return await remoteResponse(REMOTE_HOST, req.path);
	};

	hendlers["/stat"] = async (req: { path: string }) => {
		return await remoteResponse(REMOTE_HOST_PINNING, req.path);
	};

	hendlers["/select"] = async (req: { path: string }) => {
		return await remoteResponse(REMOTE_HOST_PINNING, req.path);
	};

	hendlers["/images/*"] = async (req: { path: string }) => {
		console.log("IMAGES", req.path)
		return await fileResponse("./configuration" + req.path);
	};

	// hendlers["/assets/scipts/**"] = async (req: { path: string }) => {
	// 	return await fileResponse(join("./configuration",  req.path));
	// };

	hendlers["/assets/*"] = async (req: { path: string }) => {
		return await fileResponse(join("./configuration",  req.path));
	};

	


	hendlers["*/"] = async (req: { path: string }) => {
		return await indexResponse(join(rootDir, CONF_DIR), join(rootDir, bsDir));
	};

	hendlers["*/*"] = async (req: { path: string }) => {
		return await indexResponse(join(rootDir, CONF_DIR), join(rootDir, bsDir));
	};



	const server = Bun.serve({
		port: port,
		async fetch(request) {
			const url = new URL(request.url);
			const path = url.pathname + url.search;

			const handlerKey: string | undefined = Object.keys(hendlers).find(
				(item) => {
					const pattern = "^" + item.replace("*", ".*") + "$";
					return path.match(pattern);
				},
			);

			if (handlerKey) {
				const h: HendlerFunc = hendlers[handlerKey];
				return h({ path });
			}
			let filePath = CONF_DIR + path;
			return fileResponse(filePath);
		},
	});

	console.log(`Start server ${name}: ${server.port}`, Bun.nanoseconds());
}

export function runServers(rootDir: string) {
	const bootstaps = extractBootstrapsDirs(rootDir);
	let port = 8080;
	for (const name of Object.keys(bootstaps)) {
		port++;
		const bsDir = bootstaps[name];
		console.log("START", name, bsDir, port);

		if (existsSync(bsDir)) {
			startServer(rootDir, name, bsDir, port);
		}
	}
}

runServers("./");
