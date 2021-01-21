<template>
  <div id="wrapper">
    <v-row class="fill-height ma-0" align="center" justify="center">
      <v-card width="90%" max-width="400px" elevation="0">
        <v-card-text>
          <v-text-field
            :readonly="isSearching"
            @click:append="goFetch"
            autofocus
            outlined
            rounded
            :color="Colors.accent"
            label="Search"
            hint="Type Name, Email or Transaction ID"
            v-model.trim="searchQuery"
            :append-icon="searchQuery !== '' ? isSearching  ? 'mdi-loading mdi-spin' : ' mdi-arrow-right' : 'mdi-magnify'"
          ></v-text-field>

          <span id="result-wrapper">
            <span id="result-title" v-if="previousQuery !== '' && !isSearching && !isEmpty">
              Search Results for
              <i>
                <span :style="{color:Colors.accent}">{{previousQuery}}</span>
              </i>
            </span>
            <span id="result-title" v-if="previousQuery !== '' && !isSearching && isEmpty">
              No Search Result for
              <i>
                <span :style="{color:Colors.accent}">{{previousQuery}}</span>
              </i>
            </span>
            <v-chip
              @click="transactionsDialog = true"
              v-if="transactionsCount > 0 && !isSearching"
              style="margin:10px"
              outlined
              dark
              :color="Colors.accent"
            >
              <v-icon left>mdi-clipboard-text-outline</v-icon>
              ({{formatToCurrency(transactionsCount)}}) Transactions
            </v-chip>

            <v-chip
              @click="namesDialog = true"
              v-if="namesCount > 0  && !isSearching"
              style="margin:10px"
              outlined
              dark
              :color="Colors.accent"
            >
              <v-icon left>mdi-account-outline</v-icon>
              {{formatToCurrency(namesCount)}} Names
            </v-chip>

            <v-chip
              @click="emailsDialog = true"
              v-if="emailCount > 0  && !isSearching"
              style="margin:10px"
              outlined
              dark
              :color="Colors.accent"
            >
              <v-icon left>mdi-email-outline</v-icon>
              ({{formatToCurrency(emailCount)}}) Email
            </v-chip>
          </span>
        </v-card-text>
      </v-card>
    </v-row>

    <v-dialog v-model="transactionsDialog" fullscreen>
      <v-toolbar dense elevation="1">
        <v-btn icon @click="transactionsDialog = false" :color="Colors.accent">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>
          <b>{{formatToCurrency(transactionsCount)}}</b> Transaction ID Results
        </v-toolbar-title>
      </v-toolbar>
      <div id="search-result-wrapper"></div>
    </v-dialog>

    <v-dialog v-model="namesDialog" fullscreen>
      <v-toolbar dense elevation="1">
        <v-btn icon @click="namesDialog = false" :color="Colors.accent">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>
          <b>{{formatToCurrency(namesCount)}}</b> Names Results
        </v-toolbar-title>
      </v-toolbar>
      <div id="search-result-wrapper"></div>
    </v-dialog>

    <v-dialog v-model="emailsDialog" fullscreen>
      <v-toolbar dense elevation="1">
        <v-btn icon @click="emailsDialog = false" :color="Colors.accent">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>
          <b>{{formatToCurrency(emailCount)}}</b> Email Results
        </v-toolbar-title>
      </v-toolbar>
      <div id="search-result-wrapper"></div>
    </v-dialog>
  </div>
</template>

<script>
import app_mixin from '~/mixins/app_mixin.js'
import device_mixin from '~/mixins/device_mixin.js'
import utils_mixin from '~/mixins/utils_mixin.js'
export default {
  mixins: [device_mixin, utils_mixin,app_mixin],
  data() {
    return {
     
      searchQuery: '',
      previousQuery: '',
      isSearching: false,
      namesCount: 0,
      transactionsCount: 0,
      emailCount: 0,
      // isEmpty:false,

      transactionsDialog: false,
      namesDialog: false,
      emailsDialog: false
    }
  },
  methods: {
    goFetch() {
      if (this.searchQuery == '') {
        return
      }
      this.isSearching = true

      this.previousQuery = ''
      this.namesCount = 0
      this.transactionsCount = 0
      this.emailCount = 0

      setTimeout(() => {
        this.previousQuery = this.searchQuery
        this.namesCount = 0
        this.transactionsCount = 1334552
        this.emailCount = 0

        this.isSearching = false
      }, 2000)
    }
  },
  computed: {
    isEmpty() {
      if (
        this.namesCount == 0 &&
        this.emailCount == 0 &&
        this.transactionsCount == 0
      ) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#wrapper {
  width: 100%;
  height: 100%;
}
#result-wrapper {
  width: 100%;
  display: block;
  text-align: center;
}

#result-title {
  display: block;
  width: 100%;
  word-spacing: 0px;
}

#search-result-wrapper {
  width: 100%;
  height: calc(100vh - 48px);
  background-color: #ffffff;
  overflow: auto;
}
</style>