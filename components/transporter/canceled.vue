<template>
  <div id="wrapper">
    <span id="comp-title" v-if="!loading && !errorLoading && Orders.length > 0">Canceled Deliveries</span>
    <v-divider></v-divider>
    <div v-if="!loading && !errorLoading">
      <div id="delivered-items-wrapper" v-for="(item, index) in Orders" :key="index">
        <div id="delivered-container" @click="openLink(item.transaction_id)">
          <span id="item-id">
            Package ID
            <span class="value">{{item.transaction_id}}</span>
          </span>
          <v-divider></v-divider>
          <span id="item-amt">
            Pay
            <span class="value">&#8358;{{formatToCurrency(item.transaction_amount)}}</span>
          </span>
          <!-- <span id="item-payment-method">
            Payment Method
            <span class="value">{{item.transaction_payment_method}}</span>
          </span>-->
          <span id="item-order-date">
            Ordered Date
            <span class="value">{{item.transaction_order_date}}</span>
          </span>
          <span id="item-deliver-date">
            Canceled Date
            <span class="value">{{item.transaction_canceled_date}}</span>
          </span>
        </div>
      </div>
      <div id="load-more-btn" v-if="totalOrders > Orders.length">
        <v-btn @click="loadMore" :loading="loadingMore" block text :color="Colors.accent">
          <v-icon left>mdi-chevron-down</v-icon>Load More
        </v-btn>
      </div>
    </div>

    <v-row class="fill-height ma-0" align="center" justify="center" v-if="loading && !errorLoading">
      <v-progress-circular indeterminate :color="Colors.accent"></v-progress-circular>
    </v-row>

    <v-row
      class="fill-height ma-0"
      align="center"
      justify="center"
      v-if="Orders.length === 0  && !errorLoading && !loading"
    >
      <v-card elevation="0">You Have No Canceled Delivery...</v-card>
    </v-row>

    <v-row class="fill-height ma-0" align="center" justify="center" v-if="errorLoading && !loading">
      <v-card elevation="0" justify="center" align="center">
        <v-card-text>
          Error Loading..
          <br />Please check your network connection
          <br />
        </v-card-text>
        <v-btn @click="getOrders" :color="Colors.accent" dark rounded small outlined>Retry</v-btn>
      </v-card>
    </v-row>
  </div>
</template>

<script>
import app_mixin from '~/mixins/app_mixin.js'
import utils_mixin from '~/mixins/utils_mixin.js'
export default {
  mixins: [utils_mixin, app_mixin],
  data() {
    return {
      Orders: [],
      loading: false,
      errorLoading: false,
      totalOrders: 15,
      loadingMore: false
    }
  },
  mounted() {
    this.getOrders()
  },
  methods: {
    loadMore() {
      if (this.loadingMore) {
        return
      }
      this.loadingMore = true

      setTimeout(() => {
        this.Orders.push(
          {
            transaction_id: 345667,
            transaction_amount: 9000,
            transaction_payment_method: 'Card Payment',
            transaction_order_date: '12/09/2020',
            transaction_canceled_date: '13/09/2020'
          },
          {
            transaction_id: 35673,
            transaction_amount: 13000,
            transaction_payment_method: 'Cash on Delivery',
            transaction_order_date: '12/09/2020',
            transaction_canceled_date: '13/09/2020'
          },
          {
            transaction_id: 333456,
            transaction_amount: 4000,
            transaction_payment_method: 'Card Payment',
            transaction_order_date: '12/09/2020',
            transaction_canceled_date: '13/09/2020'
          },
          {
            transaction_id: 345567,
            transaction_amount: 7500,
            transaction_payment_method: 'Cash on Delivery',
            transaction_order_date: '12/09/2020',
            transaction_canceled_date: '13/09/2020'
          },
          {
            transaction_id: 456789,
            transaction_amount: 21000,
            transaction_payment_method: 'Card Payment',
            transaction_order_date: '12/09/2020',
            transaction_canceled_date: '13/09/2020'
          }
        )
        this.loadingMore = false
      }, 3000)
    },
    openLink(id) {
      this.$emit('openUrl', {
        url: '/transporter/canceled/' + id,
        history: true
      })
    },

    getOrders() {
      this.errorLoading = false
      this.loading = true
      setTimeout(() => {
        this.Orders = [
          {
            transaction_id: 345667,
            transaction_amount: 9000,
            transaction_payment_method: 'Card Payment',
            transaction_order_date: '12/09/2020',
            transaction_canceled_date: '13/09/2020'
          },
          {
            transaction_id: 35673,
            transaction_amount: 13000,
            transaction_payment_method: 'Cash on Delivery',
            transaction_order_date: '12/09/2020',
            transaction_canceled_date: '13/09/2020'
          },
          {
            transaction_id: 333456,
            transaction_amount: 4000,
            transaction_payment_method: 'Card Payment',
            transaction_order_date: '12/09/2020',
            transaction_canceled_date: '13/09/2020'
          },
          {
            transaction_id: 345567,
            transaction_amount: 7500,
            transaction_payment_method: 'Cash on Delivery',
            transaction_order_date: '12/09/2020',
            transaction_canceled_date: '13/09/2020'
          },
          {
            transaction_id: 456789,
            transaction_amount: 21000,
            transaction_payment_method: 'Card Payment',
            transaction_order_date: '12/09/2020',
            transaction_canceled_date: '13/09/2020'
          }
        ]
        this.loading = false
      }, 3000)
    }
  }
}
</script>

<style lang="scss" scoped>
#wrapper {
  width: 100%;
  height: 100%;
}

#comp-title {
  display: block;
  width: 100%;
  font-weight: bold;
  padding: 10px;
}

#delivered-items-wrapper {
  width: 100%;
  display: block;
  margin: auto;
  height: auto;
  padding: 8px;
}

#delivered-container {
  width: 100%;
  max-width: 500px;
  cursor: pointer;
  height: auto;
  margin: auto;
  padding: 3px;
  border-radius: 5px;
  background-color: var(--accent-color);
  color: #fff;
  box-shadow: 0px 2px 7px var(--shadow-color);
  transition: transform 5s ease-in-out;
}

#item-id {
  display: block;
  width: 100%;
  font-size: 19px;
  padding: 8px;
}

#item-amt,
#item-order-date,
#item-deliver-date,
#item-payment-method {
  display: block;
  width: 100%;
  padding: 8px;
}

.value {
  float: right;
  font-weight: bold;
}

#load-more-btn {
  display: block;
  width: 100%;
  padding: 5px;
}
</style>