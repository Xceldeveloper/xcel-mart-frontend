<template>
  <div id="wrapper" v-cloak v-if="CANRENDER">
    <style>
   :root{
    --accent-color:{{Colors.accent}};
      --text-color:{{Colors.text}};
       --subtext-color:{{Colors.subTextColor}};
      --inverttext-color:{{Colors.invertTextColor}};
      --background-color:{{Colors.background}};
      --texture-color:{{Colors.textTure}};
       --shadow-color:{{Colors.shadowColor}};
  }
    </style>
    <v-app-bar :color="Colors.accent" dense dark fixed>
      <v-btn dark icon @click="navBack">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-toolbar-title>Admin</v-toolbar-title>
    </v-app-bar>
    <div id="smwrapper">
      <div id="profile-details">
        <v-list-item two-line>
          <v-list-item-avatar
            :width="isMobile ? 85 : 100"
            :height="isMobile ? 85 : 100"
            color="#ededed"
          >
            <v-icon :size="isMobile ? 35 : 50" :color="Colors.accent">mdi-account</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              <v-skeleton-loader type="text" width="200px" :loading="admin_fullname == ''">
                <span class="username">{{admin_fullname}}</span>
              </v-skeleton-loader>
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-skeleton-loader type="text" width="195px" :loading="admin_email == ''">
                <span class="fullname" :style="{color:Colors.subTextColor}">{{admin_email}}</span>
              </v-skeleton-loader>
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              <v-skeleton-loader type="text" width="190px" :loading="admin_phone == ''">
                <span class="fullname" :style="{color:Colors.subTextColor}">{{admin_phone}}</span>
              </v-skeleton-loader>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item link dense>
          <v-list-item-content>
            <v-skeleton-loader type="text" width="170px" :loading="admin_joined == ''">
              Joined
              <b>{{admin_joined}}</b>
            </v-skeleton-loader>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link dense>
          <v-list-item-content>
            <v-skeleton-loader type="text" width="170px" :loading="admin_last_seen == ''">
              Last seen
              <b>{{admin_last_seen}}</b>
            </v-skeleton-loader>
          </v-list-item-content>
        </v-list-item>

        <v-skeleton-loader
          type="button"
          width="150px"
          :loading="admin_frozen == null"
          v-if="getAdmin.id != admin_id"
        >
          <v-btn
            @click="accountFreeze(true)"
            :loading="isFreezing"
            dark
            elevation="0"
            small
            v-if="!admin_frozen && getAdmin.id != admin_id"
            :color="Colors.accent"
          >Freeze Account</v-btn>
          <v-btn
            @click="accountFreeze(false)"
            :loading="isFreezing"
            v-if="admin_frozen && getAdmin.id != admin_id"
            dark
            small
            :color="Colors.accent"
            outlined
          >Defrost Account</v-btn>
        </v-skeleton-loader>
      </div>
      <actions @openUrl="openLink" :adminId="admin_id" />
    </div>
  </div>
</template>

<script>
import app_mixin from '~/mixins/app_mixin.js'
import device_mixin from '~/mixins/device_mixin.js'
import navigation_mixin from '~/mixins/navigation_mixin.js'
import utils_mixin from '~/mixins/utils_mixin.js'
import user_mixin from '~/mixins/user_mixin.js'

import actions from '~/components/admin/people/specific/actions.vue'
export default {
  components: {
    actions
  },
  mixins: [
    device_mixin,
    utils_mixin,
    navigation_mixin,
    user_mixin,
    app_mixin
  ],
  data() {
    return {
      CANRENDER:false,
      admin_id: null,
      admin_fullname: '',
      admin_email: '',
      admin_phone: '',
      admin_joined: '',
      admin_last_seen: '',
      admin_frozen: null,

      isFreezing: false
    }
  },

  mounted() {
    this.CANRENDER = false;
    if (
      this.isTransporterSignedIn ||
      this.isCutomerSignedIn ||
      this.isAdminSignedIn
    ) {
      if (this.isTransporterSignedIn) {
        this.openNewPage('/transporter', false);
        return
      } else if (this.isCutomerSignedIn) {
        this.openNewPage('/', false);
        return
      }
    } else {
      this.openNewPage('/gateway', false);
      return
    }
     this.admin_id = this.$route.params.id

     this.CANRENDER = true;
    this.getAccountDetails()
  },

  methods: {
    openLink(result) {
      this.openNewPage(result.url, result.history)
    },

    getAccountDetails() {
      setTimeout(() => {
        this.admin_fullname = 'Xcel Developer'
        this.admin_email = 'xceldeveloper@gmail.com'
        this.admin_phone = '08158696460'
        this.admin_joined = '01/08/2020'
        this.admin_last_seen = 'Yesterday'
        this.admin_frozen = false
      }, 2000)
    },

    accountFreeze(state) {
      if (this.getAdmin.id == this.admin_id) {
        return
      }
      if (this.isFreezing) {
        return
      }
      this.isFreezing = true

      setTimeout(() => {
        this.admin_frozen = state
        this.isFreezing = false
      }, 1000)
    }
  }
}
</script>

<style>
#wrapper {
  width: 100%;
  height: 100%;
}

#smwrapper {
  margin-top: 48px;
  width: 100%;
  max-width: 767px;
  margin: 48px auto 0 auto;
  padding: 0px;
  height: calc(100vh - 48px);
  border: 1px solid lightgrey;
}

#profile-details {
  box-shadow: 0px 1px 2px var(--shadow-color);
  padding: 10px;
  margin-bottom: 5px;
}
</style>