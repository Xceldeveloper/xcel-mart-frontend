<template>
  <div id="delivered">
    <span id="order-title" v-if="isMobile">Delivered</span>
    <div v-if="!loading && !errorLoading">
      <div id="tanscation-cover" v-for="(item, index) in orders" :key="index">
        <span id="total">
          <v-icon color="#000000" size="28">mdi-history</v-icon>
          <span id="transaction-no">Transaction ID: {{item.id}}</span>
          <span class="price copy-btn" @click="copyTransactionId(item.id)">
            <v-icon>mdi-content-copy</v-icon>
          </span>
        </span>
        <v-divider></v-divider>
        <span id="total" @click="linkTo(item.id)">
          Total Amount
          <span class="price">&#8358;{{formatToCurrency(item.total_amount)}}</span>
        </span>
        <span id="total" @click="linkTo(item.id)">
          Payment method
          <span class="price">{{item.payment_method}}</span>
        </span>
        <span id="total" @click="linkTo(item.id)">
          Order date
          <span class="price">{{item.time}}</span>
        </span>
        <span id="total" @click="linkTo(item.id)">
          Delivered date
          <span class="price">{{item.delivered_time}}</span>
        </span>
      </div>
      <div id="load-more-btn" v-if="totalOrders > orders.length">
        <v-btn @click="loadMore" :loading="loadingMore" block text :color="Colors.accent">
          <v-icon left>mdi-chevron-down</v-icon>Load More
        </v-btn>
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
    >You have No Delivered Orders</v-row>
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
  mixins: [device_mixin, user_mixin, app_mixin, utils_mixin],
  props: {
    canLoad: {}
  },
  data() {
    return {
      loading: false,
      errorLoading: false,
      firstLoaded: false,
      orders: [],
      idWasCopied: false,
      totalOrders: 0,
      loadingMore: false
    }
  },
  mounted() {
    if (this.canLoad === 1) {
      if (!this.firstLoaded) {
        this.getTotalOrders()
        this.getOrders()
      }
    }
  },
  methods: {
    getTotalOrders() {
      //get total delivered orders for customer from db
      this.totalOrders = 0
    },
    loadMore() {
      if (this.loadingMore) {
        return
      }

      this.loadingMore = true
      //get data from firebase
      this.orders
        .push
        //  {
        //     id: 383721,
        //     total_amount: 4542,
        //     payment_method: 'Card Payment',
        //     time: '21/09/2020',
        //     delivered_time: '22/09/2020'
        //   }
        ()
      //hideloader
      this.loadingMore = false
    },
    copyTransactionId(id) {
      this.copyToClipboard(id)
      this.idWasCopied = true
    },
    linkTo(id) {
      this.$emit('redirect', {
        url: '/user/transaction/delivered/' + id,
        history: true
      })
    },
    getOrders() {
      if (!this.isCutomerSignedIn) {
        //kill function if not logged in
        return
      }
      //show loader
      this.loading = true
      this.errorLoading = false
      this.firstLoaded = true
      //get data from firebase
      this.orders = [
        //  {
        //     id: 383721,
        //     total_amount: 4542,
        //     payment_method: 'Card Payment',
        //     time: '21/09/2020',
        //     delivered_time: '22/09/2020'
        //   }
      ]
      //hide loader
      this.loading = false
    }
  },
  watch: {
    canLoad(val) {
      if (val === 1) {
        if (!this.firstLoaded) {
          this.getOrders()
        }
      }
    }
  }
}
</script>

<style lang='scss'scoped>
#delivered {
  width: 100%;
  height: 100%;
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

#total {
  display: block;
  width: 100%;
  padding: 5px 0px 5px 0px;
  font-weight: bold;
  color: #ffffff;
}

#total:hover {
  padding: 10px 0px 10px 0px;
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

#load-more-btn {
  display: block;
  width: 100%;
  padding: 5px;
}
</style>