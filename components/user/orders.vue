<template>
  <div id="orders">
    <v-tabs
      :color="Colors.accent"
      :mobile-break-point="200"
      :grow="isMobile"
      centered
      dense
      value="1"
      :icons-and-text="!isMobile"
      @change="changed"
    >
      <v-tab>
        <span v-if="!isMobile">Track Order</span>
        <v-icon>mdi-truck-delivery-outline</v-icon>
      </v-tab>
      <v-tab>
        <span v-if="!isMobile">Delivered Orders</span>
        <v-icon>mdi-shield-check-outline</v-icon>
      </v-tab>
      <v-tab>
        <span v-if="!isMobile">Canceled Orders</span>
        <v-icon>mdi-cancel</v-icon>
      </v-tab>
      <v-tab>
        <span v-if="!isMobile">Dispute Orders</span>
        <v-icon>mdi-chart-donut-variant</v-icon>
      </v-tab>
      <v-tab-item>
        <div class="tab-item-cover">
          <trackorders @redirect="redirect" :canLoad="currentIndex" />
        </div>
      </v-tab-item>
      <v-tab-item>
        <div class="tab-item-cover">
          <deliveredorders @redirect="redirect" :canLoad="currentIndex" />
        </div>
      </v-tab-item>
      <v-tab-item>
        <div class="tab-item-cover">
          <canceledorders @redirect="redirect" :canLoad="currentIndex" />
        </div>
      </v-tab-item>
      <v-tab-item>
        <div class="tab-item-cover">
          <disputedorders @redirect="redirect" :canLoad="currentIndex" />
        </div>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import device_mixin from '~/mixins/device_mixin.js'
import user_mixin from '~/mixins/user_mixin.js'
import app_mixin from '~/mixins/app_mixin.js'
import trackorders from '~/components/user/userorders/trackorders.vue'
import deliveredorders from '~/components/user/userorders/deliveredorders.vue'
import canceledorders from '~/components/user/userorders/canceledorders.vue'
import disputedorders from '~/components/user/userorders/disputedorders.vue'
export default {
  mixins: [device_mixin, user_mixin,app_mixin],
  components: {
    trackorders,
    deliveredorders,
    canceledorders,
    disputedorders
  },
  data() {
    return {
     
      currentIndex: 0
    }
  },
  mounted() {
    this.currentIndex = 0 //init current tab index to 0
  },
  methods: {
    changed(n) {
      this.currentIndex = n //expose current tab index
    },
    redirect(result) {
      this.$emit('openUrl', result)
    }
  }
}
</script>

<style lang="scss" scope>
@media screen and (min-width: 767px) {
  #orders {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .tab-item-cover {
    width: 100%;
    height: calc(100vh - 124px);
    overflow: auto;
  }
}

@media screen and (min-width: 320px) and (max-width: 767px) and(orientation:portrait) {
  #orders {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .tab-item-cover {
    width: 100%;
    height: calc(100vh - 150px);
    overflow: auto;
  }
}

@media screen and (min-width: 320px) and (max-width: 767px) and(orientation:landscape) {
  #orders {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .tab-item-cover {
    width: 100%;
    height: calc(100vh - 96px);
    overflow: auto;
  }
}

//for iphone X and others needs to come last or it would confilct with laptop screen*/
@media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and(orientation:portrait) {
  #orders {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .tab-item-cover {
    width: 100%;
    height: calc(100vh - 150px);
    overflow: auto;
  }
}

@media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and(orientation:landscape) {
  #orders {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .tab-item-cover {
    width: 100%;
    height: calc(100vh - 96px);
    overflow: auto;
  }
}
</style>