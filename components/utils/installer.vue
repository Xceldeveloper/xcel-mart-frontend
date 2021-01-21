<template>
  <v-bottom-sheet width="100%" max-width="500px" inset v-model="canShow">
    <v-card v-if="Platform.android">
      <v-card-title>
        <v-icon size="36" left :color="Colors.accent">mdi-google-play</v-icon>Google Play Store
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-list-item>
          <v-list-item-avatar>
            <img src="~/static/icon.png" id="logo" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{AppName}}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn rounded dark small @click="installAndroid" :color="Colors.accent">install</v-btn>
          </v-list-item-action>
        </v-list-item>
        <div id="xperience">Install the Android App For Better Experience</div>
      </v-card-text>
    </v-card>
    <v-card v-if="Platform.ios">
      <v-card-title>
        <v-icon size="36" left :color="Colors.accent">mdi-apple</v-icon>Install App
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <div id="xperience">
          Install this App on your
          <b>Home Screen</b> for Better Experience and Quick Access
        </div>

        <v-list-item>
          <v-list-item-avatar>
            <img src="~/static/icon.png" id="logo" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{AppName}}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn rounded dark small :color="Colors.accent" @click="installIos(true)">Ok Got It</v-btn>
          </v-list-item-action>
        </v-list-item>
        <br />
        <v-btn
          rounded
          block
          outlined
          :color="Colors.accent"
          @click="installIos(false)"
          small
        >still don't understand ?</v-btn>
      </v-card-text>
    </v-card>

    <v-dialog v-model="showiosinstruction" max-width="400px" inset>
      <img src="~/static/iosinstructions.png" id="instructions" />
      <v-btn dark block :color="Colors.accent" @click="installIos(true)">Ok Got it</v-btn>
    </v-dialog>
  </v-bottom-sheet>
</template>

<script>
import device_mixin from '~/mixins/device_mixin.js'
import app_mixin from '~/mixins/app_mixin.js'
export default {
  mixins: [device_mixin, app_mixin],
  data() {
    return {
      canShow: false,
      cachedInstallPrompt: null,
      showiosinstruction: false
    }
  },
  mounted() {
    let displayMode = 'browser tab'
    if (navigator.standalone) {
      displayMode = 'standalone-ios'
    }
    if (window.matchMedia('(display-mode: standalone)').matches) {
      displayMode = 'standalone'
    }

    ///
    if (
      displayMode != 'standalone-ios' &&
      displayMode != 'standalone' &&
      this.Platform.ios &&
      this.$route.path == '/' //very important
    ) {
      this.canShow = true
      window.addEventListener('appinstalled', (evt) => {
        // Log install to analytics
        console.log('INSTALL: Success')
      })
    }
    if (displayMode != 'standalone' && this.Platform.android) {
      this.catchInstallPrompt()
    }
  },
  methods: {
    installAndroid() {
      this.canShow = false
      //cachedInstallPrompt.prompt();
      //open plaaystore link
    },
    installIos(understand) {
      this.canShow = false
      this.showiosinstruction = false
      if (!understand) this.showiosinstruction = true
    },

    catchInstallPrompt() {
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault()
        // Stash the event so it can be triggered later.
        this.cachedInstallPrompt = e
        // Update UI notify the user they can install the PWA
         this.canShow = true
      })
    }
  }
}
</script>

<style>
#logo {
  width: 65px;
  height: 65px;
}
#xperience {
  width: 100%;
  height: auto;
  margin: 10px 0px;
  text-align: center;
}

#instructions {
  width: 100%;
  height: auto;
}
</style>