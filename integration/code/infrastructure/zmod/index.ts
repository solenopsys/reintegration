

import { write } from "bun"; 
import { pathToFileURL } from "url";
import { genLib ,genHeader} from "./generators";


const path= "../../zig/libraries/quickjs";
const fileName="build.zig"
const config="build.ts"

const zigBuildPath=path+"/"+fileName
const configPath=path+"/"+config


async function  runCode(filePath:string,local:boolean=false){
    const moduleURL = pathToFileURL(filePath).href;
    const module = await import(moduleURL) 

    const header=genHeader();
    const libCode = genLib(module.config,local?".":path);
 
    write(zigBuildPath,header+libCode)
}


 

runCode(configPath,true).then()

 