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
    <component
      @register="selectedComponent = 'createaccount'"
      @forgotpassword="selectedComponent = 'forgotpassword'"
      @login="selectedComponent = 'login'"
      @redirect="redirect"
      :is="selectedComponent"
    ></component>

    <installer />
  </div>
</template>

<script>
import app_mixin from '~/mixins/app_mixin.js'
import device_mixin from '~/mixins/device_mixin.js'
import user_mixin from '~/mixins/user_mixin.js'
import utils_mixin from '~/mixins/utils_mixin.js'
import navigation_mixin from '~/mixins/navigation_mixin.js'
import login from '~/components/login.vue'
import forgotpassword from '~/components/forgotpassword.vue'
import createaccount from '~/components/createaccount.vue'
import installer from '~/components/utils/installer.vue'
export default {
  mixins: [device_mixin, user_mixin, navigation_mixin, app_mixin],
  components: {
    login: login,
    forgotpassword: forgotpassword,
    createaccount: createaccount,
    installer
  },
  data() {
    return {
      CANRENDER: false,
      selectedComponent: 'login'
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
        this.openNewPage('/transporter', false, true)
      } else if (this.isCutomerSignedIn) {
        this.openNewPage('/', false, true)
      } else if (this.isAdminSignedIn) {
        this.openNewPage('/admin', false, true)
      }
    } else {
      this.CANRENDER = true
    }
  },
  methods: {
    redirect(result) {
      this.openNewPage(result.url, result.history, result.clear)
    }
  }
}
</script>
<style lang="scss" scoped>
#wrapper {
  width: 100vw;
  height: 100vh;
}
</style>