# CAP (Compact Abstraction Protocol)


**CAP** is the cornerstone of the Solenopsys infrastructure, defining the format of messages, interfaces, and data structures. Tools built on CAP facilitate the rapid serialization and deserialization of data throughout the Solenopsys ecosystem, ensuring high-speed performance.

*CAP is inspired by Cap’n Proto and can be seen as its minimalist younger sibling.*

The protocol specifies service interfaces and data structures for message exchanges, inspired by **Cap’n Proto** and designed to function similarly.

Interfaces are defined in a TypeScript-based schema format, and this schema serves as the blueprint for code generation across any programming language through customizable plugins.

While CAP operates in a way akin to Cap’n Proto, it diverges in key areas, particularly the absence of built-in transport and the use of its own schema language.

### **Key Differences from Cap’n Proto**
- **Transport-agnostic**: Unlike Cap’n Proto, CAP does not include a built-in transport layer, providing greater flexibility to use different transports as needed.
- **TypeScript-based Schemas**: Schemas are simply defined using TypeScript interfaces and types, making it intuitive and seamless for developers familiar with the language.
- **Strict Schema Storage**: CAP stores schemas in a tightly structured format via CAP serialization, allowing for deterministic storage and hash-based validation.
- **Code Generation**: The code generator, written in TypeScript, supports multiple languages and leverages **CLI Organic** for generation, making it versatile and easy to extend.