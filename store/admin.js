export const state = () => ({
  id: 1,
  fullname: '',
  email: '',
  phone: '',
  level: -1,

  isLoggedIn: false

});

export const mutations = {
  signInAdmin(state, details) {
    if (details !== null)
      state.id = details.id
    state.fullname = details.fullname
    state.email = details.email
    state.phone = details.phone
    state.level = details.level
    state.isLoggedIn = true
  },
  editAdminProfile(state, details) {
    state.fullname = details.fullname
    state.email = details.email
    state.phone = details.phone
  },
  logoutAdmin(state) {
    state.id = null;
    state.fullname = '';
    state.email = '';
    state.phone = '';
    state.level = -1;
    state.isLoggedIn = false;
  }
}
