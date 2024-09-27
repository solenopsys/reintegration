# Inodes Settings 
Segment size 256MB
Maps of blocs width 2 bit per block (128 kbit 16kbyte)
 - free - block free
 - full - block full
 - iods - iods block
 - jurnal - jurnal block


 ## Global Blocks Inodes 64 bytes
  uid - 32 bytes
  range - 4 bytes
  date-create - 4 bytes
  date-access - 4 bytes - ?
  access-count - 4 bytes - ?
  owner - 4 bytes
  lock-settings - 1 byte ()
  zip-settings - 1 byte ()
  format-type - 2 bytes
  serialize-uid- 8 bytes


## Disc Metadata 256 megabytes
- block-devices 
- superblocks
- access statistics 
- access dates
- jurnal disc  


  


Buddy System block control