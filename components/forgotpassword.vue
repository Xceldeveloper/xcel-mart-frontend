<template>
  <div id="page-wrapper">
    <v-row class="fill-height ma-0" align="center" justify="center">
      <br />
      <div id="wrapper" ref="form">
        <img src="~/static/icon.png" id="logo" />
        <span id="page-title">Forgot Password</span>
        <v-text-field
          name="Email"
          ref="email"
          label="Email"
          :readonly="isSendingEmail"
          v-model.trim="email"
          type="email"
          outlined
          :rules="[
         ()=> !!email || 'This field is required',
         () =>  /.+@.+\..+/.test(email)  || 'Invalid E-mail']"
          rounded
          :append-icon="emailVerified ? 'mdi-email' : 'mdi-email-outline'"
          :color="Colors.accent"
           @keypress.enter="FORGOT_PASSWORD"
        ></v-text-field>
        <br />
        <v-btn
          @click="FORGOT_PASSWORD"
          width="70%"
          style="display:block;margin:auto"
          dark
          :loading="isSendingEmail"
          rounded
          :color="Colors.accent"
        >proceed</v-btn>
        <br />
        <br />
        <br>
        <v-btn
          v-if="!isSendingEmail"
          @click="goBackToLogin"
          width="50%"
          style="display:block;margin:auto"
          outlined
          :loading="isSendingEmail"
          rounded
          :color="Colors.accent"
          small
        >login</v-btn>
      </div>
    </v-row>
    <v-snackbar v-model="showToast" :timeout="3000">{{toastMesssage}}</v-snackbar>
  </div>
</template>

<script>
import app_mixin from '~/mixins/app_mixin.js'
import device_mixin from '~/mixins/device_mixin.js'
import user_mixin from '~/mixins/user_mixin.js'
import utils_mixin from '~/mixins/utils_mixin.js'
import navigation_mixin from '~/mixins/navigation_mixin.js'
export default {
  mixins: [device_mixin, user_mixin, navigation_mixin,app_mixin],
  data() {
    return {
     
      email: '',
      emailVerified: false,
      formHasErrors: false,
      isSendingEmail: false,
      errorFORGOT_PASSWORDIn: false,
      toastMesssage: '',
      showToast: false
    }
  },

  methods: {
    FORGOT_PASSWORD() {
      if (this.isSendingEmail) {
        return
      } //to prevent doube click
      this.formHasErrors = false
      Object.keys(this.form).forEach((f) => {
        if (!this.form[f]) this.formHasErrors = true
        this.$refs[f].validate(true)
      })

      //email second test
      if (
        !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          this.email
        )
      ) {
        return
      }
      if (this.formHasErrors) {
        return
      } //if form has error stop func
      this.isSendingEmail = true

      setTimeout(() => {
        ///then
        //check server if email exist then recovery email
        let result = 'xceldeveloper@gmail.com' //dummy email
        if (this.email === result) {
          this.showToast = true
          this.toastMesssage = 'Recovery Link has been Sent to your email'
        } else {
          this.showToast = true
          this.toastMesssage = "Email doesn't exist"
        }
        this.isSendingEmail = false
      }, 3000)
      //})
    },

    goBackToLogin() {
      this.$emit('login')
    }
  },

  computed: {
    form() {
      return {
        email: this.email
      }
    }
  },
  watch: {
    email(val) {
      if (
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          val
        )
      ) {
        this.emailVerified = true
      } else {
        this.emailVerified = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#page-wrapper {
  width: 100vw;
  height: 100vh;
}

#logo {
  width: 60px;
  height: 60px;
  display: block;
  object-fit: contain;
  margin: auto;
}
#page-title {
  font-size: 21px;
  display: block;
  font-weight: bold;
  width: 100%;
  text-align: center;
  padding: 20px;
  margin-bottom: 30px;
}

#wrapper {
  width: 90%;
  height: auto;
  max-width: 360px;
  // box-shadow: 0px 1px 3px var(--shadow-color),
  //   -0px -0px 0px var(--shadow-color);
  border-radius: 10px;
  padding: 10px;
}

.no-account {
  color: var(--accent-color);
  display: block;
  text-align: center;
  padding: 5px;
  font-size: 15px;
  margin-top: 30px;
}
</style>