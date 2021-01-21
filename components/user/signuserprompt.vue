<template>
  <v-dialog
      v-model="canShow"
      scrollable fullscreen 
      persistent :overlay="false"
      max-width="500px"
      transition="dialog-transition">
     <v-btn color="success"   @click="close">hi</v-btn>
  </v-dialog>
</template>

<script>
export default {
    props:{
        canShow:{
            default:false
        }
    },
    methods:{
        close(){
            this.$emit('close')
        }
    }

}
</script>

<style>

</style>