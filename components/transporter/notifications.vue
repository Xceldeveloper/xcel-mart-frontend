<template>
  <div id="wrapper">
    <v-row class="fill-height ma-0" align="center" justify="center" v-if="loading && !errorLoading">
      <v-progress-circular indeterminate :color="Colors.accent"></v-progress-circular>
    </v-row>
    <v-row
      class="fill-height ma-0"
      align="center"
      justify="center"
      v-if="notifications.length === 0  && !errorLoading && !loading"
    >
      <v-card elevation="0">You Have No Notifications</v-card>
    </v-row>
    <v-row class="fill-height ma-0" align="center" justify="center" v-if="errorLoading && !loading">
      <v-card elevation="0" justify="center" align="center">
        <v-card-text>
          Error Loading..
          <br />Please check your network connection
          <br />
        </v-card-text>
        <v-btn @click="getNotifications" :color="Colors.accent" dark rounded small outlined>Retry</v-btn>
      </v-card>
    </v-row>
  </div>
</template>

<script>
import app_mixin from '~/mixins/app_mixin.js'
import utils_mixin from '~/mixins/utils_mixin.js'
export default {
  mixins: [utils_mixin,app_mixin],
  data() {
    return {
     
      notifications: [],
      errorLoading: false,
      loading: false
    }
  },
  mounted() {
    this.getNotifications()
  },
  methods: {
    getNotifications() {
      this.erroLoading = false
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
#wrapper {
  width: 100%;
  height: 100%;
}
</style>