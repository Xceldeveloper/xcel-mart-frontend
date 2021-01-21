<template>
  <div class="error-404" >
      <v-row
      class="fill-height ma-0"
      align="center"
      justify="center">
    <v-card align="center" justify="center" elevation="0" color="#101010">
        <img src="~/static/icon.png" id="logo" />
        <h1 class="textc">This page doesn’t exist</h1>
    <p class="textcx">The link you clicked on may be broken or no longer exist.</p>
    <v-btn large dark icon to="/"><v-icon>mdi-home-variant</v-icon></v-btn>
    </v-card>
      </v-row>
  </div>
</template>
<script>
import app_mixin from '~/mixins/app_mixin.js'
export default {
    mixins:[app_mixin],
  name: 'error-404',
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
};
</script>
<style scoped>

#logo{
  width: 40%;
  max-width: 200px;
  height: auto;
}
.error-404{
    width: 100%;
    height: 100vh;
    background-color: #101010;
}

.textc{
    color: #ffffff;
    font-family: sans-serif;
}


.textcx{
    color: #929796;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>