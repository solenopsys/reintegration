#### SHOCK Protocol Architecture
It is application-level protocol.

SHOCK Protocol does not rely on traditional message queue mechanisms and does not support transactional message
transmission. Its architecture is simple and based on routers, which serve as points of message exchange between
frontends and backends.

For transport layer SHOCK Protocol uses WebSocket and ZeroMQ or another Packages protocols.

Each router provides connections to frontends via WebSocket and to backends via ZeroMQ. Both of these protocols operate
over TCP. SHOCK Protocol is an end-to-end framework whose purpose is to simply transmit messages from one connection to
another.


