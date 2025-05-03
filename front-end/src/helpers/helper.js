export const getUserIdLocal = () => {
    let authUser = JSON.parse(localStorage.getItem('authUser'));
    if (authUser) {
        return authUser.user._id;
    }
}