<template>
  <v-dialog v-model="canShow" fullscreen>
    <v-toolbar dark dense :color="Colors.accent">
      <v-btn icon @click="closeMe">
        <v-icon>mdi-chevron-down</v-icon>
      </v-btn>
      <v-toolbar-title>Contact Us</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text @click="confirmPublishDialog = true" :loading="isLoading || isPublishing">Publish</v-btn>
    </v-toolbar>
    <div id="wrapper">
      <div id="contactus">
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-card elevation="0" v-if="!isLoading">
            <v-card-text>
              <v-text-field
                name="Phone"
                label="Phone"
                ref="phone"
                :readonly="isPublishing"
                v-model.trim="phone"
                hint="Your Business Phone Number (important)"
                :persistent-hint="true"
                type="text"
                outlined
                :rules="[
          ()=> !!phone || 'This field is required',
          () => phone.length == 11 || 'Invaid Number']"
                rounded
                :color="Colors.accent"
                append-icon="mdi-phone"
                @click:append="openPhone()"
              ></v-text-field>

              <v-text-field
                name="Email"
                ref="email"
                label="Email"
                :persistent-hint="true"
                hint="This will be used by customers to contact you (important)"
                :readonly="isPublishing"
                v-model.trim="email"
                type="email"
                outlined
                :rules="[
                    ()=> !!email || 'This field is required',
                 () =>  /.+@.+\..+/.test(email)  || 'Invalid E-mail']"
                rounded
                append-icon="mdi-gmail"
                @click:append="openEmail"
              ></v-text-field>

              <v-text-field
                name="Whatsapp "
                label="Whatsapp "
                :readonly="isPublishing"
                v-model.trim="whatsapp"
                hint="Your Business Official Whatsapp Number (optional)"
                type="text"
                outlined
                :rules="[
          () => whatsapp.length == 11 || 'Invaid Number']"
                rounded
                :color="Colors.accent"
                append-icon="mdi-whatsapp"
                @click:append="openWhatsapp"
              ></v-text-field>

              <v-text-field
                name="Messenger "
                label="Messenger "
                :readonly="isPublishing"
                v-model.trim="messenger"
                hint="Your Business Facebook Messenger name (optional)"
                type="text"
                outlined
                rounded
                :color="Colors.accent"
                append-icon="mdi-facebook-messenger"
                @click:append="openMessenger"
              ></v-text-field>

              <v-text-field
                name="Facebook "
                label="Facebook "
                :readonly="isPublishing"
                v-model.trim="facebook"
                hint="Your Business Facebbok Page Name (optional)"
                type="text"
                outlined
                rounded
                :color="Colors.accent"
                append-icon="mdi-facebook"
                @click:append="openFacebook"
              ></v-text-field>

              <v-text-field
                name="Instagram "
                label="Instagram "
                :readonly="isPublishing"
                v-model.trim="instagram"
                hint="Your Business Instagram Page Name (optional)"
                type="text"
                outlined
                rounded
                :color="Colors.accent"
                append-icon="mdi-instagram"
                @click:append="openInstagram"
              ></v-text-field>

              <v-text-field
                name="Twitter "
                label="Twitter "
                :readonly="isPublishing"
                v-model.trim="twitter"
                hint="Your Business Twitter Page Name (optional)"
                type="text"
                outlined
                rounded
                :color="Colors.accent"
                append-icon="mdi-twitter"
                @click:append="openTwitter"
              ></v-text-field>

              <v-text-field
                name="Youtube "
                label="Youtube "
                :readonly="isPublishing"
                v-model.trim="youtube"
                hint="Your Business Youtube Channel Name (optional)"
                type="text"
                outlined
                rounded
                :color="Colors.accent"
                append-icon="mdi-youtube"
                @click:append="openYoutube"
              ></v-text-field>
            </v-card-text>
          </v-card>
        </v-row>
      </div>
    </div>
    <v-bottom-sheet max-width="500px" inset v-model="confirmPublishDialog">
      <v-card>
        <v-card-title>Are you sure you have verfified changes?</v-card-title>
        <v-card-text>
          <v-btn
            @click="confirmPublish"
            dark
            block
            :color="Colors.accent"
            :style="{boderRadius:'0px'}"
          >Yes publish</v-btn>
          <v-btn block :color="Colors.accent" text @click="confirmPublishDialog = false">No</v-btn>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>

    <div>
      <v-snackbar v-model="snackBar" :timeout="snackDurr">{{snackMessage}}</v-snackbar>
    </div>
  </v-dialog>
</template>
<script>
import app_mixin from '~/mixins/app_mixin.js'
import device_mixin from '~/mixins/device_mixin.js'
import utils_mixin from '~/mixins/utils_mixin.js'
export default {
  mixins: [device_mixin, utils_mixin,app_mixin],
  props: {
    canShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
     
      confirmPublishDialog: false,
      isPublishing: false,
      isLoading: false,
      snackBar: false,
      snackMessage: '',
      snackDurr: 2500,
      ContactusArticle: '',

      phone: '',
      email: '',
      whatsapp: '',
      messenger: '',
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: ''
    }
  },

  mounted() {
    if (!this.hasLoaded) {
      this.getArticle()
      this.hasLoaded = true
    }
  },
  methods: {
    openPhone() {
      if (this.phone.length == 11) {
        this.snackBar = true
        this.snackMessage = 'phone'
      } else {
        this.snackBar = true
        this.snackMessage = 'please type in a valid phone number'
      }
    },
    openEmail() {
      if (
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          this.email
        )
      ) {
        this.snackBar = true
        this.snackMessage = 'email'
      } else {
        this.snackBar = true
        this.snackMessage = 'please type in a valid email'
      }
    },
    openWhatsapp() {
      if (this.phone.length == 11) {
        this.snackBar = true
        this.snackMessage = 'whatsapp'
      } else {
        this.snackBar = true
        this.snackMessage = 'please type in a valid whatsapp number'
      }
    },
    openMessenger() {
      if (!this.messenger == '') {
        this.snackBar = true
        this.snackMessage = 'messenger'
      } else {
        this.snackBar = true
        this.snackMessage = 'please type in a valid messenger name'
      }
    },
    openFacebook() {
      if (!this.facebook == '') {
        this.snackBar = true
        this.snackMessage = 'facebook'
      } else {
        this.snackBar = true
        this.snackMessage = 'please type in a valid Facebook Page Name'
      }
    },
    openInstagram() {
      if (!this.instagram == '') {
        this.snackBar = true
        this.snackMessage = 'instagram'
      } else {
        this.snackBar = true
        this.snackMessage = 'please type in a valid Instagram Account Name'
      }
    },
    openTwitter() {
      if (!this.twitter == '') {
        this.snackBar = true
        this.snackMessage = 'twitter'
      } else {
        this.snackBar = true
        this.snackMessage = 'please type in a valid Twitter Handle'
      }
    },
    openYoutube() {
      if (!this.youtube == '') {
        this.snackBar = true
        this.snackMessage = 'Youtube'
      } else {
        this.snackBar = true
        this.snackMessage = 'please type in a valid Youtube Channel Name'
      }
    },
    closeMe() {
      if (!this.isPublishing) this.$emit('cancel', true)
      else this.snackBar = true
      this.snackMessage = 'Please Wait'
    },

    getArticle() {
      this.isLoading = true

      var details = {
        email: 'xceldeveloper@gmail.com',
        phone: '09039276175',
        whatsapp: '08158696460',
        messenger: 'xceldeveloper',
        facebook: 'xceldeveloper',
        instagram: 'xceldeveloper',
        twitter: 'xceldeveloper',
        youtube: 'xcedleveloper'
      }

      setTimeout(() => {
        this.email = details.email
        this.phone = details.phone
        this.whatsapp = details.whatsapp
        //   this.messenger = details.messenger
        this.facebook = details.facebook
        this.instagram = details.instagram
        this.twitter = details.twitter
        //   this.youtube = details.youtube
        this.isLoading = false
      }, 3000)
    },

    confirmPublish() {
      if (this.isPublishing) {
        return
      }

      if (
        !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          this.email
        )
      ) {
        this.confirmPublishDialog = false
        this.snackMessage = 'Please enter valid email'
        this.snackBar = true
        this.$refs.email.validate(true)
        return
      }

      if (this.phone.length !== 11) {
        this.confirmPublishDialog = false
        this.snackMessage = 'Please enter valid phone number'
        this.snackBar = true
        this.$refs.phone.validate(true)
        return
      }

      this.confirmPublishDialog = false
      this.isPublishing = true
      setTimeout(() => {
        this.snackMessage = 'CONTACTS updated'
        this.snackBar = true
        this.isPublishing = false
      }, 3000)
    }
  },
  watch: {
    canShow(val) {
      if (val && !this.hasLoaded) {
        this.getArticle()
        this.hasLoaded = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#wrapper {
  width: 100%;
  height: calc(100vh - 48px);
  margin: auto;
  background-color: #ffffff;
}

#contactus {
  width: 100%;
  height: 100%;
  overflow: auto;
  max-width: 900px;
  margin: auto;
}
</style>