import { Project, Type, Symbol, TypeAliasDeclaration } from "ts-morph"

type StructField ={
  name: string;
  type: string;
  order: number;
}

type StructLink = {
  name: string;
  type: string;
}

type StructObject = {
  name: string;
  fields: StructField[];
  links: StructLink[];
}

type Config = {
  structs: StructObject[];
}

// Функция для извлечения схемы из TypeScript файла
export function extractSchema(filePath: string): Config {
  const project = new Project();
  project.addSourceFileAtPath(filePath);
  const sourceFile = project.getSourceFileOrThrow(filePath);


// // Find the type alias "Person"
// const typeAlias = sourceFile.getTypeAliasOrThrow("Person");

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


  const structs=sourceFile.getTypeAliases().map(processTypeAlias)

  return {structs} ;
}

function processTypeAlias(typeAlias: TypeAliasDeclaration): StructObject {
  const name = typeAlias.getName();
  const type = typeAlias.getType();
  const properties = type.getProperties();

   const fields = properties
    .map((property, index) => processProperty(property, index + 1))
    .filter((field): field is StructField => field !== null);

  return {name,fields};
}

function processProperty(property: Symbol, order: number): StructField|null {
  console.log("PROP");
  const propName = property.getName();
  const declarations = property.getDeclarations();

  if (declarations.length === 0) {
    return null;
  }

  const declaration = declarations[0];
  const propType = declaration.getType();
  const comment = declaration.getLeadingCommentRanges() ;

  // Print out all leading comments
  comment.forEach(c => {
  console.log(c.getText());
});


    console.log("COMMENT",comment);

  if (!propType) {
    return null;
  }


  return {
    name: propName,
    type: propType+"",
    order
  };
}

