export const state = () => ({
      id:1,
      fullname:'',
      email:'',
      phone:'',
      country:'',
      country_id:'',
      state:'',
      state_id:'',
      town:'',
      town_id:'',
     
      isLoggedIn:false

  });
  
  export const mutations = {
      signInUser(state,details){
          if(details !== null)
          state.id = details.id
          state.fullname = details.fullname
          state.email = details.email
          state.phone = details.phone
          state.country = details.country
          state.country_id = details.country_id
          state.state = details.state,
          state.state_id = details.state_id
          state.town = details.town
          state.town_id = details.town_id
          state.isLoggedIn = true
      },
      editUserProfile(state,details){
        state.fullname = details.fullname
        state.email = details.email
        state.phone = details.phone,
        state.country = details.country
        state.country_id = details.country_id
        state.state = details.state
        state.state_id = details.state_id
        state.town = details.town
        state.town_id = details.town_id
      },
      logoutCustomer(state){
        state.id = null;
        state.fullname =  '';
        state.email = '';
        state.phone = '';
        state.country = '';
        state.country_id = '';
        state.state = '';
        state.state_id = '';
        state.town = '';
        state.town_id = '';
        state.isLoggedIn = false;
        state.isShippingDetails = false
      }
  }