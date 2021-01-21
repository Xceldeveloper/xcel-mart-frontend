<template>
  <div id="contact">
    <v-row class="fill-height ma-0" align="center" justify="center">
      <div id="follow-container" v-if="!loading">
        <span
          id="cat-title"
          v-if="facebook !== '' || instagram !== '' || twitter !== '' || youtube !== ''"
        >Follow us on</span>
        <v-btn
          v-if="facebook !== ''"
          @click="openFacebook"
          fab
          :color="Colors.accent"
          :style="{margin:'5px'}"
          icon
        >
          <v-icon size="32px" :color="Colors.acccent">mdi-facebook</v-icon>
        </v-btn>

        <v-btn
          fab
          v-if="instagram !== ''"
          @click="openInstagram"
          :color="Colors.accent"
          :style="{margin:'5px'}"
          icon
        >
          <v-icon size="32px" :color="Colors.accent">mdi-instagram</v-icon>
        </v-btn>

        <v-btn
          fab
          v-if="twitter !== ''"
          @click="openTwitter"
          :color="Colors.accent"
          :style="{margin:'5px'}"
          icon
        >
          <v-icon size="32px" :color="Colors.accent">mdi-twitter</v-icon>
        </v-btn>

        <v-btn
          fab
          v-if="youtube !== ''"
          @click="openYoutube"
          :color="Colors.accent"
          :style="{margin:'5px'}"
          icon
        >
          <v-icon size="32px" :color="Colors.accent">mdi-youtube</v-icon>
        </v-btn>

        <div
          id="contact-container"
          v-if="email !== '' || whatsapp !== '' || messenger !== '' || dialer !== ''"
        >
          <span id="cat-title">Contact us via</span>
          <v-btn
            fab
            v-if="email !== ''"
            @click="openEmail"
            :color="Colors.accent"
            :style="{margin:'5px'}"
            icon
          >
            <v-icon size="32px" :color="Colors.accent">mdi-gmail</v-icon>
          </v-btn>

          <v-btn
            fab
            v-if="whatsapp !== ''"
            @click="openWhatsapp"
            :color="Colors.accent"
            :style="{margin:'5px'}"
            icon
          >
            <v-icon size="32px" :color="Colors.accent">mdi-whatsapp</v-icon>
          </v-btn>

          <v-btn
            fab
            v-if="messenger !== ''"
            @click="openMessenger"
            :color="Colors.accent"
            :style="{margin:'5px'}"
            icon
          >
            <v-icon size="32px" :color="Colors.accent">mdi-facebook-messenger</v-icon>
          </v-btn>

          <v-btn
            fab
            v-if="dialer !== ''"
            @click="openDialer"
            :color="Colors.accent"
            :style="{margin:'5px'}"
            icon
          >
            <v-icon size="32px" :color="Colors.accent">mdi-phone</v-icon>
          </v-btn>
        </div>
      </div>

      <div id="loader-cover" v-if="loading">
        <v-progress-linear width="50%" indeterminate :color="Colors.accent"></v-progress-linear>
      </div>
    </v-row>

    <div id="ccBtn">
      <v-btn fab :x-large="isMobile ? false : true" :color="Colors.accent">
        <v-icon :color="Colors.invertTextColor">mdi-message</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import device_mixin from '~/mixins/device_mixin.js'
import user_mixin from '~/mixins/user_mixin.js'
import app_mixin from '~/mixins/app_mixin.js'
export default {
  mixins: [device_mixin, user_mixin, app_mixin],
  data() {
    return {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: '',

      email: '',
      whatsapp: '',
      messenger: '',
      dialer: '',

      loading: false
    }
  },
  mounted() {
    this.getContactDetails()
  },

  methods: {
    openFacebook() {},
    openInstagram() {},
    openTwitter() {},
    openYoutube() {},

    openEmail() {},
    openWhatsapp() {},
    openMessenger() {},

    openDialer() {},

    getContactDetails() {
      this.loading = true
      setTimeout(() => {
        this.loading = false

        this.facebook = '1'
        this.instagram = '2'
        this.twitter = '3'
        this.youtube = '7'

        this.email = '6'
        this.whatsapp = '5'
        this.dialer = '4'
        this.messenger = '8'
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scope>
#loader-cover {
  width: 50%;
  max-width: 320px;
}
@media screen and (min-width: 767px) {
  #contact {
    width: 100%;
    height: calc(100vh - 48px);
    overflow: auto;
  }

  #follow-container,
  #contact-container {
    width: 95%;
    max-width: 370px;
    text-align: center;
    box-shadow: 0px 1px 3px var(--shadow-color),
      -0px -0px 0px var(--shadow-color);
    padding: 10px;
    margin: auto;
    border-radius: 10px;
  }

  #contact-container {
    margin-top: 5px;
  }

  #cat-title {
    display: block;
    width: 100%;
    padding: 10px;
    border-bottom: 1px solid lightgrey;
    margin: 0px 0px 15px 0px;
  }

  #ccBtn {
    position: fixed;
    bottom: 50px;
    right: 50px;
  }
}

@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: portrait) {
  #contact {
    width: 100%;
    height: calc(100vh - 108px);
    overflow: auto;
  }

  #follow-container,
  #contact-container {
    width: 95%;
    max-width: 340px;
    text-align: center;
    box-shadow: 0px 1px 3px var(--shadow-color),
      -0px -0px 0px var(--shadow-color);
    border-radius: 10px;
    padding: 10px;
    margin: 10px auto 0px auto;
  }

  #cat-title {
    display: block;
    width: 100%;
    padding: 10px;
    border-bottom: 1px solid lightgrey;
    margin: 0px 0px 15px 0px;
  }

  #ccBtn {
    position: fixed;
    bottom: 60px;
    right: 10px;
  }
}

@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {
  #contact {
    width: 100%;
    height: calc(100vh - 48px);
    overflow: auto;
  }

  #follow-container,
  #contact-container {
    width: 95%;
    max-width: 360px;
    text-align: center;
    box-shadow: 0px 1px 3px var(--shadow-color),
      -0px -0px 0px var(--shadow-color);
    border-radius: 10px;
    padding: 10px;
    margin: auto;
  }

  #contact-container {
    margin-top: 5px;
  }

  #cat-title {
    display: block;
    width: 100%;
    padding: 10px;
    border-bottom: 1px solid lightgrey;
    margin: 0px 0px 15px 0px;
  }

  #ccBtn {
    position: fixed;
    bottom: 10px;
    right: 10px;
  }
}

/*for iphone X and others needs to come last or it would confilct with laptop screen*/
@media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: portrait) {
  #contact {
    width: 100%;
    height: calc(100vh - 108px);
    overflow: auto;
  }

  #follow-container,
  #contact-container {
    width: 95%;
    max-width: 340px;
    text-align: center;
    box-shadow: 0px 1px 3px var(--shadow-color),
      -0px -0px 0px var(--shadow-color);
    border-radius: 10px;
    padding: 10px;
    margin: 10px auto 0px auto;
  }

  #cat-title {
    display: block;
    width: 100%;
    padding: 10px;
    border-bottom: 1px solid lightgrey;
    margin: 0px 0px 15px 0px;
  }

  #ccBtn {
    position: fixed;
    bottom: 60px;
    right: 10px;
  }
}

@media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
  #contact {
    width: 100%;
    height: calc(100vh - 48px);
    overflow: auto;
  }

  #follow-container,
  #contact-container {
    width: 95%;
    max-width: 360px;
    text-align: center;
    box-shadow: 0px 1px 3px var(--shadow-color),
      -0px -0px 0px var(--shadow-color);
    border-radius: 10px;
    padding: 10px;
    margin: auto;
  }

  #contact-container {
    margin-top: 5px;
  }

  #cat-title {
    display: block;
    width: 100%;
    padding: 10px;
    border-bottom: 1px solid lightgrey;
    margin: 0px 0px 15px 0px;
  }

  #ccBtn {
    position: fixed;
    bottom: 10px;
    right: 10px;
  }
}
</style>