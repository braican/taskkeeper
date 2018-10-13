export function toggleNewClientDrawer() {
    return {
        type: 'TOGGLE_NEW_CLIENT_DRAWER'
    };
}

export function toggleAuthenticatedUser(isAuth) {
    return {
        type: 'TOGGLE_AUTHENTICATED_USER',
        isAuth
    };
}
