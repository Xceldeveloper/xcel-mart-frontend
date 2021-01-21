<template>
  <div id="transaction" v-cloak v-if="CANRENDER">
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
    <v-app-bar :color="Colors.accent" dense dark fixed>
      <v-btn dark icon @click="navBack">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-toolbar-title>New Order</v-toolbar-title>
    </v-app-bar>

    <div id="overall-wrapper" v-if="isAdminSignedIn && !isloading && !errorLoading">
      <div id="tanscation-cover">
        <span id="total" @click="openNewPage('/admin/people/customer/'+userId, true)">
          <v-icon :color="Colors.accent" size="28">mdi-account-outline</v-icon>
          <span id="transaction-no">{{user_name}}</span>
        </span>
        <v-divider></v-divider>
        <v-divider></v-divider>
        <span id="total">
          <b>Transaction ID: {{transactionID}}</b>
          <span class="price copy-btn" @click="copyTransactionId(transactionID)">
            <v-icon>mdi-content-copy</v-icon>
          </span>
        </span>
        <span id="total">
          Total Amount
          <span v-if="orderAmount !== ''" class="price">
            <b>&#8358;{{formatToCurrency(orderAmount)}}</b>
          </span>
        </span>
        <span id="total">
          Payment method
          <span class="price">
            <b>{{paymentMethod}}</b>
          </span>
        </span>
        <span id="total">
          Order date
          <span class="price">{{orderDate}}</span>
        </span>
        <span id="total">
          Order Time
          <span class="price">{{orderDate}}</span>
        </span>
        <br />
        <span id="total">
          <v-icon :color="Colors.accent" size="28">mdi-map-marker-radius-outline</v-icon>
          <span id="transaction-no">Shipping Information</span>
        </span>
        <v-divider></v-divider>
        <v-divider></v-divider>
        <span id="info">Name</span>
        <span class="mation">{{buyerName}}</span>
        <span id="info">E-mail</span>
        <span class="mation">{{buyerEmail}}</span>
        <span id="info">Phone</span>
        <span class="mation">{{buyerPhone}}</span>
        <span id="info">Address</span>
        <span class="mation">{{buyerAddress}}</span>
        <span id="info">City</span>
        <span class="mation">{{buyerCity}}</span>
        <!-- <span id="info">Location</span>
        <span class="mation">
          latitude
          <b>{{buyerLocaion.longitude}}</b> longitude
          <b>{{buyerLocaion.latitude}}</b>
        </span>-->
      </div>

      <div id="items-ordered-cover" v-if="itemsOrdered.length > 0">
        <span id="total">
          <v-icon :color="Colors.accent" size="28">mdi-clipboard-text-outline</v-icon>
          <span id="transaction-no">Items Ordered</span>
        </span>
        <v-divider></v-divider>
        <v-divider></v-divider>
        <div id="ordered-items-wrapper">
          <div id="item-ordered" v-for="(item, index) in itemsOrdered" :key="index">
            <span id="ordered-item-title">{{item.title}}</span>
            <span id="ordered-item-quantity">
              Quantity
              <span id="value">
                <b>{{item.quantity}}</b>
              </span>
            </span>
            <span id="ordered-item-quantity">
              Total Amount
              <span id="value">&#8358;{{formatToCurrency(item.total_amount)}}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <v-snackbar v-model="idWasCopied" :timeout="2000">Transaction ID Copied</v-snackbar>

    <v-row class="fill-height ma-0" align="center" justify="center" v-if="isloading">
      <v-progress-circular indeterminate size="50" :color="Colors.accent"></v-progress-circular>
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
        <v-btn @click="generalCall" :color="Colors.accent" dark rounded small outlined>Retry</v-btn>
      </v-card>
    </v-row>
    <div id="action-btn-cover" v-if="isAdminSignedIn && !isloading && !errorLoading">
      <v-btn
        @click="verifyProcessed = true"
        rounded
        width="80%"
        max-width="500px"
        dark
        :color="Colors.accent"
      >Process Order</v-btn>

      <v-btn
        @click="verifyCancel = true"
        text
        width="80%"
        max-width="500px"
        dark
        :color="Colors.accent"
      >Cancel Order</v-btn>
    </div>

    <v-bottom-sheet
      scrollable
      width="95%"
      max-width="500px"
      inset
      v-model="verifyProcessed"
      :persistent="preparingOrder"
    >
      <v-card>
        <v-card-text>
          <v-card-title>Processed Order Verification</v-card-title>
          <v-divider></v-divider>
          <v-checkbox
            :readonly="preparingOrder"
            :color="Colors.accent"
            label="Payment Verified"
            v-model="paymentVerified"
          ></v-checkbox>
          <v-checkbox
            :readonly="preparingOrder"
            :color="Colors.accent"
            label="All Ordered Items and Shipping Information are clear and concise"
            v-model="everythingIsClear"
          ></v-checkbox>
          <v-checkbox
            :readonly="preparingOrder"
            :color="Colors.accent"
            label="All Ordered Items Are Available In Stock"
            v-model="allItemsAreAvailable"
          ></v-checkbox>
          <v-checkbox
            :readonly="preparingOrder"
            :color="Colors.accent"
            label="All Ordered Items are Ready to Be Shipped"
            v-model="allItemsAreReadyToBeShipped"
          ></v-checkbox>
          <v-divider></v-divider>
          <v-select
            :items="availableTransporters"
            :readonly="preparingOrder"
            v-model.trim="selectedTransporter"
            :loading="loadingTransporters"
            label="Select Transporter"
            name="Select Transporter"
            outlined
            dense
            :color="Colors.accent"
          ></v-select>
          <v-divider></v-divider>
          <v-btn
            @click="RESOLVE_ORDER"
            :loading="preparingOrder"
            v-if="paymentVerified && everythingIsClear && allItemsAreAvailable && allItemsAreReadyToBeShipped && selectedTransporter !== ''"
            block
            dark
            :color="Colors.accent"
          >Order is Ready</v-btn>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>

    <v-bottom-sheet
      scrollable
      width="95%"
      max-width="500px"
      inset
      v-model="verifyCancel"
      :persistent="cancelingOrder"
    >
      <v-card>
        <v-card-text>
          <v-card-title>Cancel Order Verification</v-card-title>
          <v-divider></v-divider>
          <v-checkbox
            :readonly="cancelingOrder"
            :color="Colors.accent"
            label="Payment Verified and Refunded"
            v-model="paymentVerifiedandRedunded"
          ></v-checkbox>
          <v-checkbox
            :readonly="cancelingOrder"
            :color="Colors.accent"
            label="All Ordered Items are not Been Shipped"
            v-model="notBeenShipped"
          ></v-checkbox>

          <v-text-field
            name="Order Cancelation Reason "
            label="Order Cancelation Reason"
            :readonly="cancelingOrder"
            :color="Colors.accent"
            outlined
            v-model="cancelationReason"
          ></v-text-field>
          <v-divider></v-divider>

          <v-btn
            @click="CANCEL_ORDER"
            :loading="cancelingOrder"
            v-if="paymentVerifiedandRedunded && notBeenShipped && cancelationReason !== ''"
            block
            dark
            :color="Colors.accent"
          >Cancel Order</v-btn>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>

    <v-snackbar v-model="snackBarX" :timeout="snackBarDurr">{{snackbarMessage}}</v-snackbar>
  </div>
</template>

<script>
import app_mixin from '~/mixins/app_mixin.js'
import device_mixin from '~/mixins/device_mixin.js'
import navigation_mixin from '~/mixins/navigation_mixin.js'
import utils_mixin from '~/mixins/utils_mixin.js'
import user_mixin from '~/mixins/user_mixin.js'
export default {
  mixins: [
    device_mixin,
    utils_mixin,
    navigation_mixin,
    user_mixin,
    app_mixin
  ],
  data() {
    return {
      CANRENDER:false,
      userId: null,
      user_name: '',
      transactionID: '',
      orderAmount: '',
      orderStatus: '',
      paymentMethod: '',
      orderDate: '',
      orderTime: '',
      buyerName: '',
      buyerEmail: '',
      buyerPhone: '',
      buyerAddress: '',
      buyerCity: '',
      buyerLocaion: {
        longitude: '--',
        latitude: '--'
      },
      itemsOrdered: [],
      isloading: false,
      idWasCopied: false,
      errorLoading: false,

      verifyProcessed: false,
      paymentVerified: false,
      allItemsAreAvailable: false,
      allItemsAreReadyToBeShipped: false,
      everythingIsClear: false,

      verifyCancel: false,
      paymentVerifiedandRedunded: false,
      notBeenShipped: false,
      cancelingOrder: false,
      cancelationReason: '',

      selectedTransporter: '',
      availableTransporters: ['Francis John', 'Kelvin James'],
      loadingTransporters: false,
      preparingOrder: false,

      snackBarX: false,
      snackBarDurr: 2000,
      snackbarMessage: ''
    }
  },
  mounted() {
    this.CANRENDER= false;
    if (
      this.isTransporterSignedIn ||
      this.isCutomerSignedIn ||
      this.isAdminSignedIn
    ) {
      if (this.isTransporterSignedIn) {
        this.openNewPage('/transporter', false);
        return
      } else if (this.isCutomerSignedIn) {
        this.openNewPage('/', false);
        return
      }
    } else {
      this.openNewPage('/gateway', false);
      return
    }

    this.CANRENDER = true;
    this.generalCall()
  },
  methods: {
    copyTransactionId(id) {
      this.copyToClipboard(id)
      this.idWasCopied = true
    },
    generalCall() {
      this.transactionID = this.$route.params.id

      let orderDetails = {
        user_name: 'Netflix inc',
        user_id: 1,
        amount: 3000,
        status: 'En Route',
        paymentMethod: 'Cash on Delivery',
        time: '12:30pm',
        date: '12/08/2020'
      }

      let shippingDetails = {
        name: 'Joshua Imoisili',
        email: 'josh34@gmail.com',
        phone: '09023567984',
        address: 'No 27 agede street Igbagoe',
        city: 'Benin',
        location: {
          longitude: -32,
          latitude: 300
        }
      }

      let orderedItems = [
        {
          id: 23,
          title: 'Bag of Water',
          quantity: 40,
          total_amount: 40000
        },
        {
          id: 23,
          title: 'Bag of Water',
          quantity: 40,
          total_amount: 40000
        },
        {
          id: 23,
          title: 'Bag of Water',
          quantity: 40,
          total_amount: 40000
        },
        {
          id: 23,
          title: 'Bag of Water',
          quantity: 40,
          total_amount: 40000
        },
        {
          id: 23,
          title: 'Bag of Water',
          quantity: 40,
          total_amount: 40000
        },
        {
          id: 23,
          title: 'Bag of Water',
          quantity: 40,
          total_amount: 40000
        }
      ]

      this.isloading = true
      //this.errorLoading = true;

      setTimeout(() => {
        this.getOrderDetails(orderDetails)
        this.getShippingDetails(shippingDetails)
        this.getOrderedItems(orderedItems)

        this.isloading = false
      }, 4000)
    },
    getOrderDetails(result) {
      this.orderAmount = result.amount
      this.orderStatus = result.status
      this.paymentMethod = result.paymentMethod
      this.orderDate = result.date
      this.orderTime = result.time
      this.userId = result.user_id
      this.user_name = result.user_name
    },

    getShippingDetails(details) {
      this.buyerName = details.name
      this.buyerEmail = details.email
      this.buyerPhone = details.phone
      this.buyerAddress = details.address
      this.buyerCity = details.city
      this.buyerLocaion.longitude = details.location.longitude
      this.buyerLocaion.latitude = details.location.latitude
    },

    getOrderedItems(items) {
      this.itemsOrdered = items
    },

    RESOLVE_ORDER() {
      if (this.preparingOrder) {
        return
      }
      this.preparingOrder = true

      //place order in transporter queue,
      //put order in live transaction

      setTimeout(() => {
        this.verifyProcessed = false

        this.preparingOrder = false
        this.snackbarMessage = 'Order Processed'
        this.snackBarX = true

        setTimeout(() => {
          this.openNewPage('/admin', false)
        }, this.snackBarDurr)
      }, 4200)
    },

    CANCEL_ORDER() {
      if (this.cancelingOrder) {
        return
      }
      this.cancelingOrder = true

      //put order in canceled transaction
      //add cancelation reason

      setTimeout(() => {
        this.verifyCancel = false

        this.cancelingOrder = false
        this.snackbarMessage = 'Order Canceled'
        this.snackBarX = true

        setTimeout(() => {
          this.openNewPage('/admin', false)
        }, this.snackBarDurr)
      }, 4200)
    },

    getAvaliableTransporters() {
      this.availableTransporters = []
      this.loadingTransporters = true
      setTimeout(() => {
        this.loadingTransporters = false
        this.availableTransporters = [
          'John Doe',
          'Micheal Outis',
          'James Bettle',
          'Chris HemsWorth'
        ]
      }, 4000)
    },

    beforeLeavingPage(to, from, next, callback) {
      var callBackFunc = callback || function() {}
      if (this.verifyProcessed || this.verifyCancel) {
        //prevent back btn press till all modals or bottom sheets are closed
        if (this.preparingOrder || this.cancelingOrder) {
          this.snackbarMessage = 'Please Wait'
          this.snackBarX = true
          return
        }
        this.verifyProcessed = false
        this.verifyCancel = false
        callBackFunc(false)
      } else {
        callBackFunc(true)
      }
    }
  },
  watch: {
    verifyProcessed(val) {
      if (val) {
        this.getAvaliableTransporters()
      } else {
        this.paymentVerified = false
        this.allItemsAreAvailable = false
        this.everythingIsClear = false
        this.allItemsAreReadyToBeShipped = false
        this.selectedTransporter = ''
      }
    },
    verifyCancel(val) {
      if (!val) {
        this.cancelationReason = ''
        this.paymentVerifiedandRedunded = false
        this.notBeenShipped = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#transaction {
  width: 100%;
  height: 100%;
}

#overall-wrapper {
  width: 100%;
  height: 100vh;
  margin-top: 50px;
  margin-bottom: 90px;
  overflow: auto;
}

#tanscation-cover {
  margin: 20px auto 10px auto;
  width: 97%;
  box-sizing: border-box;
  max-width: 600px;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0px 1px 3px var(--shadow-color), -0px -0px 0px var(--shadow-color);
}

#items-ordered-cover {
  margin: 10px auto 10px auto;
  width: 97%;
  overflow: auto;
  box-sizing: border-box;
  max-width: 600px;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0px 1px 3px var(--shadow-color), -0px -0px 0px var(--shadow-color);
}

#item-ordered {
  margin: 3px auto 0 auto;
  width: 100%;
  box-sizing: border-box;
  max-width: 550px;
  padding: 10px;
  box-shadow: 0px 0px 0px 1px lightgrey, -0px -0px 0px var(--shadow-color);
}

#ordered-items-wrapper {
  max-height: 600px;
  padding: 5px 0px;
  height: auto;
  overflow: auto;
}

#ordered-item-title {
  display: block;
  width: 95%;
  margin: auto;
  font-size: 18px;
  border: none;
  padding: 0px 0px 5px 0px;
  border-bottom: 1px solid lightgrey;
}

#ordered-item-quantity {
  display: block;
  width: 95%;
  margin: auto;
  padding: 3px 0px 3px 0px;
  font-weight: bold;
  font-size: 15px;
}

#value {
  float: right;
  font-size: 16px;
  font-weight: 100;
}

#transaction-no {
  font-weight: bold;
  margin-left: 5px;
  color: var(--accent-color);
}

.copy-btn {
  display: block;
}

#total,
#delivery-price,
#order-total {
  display: block;
  width: 100%;
  padding: 5px 0px 5px 0px;
  font-weight: 400;
  color: var(--text-color);
}

.price {
  float: right;
  font-size: 15px;
  font-weight: 100;
  color: var(--subtext-color);
}

.transporter {
  font-weight: bold;
}

.status {
  color: var(--accent-color);
  font-weight: bold;
  text-transform: capitalize;
}

#info {
  display: block;
  width: 100%;
  font-size: 15px;
  padding: 1px;
  font-weight: bold;
}
.mation {
  display: block;
  padding: 3px;
}

#action-btn-cover {
  width: 100%;
  height: auto;
  text-align: center;
  padding: 10px;
  position: fixed;
  bottom: 0px;
  background-color: #ffffff;
}
</style>