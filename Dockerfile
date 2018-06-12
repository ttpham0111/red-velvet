FROM alpine:latest

ARG user=red-velvet
ARG group=red-velvet

RUN addgroup $user && \
    adduser -D -G $group -s /sbin/nologin $user

ADD requirements.txt /tmp/requirements.txt

RUN apk add \
        --update \
        --no-cache \
            gcc \
            make \
            musl-dev \
            python3-dev \
            python3 && \
    pip3 install -r /tmp/requirements.txt && \
    apk del gcc \
            make \
            musl-dev \
            python3-dev

ADD . /tmp/red-velvet
RUN pip3 install /tmp/red-velvet

USER $user

ENTRYPOINT red-velvet