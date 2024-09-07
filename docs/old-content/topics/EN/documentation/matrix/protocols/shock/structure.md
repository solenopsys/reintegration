### SHOCK Package Structure

#### Entities
**Process** - This is a computational process to which a stream of messages belongs. This process has a state that is stored in the cache.
**Object** - The address of the object to which the call is made (this can be a microservice, core, or device).
**Method** - The method that is called on the object (this can be a function, event, or property).

#### Header
1 byte - indicates the header structure and the length of the fields
Bits - 5 bits determine the length of the Process field in bytes
     - 2 bits determine the length of the Object field in bytes
     - 1 bit determines the length of the Method field in bytes

#### Field Lengths
- Process can be from 0 to 16 bytes long.
- Object can be from 0 to 3 bytes long.
- Method can be from 0 to 1 byte long.
The maximum header length is 21 bytes, and the minimum is 1 byte.

The Process field has the following structure:
- Initiator
- Process ID
- Sub-process ID (can be multiple)

The length of the Process header can vary.