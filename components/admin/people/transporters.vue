<template>
  <div id="customers">
    <span id="comp-title" v-if="isMobile">
      <span>Transporters</span>
    </span>
    <div id="table-wrapper">
      <v-data-table
        :headers="headers"
        hide-default-footer
        :hide-default-header="isMobile ? true : false"
        fixed-header
        :height="!isMobile ? 'calc(95vh - 50px)' : 'calc(87vh - 50px)'"
        disable-pagination
        :loading="transportersLoading"
        :items="transportersLists"
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
          v-if="totalTransporters > transportersLists.length && transportersLists.length > 0"
        >
          <div id="load-more-wrapper">
            <v-btn
              text
              @click="LoadMore"
              :loading="transportersLoading"
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
    <div id="create-btn">
      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-btn
            @click="createNewAdminBottomSheet = true"
            v-on="on"
            :width="isMobile ? 50: 70"
            :height="isMobile ? 50: 70"
            :color="Colors.accent"
            fab
            dark
          >
            <v-icon :size="isMobile ? 25: 38">mdi-account-multiple-plus</v-icon>
          </v-btn>
        </template>
        Create New Transporter
      </v-tooltip>
    </div>

    <v-bottom-sheet
      :persistent="checkingEmail || sendingInvite "
      width="95%"
      inset
      v-model="createNewAdminBottomSheet"
      max-width="500px"
    >
      <v-card justify="center" align="center">
        <v-card-title>Create New Transporter</v-card-title>
        <v-divider></v-divider>

        <v-card-text>
          <v-text-field
            name="Email"
            ref="email"
            label="Email"
            :readonly="sendingInvite || checkingEmail"
            hint="The Email of the Person you want to Create as A Transpoter"
            v-model.trim="adminEmail"
            @keyup.enter="verifyInputs"
            type="email"
            :rules="[
         ()=> !!adminEmail || 'This field is required',
         () =>  /.+@.+\..+/.test(adminEmail)  || 'Invalid E-mail']"
            :append-icon="checkingEmail ?  'mdi-loading mdi-spin' : emailVerified ? 'mdi-email-check' : 'mdi-email-outline'"
            :color="Colors.accent"
          ></v-text-field>

          <v-btn
            @click="verifyInputs"
            dark
            :loading="sendingInvite"
            :color="Colors.accent"
          >Send Invite</v-btn>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>

    <v-snackbar v-model="snackBar" :timeout="snackDurr">{{snackMessage}}</v-snackbar>
  </div>
</template>
<script>
import device_mixin from '~/mixins/device_mixin.js'
import utils_mixin from '~/mixins/utils_mixin.js'
import app_mixin from '~/mixins/app_mixin.js'
export default {
  mixins: [device_mixin, utils_mixin, app_mixin],
  data() {
    return {
      headers: [
        { text: "Transporter's ID", value: 'id', sortable: false },
        {
          text: 'Name',
          align: 'left',
          value: 'name',
          sortable: false
        },
        { text: 'Email', value: 'email', sortable: false },
        { text: 'Last Seen', value: 'lastseen', sortable: false }
      ],
      transportersLoading: false,
      transportersLists: [],

      totalTransporters: 2,
      searchQuery: '',

      createNewAdminBottomSheet: false,
      emailVerified: false,
      checkingEmail: false,
      adminEmail: '',
      sendingInvite: false,
      snackBar: false,
      snackMessage: '',
      snackDurr: 3000
    }
  },
  mounted() {
    this.gettransportersLists()
  },
  methods: {
    createNewTransporter() {
      this.sendingInvite = true
      this.snackMessage = 'Sending Invite'
      this.snackBar = true
      this.snackDurr = 1500
      setTimeout(() => {
        this.sendingInvite = false
        this.createNewAdminBottomSheet = false

        this.snackBar = true
        this.snackMessage = 'Transporter invite has been Sent'
      }, 3000)
    },
    gettransportersLists() {
      this.transportersLoading = true
      setTimeout(() => {
        this.transportersLists = [
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
          }
        ]
        this.transportersLoading = false
      }, 3500)
    },
    openPerson(id) {
      this.$emit('openUrl', {
        url: '/admin/people/transporter/' + id,
        history: true
      })
    },

    LoadMore() {
      if (this.transportersLoading) {
        return
      }

      this.transportersLoading = true
      setTimeout(() => {
        this.transportersLists.push(
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
            id: 190,
            name: 'Ray  Aisosa',
            email: 'rey@gmail.com',
            country: 'Nigeria',
            state: 'Edo',
            town: 'Evboutubu',
            lastseen: 'yesterday'
          }
        )

        this.transportersLoading = false
      }, 3000)
    },

    verifyInputs() {
      if (this.checkingEmail) {
        return
      }
      if (
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          this.adminEmail
        )
      ) {
        //check if it is a valid email
        //then check db if email is not exist
        this.checkingEmail = true
        setTimeout(() => {
          this.emailVerified = true
          this.checkingEmail = false

          if (this.emailVerified) {
            this.createNewTransporter()
          } else {
            this.snackMessage = 'Email is already been used'
            this.snackBar = true
          }
        }, 3000)
      } else {
        this.emailVerified = false
        this.checkingEmail = false
        this.$refs.email.validate(true)
      }
    }
  },
  computed: {},
  watch: {
    createNewAdminBottomSheet(val) {
      if (!val) {
        this.adminEmail = ''
        this.snackDurr = 2500
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#create-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

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