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
        <span v-if="!isMobile">En Route</span>
        <v-icon>mdi-truck-fast</v-icon>
      </v-tab>
      <v-tab>
        <span v-if="!isMobile">Queued Deliveries</span>
        <v-icon>mdi-truck-delivery</v-icon>
      </v-tab>
      <v-tab>
        <span v-if="!isMobile">Completed Deliveries</span>
        <v-icon>mdi-truck-check</v-icon>
      </v-tab>
      <v-tab>
        <span v-if="!isMobile">Canceled Deliveries</span>
        <v-icon>mdi-cancel</v-icon>
      </v-tab>
      <v-tab-item>
        <div class="tab-item-cover">
          <enroute @redirect="redirect" :canLoad="currentIndex" :id="userId" />
        </div>
      </v-tab-item>
      <v-tab-item>
        <div class="tab-item-cover">
          <queued @redirect="redirect" :canLoad="currentIndex" :id="userId" />
        </div>
      </v-tab-item>
      <v-tab-item>
        <div class="tab-item-cover">
          <completed @redirect="redirect" :canLoad="currentIndex" :id="userId" />
        </div>
      </v-tab-item>
      <v-tab-item>
        <div class="tab-item-cover">
          <canceled @redirect="redirect" :canLoad="currentIndex" :id="userId" />
        </div>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import device_mixin from '~/mixins/device_mixin.js'
import app_mixin from '~/mixins/app_mixin.js'

import enroute from '~/components/admin/people/specific/transporterdeliveries/enroute.vue'
import queued from '~/components/admin/people/specific/transporterdeliveries/queued.vue'
import completed from '~/components/admin/people/specific/transporterdeliveries/completed.vue'
import canceled from '~/components/admin/people/specific/transporterdeliveries/canceled.vue'
export default {
  props: {
    userId: {
      required: true
    }
  },
 mixins: [device_mixin,app_mixin],
  components: {
    enroute,
    queued,
    completed,
    canceled
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

<style lang="scss" scoped>
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
    height: calc(100vh - 96px);
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
    height: calc(100vh - 96px);
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