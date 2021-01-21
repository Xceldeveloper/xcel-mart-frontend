<template>
  <div id="customers">
    <span id="comp-title" v-if="isMobile">
      <span>Customers</span>
    </span>
    <div id="table-wrapper">
      <v-data-table
        :headers="headers"
        hide-default-footer
        :hide-default-header="isMobile ? true : false"
        fixed-header
        :height="!isMobile ? 'calc(95vh - 50px)' : 'calc(87vh - 50px)'"
        disable-pagination
        :loading="customersLoading"
        :items="customersList"
        class="elevation-3"
      >
        <template v-slot:header.id="{header}">
          <b>{{header.text}}</b>
        </template>
        <template v-slot:header.name="{header}">
          <b>{{header.text}}</b>
        </template>
        <template v-slot:header.email="{header}">
          <b>{{header.text}}</b>
        </template>
        <template v-slot:header.lastseen="{header}">
          <b>{{header.text}}</b>
        </template>
        <template v-slot:item.id="{item}">
          <span @click="openPerson(item.id)">{{item.id}}</span>
        </template>
        <template v-slot:item.name="{item}">
          <span @click="openPerson(item.id)">{{item.name}}</span>
        </template>
        <template v-slot:item.email="{item}">
          <span @click="openPerson(item.id)">{{item.email}}</span>
        </template>

        <template v-slot:item.lastseen="{item}">
          <span @click="openPerson(item.id)">{{item.lastseen}}</span>
        </template>

        <template
          v-slot:footer
          v-if="totalCustomers > customersList.length && customersList.length > 0"
        >
          <div id="load-more-wrapper">
            <v-btn
              text
              @click="LoadMore"
              :loading="customersLoading"
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
        { text: "Customer's ID", value: 'id', sortable: false },
        {
          text: 'Name',
          align: 'left',
          value: 'name',
          sortable: false
        },
        { text: 'Email', value: 'email', sortable: false },
        { text: 'Last Seen', value: 'lastseen', sortable: false }
      ],
      customersLoading: false,
      customersList: [],

      totalCustomers: 30,
      searchQuery: '',
      emailVerified: false
    }
  },
  mounted() {
    this.getCustomersList()
  },
  methods: {
    getCustomersList() {
      this.customersLoading = true
      setTimeout(() => {
        this.customersList = [
          {
            id: 23,
            name: 'Bisola Blessed',
            email: 'bb@google.com',
            country: 'Nigeria',
            state: 'Lagos',
            town: 'Mile 2',
            lastseen: 'Active'
          },
          {
            id: 134,
            name: 'Emiator Overcomer',
            email: 'support@emov.com',
            country: 'Nigeria',
            state: 'Edo',
            town: 'Irrua',
            lastseen: 'Today'
          },
          {
            id: 134,
            name: 'Uchechukwu Evans',
            email: 'youngbus@emov.com',
            country: 'Nigeria',
            state: 'Enugu',
            town: 'Adelee',
            lastseen: 'Today'
          },
          {
            id: 986,
            name: 'Propser Bankz',
            email: 'ppb@google.com',
            country: 'Nigeria',
            state: 'Akwa Ibom',
            town: 'Ikote',
            lastseen: 'few Mins Ago'
          },
          {
            id: 190,
            name: 'Pablo Ozuwa',
            email: 'padre@gmail.com',
            country: 'Nigeria',
            state: 'Edo',
            town: 'Evboutubu',
            lastseen: 'Last Week Friday'
          }
        ]
        this.customersLoading = false
      }, 3500)
    },
    openPerson(id) {
      this.$emit('openUrl', {
        url: '/admin/people/customer/' + id,
        history: true
      })
    },

    LoadMore() {
      if (this.customersLoading) {
        return
      }

      this.customersLoading = true
      setTimeout(() => {
        this.customersList.push(
          {
            id: 134,
            name: 'Donald Daniel',
            email: 'danni@gmail.com',
            country: 'Nigeria',
            state: 'Edo',
            town: 'Ewato',
            lastseen: 'yesterday'
          },
          {
            id: 986,
            name: 'Joshua Imoisili',
            email: 'johIb@gmail.com',
            country: 'Nigeria',
            state: 'Edo',
            town: 'Ugbowor',
            lastseen: 'yesterday'
          },
          {
            id: 986,
            name: 'Ezomon Peculiar',
            email: 'pecu@gmail.com',
            country: 'Nigeria',
            state: 'Edo',
            town: 'Irrua',
            lastseen: 'yesterday'
          },
          {
            id: 190,
            name: 'Allen Igabase',
            email: 'allib@gmail.com',
            country: 'Nigeria',
            state: 'Edo',
            town: 'Ramat',
            lastseen: 'yesterday'
          },
          {
            id: 190,
            name: 'Ray  Aisosa',
            email: 'rey@gmail.com',
            country: 'Nigeria',
            state: 'Edo',
            town: 'Evboutubu',
            lastseen: 'yesterday'
          }
        )

        this.customersLoading = false
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