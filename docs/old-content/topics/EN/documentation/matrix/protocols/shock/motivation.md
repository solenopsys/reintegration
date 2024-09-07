### Why Create a Custom Protocol?

Existing protocols are considered too complex and heavyweight for our needs, and their implementations are too tightly
bound to specific platforms. Due to the unique requirements of the task, particularly the creation of digital factories,
we need real-time information display. Therefore, a simple binary protocol was developed as the best solution for our
needs.

#### Some Other Protocol Options:

- **AMQP**: This is an open protocol for message transmission between system components, often used with RabbitMQ. It is
  similar to SHOCK Protocol but more complex in implementation and lacks support for streams.

- **STOMP**: This text-based protocol is aimed at integration with the Java platform and JMS systems, which are
  heavyweight and enterprise-oriented.

- **rsocket**: A more suitable protocol compared to STOMP, but all its implementations are focused on Java and intended
  for enterprise use.