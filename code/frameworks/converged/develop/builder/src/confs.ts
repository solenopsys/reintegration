export const IMPORT_MAP = {
	"@solenopsys/converged-reactive":
		"/library/solenopsys/converged-reactive.mjs",
	"@solenopsys/converged-renderer":
		"/library/solenopsys/converged-renderer.mjs",
	"@solenopsys/converged-router": "/library/solenopsys/converged-router.mjs",
	"@solenopsys/converged-style": "/library/solenopsys/converged-style.mjs",
	"@solenopsys/converged-renderer/jsx-dev-runtime":
		"/library/solenopsys/converged-renderer.mjs",
	"@solenopsys/ui-navigate": "/packages/solenopsys/ui-navigate",
	"@solenopsys/ui-controls": "/packages/solenopsys/ui-controls",
	"@solenopsys/ui-layouts": "/packages/solenopsys/ui-layouts",
	"@solenopsys/mf-landing": "/packages/solenopsys/mf-landing",
	"@solenopsys/mf-content": "/packages/solenopsys/mf-content",
	"@solenopsys/ui-content": "/packages/solenopsys/ui-content",
	"@solenopsys/ui-state": "/packages/solenopsys/ui-state",
	"@solenopsys/lt-website": "/packages/solenopsys/lt-website",
	"@solenopsys/lt-auth": "/packages/solenopsys/lt-auth",
	"@solenopsys/ui-highlight": "/packages/solenopsys/ui-highlight",
	"@solenopsys/ui-landing": "/packages/solenopsys/ui-landing",
	"@solenopsys/ui-forms": "/packages/solenopsys/ui-forms",
	"@solenopsys/fl-crypto": "/packages/solenopsys/fl-crypto",
	"@solenopsys/ui-qr": "/packages/solenopsys/ui-qr",
	"@solenopsys/ui-3d": "/packages/solenopsys/ui-3d",
	"@solenopsys/mf-visualize": "/packages/solenopsys/mf-visualize",
	"@solenopsys/mf-graphene": "/packages/solenopsys/mf-graphene",
	"@solenopsys/mf-generator": "/packages/solenopsys/mf-generator",


};


export const PACKAGE = "package.json";

export const CORE_LIBS = [
	"@solenopsys/converged-reactive",
	"@solenopsys/converged-renderer",
	"@solenopsys/converged-router",
	"@solenopsys/converged-style",
];

export const DEFAULT_EXTERNAL = [...CORE_LIBS];

const local=false
export const REMOTE_HOST =local? "http://localhost:7777" :"http://solenopsys.org";
export const REMOTE_HOST_PINNING = "http://pinning.solenopsys.org";

export const REMOTE_PREFEIX = "https://zero.node.solenopsys.org/ipfs/";

export const PRO_DIST = "distp";


export const IPFS_HOST = "ipfs-api.solenopsys.org";
export const IPFS_PORT = 80;