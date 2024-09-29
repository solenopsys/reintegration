import type { CapIO } from "../types";

interface PersonIO extends CapIO<Person> { }

type Person = {
    name: string;
    age: number; // @u8
};

