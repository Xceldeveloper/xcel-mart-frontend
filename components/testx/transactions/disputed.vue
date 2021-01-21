<template>
  <div id="Disputed">
    <span id="comp-title" v-if="isMobile">
      <span>Disputed Transactions</span>
    </span>
    <div v-if="!loading && !errorLoading">
      <div id="tanscation-cover" v-for="(item, index) in orders" :key="index">
        <span id="total">
          <v-icon color="#ffffff" size="28">mdi-account</v-icon>
          <span id="transaction-name">{{item.user_name}}</span>
        </span>
        <v-divider></v-divider>
        <span id="total">
          Transaction ID: {{item.id}}
          <span
            class="price copy-btn"
            @click="copyTransactionId(item.id)"
          >
            <v-icon>mdi-content-copy</v-icon>
          </span>
        </span>
        <span id="total" @click="linkTo(item.id)">
          Total Amount
          <span class="price">&#8358;{{formatToCurrency(item.total_amount)}}</span>
        </span>
        <span id="total" @click="linkTo(item.id)">
          Payment method
          <span class="price">{{item.payment_method}}</span>
        </span>
        <span id="total" @click="linkTo(item.id)">
          Status
          <span class="price">{{item.dispute_status}}</span>
        </span>
        <span id="total" @click="linkTo(item.id)">
          Order date
          <span class="price">{{item.time}}</span>
        </span>
        <span id="total" @click="linkTo(item.id)">
          Disputed date
          <span class="price">{{item.dispute_time}}</span>
        </span>
      </div>
    </div>
    <v-row class="fill-height ma-0" align="center" justify="center" v-if="loading">
      <v-progress-circular indeterminate size="50" :color="Colors.accent"></v-progress-circular>
    </v-row>
    <v-row
      class="fill-height ma-0"
      align="center"
      justify="center"
      v-if="orders.length == 0 && !loading && !errorLoading"
    >No Disputed Transaction</v-row>
    <v-row class="fill-height ma-0" align="center" justify="center" v-if="errorLoading && !loading">
      <v-card elevation="0" align="center">
        <v-card-text>
          Error Loading...
          <br />Please check your Connection
          <br />
          <br />
          <v-btn @click="getOrders" outlined rounded small :color="Colors.accent">Retry</v-btn>
        </v-card-text>
      </v-card>
    </v-row>
    <v-snackbar v-model="idWasCopied" :timeout="2000">Transaction ID Copied</v-snackbar>
  </div>
</template>

<script>
import device_mixin from '~/mixins/device_mixin.js'
import user_mixin from '~/mixins/user_mixin.js'
import utils_mixin from '~/mixins/utils_mixin.js'
import app_mixin from '~/mixins/app_mixin.js'
export default {
  mixins: [device_mixin,app_mixin,app_mixin,utils_mixin],
  data() {
    return {
     
      loading: false,
      errorLoading: false,
      firstLoaded: false,
      orders: [],
      idWasCopied: false
    }
  },
  mounted() {
    this.getOrders()
  },
  methods: {
    copyTransactionId(id) {
      this.copyToClipboard(id)
      this.idWasCopied = true
    },
    linkTo(id) {
      this.$emit('openUrl', {
        url: '/admin/transaction/dispute/' + id,
        history: true
      })
    },
    getOrders() {
      this.loading = true
      this.errorLoading = false
      this.firstLoaded = true
      setTimeout(() => {
        this.loading = false
        this.orders = [
          {
            user_name: 'Google LLC',
            user_id: 1,
            id: 234,
            total_amount: 4542,
            payment_method: 'Card Payment',
            dispute_status: 'Resolved and Refunded',
            time: '21/09/2020',
            dispute_time: '22/09/2020'
          },
          {
            user_name: 'Walmart inc',
            user_id: 2,
            id: 234,
            total_amount: 4542,
            payment_method: 'Card Payment',
            dispute_status: 'Resolved and Refunded',
            time: '21/09/2020',
            dispute_time: '22/09/2020'
          }
        ]
      }, 2000)
    }
  },
  watch: {}
}
</script>

<style lang='scss'scoped>
#Disputed {
  width: 100%;
  height: 100%;
}

#comp-title {
  display: block;
  width: 100%;
  text-align: center;
  padding: 8px;
}

#comp-title span {
  padding: 10px;
  font-weight: bold;
  border-bottom: 3px solid #000000;
}

#order-title {
  display: block;
  padding: 5px 0px 5px 10px;
  font-size: 18px;
  font-weight: bold;
}

#tanscation-cover {
  margin: 5px auto 10px auto;
  width: 97%;
  box-sizing: border-box;
  max-width: 550px;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  background-color: var(--accent-color);
  box-shadow: 0px 2px 5px var(--shadow-color), -0px -0px 0px var(--shadow-color);
}

#transaction-no {
  font-weight: bold;
  margin-left: 5px;
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
  font-weight: bold;
  color: #ffffff;
}

.price {
  float: right;
  font-size: 15px;
  font-weight: 100;
  color: #ffffff;
}

.status {
  color: var(--accent-color);
  font-weight: bold;
  text-transform: capitalize;
}
</style>