<template>
  <div id="home">
       <v-row class="fill-height ma-0" align="center" justify="center">
           <div>
               welcome {{getTransporter.fullname}}
           </div>
       </v-row>
  </div>
</template>

<script>
import app_mixin from '~/mixins/app_mixin.js'
import device_mixin from '~/mixins/device_mixin.js'
import utils_mixin from '~/mixins/utils_mixin.js'
import user_mixin from '~/mixins/user_mixin.js'
export default {
     mixins: [device_mixin, utils_mixin,user_mixin],

}
</script>
<style lang="scss" scoped>
#home{
    width: 100%;
    height: 100%;
}
</style>