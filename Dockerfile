
ARG NODE_VERSION=18.18-alpine3.18


#### Base image ####
FROM node:${NODE_VERSION} AS base

WORKDIR /usr/src/app

RUN apk add --no-cache \
  curl

ARG USER_ID=1000
ARG USER_NAME=node

RUN chown -R ${USER_NAME}: /usr/src/app

# Note: not working with UTC may cause unwanted side effects!
ENV TZ=Europe/Madrid
ENV NODE_ICU_DATA=node_modules/full-icu


#### Development image ####
FROM base AS development

ENV PATH="${PATH}:/usr/src/app/node_modules/.bin"
ENV PROMPT="%B%F{cyan}%n%f@%m:%F{yellow}%~%f %F{%(?.green.red[%?] )}>%f %b"

RUN apk add --no-cache \
  build-base \
  curl \
  python3 \
  zsh

RUN if [ ${USER_ID} -ne 1000 ]; then \
  apk add --no-cache -t volatile \
  shadow \
  && groupmod -g ${USER_ID} ${USER_NAME} \
  && usermod -u ${USER_ID} -g ${USER_ID} ${USER_NAME} \
  && apk del --purge volatile; \
  fi

USER ${USER_NAME}


#### Runtime image ####
FROM base AS runtime

USER ${USER_NAME}

COPY package*.json ./

RUN --mount=type=secret,id=npmrc,target=/usr/src/app/.npmrc,uid=${USER_ID} npm ci

COPY . .

ENV NODE_ENV=production

CMD ["node", "index.js"]
