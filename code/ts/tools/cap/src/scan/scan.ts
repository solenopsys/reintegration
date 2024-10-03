import { Project, Type, Symbol, TypeAliasDeclaration, SourceFile } from "ts-morph"
import { ts } from "ts-morph";

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
  value: object;
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
  const typeAlias = source.getTypeAliasOrThrow(typeName);
  const name = typeAlias.getName();
  const type = typeAlias.getType();
  const properties = type.getProperties();

  const { fields, links } = processProperties(properties);

  return { name, fields, links };
}

// // Find the type alias "Person"
// 

// // Get the leading comments of the type alias (including `//` and `/** ... */`)
// const leadingComments = typeAlias.getLeadingCommentRanges();

// // Print out all leading comments
// leadingComments.forEach(comment => {
//     console.log(comment.getText());
// });

// // You can also get comments for properties inside the type alias
// typeAlias.getType().getProperties().forEach(property => {
//     const declaration = property.getDeclarations()[0];
//     if (declaration) {
//         const comments = declaration.getLeadingCommentRanges();
//         console.log(`Comments for property ${property.getName()}:`);
//         comments.forEach(comment => console.log(comment.getText()));
//     }
// });
function processProperties(properties: Symbol[]): { fields: StructField[], links: StructLink[] } {
  let fields: StructField[] = [];
  let links: StructLink[] = [];
  for (const property of properties) {
    const propName = property.getName();
    const declarations = property.getDeclarations();

    if (declarations.length === 0) {
      continue;
    }

    const declaration = declarations[0];
    const propType = declaration.getType();
    const comment = declaration.getLeadingCommentRanges();

   
    if (FIELDS_TYPES.find(flag => flag & propType.getFlags())) {
      fields.push({
        name: propName,
        type: "string",
        order: 1
      });
    }
    else if (LINKS_TYPES.find(flag => flag & propType.getFlags())) {
      links.push({
        value: propName,
        type: "string"

      });
    }
  }
  return { fields, links };
}





// comment.forEach(c => {
//   console.log(c.getText());
// });

// console.log("COMMENT", propType);

// if (!propType) {
//   return null;
// }

// // Получаем строковое представление типа
// let type: string;

// // Создайте переключатель или просто извлеките название типа
// switch (propType.getFlags()) {
//   case ts.TypeFlags.String:
//     type = "string";
//     break;
//   case ts.TypeFlags.Number:
//     type = "i32";
//     break;
//   case ts.TypeFlags.Boolean:
//     type = "boolean";
//     break;
//   // Добавьте другие типы по необходимости
//   default:
//     type = propType.getText(); // Используем общее текстовое представление типа
// }

// return {
//   name: propName,
//   type,
//   order
// };
//   }

