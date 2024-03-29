FROM node:16-alpine
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ ./.yarn/
RUN yarn install
COPY tsconfig.json tsconfig.json
COPY @types @types
COPY src src
COPY views views
RUN yarn run build
RUN rm -r src @types tsconfig.json
COPY .env ./ 

CMD ["yarn", "start"]