FROM node:14.15.0-alpine

ENV APP_DIR /app/

WORKDIR ${APP_DIR}

COPY . ${APP_DIR}

RUN yarn install

RUN yarn build

ENV HOST 0.0.0.0

EXPOSE 80

CMD ["yarn", "start","--port=80"]