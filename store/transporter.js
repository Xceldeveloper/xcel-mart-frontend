export const state = () => ({
    id: 1,
    fullname: '',
    email: '',
    phone: '',

    isLoggedIn: false

});

export const mutations = {
    signInTransporter(state, details) {
        if (details !== null)
            state.id = details.id
        state.fullname = details.fullname
        state.email = details.email
        state.phone = details.phone
        state.isLoggedIn = true
    },
    editTransporterProfile(state, details) {
        state.fullname = details.fullname
        state.email = details.email
        state.phone = details.phone
    },
    logOutTransporter(state) {
        state.id = null;
        state.fullname = '';
        state.email = '';
        state.phone = '';
        state.isLoggedIn = false;
    }
}