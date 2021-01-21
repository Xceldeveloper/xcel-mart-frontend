<template>
  <div v-if="CANRENDER">
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
    <v-toolbar :color="Colors.accent" height="50" dense dark>
      <v-btn icon @click="navBack" v-if="!isPlacingOrder">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-toolbar-title>Checkout</v-toolbar-title>
    </v-toolbar>

    <v-stepper :value="current" :color="Colors.accent" :alt-labels="isMobile ? false : true">
      <v-stepper-header>
        <v-stepper-step step="1">Shipping</v-stepper-step>
        <v-divider :color="Colors.accent"></v-divider>
        <v-stepper-step step="2">Payment</v-stepper-step>
        <v-divider :color="Colors.accent"></v-divider>
        <v-stepper-step step="3">Success</v-stepper-step>
      </v-stepper-header>
      <v-stepper-content step="1">
        <v-card elevation="0" height="74.5vh" width="100vw">
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-btn
              dark
              rounded
              :color="Colors.accent"
              @click="shippingDialog = true"
            >Add Shipping Information</v-btn>
          </v-row>
        </v-card>
        <shippinginformation
          @cancel="shippingDialog = false"
          :canShow="shippingDialog"
          :shippingDetails="shippingInformation"
          :paymentInformation="CHECKOUT.paymentInformation"
          @shipping="getShippingInfo"
          @priceChange="newPrice"
        />
      </v-stepper-content>
      <v-stepper-content step="2">
        <v-card elevation="0" height="74.5vh" width="100vw">
          <v-row class="fill-height" align="center" justify="center">
            <v-card elevation="0" justify="center" align="center">
              <payment
                @success="callback"
                @aborted="close"
                :transactionDetails="{customer_name:getCustomer.fullname,transaction_id:CHECKOUT.token,customer_email:shippingInformation.email,transaction_amount:CHECKOUT.paymentInformation.total}"
              />
              <br />
              <v-btn :color="Colors.accent" @click="PLACE_ORDER(false)" text>Cash on Delivery</v-btn>
              <br />
              <br />
              <br />
              <br />
              <v-btn
                small
                dark
                outlined
                :color="Colors.accent"
                rounded
                @click="current = 1"
              >Edit shipping info</v-btn>
            </v-card>
          </v-row>
        </v-card>
      </v-stepper-content>
      <v-stepper-content step="3">
        <v-card elevation="0" height="74.5vh" width="100vw" v-if="!isPlacingOrder">
          <v-row class="fill-height" align="center" justify="center">
            <v-card width="100%" elevation="0">
              <span id="delivery-msg">
                <b>Thank You {{getCustomer.fullname}}</b>
                <br />Your Order is been Processed
              </span>
              <span id="van">
                <v-icon size="100" :color="Colors.accent">mdi-truck-fast-outline</v-icon>
              </span>
              <br />
              <span id="van">
                <v-btn :color="Colors.accent" outlined to="/">Home</v-btn>
              </span>
            </v-card>
          </v-row>
        </v-card>
        <v-card elevation="0" height="74.5vh" width="100vw" v-if="isPlacingOrder">
          <v-row class="fill-height ma-0" align="center" justify="center" v-if="isPlacingOrder">
            <v-progress-circular indeterminate size="50" :color="Colors.accent"></v-progress-circular>
          </v-row>
        </v-card>
      </v-stepper-content>
    </v-stepper>

    <v-snackbar v-model="snackbarMedia" :timeout="snackBarDurr">{{snackbarMessage}}</v-snackbar>
  </div>
</template>

<script>
import app_mixin from '~/mixins/app_mixin.js'
import device_mixin from '~/mixins/device_mixin.js'
import payment from '~/components/utils/payment.vue'
import utils_mixin from '~/mixins/utils_mixin.js'
import navigation_mixin from '~/mixins/navigation_mixin.js'
import shippinginformation from '~/components/utils/shippinginformation.vue'
import user_mixin from '~/mixins/user_mixin.js'
export default {
  name: 'user-checkout-id',
  mixins: [device_mixin, utils_mixin, navigation_mixin, user_mixin, app_mixin],
  components: {
    payment,
    shippinginformation
  },
  data() {
    return {
      CANRENDER: false,
      isPlacingOrder: false,
      current: 1,
      shippingInformation: {
        name: '',
        email: '',
        phone: '',
        address: '',
        country: '',
        state: '',
        town: '',
        gpsLocation: {
          longitude: '',
          latitude: ''
        }
      },
      orderStatusDialog: false,
      shippingDialog: false,

      snackbarMedia: false,
      snackbarMessage: '',
      snackBarDurr: 3000
    }
  },
  mounted() {
    this.CANRENDER = false
    if (
      this.isTransporterSignedIn ||
      this.isCutomerSignedIn ||
      this.isAdminSignedIn
    ) {
      if (this.isTransporterSignedIn) {
        this.openNewPage('/transporter', false)
        return
      } else if (this.isAdminSignedIn) {
        this.openNewPage('/admin', false)
        return
      }
    } else {
      this.openNewPage('/gateway', false)
      return
    }

    if (this.$route.params.id == this.CHECKOUT.token) {
      //check route param id is same with token
      this.cacheInLocalStorage() //save transaction to local storage incase of refresh of page by user
      this.CANRENDER = true
    } else {
      this.getCached() // vuex token is empty due to refresh or something else so we check local storeg for previously stored one
    }

    let shippingInfo = {
      name: this.getCustomer.fullname,
      email: this.getCustomer.email,
      phone: this.getCustomer.phone,
      address: '',
      country: this.getCustomer.country,
      state: this.getCustomer.state,
      town: this.getCustomer.town,
      gpsLocation: {
        longitude: 50,
        latitude: 300
      }
    }

    this.setShippingInfo(shippingInfo)
  },
  methods: {
    // details from user shipping info
    setShippingInfo(info) {
      this.shippingInformation.name = info.name
      this.shippingInformation.email = info.email
      this.shippingInformation.phone = info.phone
      this.shippingInformation.address = info.address
      this.shippingInformation.country = info.country
      this.shippingInformation.state = info.state
      this.shippingInformation.town = info.town
      this.shippingInformation.gpsLocation.longitude =
        info.gpsLocation.longitude
      this.shippingInformation.gpsLocation.latitude = info.gpsLocation.latitude
    },
    getShippingInfo(result) {
      // get shipping info from shipping component incase of chaneg
      this.shippingDialog = false
      this.current = 2

      this.setShippingInfo(result)
    },

    PLACE_ORDER(isOnlinePayment) {
      //place the order in db
      this.current = 3
      this.isPlacingOrder = true
      setTimeout(() => {
        this.isPlacingOrder = false

        //clear checkout temporary storage && vuex store
        localStorage.removeItem('CHECKOUT')
        this.$store.commit('checkout/deleteCheckoutToken')
        this.$store.commit('checkout/emptyCheckoutPrice')
        this.$store.commit('checkout/emptyCheckoutItems')
      }, 3000)
    },

    cacheInLocalStorage() {
      //caching transaction
      let pp = {
        token: this.CHECKOUT.token,
        paymentInformation: this.CHECKOUT.paymentInformation,
        items: this.CHECKOUT.items
      }
      let xx = JSON.stringify(pp)
      localStorage.setItem('CHECKOUT', xx)
    },
    getCached() {
      //getting cached transaction
      var result = localStorage.getItem('CHECKOUT')
      var pp = null
      if (result !== null) {
        //if cache is not empty
        pp = JSON.parse(result)
        if (pp.token == this.$route.params.id) {
          //check if tokens are the same
          this.pushToCheckOut(pp.token, pp.paymentInformation, pp.items)
          this.CANRENDER = true
        } else {
          //if tokens are not the same abort transaction and goback to home page
          localStorage.removeItem('CHECKOUT')
          this.openNewPage('/', false)
        }
      } else {
        //cache is empty abort
        this.openNewPage('/', false)
      }
    },

    newPrice(price) {
      //new price from shipping component
      this.$store.commit('checkout/emptyCheckoutPrice')
      this.$store.commit('checkout/setCheckoutPrice', price)
      //re cache in db because of change of price
      this.cacheInLocalStorage()
    },

    pushToCheckOut(token, price, items) {
      //pushing transaction to vuex store for temporary storage
      this.$store.commit('checkout/deleteCheckoutToken')
      this.$store.commit('checkout/setCheckoutToken', token)

      this.$store.commit('checkout/emptyCheckoutPrice')
      this.$store.commit('checkout/setCheckoutPrice', price)

      this.$store.commit('checkout/emptyCheckoutItems')
      this.$store.commit('checkout/setCheckoutItems', items)
    },
    callback: function(response) {
      //payment succesful procced to place order
      this.PLACE_ORDER(true)
    },
    close: function() {},
    beforeLeavingPage(to, from, next, callback) {
      var callBackFunc = callback || function() {}
      if (this.shippingDialog || this.isPlacingOrder) {
        //prevent back btn press till all modals or bottom sheets are closed
        if (this.isPlacingOrder) {
          this.snackbarMedia = true
          this.snackbarMessage = 'Please wait'
          return
        }
        this.shippingDialog = false
        callBackFunc(false)
      } else {
        callBackFunc(true)
      }
    }
  },
  watch: {
    current(val) {
      if (val === 1) {
      } else if (val === 2) {
      } else if (val === 3) {
      }
    }
  },
  computed: {
    CHECKOUT() {
      return {
        //get checkout details from vuex storage
        paymentInformation: this.$store.state.checkout.price,
        items: this.$store.state.checkout.items,
        token: this.$store.state.checkout.token
      }
    }
  }
}
</script>

<style>
#delivery-msg {
  display: block;
  width: 100%;
  text-align: center;
}

#van {
  width: 100%;
  display: block;
  text-align: center;
}
</style>