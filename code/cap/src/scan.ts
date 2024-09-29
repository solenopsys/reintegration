import { Project, Type, Symbol, TypeAliasDeclaration } from "ts-morph"
import type {  StructNode, SchemaField } from "./shema-types"
import {FieldType as FT,NodeType as NT} from "./shema-types.js";

// Функция для извлечения схемы из TypeScript файла
function extractSchema(filePath: string): StructNode[] {
  const project = new Project();
  project.addSourceFileAtPath(filePath);
  const sourceFile = project.getSourceFileOrThrow(filePath);

  return sourceFile.getTypeAliases().map(processTypeAlias);
}

function processTypeAlias(typeAlias: TypeAliasDeclaration): StructNode {
  const name = typeAlias.getName();
  const type = typeAlias.getType();
  const properties = type.getProperties();

  const fields: SchemaField[] = properties
    .map((property, index) => processProperty(property, index + 1))
    .filter((field): field is SchemaField => field !== null);

  return {
    name,
    fields,
    nodeType: NT.Struct,
    dataWordCount: 1,
    pointerCount: 0,
  };
}

function processProperty(property: Symbol, offset: number): SchemaField | null {
  const propName = property.getName();
  const declarations = property.getDeclarations();

  if (declarations.length === 0) {
    return null;
  }

  const declaration = declarations[0];
  const propType = declaration.getType();
  const comment = declaration
    .getJsDocs()
    .map((doc) => doc.getComment())
    .join(" ");

  if (!propType) {
    return null;
  }

  const fieldType = getFieldType(propType, comment);

  return {
    name: propName,
    type: fieldType,
    offset,
  };
}

function generateId(): number {
  // Реализуйте логику генерации уникальных идентификаторов
  return Date.now();
}
