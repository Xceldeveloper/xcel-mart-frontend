<template>
  <div id="cart-container" v-cloak v-if="CANRENDER">
    <style>
   :root{
    --accent-color:{{Colors.accent}};
      --text-color:{{Colors.text}};
       --subtext-color:{{Colors.subTextColor}};
      --inverttext-color:{{Colors.invertTextColor}};
      --background-color:{{Colors.background}};
      --texture-color:{{Colors.textTure}};
       --shadow-color:{{Colors.shadowColor}};
  }
    </style>
    <v-app-bar :color="Colors.accent" dark dense fixed width="100%">
      <v-btn icon @click="navBack">
        <v-icon color="#ffffff">mdi-chevron-left</v-icon>
      </v-btn>
      <v-toolbar-title class="mr-12 align-center" color="#ffffff">Cart</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu left bottom open-on-hover :close-on-click="true" :close-on-content-click="true">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon color="#ffffff">mdi-dots-horizontal</v-icon>
          </v-btn>
        </template>
        <v-card :color="Colors.background" width="220px">
          <v-list-item link to="/">
            <v-list-item-title :style="{color:Colors.subTextColor}">Home</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/faqs">
            <v-list-item-title :style="{color:Colors.subTextColor}">FAQs</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/termsandconditions">
            <v-list-item-title :style="{color:Colors.subTextColor}">Terms and Conditions</v-list-item-title>
          </v-list-item>
        </v-card>
      </v-menu>
    </v-app-bar>
    <div id="cart-wrapper">
      <div id="more-info" v-if="cartItems.length > 0 && !loading && !errorLoading">
        <span id="total">
          Total:
          <span :style="{color:Colors.accent}">
            <b>&#8358;{{formatToCurrency(totalPrice)}}</b>
          </span>
        </span>
        <span id="delivery-fee">Delivery Fee: &#8358;{{formatToCurrency(shippingCost)}}</span>
      </div>
      <div id="cart-box" v-if="!loading && !errorLoading && cartItems.length > 0">
        <div id="cart-item-container" v-for="(item, index) in cartItems" :key="index">
          <div id="img-wrapper" @click="openItem(item.id)">
            <v-img
              :src="item.image"
              class="grey lighten-2"
              width="115"
              :aspect-ratio="1/1"
              :style="{borderRadius:'5px 0px 0px 5px'}"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate :color="Colors.accent"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </div>
          <div id="cart-item-details">
            <span id="item-title" @click="openItem(item.id)">{{item.name}}</span>
            <span id="item-price" @click="openItem(item.id)">&#8358;{{formatToCurrency(item.price)}}</span>
            <span id="item-total" @click="openItem(item.id)">
              <span :style="{color:Colors.accent,fontWeight:'bold'}">Total</span>
              :&#8358;{{formatToCurrency(item.price * item.quantity)}}
            </span>
            <div id="edit-numbers">
              <v-btn
                :color="Colors.accent"
                fab
                height="21px"
                width="21px"
                elevation="1"
                @click="item.min < item.quantity ? item.quantity-- : item.min"
              >
                <v-icon color="#ffffff">mdi-minus</v-icon>
              </v-btn>
              <input
                id="nmb"
                type="number"
                v-model="item.quantity"
                @blur="item.quantity < item.min ? item.quantity = item.min : ''"
              />
              <v-btn
                :color="Colors.accent"
                fab
                height="21px"
                width="21px"
                elevation="1"
                @click="item.quantity++"
              >
                <v-icon color="#ffffff">mdi-plus</v-icon>
              </v-btn>
            </div>
            <div id="action-btns">
              <button v-if="!item.later" @click="saveForLater(index)">save for later</button>
              <button v-if="item.later" @click="purChaseNow(index)">purchase now</button>
              |
              <button @click="removeFromCart(index)">remove</button>
            </div>
          </div>
        </div>
      </div>

      <div id="checkout-btn" v-if="!loading && totalNumberOfitems > 0">
        <v-btn @click="CHECKOUT" :color="Colors.accent" dark width="80%" max-width="400">Checkout</v-btn>
      </div>

      <v-row class="fill-height ma-0" align="center" justify="center" v-if="loading">
        <v-progress-circular indeterminate size="50" :color="Colors.accent"></v-progress-circular>
      </v-row>
      <v-row
        class="fill-height ma-0"
        align="center"
        justify="center"
        v-if="cartItems.length === 0 && !loading && !errorLoading "
      >No items in your Cart</v-row>

      <v-row class="fill-height ma-0" align="center" justify="center" v-if="errorLoading">
        <v-card elevation="0" justify="center" align="center">
          <v-card-text>
            Error Loading..
            <br />Please check your network connection
            <br />
          </v-card-text>
          <v-btn @click="getItemsInCart" :color="Colors.accent" dark rounded small outlined>Retry</v-btn>
        </v-card>
      </v-row>
    </div>

    <v-snackbar v-model="canRemoveFromCartDialog" :timeout="3000">
      Item removed from cart
      <v-btn text dark @click.native="undoRemove = true">Undo</v-btn>
    </v-snackbar>

    <installer />
  </div>
</template>

<script>
import app_mixin from '~/mixins/app_mixin.js'
import device_mixin from '~/mixins/device_mixin.js'
import utils_mixin from '~/mixins/utils_mixin.js'
import navigation_mixin from '~/mixins/navigation_mixin.js'
import user_mixin from '~/mixins/user_mixin.js'
import installer from '~/components/utils/installer.vue'
export default {
  components: {
    installer
  },
  mixins: [device_mixin, utils_mixin, navigation_mixin, user_mixin, app_mixin],
  data() {
    return {
      CANRENDER: false,
      loading: false,
      errorLoading: false,
      cartItems: [],
      canRemoveFromCartDialog: false,
      undoRemove: false,
      tempRemoveHolder: null,
      deleIndex: null
    }
  },
  created() {},
  mounted() {
    this.CANRENDER = false
    if (
      this.isTransporterSignedIn ||
      this.isCutomerSignedIn ||
      this.isAdminSignedIn
    ) {
      if (this.isTransporterSignedIn) {
        this.openNewPage('/transporter', false, true)
        return
      } else if (this.isAdminSignedIn) {
        this.openNewPage('/admin', false, true)
        return
      }
    } else {
      this.openNewPage('/gateway', false, true)
      return
    }
    this.CANRENDER = true
    this.getItemsInCart()
  },
  methods: {
    openItem(id) {
      this.openNewPage('/user/item/' + id, true)
    },
    getItemsInCart() {
      if (this.isCutomerSignedIn) {
        //show loader
        this.loading = true

        //get cart items for customer from db
        this.cartItems = []
        //hide loader
        this.loading = false
      }
    },
    CHECKOUT() {
      Date.prototype.getUnixTime = function() {
        return (this.getTime() / 1000) | 0
      }
      if (!Date.now)
        Date.now = function() {
          return new Date()
        }
      Date.time = function() {
        return Date.now().getUnixTime()
      }
      var someDate = new Date()
      var theUnixTime = someDate.getUnixTime()
      var token = theUnixTime + '' + this.getCustomer.id //timestamp plus user id

      //sort items that are ready to be purchsed now from the later key
      var items = this.cartItems.filter((e) => {
        return !e.later
      })

      //re arrange details for the ready ones
      var rearrangedItems = []
      for (var i = 0; i < items.length; i++) {
        rearrangedItems.push({
          id: items[i].id,
          quantity: items[i].quantity,
          price: items[i].price,
          totalPrice: items[i].price * items[i].quantity
        })
      }

      let price = {
        order: this.totalPrice,
        shipping: this.shippingCost,
        total: this.totalPrice + this.shippingCost
      }

      this.pushToCheckOut(token, price, rearrangedItems)
      this.$router.push('/user/checkout/' + token)
    },

    saveForLater(index) {
      this.cartItems[index].later = true
    },
    purChaseNow(index) {
      this.cartItems[index].later = false
    },
    removeFromCart(index) {
      this.undoRemove = false
      this.tempRemoveHolder = null
      this.deleIndex = index
      this.tempRemoveHolder = this.cartItems[index] //push to temp holder
      this.cartItems.splice(index, 1) // remove from view
      this.canRemoveFromCartDialog = true //show snackbar warning
      setTimeout(() => {
        ///we have to wait if user bring it back
        if (!this.undoRemove) {
          ////confirme delete
        }
        this.undoRemove = false
        this.canRemoveFromCartDialog = false
        this.tempRemoveHolder = null
      }, 4000)
    },
    pushToCheckOut(token, price, items) {
      this.$store.commit('checkout/deleteCheckoutToken')
      this.$store.commit('checkout/setCheckoutToken', token)

      this.$store.commit('checkout/emptyCheckoutPrice')
      this.$store.commit('checkout/setCheckoutPrice', price)

      this.$store.commit('checkout/emptyCheckoutItems')
      this.$store.commit('checkout/setCheckoutItems', items)
    },
    sumArray(arr) {
      let sum = 0
      for (var i = 0; i < arr.length; i++) {
        sum += arr[i]
      }
      return sum
    }
  },
  computed: {
    shippingCost() {
      return 3000
    },
    totalPrice() {
      var items = this.cartItems.filter((e) => {
        return !e.later
      })
      var arr = []

      for (var i = 0; i < items.length; i++) {
        arr.push(items[i].price * items[i].quantity)
      }
      return this.sumArray(arr)
    },
    totalNumberOfitems() {
      var items = this.cartItems.filter((e) => {
        return !e.later
      })
      var arr = []
      for (var i = 0; i < items.length; i++) {
        arr.push(items[i].quantity)
      }
      return this.sumArray(arr)
    }
  },
  watch: {
    undoRemove(val) {
      if (val) {
        this.canRemoveFromCartDialog = false
        this.cartItems.splice(this.deleIndex, 0, this.tempRemoveHolder)
        this.undoRemove = false
        this.tempRemoveHolder = null
      }
    }
  }
}
</script>

<style lang="scss"scoped>
#cart-container {
  width: 100%;
  height: 100%;
  display: flex;
}

#cart-wrapper {
  margin-top: 48px;
  width: 100%;
  padding: 0px;
  height: calc(100vh - 48px);
}

#more-info {
  width: 100%;
  height: auto;
  padding: 10px;
  box-shadow: 0px 1px 3px var(--shadow-color), -0px -0px 0px var(--shadow-color);
}

#more-info #total,
#devilvery-fee {
  width: 100%;
  display: block;
  font-size: 18px;
}

#cart-box {
  width: 100%;
  height: auto;
  margin-bottom: 60px;
}

#cart-item-container {
  width: 95%;
  max-width: 550px;
  height: auto;
  margin: 5px auto 5px auto;
  border-radius: 5px;
  box-shadow: 0px 1px 3px var(--shadow-color), -0px -0px 0px var(--shadow-color);
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  overflow: hidden;
  position: relative;
}

#cart-item-details {
  height: auto;
  width: auto;
  flex: 1;
  margin-left: 3px;
}

#item-title {
  font-size: 15px;
  padding: 2px;
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#item-price {
  display: block;
  width: 100%;
  font-size: 14px;
  padding-left: 5px;
}

#item-total {
  width: auto;
  font-size: 15px;
  padding-left: 2px;
}

#edit-numbers {
  padding-left: 2px;
}

#nmb {
  text-align: center;
  width: auto;
  max-width: 35px;
  outline-style: none;
  font-size: 15px;
  margin: none;
  padding: none;
}

#action-btns {
  width: auto;
  font-size: 13px;
  margin-top: 0px;
}
#action-btns button {
  color: var(--accent-color);
  outline-style: none;
  cursor: pointer;
}

#checkout-btn {
  width: 100%;
  text-align: center;
  position: fixed;
  bottom: 0px;
  padding: 5px;
  background-color: #ffffff;
}
</style>