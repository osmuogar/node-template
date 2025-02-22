# Node-template

## Table of contents.

- [node-template](#node-template)
  - [Table of contents.](#table-of-contents)
  - [1. Documentation](#1-documentation)
    - [1.2 Directories.](#12-directories)
  - [2. Dependencies.](#2-dependencies)
  - [3. Execution.](#3-execution)
  - [4. Development.](#4-development)
    - [4.1 Development execution.](#41-development-execution)
    - [4.2 Linting.](#42-linting)
  - [5. Testing.](#5-testing)
    - [5.1. Code coverage.](#51-code-coverage)

## 1. Documentation

Run `npm run doc` to generate the documentation at `/doc`.

### 1.2 Directories.

* config: configuration example.
* src: source files.
* test: test files.

## 2. Dependencies.

* node.js: See package.json node version
* npm: See package.json npm version

## 3. Execution.

- Install dependencies with `npm install`.
- Transpile the project to JavaScript with `npm run build`.
- Execute the project with `npm start`.

## 4. Development.

### 4.1 Development execution

Run `npm run start-dev`.

### 4.2 Linting.

Run `npm run lint`.

## 5. Testing.

Depending on the amount of tests you want to execute:
- All tests `npm test`.
- E2e tests `npm run test-e2e`.
- Unit tests `npm run test-unit`.

### 5.1. Code coverage.

Run `npm run coverage`.
