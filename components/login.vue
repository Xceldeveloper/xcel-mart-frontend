<template>
  <div id="page-wrapper">
    <v-row class="fill-height ma-0" align="center" justify="center">
      <br />
      <div id="wrapper" ref="form">
        <img src="~/static/icon.png" id="logo" />
        <span id="page-title">Login</span>
        <v-text-field
          name="Email"
          ref="email"
          label="Email"
          :readonly="isLoginIn"
          v-model.trim="email"
          type="email"
          @keypress.enter="LOGIN"
          outlined
          :rules="[
            () => !!email || 'This field is required',
            () => /.+@.+\..+/.test(email) || 'Invalid E-mail'
          ]"
          rounded
          :append-icon="emailVerified ? 'mdi-email' : 'mdi-email-outline'"
          :color="Colors.accent"
        ></v-text-field>
        <v-text-field
          ref="password"
          name="Password"
          label="Password"
          hover-color="red"
          v-model.trim="password"
          :readonly="isLoginIn"
          :rules="[
            () => !!password || 'This field is required',
            () =>
              password.length >= 4 || 'Password is more than four Characters'
          ]"
          :type="togglePassword ? 'text' : 'password'"
          :append-icon="togglePassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append="togglePassword = !togglePassword"
          @keypress.enter="LOGIN"
          outlined
          rounded
          :color="Colors.accent"
        ></v-text-field>
        <v-btn
          @click="LOGIN"
          width="70%"
          style="display:block;margin:auto"
          dark
          :loading="isLoginIn"
          rounded
          :color="Colors.accent"
          >Login</v-btn
        >
        <span @click="noAccount" class="no-account"
          >Don't have an account ?</span
        >

        <span class="no-account" @click="forgotPassword">
          <b>Forgot Password ?</b>
        </span>

        
        <span class="no-account" @click="viewlogDetails = true">
         <v-btn :color="Colors.accent" small rounded outlined dark>Vew login details</v-btn>
        </span>
      </div>
    </v-row>
    <v-snackbar v-model="errorLoginIn" :timeout="3000">{{
      errorMessage
    }}</v-snackbar>


    <v-bottom-sheet inset v-model="viewlogDetails" max-width="500">
      <v-card>
        <v-card-title>Login Details</v-card-title>
        <v-card-text>
           <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-title>Customer</v-list-item-title>
        <v-list-item-subtitle>
          <b>Email</b> customer@testmail.com
        </v-list-item-subtitle>
        <v-list-item-subtitle>
         <b>Password</b> 1000
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
     <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-title>Driver</v-list-item-title>
        <v-list-item-subtitle>
         <b>Email</b> transporter@testmail.com
        </v-list-item-subtitle>
        <v-list-item-subtitle>
         <b>Password</b> 2000
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
     <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-title>Admin</v-list-item-title>
        <v-list-item-subtitle>
         <b>Email</b> admin@testmail.com
        </v-list-item-subtitle>
        <v-list-item-subtitle>
         <b>Password</b> 3000
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script>
import app_mixin from '~/mixins/app_mixin.js'
import device_mixin from '~/mixins/device_mixin.js'
import user_mixin from '~/mixins/user_mixin.js'
import utils_mixin from '~/mixins/utils_mixin.js'
export default {
  mixins: [device_mixin, user_mixin, app_mixin],
  data() {
    return {
      email: '',
      emailVerified: false,
      password: '',
      togglePassword: false,
      formHasErrors: false,
      isLoginIn: false,
      errorLoginIn: false,
      errorMessage: '',
      viewlogDetails:false
    }
  },

  methods: {
    LOGIN() {
      if (this.isLoginIn) {
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

      this.isLoginIn = true


      // this.$axios
      //   .$get('/finduser?email=' + this.email + '&password=' + this.password)
      //   .then((res) => {
      //     if (res.length > 0) {
      //        var result = res[0];

      //       if (result.role == 'CUSTOMER' || result.level == 1) {
      //         this.setCustomerDetails(result)
      //         this.$emit('redirect', { url: '/', history: false, clear: true })
      //       } else if (result.role == 'TRANSPORTER' || result.level == 2) {
      //         this.setTransporterDetails(result)
      //         this.$emit('redirect', {
      //           url: '/transporter',
      //           history: false,
      //           clear: true
      //         })
      //       } else if (
      //         result.role == 'ADMIN' ||
      //         result.level == 3 ||
      //         result.level == 4 ||
      //         result.level == 5
      //       ) {
      //         this.setAdminDetails(result)
      //         this.$emit('redirect', {
      //           url: '/admin',
      //           history: false,
      //           clear: true
      //         })
      //       }

      //       this.isLoginIn = false
      //     } else {
      //       this.errorMessage = 'Login details not correct'
      //       this.errorLoginIn = true
      //       this.isLoginIn = false
      //     }
      //   })

      const result = {
       id:21,
       fullname:"Overcomer Emiator",
       email:"xceldeveloper@gmail.com",
       phone:"08158696460",
       country:"Nigera",
       country_id:12,
        state:"Edo",
        state_id:23,
        town:"Ugbowor",
       town_id:34

      }

      setTimeout(() => {
        //then
       // check server //search
        if (
          this.email === 'customer@testmail.com' &&
          this.password === '1000'
        ) {
          this.setCustomerDetails(result)
          this.$emit('redirect', { url: '/', history: false,clear:true })
        } else if (
          this.email === 'transporter@testmail.com' &&
          this.password === '2000'
        ) {
          this.setTransporterDetails(result)
          this.$emit('redirect', { url: '/transporter', history: false,clear:true })
        } else if (
          this.email === 'admin@testmail.com' &&
          this.password === '3000'
        ) {
          this.setAdminDetails(result)
          this.$emit('redirect', { url: '/admin', history: false,clear:true })
        } else {
          this.errorMessage = 'Login details not correct'
          this.errorLoginIn = true
        }
        this.isLoginIn = false
      }, 3000)
      
    },
    noAccount() {
      this.$emit('register')
    },
    forgotPassword() {
      this.$emit('forgotpassword')
    }
  },

  computed: {
    form() {
      return {
        email: this.email,
        password: this.password
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
  width: 80px;
  height: 80px;
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
  cursor: pointer;
}
</style>