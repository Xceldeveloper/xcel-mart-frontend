<template>
  <div id="wrapper">
    <span id="comp-title" v-if="!loading && !errorLoading && Orders.length > 0">Pending Deliveries</span>
    <v-divider></v-divider>
    <div v-if="!loading && !errorLoading">
      <div id="delivered-items-wrapper" v-for="(item, index) in itemx" :key="index">
        <div id="delivered-container" @click="openLink(item.transaction_id)">
          <span id="item-id">
            Package ID
            <span class="value">{{item.transaction_id}}</span>
          </span>
          <v-divider></v-divider>
          <span id="item-deliver-date">
            Distance
            <span class="value">{{item.transaction_distance}}KM</span>
          </span>
          <span id="item-amt">
            Pay
            <span class="value">&#8358;{{formatToCurrency(item.transaction_amount)}}</span>
          </span>
          <!-- <span id="item-payment-method">
            Payment Method
            <span class="value">{{item.transaction_payment_method}}</span>
          </span>-->
          <span id="item-order-date">
            Order Date
            <span class="value">{{item.transaction_order_date}}</span>
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
      v-if="Orders.length === 0 && !!Orders  && !errorLoading && !loading"
    >
      <v-card elevation="0">You Have No Pending Packages For Delivery</v-card>
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
            transaction_id: 28832,
            transaction_amount: 3456,
            transaction_payment_method: 'Cash on Delivery',
            transaction_order_date: '12/09/2020',
            transaction_distance: 15
          },
          {
            transaction_id: 826283,
            transaction_amount: 3234,
            transaction_payment_method: 'Card Payment',
            transaction_order_date: '12/09/2020',
            transaction_distance: 20
          },
          {
            transaction_id: 52528,
            transaction_amount: 2000,
            transaction_payment_method: 'Card Payment',
            transaction_order_date: '12/09/2020',
            transaction_distance: 19
          },
          {
            transaction_id: 82262,
            transaction_amount: 1897,
            transaction_payment_method: 'Cash on Delivery',
            transaction_order_date: '12/09/2020',
            transaction_distance: 5
          },
          {
            transaction_id: 62523,
            transaction_amount: 345,
            transaction_payment_method: 'Card Payment',
            transaction_order_date: '12/09/2020',
            transaction_distance: 0.4
          }
        )
        this.loadingMore = false
      }, 3000)
    },

    openLink(id) {
      this.$emit('openUrl', {
        url: '/transporter/pending/' + id,
        history: true
      })
    },

    getOrders() {
      this.errorLoading = false
      this.loading = true
      setTimeout(() => {
        this.Orders = [
          {
            transaction_id: 28832,
            transaction_amount: 2343,
            transaction_payment_method: 'Cash on Delivery',
            transaction_order_date: '12/09/2020',
            transaction_distance: 15
          },
          {
            transaction_id: 826283,
            transaction_amount: 4543,
            transaction_payment_method: 'Card Payment',
            transaction_order_date: '12/09/2020',
            transaction_distance: 20
          },
          {
            transaction_id: 52528,
            transaction_amount: 200,
            transaction_payment_method: 'Card Payment',
            transaction_order_date: '12/09/2020',
            transaction_distance: 19
          },
          {
            transaction_id: 82262,
            transaction_amount: 3211,
            transaction_payment_method: 'Cash on Delivery',
            transaction_order_date: '12/09/2020',
            transaction_distance: 5
          },
          {
            transaction_id: 62523,
            transaction_amount: 780,
            transaction_payment_method: 'Card Payment',
            transaction_order_date: '12/09/2020',
            transaction_distance: 3
          }
        ]
        this.loading = false
      }, 3000)
    }
  },
  computed: {
    itemx() {
      return this.Orders.sort((a, b) => {
        return a.transaction_distance - b.transaction_distance
      })
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