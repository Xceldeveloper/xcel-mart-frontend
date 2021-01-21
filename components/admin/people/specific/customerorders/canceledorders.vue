<template>
  <div id="cancel">
    <span id="order-title" v-if="isMobile">Canceled</span>
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
          Status
          <span class="price status">{{item.refund_status}}</span>
        </span>
        <span id="total" @click="linkTo(item.id)">
          Order date
          <span class="price">{{item.time}}</span>
        </span>
        <span id="total" @click="linkTo(item.id)">
          Canceled date
          <span class="price">{{item.canceled_time}}</span>
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
    >No Items has been Canceled</v-row>
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
    if (this.canLoad === 2 && !!this.id) {
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
            id: 7335,
            total_amount: 19000,
            payment_method: 'Card Payment',
            refund_status: 'Done',
            time: '21/09/2020',
            canceled_time: '22/09/2020'
          },
          {
            id: 29283,
            total_amount: 49833,
            payment_method: 'Card Payment',
            refund_status: 'Pending',
            time: '21/09/2020',
            canceled_time: '22/09/2020'
          },
          {
            id: 28273,
            total_amount: 120000,
            payment_method: 'Card Payment',
            refund_status: 'Done',
            time: '21/09/2020',
            canceled_time: '22/09/2020'
          },
          {
            id: 28372,
            total_amount: 76500,
            payment_method: 'Card Payment',
            refund_status: 'Pending',
            time: '21/09/2020',
            canceled_time: '22/09/2020'
          },
          {
            id: 21237,
            total_amount: 13500,
            payment_method: 'Card Payment',
            refund_status: 'Pending',
            time: '21/09/2020',
            canceled_time: '22/09/2020'
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
        url: '/admin/transaction/canceled/' + id,
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
            id: 7335,
            total_amount: 19000,
            payment_method: 'Card Payment',
            refund_status: 'Done',
            time: '21/09/2020',
            canceled_time: '22/09/2020'
          },
          {
            id: 29283,
            total_amount: 49833,
            payment_method: 'Card Payment',
            refund_status: 'Pending',
            time: '21/09/2020',
            canceled_time: '22/09/2020'
          },
          {
            id: 28273,
            total_amount: 120000,
            payment_method: 'Card Payment',
            refund_status: 'Done',
            time: '21/09/2020',
            canceled_time: '22/09/2020'
          },
          {
            id: 28372,
            total_amount: 76500,
            payment_method: 'Card Payment',
            refund_status: 'Pending',
            time: '21/09/2020',
            canceled_time: '22/09/2020'
          },
          {
            id: 21237,
            total_amount: 13500,
            payment_method: 'Card Payment',
            refund_status: 'Pending',
            time: '21/09/2020',
            canceled_time: '22/09/2020'
          }
        ]
      }, 1000)
    }
  },
  watch: {
    canLoad(val) {
      if (val === 2 && !!this.id) {
        if (!this.firstLoaded) {
          this.getOrders()
        }
      }
    }
  }
}
</script>

<style lang='scss'scoped>
#cancel {
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
  font-weight: bold;
  text-transform: capitalize;
}

#load-more-btn {
  display: block;
  width: 100%;
  padding: 5px;
}
</style>