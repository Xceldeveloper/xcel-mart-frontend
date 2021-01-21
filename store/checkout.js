export const state = () => ({
  price:{
      order:0,
      shipping:0,
      total:0
  },

  items:[],

  token:0
});

export const mutations = {
  setCheckoutPrice(state,price){
     state.price.order = price.order;
     state.price.shipping = price.shipping;
     state.price.total = price.total
  },

  emptyCheckoutPrice(state){
    state.price.order = 0;
    state.price.shipping = 0;
    state.price.total = 0
  },

  setCheckoutItems(state,items){
    state.items = items
  },
  emptyCheckoutItems(state){
    state.items = []
  },

  setCheckoutToken(state,token){
      state.token = token
  },

  deleteCheckoutToken(state){
      state.token = 0
  }
}