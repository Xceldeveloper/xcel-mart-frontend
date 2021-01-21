<template>
  <div id="wrapper">
    <v-row
      class="fill-height ma-0"
      align="center"
      justify="center"
      v-if="!isEmpty && !errorLoading"
    >
      <v-card width="95%" max-width="600px" class="box-container" elevation="5">
        <div id="header">
          <v-btn small absolute top left fab elevation="2">
            <v-icon :color="Colors.accent">mdi-clipboard-text-outline</v-icon>
          </v-btn>
          <span class="id">
            <v-skeleton-loader
              :loading="transaction_id == ''"
              type="text"
            >Transaction ID {{transaction_id}}</v-skeleton-loader>
          </span>
          <span class="order-items-title">Ordered Items</span>
          <v-skeleton-loader :loading="itemsOrdered.length === 0" type="table-tbody">
            <v-expansion-panels class="mb-6" popout>
              <v-expansion-panel v-for="(item,i) in itemsOrdered" :key="i">
                <v-expansion-panel-header expand-icon="mdi-menu-down">
                  <span id="ordered-item-title">{{item.title}}</span>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <span id="ordered-item-quantity">
                    Quantity:
                    <span id="value">{{item.quantity}}</span>
                  </span>
                  <span id="ordered-item-quantity">
                    Total Amount:
                    <span id="value">&#8358;{{formatToCurrency(item.total_amount)}}</span>
                  </span>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-skeleton-loader>
          <v-divider></v-divider>

          <v-skeleton-loader
            :loading="ordertotal == '' || payment_method == '' || order_date == ''"
            type="list-item-three-line"
          >
            <span class="order-total">
              <span class="titlex">Order Total:</span>
              <span class="value">&#8358;{{formatToCurrency(ordertotal)}}</span>
            </span>
            <span class="payment-method">
              <span class="titlex">Payment:</span>
              <span class="value">{{payment_method}}</span>
            </span>
            <span class="payment-method">
              <span class="titlex">Order Date:</span>
              <span class="value">{{order_date}}</span>
            </span>
          </v-skeleton-loader>
        </div>
        <v-divider width="90%" style="display:block;margin:auto;max-width:500px"></v-divider>
        <div id="address">
          <v-btn small absolute top left fab elevation="2">
            <v-icon :color="Colors.accent">mdi-map-marker-radius-outline</v-icon>
          </v-btn>
          <span class="ad-title">Destination Adress</span>
          <v-skeleton-loader :loading="destination_address == ''" type="paragraph">
            <span class="ad">{{destination_address}}</span>
          </v-skeleton-loader>
          <br v-if="destination_address == ''" />
        </div>
        <v-divider width="80%" style="display:block;margin:auto;max-width:500px"></v-divider>
        <div id="contact-info">
          <v-btn small absolute top left fab elevation="2">
            <v-icon :color="Colors.accent">mdi-account-outline</v-icon>
          </v-btn>
          <span class="contact-title">Customer Info</span>
          <v-skeleton-loader :loading="customer_name == ''" type="list-item-avatar-two-line">
            <span class="name">{{customer_name}}</span>
          </v-skeleton-loader>
          <v-skeleton-loader :loading="customer_phone == ''" type="chip">
            <v-menu left bottom open-on-hover :close-on-click="true">
              <template v-slot:activator="{ on }">
                <v-chip class="chipx" dark :color="Colors.accent" v-on="on">
                  <v-icon left>mdi-phone</v-icon>
                  {{customer_phone}}
                </v-chip>
              </template>
              <v-card :color="Colors.background" width="220px">
                <v-list-item link v-if="isMobile || isTablet" @click="callNow">
                  <v-list-item-title :style="{color:Colors.subTextColor}">Call Now</v-list-item-title>
                </v-list-item>
                <v-list-item link @click="copyNumber">
                  <v-list-item-title :style="{color:Colors.subTextColor}">Copy Number</v-list-item-title>
                </v-list-item>
              </v-card>
            </v-menu>
          </v-skeleton-loader>
          <br v-if="customer_email == ''" />
          <v-skeleton-loader :loading="customer_email == ''" type="chip">
            <v-menu left bottom open-on-hover :close-on-click="true">
              <template v-slot:activator="{ on }">
                <v-chip class="chipx" dark :color="Colors.accent" v-on="on">
                  <v-icon left>mdi-gmail</v-icon>
                  {{customer_email}}
                </v-chip>
              </template>
              <v-card :color="Colors.background" width="220px">
                <v-list-item link @click="emailNow">
                  <v-list-item-title :style="{color:Colors.subTextColor}">Email Now</v-list-item-title>
                </v-list-item>
                <v-list-item link @click="copyEmail">
                  <v-list-item-title :style="{color:Colors.subTextColor}">Copy Email</v-list-item-title>
                </v-list-item>
              </v-card>
            </v-menu>
          </v-skeleton-loader>
          <v-divider></v-divider>
          <!-- <v-card
            v-if="transaction_id !== '' "
            width="95%"
            max-width="400px"
            style="margin:30px auto"
            elevation="0"
          >
            <v-btn @click="deliveredBottomSheet = true" :color="Colors.accent" block dark>DELIVERED</v-btn>
            <v-btn :color="Colors.accent" block text>Cancel Delivery</v-btn>
          </v-card>-->
        </div>
      </v-card>
    </v-row>
    <v-snackbar v-model="snackMedia" :timeout="snackDuration">{{snackMessage}}</v-snackbar>

    <v-bottom-sheet
      inset
      v-model="deliveredBottomSheet"
      width="95%"
      max-width="360px"
      :persistent="verifyingDeliveredItems"
    >
      <v-card>
        <v-card-title>Delivered Item</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-checkbox
            :readonly="verifyingDeliveredItems"
            label="All items Delivered to Customer"
            :color="Colors.accent"
            v-model="items_deliviered_to_customers"
            value="value"
          ></v-checkbox>
          <v-checkbox
            :readonly="verifyingDeliveredItems"
            label="All items in good Condition"
            v-model="items_in_good_condition"
            :color="Colors.accent"
          ></v-checkbox>
          <v-checkbox
            :readonly="verifyingDeliveredItems"
            label="Items Payment Verified"
            v-model="items_payment_verified"
            :color="Colors.accent"
          ></v-checkbox>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            v-if="items_deliviered_to_customers && items_in_good_condition && items_payment_verified "
            block
            :color="Colors.accent"
            dark
            @click="verifyDelivery"
            :loading="verifyingDeliveredItems"
          >Verify Delivery</v-btn>
        </v-card-actions>
      </v-card>
    </v-bottom-sheet>

    <v-row class="fill-height ma-0" align="center" justify="center" v-if="isEmpty && !errorLoading">
      <v-card elevation="0">No Deliveries on Route</v-card>
    </v-row>

    <v-row class="fill-height ma-0" align="center" justify="center" v-if="errorLoading">
      <v-card elevation="0" justify="center" align="center">
        <v-card-text>
          Error Loading..
          <br />Please check your network connection
          <br />
        </v-card-text>
        <v-btn @click="getInformations" :color="Colors.accent" dark rounded small outlined>Retry</v-btn>
      </v-card>
    </v-row>
  </div>
</template>
<script>
import app_mixin from '~/mixins/app_mixin.js'
import device_mixin from '~/mixins/device_mixin.js'
import utils_mixin from '~/mixins/utils_mixin.js'
import user_mixin from '~/mixins/user_mixin.js'
export default {
   props:{
    required:true,
    default:null
  },
  mixins: [device_mixin, utils_mixin, user_mixin,app_mixin],
  data() {
    return {
     
      transaction_id: '',
      itemsOrdered: [],
      customer_id: '',
      customer_name: '',
      customer_phone: '',
      customer_email: '',
      destination_address: '',
      ordertotal: '',
      payment_method: '',
      order_date: '',

      snackMedia: false,
      snackMessage: '',
      snackDuration: 2500,
      deliveredBottomSheet: false,
      verifyingDeliveredItems: false,
      isEmpty: true,
      errorLoading: false,

      items_deliviered_to_customers: false,
      items_in_good_condition: false,
      items_payment_verified: false
    }
  },
  created() {
    this.getInformations()
  },
  methods: {
    getInformations() {
      this.errorLoading = false
      this.isEmpty = false
      ////

      setTimeout(() => {
        this.transaction_id = '3045123'
        this.customer_id = 1
        this.customer_name = 'Sunny Duke Okosun'
        this.customer_phone = '0923456432'
        this.customer_email = 'sunnydk@xmail.com'
        this.destination_address = 'No 23 Uwasota off Airport Road'
        this.ordertotal = 45000
        this.payment_method = 'Cash on Delivery'
        this.order_date = '11/09/2020'
        this.itemsOrdered = [
          {
            id: 23,
            title: 'Bag of Water',
            quantity: 40,
            total_amount: 40000
          },
          {
            id: 23,
            title: 'Bag of Water',
            quantity: 50,
            total_amount: 40000
          }
        ]
      }, 3500)
    },

    verifyDelivery() {
      if (this.verifyingDeliveredItems) {
        return
      }
      this.verifyingDeliveredItems = true
      setTimeout(() => {
        this.verifyingDeliveredItems = false
        this.deliveredBottomSheet = false
        this.snackMessage = 'Items delivered'
        this.snackMedia = true

        setTimeout(() => {
          this.$emit('itemDelivered')
        }, this.snackDuration)
      }, 4000)
    },

    callNow() {},
    copyNumber() {
      this.copyToClipboard(this.customer_phone)
      this.snackMessage = 'Phone Number Copied'
      this.snackMedia = true
    },
    emailNow() {},
    copyEmail() {
      this.copyToClipboard(this.customer_email)
      this.snackMessage = 'Email Copied'
      this.snackMedia = true
    }
  },

  beforeRouteLeave(to, from, next) {
    if (this.deliveredBottomSheet) {
      if (this.verifyingDeliveredItems) {
        this.snackMessage = 'Please wait'
        this.snackMedia = true
        return
      }
      this.deliveredBottomSheet = false
      next(false)
    } else {
    }
  },

  watch: {
    deliveredBottomSheet() {
      this.items_in_good_condition = false
      this.items_deliviered_to_customers = false
      this.items_payment_verified = false
    }
  }
}
</script>

<style lang="scss" scoped>
#wrapper {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.box-container {
  margin: auto;
  display: block;
  margin: 30px auto;
}

#header,
#address,
#contact-info {
  width: 100%;
  position: relative;
  height: auto;
  padding: 10px;
}

#header .id {
  display: block;
  font-weight: bold;
  padding: 15px;
}

.order-items-title {
  display: block;
  padding: 0px 0px 5px 15px;
  font-weight: bold;
}
#items-order-wrapper {
  width: 100%;
  height: auto;
  max-height: 300px;
  overflow: auto;
}

.ad {
  padding: 5px;
  margin-bottom: 10px;
  display: block;
}

.ad:hover {
  font-size: 20px;
}

#address .ad-title,
#contact-info .contact-title {
  display: block;
  font-weight: bold;
  padding: 15px 5px 5px 5px;
}

#contact-info .name {
  display: block;
  padding: 0px 0px 5px 5px;
}

#contact-info .chipx {
  margin: 5px 0px 5px 0px;
}

#items-ordered-cover {
  margin: 10px auto 10px auto;
  width: 97%;
  overflow: auto;
  box-sizing: border-box;
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
  max-height: 300px;
  padding: 5px 0px;
  height: auto;
  overflow: auto;
}

#ordered-item-title {
  display: block;
  margin: auto;
  font-size: 18px;
}

#ordered-item-quantity {
  display: block;
  width: 100%;
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

.order-total,
.payment-method {
  display: block;
  padding: 5px;
}

.titlex {
  font-weight: bold;
}

.value {
  font-size: 17px;
  font-weight: bold;
  color: var(--accent-color);
  float: right;
}
</style>