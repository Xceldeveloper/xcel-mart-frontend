<template>
  <div id="live">
    <span id="comp-title" v-if="isMobile">
      <span>Canceled Deliveries</span>
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
          Transporter
          <span class="price">{{item.transporter}}</span>
        </span>
        <span id="total" @click="linkTo(item.id)">
          Order date
          <span class="price">{{item.order_date}}</span>
        </span>
        <span id="total" @click="linkTo(item.id)">
          Canceled date
          <span class="price">{{item.canceled_date}}</span>
        </span>
      </div>
      <div id="load-more-btn" v-if="totalOrders > orders.length">
        <v-btn @click="loadMore" :loading="loadingMore" block text :color="Colors.accent"> <v-icon left>mdi-chevron-down</v-icon> Load More</v-btn>
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
    >No Live Transactions at the Moment</v-row>
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
      idWasCopied: false,
       totalOrders:20,
      loadingMore:false,
    }
  },
  mounted() {
    this.getOrders()
  },
  methods: {
     loadMore(){
       if(this.loadingMore){return}
      this.loadingMore = true;

      setTimeout(()=>{

        this.orders.push(      {
            user_name: 'Esteem Mercedes',
            user_id: 1,
            id: 19373,
            total_amount: 4542,
            transporter:'Jim Emeka',
            order_date: 'Yessterday',
            canceled_date: 'Today 12:09pm'
          },
          {
            user_name: 'Henry Ford II',
            user_id: 1,
            id: 26363,
            transporter:'Jim Emeka',
            total_amount: 30000,
            order_date: 'Yessterday',
            canceled_date: '12:19pm'
          },
          {
            user_name: 'Hugh Jackman',
            user_id: 1,
            id: 92723,
            transporter:'Jim Emeka',
            total_amount: 234567,
            order_date: 'Yessterday',
            canceled_date: '09/20/2020'
          },
          {
            user_name: 'Malcom Bennet',
            user_id: 1,
            id: 345678,
            transporter:'Jim Emeka',
            total_amount: 23478,
            order_date: 'Yessterday',
            canceled_date: '09/20/2020'
          },
           {
            user_name: 'Okayla Meh',
            user_id: 1,
            id: 34578,
            total_amount: 6786,
            transporter:'Jim Emeka',
            order_date: 'Yessterday',
            canceled_date: 'Today 12:09pm'
          })

            this.loadingMore = false;
      },3000)
     },
    copyTransactionId(id) {
      this.copyToClipboard(id)
      this.idWasCopied = true
    },
    linkTo(id) {
      this.$emit('openUrl', {
        url: '/admin/unresolved/canceled/' + id,
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
            user_name: 'Esteem Mercedes',
            user_id: 1,
            id: 19373,
            total_amount: 4542,
            transporter:'Jim Emeka',
            order_date: 'Yessterday',
            canceled_date: 'Today 12:09pm'
          },
          {
            user_name: 'Henry Ford II',
            user_id: 1,
            id: 26363,
            transporter:'Jim Emeka',
            total_amount: 30000,
            order_date: 'Yessterday',
            canceled_date: '12:19pm'
          },
          {
            user_name: 'Hugh Jackman',
            user_id: 1,
            id: 92723,
            transporter:'Jim Emeka',
            total_amount: 234567,
            order_date: 'Yessterday',
            canceled_date: '09/20/2020'
          },
          {
            user_name: 'Malcom Bennet',
            user_id: 1,
            id: 345678,
            transporter:'Jim Emeka',
            total_amount: 23478,
            order_date: 'Yessterday',
            canceled_date: '09/20/2020'
          },
           {
            user_name: 'Okayla Meh',
            user_id: 1,
            id: 34578,
            total_amount: 6786,
            transporter:'Jim Emeka',
            order_date: 'Yessterday',
            canceled_date: 'Today 12:09pm'
          }
        ]
      }, 2000)
    }
  },
  watch: {}
}
</script>

<style lang='scss'scoped>
#live {
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
  margin: 10px auto 40px auto;
  width: 97%;
  box-sizing: border-box;
  max-width: 550px;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  background-color: var(--accent-color);
  transition: transform 3.5s ease-in-out;
  box-shadow: 0px 2px 10px var(--shadow-color),
    -0px -0px 0px var(--shadow-color);
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
  padding: 8px 0px 8px 0px;
  font-weight: bold;
  color: #ffffff;
  transition: transform 3.5s ease-in-out;
}

#total:hover {
  padding: 15px 0px 15px 0px;
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


#load-more-btn{
  display: block;
  width: 100%;
  padding: 5px;
}
</style>