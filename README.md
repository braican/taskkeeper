<p align="center">
  <a href="https://www.upstatement.com/">
    <img src="https://pbs.twimg.com/profile_images/704375735654477824/NHmbSXOe_400x400.jpg" width="60" alt="ups logo" />
  </a>
</p>
<h1 align="center">
  Ups Starter + Create React App
</h1>

Kick off your project with this boilerplate. This starter ships with the main dev dependencies you might need + [Create React App](https://github.com/facebook/create-react-app).

## 🚀 Quick Start

1.  **Ensure [NVM](https://github.com/creationix/nvm) is installed globally** (see [Ups Dev Env Setup](https://github.com/Upstatement/Upstatement/wiki/2018-Development-Environment-Setup))

    ```sh
    nvm -v
    ```

2.  **Ensure you're using the correct version of Node**

    ```sh
    nvm install
    ```

3.  **Install project dependencies**

    ```sh
    npm install
    ```

    or

    ```sh
    yarn
    ```

4.  **Start developing**

    ```sh
    npm start
    ```

    or

    ```sh
    yarn start
    ```

## 🧐 What's inside?

A quick look at the files included in this repo.

    .
    ├── docs/PULL_REQUEST_TEMPLATE.md
    ├── .editorconfig
    ├── .eslintrc
    ├── .gitignore
    ├── .nvmrc
    ├── README.md
    ├── package-lock.json
    ├── package.json
    └── prettier.config.js

1.  **`docs/PULL_REQUEST_TEMPLATE.md`**: A markdown file for a custom [pull request template](https://help.github.com/articles/about-issue-and-pull-request-templates/#pull-request-templates) which will automatically populate the body of a pull request in this repo. This helps enforce descriptive and thoughtful pull requests.

2.  **`.editorconfig`**: This file helps developers define and maintain consistent coding styles between different editors and IDEs.

3.  **`.eslintrc`**: This is a configuration file for [ESLint](https://eslint.org/), a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code, with the goal of making code more consistent and avoiding bugs. This file extends Upstatement's [default ESLint config](https://github.com/Upstatement/eslint-config).

4.  **`.gitignore`**: This file tells git which files it should not track / not maintain a version history for.

5.  **`README.md`**: A markdown file containing useful reference information about your project.

6.  **`package-lock.json`** (See `package.json` below, first). This is an automatically generated file based on the exact versions of your npm dependencies that were installed for your project. (You won’t change this file directly).

7.  **`package.json`**: A manifest file for Node.js projects, which includes things like metadata (the project’s name, author, etc). This manifest is how npm knows which packages to install for your project.

8.  **`prettier.config.js`**: This is a configuration file for a tool called [Prettier](https://prettier.io/), which is a tool to help keep the formatting of your code consistent. This file extends Upstatement's [default Prettier config](https://github.com/Upstatement/prettier-config).

## 🛠 Linting & Precommit Hooks

A few linting tools already baked into this starter repo:

1.  [`@upstatement/eslint-config`](https://github.com/Upstatement/eslint-config): Upstatement's default ESLint config

2.  [`@upstatement/prettier-config`](https://github.com/Upstatement/prettier-config): Upstatement's default Prettier config

3.  [`husky`](https://github.com/typicode/husky): Git hooks made easy

4.  [`pretty-quick`](https://github.com/azz/pretty-quick): Runs Prettier on your changed files

5.  [`lint-staged`](https://github.com/okonet/lint-staged): Runs ESLint on your staged git files
