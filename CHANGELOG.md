# Taskkeeper Changelog

**2.1.2** `7/24/2019`

- Fixes a bug where fixed-price tasks were returning `NaN`. ([#46](https://github.com/braican/taskkeeper/pull/46))
- Add Google Analytics.
- Fixes an error originating from upgrading react-redux-firebase to version 3.0.0-alpha.13 where the `firebase` prop was reserved and conflicting with other internals. Probably related to [this issue](https://github.com/prescottprue/react-redux-firebase/issues/700) in the react-redux-firebase project.

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
