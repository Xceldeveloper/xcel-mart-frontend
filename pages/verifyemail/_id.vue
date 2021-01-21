<template>
  <div id="page-wrapper">
    <v-row class="fill-height ma-0" align="center" justify="center">
      <v-card width="80%" elevation="0" align="center" justify="center">
        <v-card-text>
          <v-progress-linear
            v-if="!emailVerified && !errorOcurred"
            max-width="500"
            width="80%"
            :indeterminate="true"
            :color="Colors.accent"
          ></v-progress-linear>
          <h1 v-if="emailVerified">Email Verified</h1>

          <h1 v-if="errorOcurred && !emailVerified">Error Occured</h1>
          <br />
          <br />

          <v-btn
            v-if="emailVerified && !errorOcurred"
            outlined
            large
            @click="openNewPage('/',false,true)"
            :color="Colors.accent"
            icon
          >
            <v-icon>mdi-home-variant</v-icon>
          </v-btn>
        </v-card-text>
      </v-card>
    </v-row>
    <installer />
  </div>
</template>

<script>
import app_mixin from '~/mixins/app_mixin.js'
import device_mixin from '~/mixins/device_mixin.js'
import user_mixin from '~/mixins/user_mixin.js'
import utils_mixin from '~/mixins/utils_mixin.js'
import navigation_mixin from '~/mixins/navigation_mixin.js'
import installer from '~/components/utils/installer.vue'
export default {
  components: {
    installer
  },
  mixins: [device_mixin, user_mixin, navigation_mixin, app_mixin],
  data() {
    return {
      email: '',
      emailVerified: false,
      errorOcurred: false
    }
  },

  created() {
    this.email = this.$route.params.id
    this.checkEmail()
  },

  methods: {
    checkEmail() {
      //if email not existed in db or bla bla bla error
      var hasError = false

      if (hasError) {
        //redirect home
        this.openNewPage('/', false, true)
        return
      }
      this.emailVerified = true
    }
  }
}
</script>

<style lang="scss" scoped>
#page-wrapper {
  width: 100vw;
  height: 100vh;
}

#logo {
  width: 60px;
  height: 60px;
  display: block;
  object-fit: contain;
  margin: auto;
}
#page-title {
  font-size: 21px;
  display: block;
  font-weight: bold;
  width: 100%;
  text-align: center;
  padding: 20px;
  margin-bottom: 30px;
}

#wrapper {
  width: 90%;
  height: auto;
  max-width: 360px;
  // box-shadow: 0px 1px 3px var(--shadow-color),
  //   -0px -0px 0px var(--shadow-color);
  border-radius: 10px;
  padding: 10px;
}

.no-account {
  color: var(--accent-color);
  display: block;
  text-align: center;
  padding: 5px;
  font-size: 15px;
  margin-top: 30px;
}
</style>