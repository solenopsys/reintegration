import * as cbor from 'cbor';
import * as fs from 'fs';

// Пример объекта для сериализации
const person = {
  name: 'John Doe',
  age: 30,
  isActive: true,
  hobbies: ['reading', 'traveling', 'swimming']
};

// Сериализация объекта в формат CBOR
const serialized = cbor.encode(person);
console.log('Serialized CBOR:', serialized);
// write to file
fs.writeFileSync('person.cbor', serialized);

// Десериализация CBOR обратно в объект
const deserialized = cbor.decode(serialized);
console.log('Deserialized Object:', deserialized);