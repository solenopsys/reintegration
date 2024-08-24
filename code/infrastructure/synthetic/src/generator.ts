import {dump} from "js-yaml";
import {mkdirSync, writeFileSync} from "fs";
import {Deploy} from "./deploy";
import * as fs from "fs";


export function dumpToYaml(obj: any, file:string) {

    const yamlString = dump(obj, {lineWidth: 1000});
    writeFileSync(file, yamlString, 'utf-8');
}

export function exportToHelmFormat(chart: Deploy, distFolder: string) {
    if (!fs.existsSync(distFolder))
        mkdirSync(distFolder,{recursive: true});
    let arr = chart.exportStruct();


    for (let key in arr) {

        let file = `${distFolder}/${key}.yaml`;
        let dir = file.substring(0, file.lastIndexOf("/"));

        if (!fs.existsSync(dir))
            mkdirSync(dir);
        dumpToYaml(arr[key], file);
    }
}