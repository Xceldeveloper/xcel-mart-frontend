<template>
  <div class="error-404" >
      <v-row
      class="fill-height ma-0"
      align="center"
      justify="center">
    <v-card align="center" justify="center" elevation="0" color="#000">
        <img src="~/static/icon.png" id="logo" />
        <h1 class="textc">An Error Occured</h1>
    <v-btn large dark icon to="/"><v-icon>mdi-home-variant</v-icon></v-btn>
    </v-card>
      </v-row>
  </div>
</template>
<script>
import app_mixin from '~/mixins/app_mixin.js'
export default {
    mixins:[app_mixin],
  name: 'error-500',
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
  mounted(){
     this.showError();
  },
  methods:{
      showError(){
          console.log('showing error '+ JSON.stringify(this.error));
      }
  }
};
</script>
<style scoped>
#logo{
  width: 50%;
  max-width: 200px;
  height: auto;
}
.error-404{
    width: 100%;
    height: 100vh;
    background-color: #000;
}

.textc{
    color: #ffffff;
    font-family: sans-serif;
}


.textcx{
    color: #ffffff;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>