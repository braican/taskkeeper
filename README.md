# Taskkeeper

[taskkeeper.braican.com](https://taskkeeper.braican.com/)

People should pay you, so you should know how much they owe you.

## Getting started

1. Clone this repo into a directory. `cd` into that directory.
1. Run `nvm install` to make sure we're using the right version of node.
1. Run `yarn install` to install all the good stuff.
1. Run `yarn start` to star the server and watch all the files.

## Styles

Global styles exist in the `src/styles` directory. Component-specific styles exist within their component directory.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

### `yarn run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](#deployment) for more information.

## Changelog

**2.1.1** `7/24/2019`

- Fixes a bug where task hours wouldn't allow fractional numbers.

**2.1.0** `7/16/2019`

- Adds a better login page.
- Introduces a new dashboard for quick access to open tasks and invoices.
- Adds indicators to client nav to indicate open tasks and invoices.
- Various style tweaks.
- Updates node dependencies to fix security vulnerabilities.

**2.0.1** `4/15/2019`

- Fixes bug with pathing on built applications. ([#9](https://github.com/braican/taskkeeper/issues/9))

### 2.0.0 `4/12/2019`

- Full rewrite of the application using React 16.8.
- Introduces Redux for global state management.
- Uses Firestore for database storage.
- Adds user authentication, handled by Firebase.
- Sets up hosting on Firebase.
- Various experience updates, including a new flow for tasks and additional stored information.

**1.1.1** `6/8/2018`

- Setting up a deployment process via Travis.
- Adding a changelog to the readme.

**1.1.0** `6/8/2018`

- Adding visual indicators for clients, and adding a new homepage.

### 1.0.0 `4/10/2018`

- Initial launch of the new and improved React version.
