FROM node:16-alpine
WORKDIR /usr/app
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ ./.yarn/
RUN yarn install
COPY tsconfig.json tsconfig.json
COPY typings typings
COPY src src
RUN yarn run build
RUN rm -r src typings tsconfig.json
COPY .env ./ 

CMD ["yarn", "start"]