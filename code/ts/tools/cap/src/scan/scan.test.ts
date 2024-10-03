import { expect, test, beforeAll } from "bun:test";
import { extractSchema } from "./scan.ts";
import type { Config } from "./scan.ts";
import type { CapIO } from "../types";

export interface PersonIO extends CapIO<Person> { }

export type School = {
  id: number;
  name: string;
  classes: {
    small: number;
    big: number;
  }
  persons: Person[];
};

export type Person = {
  name: string;
  age: number; // @u8
  male: boolean;
};

let schema: Config;

beforeAll(() => {
  const selfFile = __filename;
  schema = extractSchema(selfFile);
  console.log(JSON.stringify(schema,null,2));
});

test("Check count", () => {
  expect(schema.structs.length).toBe(2);
});

test("Check names", () => {
  const school = schema.structs[0];
  expect(school.name).toBe("School");
  const person = schema.structs[1];
  expect(person.name).toBe("Person");
});

test("Check fields", () => {
  const school = schema.structs[0];
  expect(school.fields.length).toBe(1);
  expect(school.links.length).toBe(3);
  const person = schema.structs[1];
  expect(person.fields.length).toBe(2);
  expect(person.links.length).toBe(1);
});

test("Check fields types", () => {
  const school = schema.structs[0];

  expect(school.fields[0].name).toBe("id");
  expect(school.fields[0].type).toBe("i32");

  expect(school.links[0].value).toBe("name");
  expect(school.links[0].type).toBe("string");

  const person = schema.structs[1];
  expect(person.fields[0].name).toBe("age");
  expect(person.fields[0].type).toBe("u8");

});



