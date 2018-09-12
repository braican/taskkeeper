Taskkeeper
==========

People should pay you, so you should know how much they owe you.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). Head to that repo for specifics around that. Some relevant documentation is included below, however.

## Getting started

1. Clone this repo into a directory. `cd` into that directory.
1. Run `yarn install` to install all the good stuff.
1. Run `yarn start` to star the server and watch all the files.


## Folder Structure

For the project to build, **these files must exist with exact filenames**:

* `public/index.html` is the page template;
* `src/index.js` is the JavaScript entry point.


## CSS

All of the CSS for this app exists inside the `src/style/sass` directory. The sass files are grouped in subdirectories and imported directly into the `src/style/style.scss` file.



## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](#deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.



## Changelog

**v1.1.1** `6/8/2018`  
* Setting up a deployment process via Travis.
* Adding a changelog to the readme.

**v1.1.0** `6/8/2018`
* Adding visual indicators for clients, and adding a new homepage.

**v1.0.0** `4/10/2018`
* Initial launch of the new and improved React version.

