### Micro-Kernels

A micro-kernel is a part of a program that contains one or several resource-intensive data processing functions. If the
kernel includes multiple functions, they are logically unified by a single concept. This segment of the program is
packaged into a container and can be deployed in a Kubernetes cluster.

The functions within these micro-kernels are stateless between calls. Once a computational task is completed, all
resources are freed. When a function is invoked, all the resources of the container are dedicated solely to that task.
This design ensures efficient use of resources and optimal performance for each task.
