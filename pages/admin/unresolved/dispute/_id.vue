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
      <v-toolbar-title>Unresolved Dispute</v-toolbar-title>
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
          <span
            v-if="orderAmount !== ''"
            class="price"
          >&#8358;{{formatToCurrency(orderAmount)}}</span>
        </span>
        <span id="total">
          Status
          <span class="price status">{{orderStatus}}</span>
        </span>
        <span id="total">
          Payment method
          <span class="price">{{paymentMethod}}</span>
        </span>
        <span id="total">
          Order date
          <span class="price">{{orderDate}}</span>
        </span>
        <span id="total">
          Disputed date
          <span class="price">{{disputedDate}}</span>
        </span>
        <span
          id="total"
          v-if="transporter !== ''"
          @click="openNewPage('/admin/people/transporter/'+transporter_id, true)"
        >
          Transporter
          <span class="price transporter">{{transporter}}</span>
        </span>
        <v-expansion-panels class="mb-6" accordion elevation="0" v-if="disputeReason !== ''">
          <v-expansion-panel>
            <v-expansion-panel-header expand-icon="mdi-menu-down">Dispute Reason</v-expansion-panel-header>
            <v-expansion-panel-content>{{disputeReason}}</v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
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
              <span id="value">{{item.quantity}}</span>
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
        @click="resolveDisputeBottomSheet = true"
        rounded
        width="80%"
        max-width="500px"
        dark
        :color="Colors.accent"
      >Resolve Dispute</v-btn>

       <v-btn
        @click="cancelDisputeBottomSheet = true"
        text
        width="80%"
        max-width="500px"
        dark
        :color="Colors.accent"
      >Cancel Dispute</v-btn>
   

      
    </div>

    <v-bottom-sheet
      scrollable
      width="95%"
      max-width="500px"
      inset
      v-model="resolveDisputeBottomSheet"
      :persistent="resolvingOrder"
    >
      <v-card>
        <v-card-text>
          <v-card-title>Verify Dispute Resolved</v-card-title>
          <v-divider></v-divider>
          <v-checkbox
            :readonly="resolvingOrder"
            :color="Colors.accent"
            label="Payment Verified or Refunded"
            v-model="paymentVerified"
          ></v-checkbox>
          <v-checkbox
            :readonly="resolvingOrder"
            :color="Colors.accent"
            label="All Issues The customer Complained About Has Been Resolved"
            v-model="issuesVerified"
          ></v-checkbox>

          <v-text-field
            name="Any Comment ?"
            label="Any Comment ?"
            :color="Colors.accent"
            v-model="resolveDisputeComment"
            outlined
          ></v-text-field>
          <v-divider></v-divider>
          <v-btn
            @click="RESOLVE_DISPUTE"
            :loading="resolvingOrder"
            v-if="paymentVerified && issuesVerified "
            block
            dark
            :color="Colors.accent"
          >Dispute Resloved</v-btn>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>

      <v-bottom-sheet
      scrollable
      width="95%"
      max-width="500px"
      inset
      v-model="cancelDisputeBottomSheet"
      :persistent="resolvingOrder"
    >
      <v-card>
        <v-card-text>
          <v-card-title>Cancel Dispute</v-card-title>
          <v-divider></v-divider>
        
          <v-checkbox
            :readonly="resolvingOrder"
            :color="Colors.accent"
            label="All Issues The customer Complained About is Incorrect"
            v-model="issuesIncorrect"
          ></v-checkbox>

          <v-text-field
            name="Canceled Reason"
            label="Canceled Reason"
            :color="Colors.accent"
            v-model.trim="cancelDisputeComment"
            outlined
          ></v-text-field>
          <v-divider></v-divider>
          <v-btn
            @click="CANCEL_DISPUTE"
            :loading="resolvingOrder"
            v-if="cancelDisputeComment !== '' && issuesIncorrect "
            block
            dark
            :color="Colors.accent"
          >Cancel Dispute</v-btn>
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
      disputedDate: '',
      transporter: '',
      disputeReason: '',
      transporter_id: '',
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

      resolveDisputeBottomSheet: false,
      paymentVerified: false,
      issuesVerified: false,

      resolvingOrder: false,
      resolveDisputeComment: '',

      cancelDisputeBottomSheet:false,
      issuesIncorrect:false,
      cancelDisputeComment:'',


      snackBarX: false,
      snackBarDurr: 2000,
      snackbarMessage: ''
    }
  },
  mounted() {
    this.CANRENDER = false;
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
        date: '12/08/2020',
        disputed_date: '13/08/2020',
        transporter: 'Moses Agbai',
        transporter_id: 23,
        disputeReason: 'I never got the goods in one piece'
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
      this.disputedDate = result.disputed_date
      this.userId = result.user_id
      this.user_name = result.user_name
      this.transporter = result.transporter
      this.transporter_id = result.transporter_id
      this.disputeReason = result.disputeReason
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

    RESOLVE_DISPUTE() {
      if (this.resolvingOrder) {
        return
      }
      this.resolvingOrder = true

      //
      //put order in dispute transaction
      //send resolve cooment if any resolveDisputeComment

      setTimeout(() => {
        this.resolveDisputeBottomSheet = false

        this.resolvingOrder = false
        this.snackbarMessage = 'Dispute Resolved'
        this.snackBarX = true

        setTimeout(() => {
          this.openNewPage('/admin', false)
        }, this.snackBarDurr)
      }, 4200)
    },

    
      CANCEL_DISPUTE() {
      if (this.resolvingOrder) {
        return
      }
      this.resolvingOrder = true

      //
      //put order in dispute transaction
      //send resolve cooment if any resolveDisputeComment

      setTimeout(() => {
        this.cancelDisputeBottomSheet = false

        this.resolvingOrder = false
        this.snackbarMessage = 'Dispute Canceled'
        this.snackBarX = true

        setTimeout(() => {
          this.openNewPage('/admin', false)
        }, this.snackBarDurr)
      }, 4200)
    },

    beforeLeavingPage(to, from, next, callback) {
      var callBackFunc = callback || function() {}
      if (this.resolveDisputeBottomSheet) {
        //prevent back btn press till all modals or bottom sheets are closed
        if (this.resolvingOrder) {
          this.snackbarMessage = 'Please Wait'
          this.snackBarX = true
          return
        }
        this.resolveDisputeBottomSheet = false
        callBackFunc(false)
      } else {
        callBackFunc(true)
      }
    }
  },
  watch: {
    resolveDisputeBottomSheet(val) {
      if (val) {
      } else {
        this.paymentVerified = false
        this.issuesVerified = false
        this.resolveDisputeComment = ''
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