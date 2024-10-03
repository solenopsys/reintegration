import { Project, Type, Symbol, TypeAliasDeclaration, SourceFile, CommentRange } from "ts-morph"
import { ts } from "ts-morph";
import type { Declaration } from "typescript";

const FIELDS_TYPES = [
  ts.TypeFlags.Number,
  ts.TypeFlags.Boolean,
  ts.TypeFlags.BooleanLike
];

const LINKS_TYPES = [
  ts.TypeFlags.String,
  ts.TypeFlags.Object,
  ts.TypeFlags.TypeParameter
];

export type StructField = {
  name: string;
  type: string;
  order: number;
}

export type StructLink = {
  value: any;
  type: string;
}

export type Object = {
  name: string;
  fields: StructField[];
  links: StructLink[];
}

export type StructObject = {
  name: string;
  fields: StructField[];
  links: StructLink[];
}

export type Config = {
  structs: StructObject[];
}

function checkType(flag: any, propType: ts.TypeFlags): boolean {
  return (flag & propType) !== 0
}

function decodeType(type: ts.TypeFlags, labels: string[]): string {
  if (checkType(ts.TypeFlags.Number, type)) return labels.length > 0 ? labels[0] : "i32";
  if (checkType(ts.TypeFlags.Boolean, type)) return "boolean"
  if (checkType(ts.TypeFlags.String, type)) return "string"
  if (checkType(ts.TypeFlags.Object, type)) return "object"
  return "undefined";
}

// Функция для извлечения схемы из TypeScript файла
export function extractSchema(filePath: string): Config {
  const project = new Project();
  project.addSourceFileAtPath(filePath);
  const sourceFile = project.getSourceFileOrThrow(filePath);
  const structNames = sourceFile.getTypeAliases().map(o => o.getName())

  let structs = [];

  for (const name of structNames) {
    const struct = processTypeAlias(sourceFile, name);
    structs.push(struct);
  }

  return { structs };
}



function processTypeAlias(source: SourceFile, typeName: string): StructObject {
  console.log("NAME",typeName);
  const typeAlias = source.getTypeAliasOrThrow(typeName);
  const name = typeAlias.getName();
  const type = typeAlias.getType();
  const properties = type.getProperties();
  const { fields, links } = processProperties(properties);
  console.log("END",fields);
  return { name, fields, links };
}

function extractCommentLabels(comments: CommentRange[]): string[] {
  let commentString = "";
  comments.forEach(comment => {
    commentString += comment.getText();
  });

  const regex = /@([^@\s]+)/g
  const matches = commentString.match(regex)?.map(match => match.replace("@", ""));
  return matches || [];
}




function processProperties(properties: Symbol[]): { fields: StructField[], links: StructLink[] } {
  let fields: StructField[] = [];
  let links: StructLink[] = [];

 

  let order = 0;
  console.log("ORDER",order);
  for (const property of properties) {
  
    const propName = property.getName();
    const declarations = property.getDeclarations();

    if (declarations.length === 0) {
      continue;
    }

    const declaration = declarations[0];
    const propType = declaration.getType();

    const labels = extractCommentLabels(declaration.getTrailingCommentRanges())

    if (FIELDS_TYPES.find(flag => checkType(flag, propType.getFlags()))) {
      order += 1;
      fields.push({
        name: propName,
        type: decodeType(propType.getFlags(), labels),
        order: order
      });
    }
    else if (LINKS_TYPES.find(flag => checkType(flag, propType.getFlags()))) {


      links.push({
        value: propName,
        type: decodeType(propType.getFlags(), labels),

      });
    }
  }
  return { fields, links };
}



