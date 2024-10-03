import { expect, test } from "bun:test";
import { extractSchema } from "./scan.ts";
import type { CapIO } from "../types";

export interface PersonIO extends CapIO<Person> { }

// bla bla 324323
export type School = {
    id: number; // bla bla2
    name: string;
    classes: {
        small: number;
        big: number;
    }
    persons: Person[];
};
// bla bla
export type Person = {
    name: string;
    age: number; // @u8
    male: boolean;

};


test("2 + 2", () => {
  const selfFile=__filename;
  const res=extractSchema(selfFile);
  console.log(JSON.stringify(res,null,2));
  expect(res.structs.length).toBe(2);
  const school=res.structs[0];
  expect(school.name).toBe("School");
  expect(school.fields.length).toBe(4);
  const fistField=school.fields[0];
  expect(fistField.name).toBe("id");
  expect(fistField.type).toBe("i32");
});