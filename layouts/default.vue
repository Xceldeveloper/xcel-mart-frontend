<template>
  <v-app id="app">
    <nuxt keep-alive :keep-alive-props="{ include:cacheStatcks }" />
  </v-app>
</template>

<script>
export default {
  mounted(){
      //polifix for persisent scrollbar
   let eHtml = document.getElementsByTagName('html')[0]
   eHtml.style.overflowY = 'auto'
  },
  computed: {
    Router() {
      return {
        stacks: this.$store.state.routestack.stacks,
        length: this.$store.state.routestack.stacks.length,
        current: this.$store.state.routestack.stacks[
          this.$store.state.routestack.stacks.length - 1
        ],
        previous: this.$store.state.routestack.stacks[
          this.$store.state.routestack.stacks.length - 2
        ],
        paths: this.$store.state.routestack.paths
      }
    },
    cacheStatcks() {
        //console.log(JSON.stringify(this.Router.stacks));
      //  console.log(JSON.stringify(this.Router.paths));
      return this.Router.stacks.join(',')

      // return this.Router.stacks.map(({name}) => name).join(',');
    }
  }
}
</script>
