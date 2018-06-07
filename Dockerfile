FROM alpine:3.7 as builder

RUN apk add --update \
    git \
    python \
    make \
    g++ \
    bash \
    nodejs

COPY . /app

WORKDIR /app

ENV ORBITDB_PREFIX="forus.kindpakket." ORBITDB_DIR="/data/orbitdb" IPFS_REPO_DIR="/data/ipfs"

RUN npm install


FROM alpine:3.7

RUN apk add --update \
    nodejs

COPY --from=builder /app /app

EXPOSE 80

RUN mkdir /data
VOLUME [ "/data" ]

CMD ["node", "/app/index.js"]
