import * as fs from "fs";
import { Deploy } from "./deploy";
import { exportToHelmFormat } from "./generator";
import path, { join } from "path";

const listExamples = fs.readdirSync("./examples");

import yaml from "js-yaml";


function loadConfigFromYaml(file: string): any {
    console.log("FILE",file)
 
    const bytes = fs.readFileSync(file, "utf-8");
    return yaml.load(bytes);
}




for (let i = 0; i < listExamples.length; i++) {
    const example = listExamples[i];
    const name = example.substring(0, example.lastIndexOf("."));
    const dir = join("./examples/" , listExamples[0]);
    const scriptFile = join(dir ,"script.ts");
    const configFile = join(dir ,"config.yaml");
  
    import(scriptFile).then((module) => {
        console.log("IMPORT", name)
        const config: any = loadConfigFromYaml(configFile);
        let manage: Deploy = module.run(config);
        exportToHelmFormat(manage, "./helm/" + name);
    })
}



console.log(listExamples);