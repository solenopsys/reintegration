### Framework Components

![cluster-diagram.svg](./content/images/detonation/cluster-diagram.svg)

**Microservices** - Modules designed to handle user requests on the backend. They operate as containers within a
lightweight Kubernetes cluster. Users on the Solenopsys platform can create and publish their own microservices, which
are then immediately available for use by other network participants.

**Data Storage Services** - Converged uses data storage services instead of traditional databases with regular drivers.
These services act as wrappers for database drivers, enabling asynchronous interaction with the database via a message
queue.

**Cache** - A distributed cache that operates at the cluster level, storing the states of data processing workflows.

**FlowControl** - A micro-program that manages data and command streams.

**StreamGates** - Programs designed to receive data streams at the cluster's entry point, transform them,
and distribute the processed streams to HostRouters. eBPF technology can be employed for high-performance packet
conversion within StreamGates.

**ClusterRouter** - A program responsible for the deployment and scaling of cellular applications across clusters.

**HostRouter** - Manages the computational process of tasks. They enable interaction between multiple micro frontends
and microservices, directing message flows via WebSockets, crucial for real-time event display.

**Microkernels** - Specialized containers for data processing, akin to AWS lambda functions. ZeroMQ technology is used
for data exchange between microkernels. Within a single node (computer), data exchange can reach speeds of three million
messages per second with a transfer delay of approximately 5 microseconds.

**SHOCK Protocol** - Frontend and backend data exchange is conducted through message streams. This involves using
WebSockets for the frontend and ZeroMQ within the cluster.


