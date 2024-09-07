//@ts-ignore
//import { CLibrary } from "zmod";

const moduleName="quickjs"
const version="0.0.1"

const vendorDir='src/vendor/'

export const  config: CLibrary={
    nameLib: moduleName,  
    rootSourceFile: "src/wrapper.zig",  
    sources: [ 
     vendorDir+"cutils.c",
     vendorDir+ "libregexp.c",
     vendorDir+"libunicode.c",
     vendorDir+"libbf.c",
     vendorDir+"quickjs.c"],
    flags:[
        "std=gnu99",
        "funsigned-char",
        "fno-sanitize=undefined"
    ],
    macros:{
        "CONFIG_VERSION":"2021-03-27",
        "CONFIG_BIGNUM":"1"
    }
}

// export const builder=new Builder(moduleName,version)
// builder.addCLibrary(qjs)