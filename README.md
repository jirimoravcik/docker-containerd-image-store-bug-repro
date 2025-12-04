# Docker containerd image store bug repro code

This repository provides code that reproduces a bug with Docker using the [containerd image store backend](https://docs.docker.com/engine/storage/containerd/).

## How to run

`docker build . -t docker-containerd-image-store-bug-repro`

`docker run -it --privileged docker-containerd-image-store-bug-repro:latest`

You should see:

```
Push: {"error":"image with reference localhost:5678/my-repo:docker-containerd-image-store-bug-repro was found but does not provide any platform","errorDetail":{"message":"image with reference localhost:5678/my-repo:docker-containerd-image-store-bug-repro was found but does not provide any platform"}}
```

More information and discussion is available at https://github.com/moby/moby/issues/51665
