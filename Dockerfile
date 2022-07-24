FROM node:14.15.4-slim

RUN apt update && apt install -y --no-install-recommends \
    git \
    ca-certificates

# container user - root
# Mínimo privilégio

USER node

WORKDIR /home/node/app

CMD [ "sh", "-c", "yarn && tail -f /dev/null" ]