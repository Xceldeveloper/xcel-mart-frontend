<template>
  <div id="itemContainer" v-cloak v-if="CANRENDER">
    <v-app-bar :color="Colors.accent" dense fixed width="100%" dark>
      <v-btn icon @click="navBack">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon @click="deleteItemDialog = true">
        <v-icon>mdi-trash-can-outline</v-icon>
      </v-btn>
    </v-app-bar>
    <div id="item-wrapper" v-if="!isloading && !errorLoading">
      <div id="item-imageCover">
        <v-responsive :aspect-ratio="1 / 1">
          <v-hover v-slot:default="{ hover }" close-delay="800">
            <imageviewpager
              @clicked="showFullScreen = true"
              :images="item.images"
              :onHover="hover"
              :hideDelimiters="false"
              :restart="true"
            />
          </v-hover>
        </v-responsive>
      </div>

      <div id="item-details">
        <span id="item-title">{{ item.title }}</span>

        <span id="item-price" v-if="item.price != ''"
          >&#8358;{{ formatToCurrency(item.price) }}</span
        >
        <span id="item-orders-count" v-if="item.order_count > 0">
          <v-btn :color="Colors.accent" dark elevation="1">
            <v-icon size="20" left>mdi-clipboard-text-outline</v-icon>
            {{ formatToCurrency(item.order_count) }}
          </v-btn>
        </span>
        <span id="item-orders-count" v-if="item.cart_count > 0">
          <v-btn :color="Colors.accent" dark elevation="1">
            <v-icon size="20" left>mdi-cart-outline</v-icon>
            {{ formatToCurrency(item.cart_count) }}
          </v-btn>
        </span>
        <span id="order-limit">
          <v-btn small outlined :color="Colors.accent">
            <v-icon left>mdi-sort-ascending</v-icon>
            {{ item.min_quantity }}
          </v-btn>
          <v-btn small outlined :color="Colors.accent">
            <v-icon left>mdi-sort-descending</v-icon>
            {{ item.max_quantity }}
          </v-btn>
        </span>
        <span id="item-specification" v-html="itemFormatedDescription"></span>

        <div id="buy-wrapper">
          <v-btn
            :color="Colors.accent"
            dark
            width="80%"
            @click="openNewPage('/admin/edititem/' + item.id, true)"
            :style="{ borderRadius: '5px' }"
          >
            <v-icon left size="20">mdi-pencil-outline</v-icon>Edit
          </v-btn>
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
            :images="item.images"
            :onHover="hover"
            :restart="true"
          />
        </v-hover>
      </div>
    </v-dialog>

    <v-row
      class="fill-height ma-0"
      align="center"
      justify="center"
      v-if="isloading"
    >
      <v-progress-circular
        indeterminate
        size="50"
        :color="Colors.accent"
      ></v-progress-circular>
    </v-row>
    <v-row
      class="fill-height ma-0"
      align="center"
      justify="center"
      v-if="errorLoading && !isloading"
    >
      <v-card elevation="0" justify="center" align="center">
        <v-card-text>
          Error Loading..
          <br />Please check your network connection
          <br />
        </v-card-text>
        <v-btn
          @click="getItemDetails"
          :color="Colors.accent"
          dark
          rounded
          small
          outlined
          >Retry</v-btn
        >
      </v-card>
    </v-row>
    <v-bottom-sheet
      max-width="500px"
      v-model="deleteItemDialog"
      :persistent="isDeleting"
    >
      <v-card>
        <v-card-title v-if="!isDeleting">
          Are you sure you want to delete this Item ?
        </v-card-title>
        <v-card-subtitle v-if="!isDeleting"
          >Once delete this item can't be Recovered</v-card-subtitle
        >
        <v-card-title v-if="isDeleting">
          Deleting...
        </v-card-title>
        <v-card-text>
          <v-btn
            block
            dark
            @click="deleteItem"
            :loading="isDeleting"
            :color="Colors.accent"
            >Delete</v-btn
          >
        </v-card-text>
      </v-card>
    </v-bottom-sheet>

    <v-snackbar v-model="snackMedia" :timeout="snackTimeout">
      {{ snackMessage }}
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
  mixins: [device_mixin, user_mixin, utils_mixin, navigation_mixin, app_mixin],
  components: {
    imageviewpager
  },
  data() {
    return {
      CANRENDER: false,
      showFullScreen: false,
      float: true,
      isloading: false,
      errorLoading: false,
      deleteItemDialog: false,
      isDeleting: false,
      item: {
        id: 0,
        title: '',
        price: '',
        order_count: 0,
        cart_count: 0,
        description: '',
        min_quantity: 0,
        max_quantity: 0,
        images: []
      },
      editableItems: [],
      snackMedia: false,
      snackMessage: '',
      snackTimeout: 2000
    }
  },
  mounted() {
    this.CANRENDER = false
    if (
      this.isTransporterSignedIn ||
      this.isCutomerSignedIn ||
      this.isAdminSignedIn
    ) {
      if (this.isCutomerSignedIn) {
        this.openNewPage('/', false)
        return
      } else if (this.isTransporterSignedIn) {
        this.openNewPage('/transporter', false)
        return
      }
    } else {
      this.openNewPage('/gateway', false)
      return
    }

    this.CANRENDER = true
    this.item.id = this.$route.params.id
    this.getItemDetails()
  },

  methods: {
    getItemDetails() {
      this.errorLoading = false
      this.isloading = true

        setTimeout(()=>{
           
            this.item.title = "Can water 50x"
            this.item.price = 100
            this.item.description = "Very tasteful"
            this.item.min_quantity = 10
             this.item.max_quantity  = 100000
             this.item.images = [{src:require('~/static/cover1.png')},{src:require('~/static/canproduct2.png')},{src:require('~/static/canproduct1.png')}]
             this.isloading = false
      
      },600)

      // this.$axios
      //   .$get('/products?id=' + this.item.id)
      //   .then((res) => {
      //     if (res.length > 0) {
      //       var data = res[0]
      //       this.item.title = data.name
      //       this.item.price = data.price
      //       this.item.images = data.images
      //       this.item.description = data.description
      //       this.item.min_quantity = data.minimum_per_order

      //       this.item.max_quantity =
      //         data.maximum_per_order == null || data.maximum_per_order == ''
      //           ? 10000
      //           : data.maximum_per_order
      //       this.isloading = false
      //     } else {
      //       //item doesnt exist oh
      //       this.openNewPage('/', false, true)
      //     }
      //   })
      //   .catch((error) => {
      //     this.errorLoading = true
      //     this.isloading = false
      //   })
    },

    deleteItem() {
      if (this.isDeleting) {
        return
      }
      this.isDeleting = true
      this.$axios
        .$delete('/deleteproduct?id=' + this.item.id)
        .then((res) => {
          this.snackMessage = 'Item Deleted...'
          this.snackMedia = true
       
          this.openNewPage('/admin', false, true)
        }).catch(error=>{
          this.isDeleting = false
          this.snackMessage = 'Error deleting product'
          this.snackMedia = true
        })

      //delete from server then redirect home
    },
    beforeLeavingPage(to, from, next, callback) {
      var callBackFunc = callback || function() {}
      if (this.deleteItemDialog || this.isDeleting) {
        if (this.isDeleting) {
          this.snackMessage = 'Please wait'
          this.snackMedia = true
          return
        }
        callBackFunc(false)
        this.deleteItemDialog = false
      } else callBackFunc(true)
    }
  },
  computed: {
    itemFormatedDescription() {
      return this.item.description.replace('\n', '<br>')
    }
  },
  watch: {}
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

  #item-orders-count,
  #order-limit {
    display: block;
    width: 100%;
    margin: 10px;
    margin-left: 0px;
  }

  #buy-wrapper {
    width: 96%;
    position: absolute;
    bottom: 1px;
    text-align: center;
    padding: 3px;
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

  #item-orders-count,
  #order-limit {
    display: block;
    width: 100%;
    margin: 10px;
    margin-left: 0px;
  }

  #buy-wrapper {
    width: 100%;
    position: fixed;
    bottom: 1px;
    text-align: center;
    padding: 3px;
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

  #item-orders-count,
  #order-limit {
    display: block;
    width: 100%;
    margin: 10px;
    margin-left: 0px;
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
    text-align: center;
    padding: 3px;
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

  #item-orders-count,
  #order-limit {
    display: block;
    width: 100%;
    margin: 10px;
    margin-left: 0px;
  }

  #buy-wrapper {
    width: 100%;
    position: fixed;
    bottom: 1px;
    text-align: center;
    padding: 3px;
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

  #item-orders-count,
  #order-limit {
    display: block;
    width: 100%;
    margin: 10px;
    margin-left: 0px;
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
    text-align: center;
    padding: 3px;
    background-color: #ffffff;
  }
}
</style>