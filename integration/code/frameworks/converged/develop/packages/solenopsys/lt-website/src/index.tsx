import { lazy, render } from "@solenopsys/converged-renderer";

import { Site } from "./layout/site";
import { Router } from "@solenopsys/converged-router";
import { UiEvents } from "@solenopsys/converged-renderer";
import $ from "@solenopsys/converged-reactive";
import { googleOneTap } from "@solenopsys/mf-auth";

function setPageTitle(title:string){
	document.title=title
}

function setFavicon(href:string){
	const link=document.querySelector("link[rel*='shortcut icon']") as HTMLAnchorElement | null
	if(link !== null){
		link.href=href
	}
}

export const createLayout = (
	tagId: string,
	loadModule: (name: string) => {},
	conf: any
) => {
	UiEvents({type:"LayoutInit",tag:tagId})
	setPageTitle(conf.page.title)
	setFavicon(conf.page.favicon)

	$.effect(() => {
		const event:any = UiEvents();
		if (event.type === "external") {
			googleOneTap();
		}
	});


	
	// @ts-ignore
	render(() => {

		console.log("ROUTER INIT")
		return (
			<Router>
				<Site  {...conf}  />
			</Router>
		);
	}, document.getElementById(tagId));
};

document.documentElement.style.setProperty(`--control-color`, "blue");
//document.documentElement.style.setProperty(`--main-bg-color`, "white");
