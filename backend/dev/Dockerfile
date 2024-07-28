FROM alpine:3.15

COPY ./dev /scripts
RUN apk --no-cache add postgresql12-client

ENV PGDATABASE=auth_dev
ENV PGHOST=host.docker.internal
ENV PGPORT=5432
ENV PGUSER=testuser
ENV PGPASSWORD=testpass

ENTRYPOINT psql -h host.docker.internal -f ./scripts/seed.sql