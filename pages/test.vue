<template>
  <div id="itemContainer" v-cloak>
    <v-app-bar :color="Colors.accent" dense fixed width="100%" dark>
      <v-btn icon @click="navBack">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon to="/user/cart">
        <v-icon>mdi-cart</v-icon>
      </v-btn>

      <v-menu left bottom open-on-hover :close-on-click="false" :close-on-content-click="false">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-horizontal</v-icon>
          </v-btn>
        </template>
        <v-card :color="Colors.background" width="220px">
          <v-list-item link>
            <v-list-item-title :style="{color:Colors.subTextColor}">Home</v-list-item-title>
          </v-list-item>
          <v-list-item link>
            <v-list-item-title :style="{color:Colors.subTextColor}">Logout</v-list-item-title>
          </v-list-item>
          <v-list-item link>
            <v-list-item-title :style="{color:Colors.subTextColor}">About</v-list-item-title>
          </v-list-item>
          <v-list-item link>
            <v-list-item-title :style="{color:Colors.subTextColor}">Terms and Conditions</v-list-item-title>
          </v-list-item>
        </v-card>
      </v-menu>
    </v-app-bar>
    <div id="item-wrapper">
      <div id="item-imageCover">
        <v-responsive :aspect-ratio="1/1">
          <v-hover v-slot:default="{ hover }" close-delay="800">
            <imageviewpager
              @clicked="showFullScreen = true"
              :images="itemImages"
              :onHover="hover"
              :hideDelimiters="false"
              :restart="true"
            />
          </v-hover>
        </v-responsive>
      </div>

      <div id="item-details">
        <span id="item-title">{{itemTitle}}</span>

        <span id="item-price">&#8358;{{formatToCurrency(itemPrice)}}</span>

        <span id="item-specification" v-html="itemDescription"></span>

        <div id="buy-wrapper">
          <v-btn text :color="Colors.accent" width="38%" @click="prepareOrder(true)">Add to Cart</v-btn>
          <v-btn
            :color="Colors.accent"
            dark
            width="60%"
            @click="prepareOrder(false)"
            :style="{borderRadius:'0px'}"
          >Buy Now</v-btn>
        </div>
      </div>
    </div>

    <v-dialog v-model="showFullScreen" fullscreen>
      <v-app-bar color="rgba(0,0,0,0.3)" dark absolute v-if="float">
        <v-btn icon height="50px" @click="showFullScreen = !showFullScreen">
          <v-icon size="28px">mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <div id="fullscreen">
        <v-hover v-slot:default="{ hover }" close-delay="800">
          <imageviewpager
            @clicked="float = !float"
            :images="itemImages"
            :onHover="hover"
            :keyPressed="getKey"
            :restart="true"
          />
        </v-hover>
      </div>
    </v-dialog>
    <v-bottom-sheet inset v-model="prepareOrderDialog" max-width="500px">
      <div id="prepare-order-wrapper">
        <span id="prepare-order-title">Quantity</span>
        <v-slider
          :color="Colors.accent"
          :thumb-color="Colors.accent"
          v-model="quantity"
          light
          :min="itemMinQuantity"
          step="1"
          :max="itemMaxQuantity"
          thumb-label
        ></v-slider>
        <span
          v-if="quantity > 0"
          id="prepare-order-price"
        >&#8358;{{formatToCurrency(itemPrice*quantity)}}</span>
        <span v-if="quantity > 0" id="prepare-order-price">
          <span style="font-size:15px;font-weight:bold">Shipping</span>
          &#8358;{{formatToCurrency(shippingFee)}}
        </span>
        <span v-if="quantity > 0" id="prepare-order-price">
          <b>Estimated Total</b>
          &#8358;{{formatToCurrency(shippingFee+(itemPrice*quantity))}}
        </span>
        <v-btn :color="Colors.accent" dark rounded @click="PROCEED">proceed</v-btn>
      </div>
    </v-bottom-sheet>

    <v-snackbar v-model="addedToCartSnackBar" :timeout="2000">Item Added to Cart</v-snackbar>

    <v-snackbar v-model="signInSnackBar" :timeout="2000">
      You need to be Signed In
      <v-btn @click="gotoSignInPage" :color="Colors.accent" text>Sign In</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import app_mixin from '~/mixins/app_mixin.js'
import device_mixin from '~/mixins/device_mixin.js'
import user_mixin from '~/mixins/user_mixin.js'
import utils_mixin from '~/mixins/utils_mixin.js'
import navigation_mixin from '~/mixins/navigation_mixin.js'
import imageviewpager from '~/components/utils/imageviewpager.vue'
export default {
  mixins: [device_mixin, user_mixin, utils_mixin, navigation_mixin,app_mixin],
  components: {
    imageviewpager
  },
  data() {
    return {
     
      showFullScreen: false,
      addedToCartSnackBar: false,
      signInSnackBar: false,
      float: true,
      getKey: {},
      itemId: 3,
      itemTitle: 'Bagx of Waters',
      itemPrice: 300,
      itemDescription:
        ' ddhdhdhdd dhdhdhd <br> djdjdjd djdjd fhfhf <br> djdjd <br> djdjdjdj <br> hdhdhdd dhdhdhd <br> djdjdjd djdjd fhfhf <br> djdjd <br> djdjdjdj <br> hdhdhdd dhdhdhd <br> djdjdjd djdjd fhfhf <br> djdjd <br> djdjdjdj',
      itemMinQuantity: 50,
      itemMaxQuantity: 2000,
      itemImages: [
        {
         // src: require('~/static/drake.jpg')
        },
        {
          src: ''
        }
      ],
      prepareOrderDialog: false,
      addToCart: false,
      quantity: 0
    }
  },
  mounted() {
    this.itemId = this.$route.params.id
  },

  methods: {
    handButtonClick(e) {
      this.getKey = {
        time: Date.now(),
        key: e.key,
        code: e.code
      }
    },
    prepareOrder(shouldAdd) {
      this.addToCart = false
      this.quantity = this.itemMinQuantity
      this.prepareOrderDialog = true
      if (shouldAdd) {
        this.addToCart = true
      } else {
        this.addToCart = false
      }
    },

    gotoSignInPage() {
      this.$store.commit('routestack/removeStack')
      this.$router.replace('/gateway')
    },

    PROCEED() {
      this.prepareOrderDialog = false
      if (!this.isCutomerSignedIn) {
        this.signInSnackBar = true
        return
      }
      if (this.addToCart) {
        //add to cart

        let details = {
          id: this.itemId,
          quantity: this.quantity
        }

        this.addedToCartSnackBar = true
      } else {
        //proceed to checkout
        // let details = {
        //   id: this.itemId,
        //   quantity: this.quantity,
        //   price: this.itemPrice,
        //   totalPrice: this.itemPrice * this.quantity
        // }

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
        var token = theUnixTime

        let price = {
          order: this.itemPrice * this.quantity,
          shipping: this.shippingFee,
          total: this.shippingFee + this.itemPrice * this.quantity
        }

        let items = {
          id: this.itemId,
          quantity: this.quantity,
          price: this.itemPrice,
          totalPrice: this.itemPrice * this.quantity
        }

        this.pushToCheckOut(token, price, items)

        this.$router.push('/user/checkout/' + token)
        this.wasActivated.ignore = true
      }
    },

    pushToCheckOut(token, price, items) {
      this.$store.commit('checkout/deleteCheckoutToken')
      this.$store.commit('checkout/setCheckoutToken', token)

      this.$store.commit('checkout/emptyCheckoutPrice')
      this.$store.commit('checkout/setCheckoutPrice', price)

      this.$store.commit('checkout/emptyCheckoutItems')
      this.$store.commit('checkout/setCheckoutItems', items)
    }
  },
  computed: {
    shippingFee() {
      return this.quantity * 5
    }
  }
}
</script>

<style lang='scss' scoped>
#itemContainer {
  width: 100vw;
  height: 100vh;
  overflow: auto;

  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;

  -webkit-box-align: center;
  -moz-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;

  -webkit-box-pack: center;
  -moz-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
}

#fullscreen {
  width: 100%;
  height: 100%;
  background-color: #000000;
}

#prepare-order-wrapper {
  width: 98%;
  margin: auto;
  height: auto;
  background-color: #ffffff;
  padding: 5px;
  border-radius: 10px 10px 0px 0px;
  text-align: center;
}

#prepare-order-title {
  font-size: 21px;
  font-weight: bold;
  padding: 0px 12px 3px 12px;
}

#prepare-order-price {
  font-size: 18px;
  display: block;
  width: 100%;
  margin-bottom: 5px;
  padding: 0px 12px 3px 12px;
}

@media screen and (min-width: 767px) {
  #item-wrapper {
    width: 85%;
    height: auto;
    overflow: auto;
    box-shadow: 0px 1px 3px grey, -0px -0px 0px grey;
    display: flex;
  }

  #item-imageCover {
    width: 50%;
    height: auto;
  }

  #item-details {
    width: 100%;
    flex: 1;
    position: relative;
    padding: 10px;
    height: auto;
    overflow: auto;
    padding: 10px;
  }

  #item-title {
    font-size: 21px;
    width: 100%;
    display: block;
  }

  #item-price {
    font-weight: bold;
    width: 100%;
    display: block;
    font-size: 19px;
    padding: 5px 0px;
  }

  #buy-wrapper {
    width: 96%;
    position: absolute;
    bottom: 1px;
    background-color: #ffffff;
  }
  #item-specification {
    font-size: 16px;
    margin: 0px 0px 50px 0px;
    display: block;
  }
}

@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: portrait) {
  #item-imageCover {
    height: auto;
    width: 100%;
  }

  #item-wrapper {
    width: 100vw;
    height: calc(100vh - 48px);
    margin-top: 48px;
  }

  #item-details {
    width: 100%;
    height: auto;
    overflow: auto;
    padding: 10px;
  }

  #item-title {
    font-size: 21px;
    width: 100%;
    display: block;
  }

  #item-price {
    font-weight: bold;
    width: 100%;
    display: block;
    font-size: 19px;
    padding: 5px 0px;
  }

  #buy-wrapper {
    width: 100%;
    position: fixed;
    bottom: 1px;
    background-color: #ffffff;
  }

  #item-specification {
    font-size: 16px;
    margin: 0px 0px 50px 0px;
    display: block;
  }
}

@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {
  #item-wrapper {
    width: 100vw;
    height: calc(100% - 48px);
    margin-top: 48px;
    overflow: auto;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
  }

  #item-imageCover {
    width: calc(50% - 30px);
    flex: 1;
    height: auto;
    display: block;
  }

  #item-details {
    flex: 1;
    width: 50%;
    height: calc(100% - 48px);
    padding: 10px;
    overflow: auto;
    display: block;
  }

  #item-title {
    font-size: 21px;
    width: 100%;
    display: block;
  }

  #item-price {
    font-weight: bold;
    width: 100%;
    display: block;
    font-size: 19px;
    padding: 5px 0px;
  }

  #item-specification {
    font-size: 16px;
    margin: 0px 0px 50px 0px;
    display: block;
  }

  #buy-wrapper {
    width: 50%;
    position: fixed;
    bottom: 1px;
    right: 0px;
    background-color: #ffffff;
  }
}

// //for iphone X and others needs to come last or it would confilct with laptop screen*/
@media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: portrait) {
  #item-imageCover {
    height: auto;
    width: 100%;
  }
  #item-wrapper {
    width: 100vw;
    height: calc(100vh - 48px);
    margin-top: 48px;
  }
  #item-details {
    width: 100%;
    height: auto;
    overflow: auto;
    padding: 10px;
  }
  #item-title {
    font-size: 21px;
    width: 100%;
    display: block;
  }
  #item-price {
    font-weight: bold;
    width: 100%;
    display: block;
    font-size: 19px;
    padding: 5px 0px;
  }
  #buy-wrapper {
    width: 100%;
    position: fixed;
    bottom: 1px;
    background-color: #ffffff;
  }
  #item-specification {
    font-size: 16px;
    margin: 0px 0px 50px 0px;
    display: block;
  }
}

// //for iphone X and others needs to come last or it would confilct with laptop screen*/
@media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
  #item-wrapper {
    width: 100vw;
    height: calc(100% - 48px);
    margin-top: 48px;
    overflow: auto;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
  }
  #item-imageCover {
    width: calc(50% - 65px);
    height: auto;
    display: block;
  }

  #item-details {
    flex: 1;
    width: calc(50% - 50px);
    height: calc(100% - 48px);
    padding: 10px;
    overflow: auto;
    display: block;
  }
  #item-title {
    font-size: 21px;
    width: 100%;
    display: block;
  }
  #item-price {
    font-weight: bold;
    width: 100%;
    display: block;
    font-size: 19px;
    padding: 5px 0px;
  }

  #item-specification {
    font-size: 16px;
    margin: 0px 0px 50px 0px;
    display: block;
  }

  #buy-wrapper {
    width: 50%;
    position: fixed;
    bottom: 1px;
    right: 0px;
    background-color: #ffffff;
  }
}
</style>