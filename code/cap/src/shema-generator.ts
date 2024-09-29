
import * as fs from "fs";
import path from "path";

import type { SchemaNode, StructNode, SchemaField,FieldType , } from "./shema-types.js";
import {FieldType as FT,NodeType as NT} from "./shema-types.js";

// Функция для сопоставления типов TypeScript с FieldType
function getFieldType(type: Type, comment?: string): FieldType {
  const typeName = type.getText();

  // Обработка комментариев, например, `// @u8`
  if (comment) {
    if (comment.includes("@u8")) return FT.Unsigned8;
    // Добавьте дополнительные проверки при необходимости
  }

  switch (typeName) {
    case "string":
      return FT.String;
    case "boolean":
      return FT.Bool;
    case "number":
      // По умолчанию используем I32, если не указано иное
      return FT.Integer64;
    default:
      return FT.Struct; // Предполагаем, что это вложенная структура или пользовательский тип
  }
}



// Функция для сохранения схемы в JSON файл
function saveSchemaToJson(structNodes: StructNode[], outputFilePath: string) {
  const schemaJson = JSON.stringify(structNodes, null, 2);
  fs.writeFileSync(outputFilePath, schemaJson);
}

// Пример использования
const inputFilePath = path.resolve(__dirname, "test/person.ts");
const outputFilePath = path.resolve(__dirname, "schema.json");

const schema = extractSchema(inputFilePath);
saveSchemaToJson(schema, outputFilePath);

console.log(`Схема сохранена в ${outputFilePath}`);
