<template>
  <div id="terms-and-conditions" v-cloak>
    <v-app-bar :color="Colors.accent" dense dark>
      <v-btn dark icon @click="navBack">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-toolbar-title>About</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu left bottom open-on-hover :close-on-click="true" :close-on-content-click="true">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon color="#ffffff">mdi-dots-horizontal</v-icon>
          </v-btn>
        </template>
        <v-card :color="Colors.background" width="220px">
          <v-list-item link to="/">
            <v-list-item-title :style="{color:Colors.subTextColor}">Home</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/termsandconditions">
            <v-list-item-title :style="{color:Colors.subTextColor}">Terms and Conditions</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/faqs">
            <v-list-item-title :style="{color:Colors.subTextColor}">FAQs</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/privacypolicy">
            <v-list-item-title :style="{color:Colors.subTextColor}">Privacy Policy</v-list-item-title>
          </v-list-item>
        </v-card>
      </v-menu>
    </v-app-bar>
    <div id="wwrapper">
      <v-row class="fill-height ma-0" align="center" justify="center">
        <div id="loader" v-if="loading">
          <v-progress-linear
            max-width="500"
            width="80%"
            :indeterminate="true"
            :color="Colors.accent"
          ></v-progress-linear>
        </div>
        <v-card elevation="0" justify="center" align="center" v-if="errorLoading && !loading">
          <v-card-text>
            Error Loading..
            <br />Please check your network connection
            <br />
          </v-card-text>
          <v-btn @click="getArticle" :color="Colors.accent" dark rounded small outlined>Retry</v-btn>
        </v-card>

        <div v-if="!loading && !errorLoading" id="article-container" v-html="formattedAticle"></div>
      </v-row>
    </div>
  </div>
</template>
<script>
import app_mixin from '~/mixins/app_mixin.js'
import navigation_mixin from '~/mixins/navigation_mixin.js'
export default {
  mixins: [navigation_mixin, app_mixin],
  data() {
    return {
      loading: false,
      errorLoading: false,
      article: ''
    }
  },
  mounted() {
    this.getArticle()
  },
  methods: {
    getArticle() {
      this.loading = true
      setTimeout(() => {
        //this.errorLoading = true
        this.loading = false
      }, 2000)
    }
  },
  computed: {
    formattedAticle() {
      return this.article.replace('\n', '<br>')
    }
  }
}
</script>

<style lang="scss" scoped>
#wwrapper {
  width: 100%;
  height: calc(100vh - 48px);
  overflow: auto;
}

#loader {
  width: 50%;
  max-width: 300px;
}
</style>