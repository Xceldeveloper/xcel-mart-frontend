<template>
  <div id="customers">
    <span id="comp-title" v-if="isMobile">
      <span>Live Transactions</span>
    </span>
    <div id="table-wrapper">
      <v-data-table
        :headers="headers"
        hide-default-footer
        fixed-header
        :height="!isMobile ? 'calc(95vh - 50px)' : 'calc(87vh - 50px)'"
        disable-pagination
        :loading="transactionsLoading"
        :items="transactionsList"
        class="elevation-3"
      >
        <template v-slot:header.id="{header}">
          <b>{{header.text}}</b>
        </template>
        <template v-slot:header.name="{header}">
          <b>{{header.text}}</b>
        </template>
        <template v-slot:header.amount="{header}">
          <b>{{header.text}}</b>
        </template>
        <template v-slot:header.status="{header}">
          <b>{{header.text}}</b>
        </template>
        <template v-slot:header.date="{header}">
          <b>{{header.text}}</b>
        </template>

        <template v-slot:header.town="{header}">
          <b>{{header.text}}</b>
        </template>

        <template v-slot:item.id="{item}">
          <span @click="openPerson(item.id)">{{item.id}}</span>
        </template>
        <template v-slot:item.name="{item}">
          <span @click="openPerson(item.id)">{{item.name}}</span>
        </template>
        <template v-slot:item.amount="{item}">
          <span @click="openPerson(item.id)">&#8358;{{formatToCurrency(item.amount)}}</span>
        </template>

        <template v-slot:item.status="{item}">
          <span @click="openPerson(item.id)">{{item.status}}</span>
        </template>

        <template v-slot:item.date="{item}">
          <span @click="openPerson(item.id)">{{item.date}}</span>
        </template>

        <template v-slot:item.town="{item}">
          <span @click="openPerson(item.id)">{{item.town}}</span>
        </template>

        <template
          v-slot:footer
          v-if="totalCustomers > transactionsList.length && transactionsList.length > 0"
        >
          <div id="load-more-wrapper">
            <v-btn
              text
              @click="LoadMore"
              :loading="transactionsLoading"
              dark
              small
              width="60%"
              :color="Colors.accent"
            >
              <v-icon left :color="Colors.accent">mdi-chevron-down</v-icon>Load More
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </div>
  </div>
</template>
<script>
import device_mixin from '~/mixins/device_mixin.js'
import utils_mixin from '~/mixins/utils_mixin.js'
import app_mixin from '~/mixins/app_mixin.js'
export default {
  mixins: [device_mixin, utils_mixin,app_mixin],
  data() {
    return {
     
      headers: [
        { text: 'Transaction ID', value: 'id', sortable: false },
        {
          text: "Customer's Name",
          align: 'left',
          value: 'name',
          sortable: false
        },
        { text: 'Amount', value: 'amount', sortable: false },
        { text: 'Status', value: 'status', sortable: false },
        { text: 'Town', value: 'town', sortable: false },
        { text: 'Ordered Date', value: 'date', sortable: false }
      ],
      transactionsLoading: false,
      transactionsList: [],

      totalCustomers: 30,
      searchQuery: '',
      amountVerified: false
    }
  },
  mounted() {
    this.getTransactions()
  },
  methods: {
    getTransactions() {
      this.transactionsLoading = true
      setTimeout(() => {
        this.transactionsList = [
          {
            id: 23,
            name: 'Bisola Blessed',
            amount: 34212,
            status: 'En Route',
            date: '11/09/2020',
            town: 'Mile 2'
          },
          {
            id: 23,
            name: 'Bisola Blessed',
            amount: 34212,
            status: 'En Route',
            date: '11/09/2020',
            town: 'Mile 2'
          },
          {
            id: 23,
            name: 'Bisola Blessed',
            amount: 34212,
            status: 'En Route',
            date: '11/09/2020',
            town: 'Mile 2'
          }
        ]
        this.transactionsLoading = false
      }, 3500)
    },
    openPerson(id) {
      this.$emit('openUrl', {
        url: '/admin/transaction/live/' + id,
        history: true
      })
    },

    LoadMore() {
      if (this.transactionsLoading) {
        return
      }

      this.transactionsLoading = true
      setTimeout(() => {
        this.transactionsList.push(
          {
            id: 23,
            name: 'Bisola Blessed',
            amount: 34212,
            status: 'En Route',
            date: '11/09/2020',
            town: 'Mile 2'
          },
          {
            id: 23,
            name: 'Bisola Blessed',
            amount: 34212,
            status: 'En Route',
            date: '11/09/2020',
            town: 'Mile 2'
          },
          {
            id: 23,
            name: 'Bisola Blessed',
            amount: 34212,
            status: 'En Route',
            date: '11/09/2020',
            town: 'Mile 2'
          }
        )

        this.transactionsLoading = false
      }, 3000)
    }
  },
  computed: {},
  watch: {}
}
</script>

<style lang="scss" scoped>
#customers {
  width: 100%;
  height: 100%;
}

#table-wrapper {
  width: 100%;
  max-width: 1000px;
  margin: auto;
  height: 100%;
  padding: 5px;
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

#load-more-wrapper {
  width: 100%;
  height: auto;
  text-align: center;
  padding: 5px;
}

#search-wrapper {
  width: 100%;
  position: relative;
  height: 50px;
  padding: 10px 10px 0px 0px;
  text-align: right;
}

.textfieldx {
  position: absolute;
  right: 5px;
}
</style>