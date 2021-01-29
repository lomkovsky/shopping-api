# To run project locally first start local mongodb service
```
mongodb://localhost:27017
```

## Install dependency

```bash
$ npm install
```

## .env.development
```
API_PORT=7777
API_ADDRESS=localhost
MONGODB=mongodb://localhost:27017/shopping-api
JWT_SECRET=JWT-SECRET
JWT_REFRESH_SECRET=JWT-REFRESH-SECRET
```
## .env.test
```
API_PORT=7777
API_ADDRESS=localhost
MONGODB=mongodb://localhost:27017/shopping-api-test
JWT_SECRET=JWT-SECRET
JWT_REFRESH_SECRET=JWT-REFRESH-SECRET
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# build project
$ npm run build

# remove old build
$ npm run prebuild

# production mode
$ npm run start:prod
```

## Test

```bash

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
