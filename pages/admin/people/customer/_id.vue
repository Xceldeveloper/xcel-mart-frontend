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
      <v-toolbar-title>Customer</v-toolbar-title>
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
              <v-skeleton-loader type="text" width="200px" :loading="customer_fullname == ''">
                <span class="username">{{customer_fullname}}</span>
              </v-skeleton-loader>
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-skeleton-loader type="text" width="195px" :loading="customer_email == ''">
                <span class="fullname" :style="{color:Colors.subTextColor}">{{customer_email}}</span>
              </v-skeleton-loader>
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              <v-skeleton-loader type="text" width="190px" :loading="customer_phone == ''">
                <span class="fullname" :style="{color:Colors.subTextColor}">{{customer_phone}}</span>
              </v-skeleton-loader>
            </v-list-item-subtitle>

            <v-list-item-subtitle>
              <v-skeleton-loader
                type="text"
                width="185px"
                :loading="customer_town == ''"
              >{{customer_town}}</v-skeleton-loader>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item link dense>
          <v-list-item-content>
            <v-skeleton-loader type="text" width="170px" :loading="customer_joined == ''">
              Joined
              <b>{{customer_joined}}</b>
            </v-skeleton-loader>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link dense>
          <v-list-item-content>
            <v-skeleton-loader type="text" width="170px" :loading="customer_last_seen == ''">
              Last seen
              <b>{{customer_last_seen}}</b>
            </v-skeleton-loader>
          </v-list-item-content>
        </v-list-item>

        <v-skeleton-loader type="button" width="150px" :loading="customer_frozen == null">
          <v-btn
            @click="accountFreeze(true)"
            :loading="isFreezing"
            dark
            elevation="0"
            small
            v-if="!customer_frozen"
            :color="Colors.accent"
          >Freeze Account</v-btn>
          <v-btn
            @click="accountFreeze(false)"
            :loading="isFreezing"
            v-if="customer_frozen"
            dark
            small
            :color="Colors.accent"
            outlined
          >Defrost Account</v-btn>
        </v-skeleton-loader>
      </div>
      <orders @openUrl="openLink" :userId="customer_id" />
    </div>
  </div>
</template>

<script>
import app_mixin from '~/mixins/app_mixin.js'
import device_mixin from '~/mixins/device_mixin.js'
import navigation_mixin from '~/mixins/navigation_mixin.js'
import utils_mixin from '~/mixins/utils_mixin.js'
import user_mixin from '~/mixins/user_mixin.js'
import orders from '~/components/admin/people/specific/orders.vue'
export default {
  components: {
    orders
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
      customer_id: null,
      customer_fullname: '',
      customer_email: '',
      customer_phone: '',
      customer_town: '',
      customer_joined: '',
      customer_last_seen: '',
      customer_frozen: null,

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
      this.CANRENDER = true;
    this.customer_id = this.$route.params.id
    this.getAccountDetails()
  },

  methods: {
    openLink(result) {
      this.openNewPage(result.url, result.history)
    },

    getAccountDetails() {
      setTimeout(() => {
        this.customer_fullname = 'Xcel Developer'
        this.customer_email = 'xceldeveloper@gmail.com'
        this.customer_phone = '08158696460'
        this.customer_town = 'Ekewan'
        this.customer_joined = '01/08/2020'
        this.customer_last_seen = 'Yesterday'
        this.customer_frozen = false
      }, 2000)
    },

    accountFreeze(state) {
      if (this.isFreezing) {
        return
      }
      this.isFreezing = true

      setTimeout(() => {
        this.customer_frozen = state
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