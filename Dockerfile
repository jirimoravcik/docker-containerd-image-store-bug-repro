FROM cruizba/ubuntu-dind:noble-29.0.4

# Add daemon.json enabling containerd snapshotter
RUN mkdir -p /etc/docker \
 && printf '{\n  "features": {\n    "containerd-snapshotter": true\n  }\n}\n' > /etc/docker/daemon.json

RUN apt update && apt install vim -y

# Install Node.js (LTS)
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

COPY ./package.json /package.json

RUN npm i

COPY ./main.js /main.js

COPY ./start.sh /start.sh

RUN chmod +x start.sh

CMD ["./start.sh"]
