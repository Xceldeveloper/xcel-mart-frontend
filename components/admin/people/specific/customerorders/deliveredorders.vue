<template>
  <div id="delivered">
    <span id="order-title" v-if="isMobile">Completed</span>
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
    >No Items has been Delivered</v-row>
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
   mixins: [device_mixin, user_mixin, utils_mixin,app_mixin],
  props: {
    canLoad: {},
    id: {
      default: null,
      required: true
    }
  },
  data() {
    return {
     
      loading: false,
      errorLoading: false,
      firstLoaded: false,
      orders: [],
      idWasCopied: false,
      totalOrders: 10,
      loadingMore: false
    }
  },
  mounted() {
    if (this.canLoad === 1 && !!this.id) {
      if (!this.firstLoaded) {
        this.getOrders()
      }
    }
  },
  methods: {
    loadMore() {
      if (this.loadingMore) {
        return
      }
      this.loadingMore = true

      setTimeout(() => {
        this.orders.push(
          {
            id: 383721,
            total_amount: 4542,
            payment_method: 'Card Payment',
            time: '21/09/2020',
            delivered_time: '22/09/2020'
          },
          {
            id: 83732,
            total_amount: 4542,
            payment_method: 'Card Payment',
            time: '21/09/2020',
            delivered_time: '22/09/2020'
          },
          {
            id: 34568,
            total_amount: 890875,
            payment_method: 'Cash On Delivery',
            time: '21/09/2020',
            delivered_time: '22/09/2020'
          },
          {
            id: 12346,
            total_amount: 57463,
            payment_method: 'Card Payment',
            time: '21/09/2020',
            delivered_time: '22/09/2020'
          },
          {
            id: 54764,
            total_amount: 70467,
            payment_method: 'Card Payment',
            time: '21/09/2020',
            delivered_time: '22/09/2020'
          }
        )

        this.loadingMore = false
      }, 3000)
    },
    copyTransactionId(id) {
      this.copyToClipboard(id)
      this.idWasCopied = true
    },
    linkTo(id) {
      this.$emit('redirect', {
        url:'/admin/transaction/completed/' + id,
        history: true
      })
    },
    getOrders() {
      if (!this.isAdminSignedIn) {
        //kill function if not logged in
        return
      }
      this.loading = true
      this.errorLoading = false
      this.firstLoaded = true
      setTimeout(() => {
        this.loading = false
        this.orders = [
          {
            id: 383721,
            total_amount: 4542,
            payment_method: 'Card Payment',
            time: '21/09/2020',
            delivered_time: '22/09/2020'
          },
          {
            id: 83732,
            total_amount: 4542,
            payment_method: 'Card Payment',
            time: '21/09/2020',
            delivered_time: '22/09/2020'
          },
          {
            id: 34568,
            total_amount: 890875,
            payment_method: 'Cash On Delivery',
            time: '21/09/2020',
            delivered_time: '22/09/2020'
          },
          {
            id: 12346,
            total_amount: 57463,
            payment_method: 'Card Payment',
            time: '21/09/2020',
            delivered_time: '22/09/2020'
          },
          {
            id: 54764,
            total_amount: 70467,
            payment_method: 'Card Payment',
            time: '21/09/2020',
            delivered_time: '22/09/2020'
          }
        ]
      }, 2000)
    }
  },
  watch: {
    canLoad(val) {
      if (val === 1 && !!this.id) {
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