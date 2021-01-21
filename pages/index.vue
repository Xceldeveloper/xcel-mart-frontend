<template>
  <div id="app" v-cloak v-if="CANRENDER">
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
    <v-app-bar :color="Colors.accent" dense dark>
      <img src="~/static/icon.png" alt="logo" style="width:37px;height:37px" />
      <v-toolbar-title class="mr-12 align-center">{{AppName}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" :to="'/user'">
            <v-icon>mdi-account-outline</v-icon>
          </v-btn>
        </template>
        <span>My Profile</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" :to="'/user/cart'">
            <v-icon>mdi-cart-outline</v-icon>
          </v-btn>
        </template>
        <span>My Cart</span>
      </v-tooltip>

      <v-tooltip bottom v-if="isMobile ? deviceOrientation.landscape ? true : false : true ">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon @click="selectComponent('home')" dark>
            <v-icon>{{selectedComponent == 'home' ? 'mdi-home-variant' : 'mdi-home-variant-outline'}}</v-icon>
          </v-btn>
        </template>
        <span>Home</span>
      </v-tooltip>

      <v-tooltip bottom v-if="isMobile ? deviceOrientation.landscape ? true : false : true ">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon @click="selectComponent('lists')">
            <v-icon>{{selectedComponent == 'lists' ? 'mdi-view-agenda' : 'mdi-view-agenda-outline'}}</v-icon>
          </v-btn>
        </template>
        <span>Store Lists</span>
      </v-tooltip>

      <v-tooltip bottom v-if="isMobile ? deviceOrientation.landscape ? true : false : true ">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon @click="selectComponent('orders')">
            <v-icon>{{selectedComponent == 'orders' ? 'mdi-clipboard-text' : 'mdi-clipboard-text-outline'}}</v-icon>
          </v-btn>
        </template>
        <span>My Orders</span>
      </v-tooltip>
      <v-tooltip bottom v-if="isMobile ? deviceOrientation.landscape ? true : false : true ">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon @click="selectComponent('contact')">
            <v-icon>{{selectedComponent == 'contact' ? 'mdi-account-voice' : 'mdi-account-tie-voice-outline'}}</v-icon>
          </v-btn>
        </template>
        <span>Contact Us</span>
      </v-tooltip>
    </v-app-bar>

    <div id="component-box">
      <keep-alive>
        <component @openUrl="openLink" :is="selectedComponent"></component>
      </keep-alive>
    </div>

    <!-- for  mobiles only -->
    <v-bottom-navigation
      v-model="navIndex"
      grow
      dense
      shift
      absolute
      centered
      :color="Colors.accent"
      v-if="isMobile ? deviceOrientation.landscape ? false : true : false "
    >
      <v-btn @click="selectComponent('home')">
        <span>Home</span>
        <v-icon>mdi-home-variant</v-icon>
      </v-btn>

      <v-btn @click="selectComponent('lists')">
        <span>Store Items</span>
        <v-icon>mdi-view-day</v-icon>
      </v-btn>

      <v-btn @click="selectComponent('orders')">
        <span>My Orders</span>
        <v-icon>mdi-clipboard-text</v-icon>
      </v-btn>
      <v-btn @click="selectComponent('contact')">
        <span>Contact us</span>
        <v-icon>mdi-account-voice</v-icon>
      </v-btn>
    </v-bottom-navigation>

    <installer/>
  </div>
</template>
<script>
import device_mixin from '~/mixins/device_mixin.js'
import user_mixin from '~/mixins/user_mixin.js'
import utils_mixin from '~/mixins/utils_mixin.js'
import navigation_mixin from '~/mixins/navigation_mixin.js'
import home from '~/components/user/home.vue'
import lists from '~/components/user/lists.vue'
import orders from '~/components/user/orders.vue'
import contact from '~/components/user/contact.vue'
import installer from '~/components/utils/installer.vue'
import app_mixin from '~/mixins/app_mixin.js'
export default {
  mixins: [
    device_mixin,
    user_mixin,
    utils_mixin,
    navigation_mixin,
    app_mixin
  ],
  components: {
    home: home,
    lists: lists,
    orders: orders,
    contact: contact,
    installer
  },
  data() {
    return {
      selectedComponent: 'home',
      navIndex: 0,
      CANRENDER: false
    }
  },


  mounted() {
    this.CANRENDER = false
    if (
      this.isTransporterSignedIn ||
      this.isCutomerSignedIn ||
      this.isAdminSignedIn
    ) {
      if (this.isTransporterSignedIn) {
        this.openNewPage('/transporter', false,true)
        return
      } else if (this.isAdminSignedIn) {
        this.openNewPage('/admin', false,true)
        return
      }
    } else {
      // this.openNewPage('/gateway',false);
    }
    this.CANRENDER = true

    // this.$axios.$get('/getcount?target=users').then((res)=>{
    //   alert(res)
    // }).catch(error =>{
    //   alert(error)
    // })
  },
  methods: {
    openLink(result) {
      this.openNewPage(result.url, result.history)
    },

    selectComponent(component) {
      if (component == 'orders' && !this.isCutomerSignedIn) {
        this.selectedComponent = 'home'
        this.navIndex = 0
        this.openNewPage('/gateway', true)
        return
      }
      this.selectedComponent = component
    }
  },
  watch: {
    selectedComponent(val) {
      if (val == 'home') {
        this.navIndex = 0
      } else if (val == 'lists') {
        this.navIndex = 1
      } else if (val == 'orders') {
        if (this.isCutomerSignedIn) {
          this.navIndex = 2
        } else {
          this.navIndex = 0
        }
      } else if (val == 'contact') {
        this.navIndex = 3
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#app {
  width: 100%;
  height: 100%;
}

@media screen and (min-width: 767px) {
  #component-box {
    width: 100%;
    height: calc(100vh - 48px);
    overflow: auto;
  }
}

@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: portrait) {
  #component-box {
    width: 100%;
    height: calc(100vh - 108px);
    overflow: auto;
  }
}

@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {
  #component-box {
    width: 100%;
    height: calc(100vh - 48px);

    overflow: auto;
  }
}

/*for iphone X and others needs to come last or it would confilct with laptop screen*/
@media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: portrait) {
  #component-box {
    width: 100%;
    height: calc(100vh - 108px);
    overflow: auto;
  }
}

@media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
  #component-box {
    width: 100%;
    height: calc(100vh - 48px);
    overflow: auto;
  }
}
</style>
