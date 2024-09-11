import { join } from "path";
import { genMap } from "./tools/bs";
import { existsSync } from "fs";
import { mkdirSync } from "fs";

export const REMOTE_PREFEIX = "https://zero.node.solenopsys.org/ipfs/";

export function getDirs(parentDir: string) {
	const dirs = [];
	const files = readdirSync(parentDir);
	for (const file of files) {
		const filePath = parentDir + file;
		const fileDescriptor = openSync(filePath, "r");
		const idDirectory = fstatSync(fileDescriptor).isDirectory();
		if (idDirectory) {
			dirs.push(filePath);
		}
	}
	return dirs;
}

export function extractModules(obj: any) {
	const modules = new Set();

	function extractModulesFromObject(obj: any) {
		if (typeof obj === "object" && obj !== null) {
			if (obj.hasOwnProperty("module")) {
				modules.add(obj.module);
			}

			for (const value of Object.values(obj)) {
				extractModulesFromObject(value);
			}
		} else if (Array.isArray(obj)) {
			obj.forEach(extractModulesFromObject);
		}
	}

	extractModulesFromObject(obj);
	return Array.from(modules);
}

process.chdir("../");

import { join } from "path";

export function indexHtmlTransform(
	indexHtmlBody: string,
	indexJs: string,
	imports: any,
	entry: any,
): string {
	const rewriter = new HTMLRewriter();

	rewriter.on("*", {
		element(el) {
			console.log(el.tagName);

			if (el.tagName === "script" && el.getAttribute("type") === "importmap") {
				el.setInnerContent(JSON.stringify({ imports }), { html: false });
			}
		},
	});

	return rewriter.transform(indexHtmlBody);
}

const INDEX_HTML = `
<html>

<head>
    <script type="importmap"> </script>
    <link rel="stylesheet" href="/assets/prism.module.css">
</head>

<body id="layout" style="padding: 0;margin: 0;">

</body>
<script type="module"  >
import { init } from "@solenopsys/ui-state";
function resFunc(res) {
	console.log("OK");
}

function errFunc(e) {
	console.log("ERR", e);
}
init(entry).then(resFunc).catch(errFunc);

</script>

</html>
`;

async function buildHtml(dirBs: string) {
	const dirPath = "./configuration/";
	const htmlStrng = INDEX_HTML;
	const scriptString = INDEX_JS;
	const entryString = await Bun.file(join(dirBs, "/entry.json")).text();

	const CONFIG_MAP = await genMap();

	const htmlContent = await indexHtmlTransform(
		htmlStrng,
		scriptString,
		CONFIG_MAP,
		entryString,
	);

	return htmlContent;
}

const name_parameter = process.argv[2];

buildHtml("./bootstraps/solenopsys/" + name_parameter).then((ht) => {
	//console.log("HTML", ht);
	console.log("DONE");
	const dir = `./${PRO_DIST}`;
	// make dirs
	if (!existsSync(dir)) {
		mkdirSync(dir);
	}
	Bun.write(`${dir}/index.html`, ht);
});
