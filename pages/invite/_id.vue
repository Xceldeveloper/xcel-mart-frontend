<template>
  <div id="invite">
    <v-toolbar dark :color="Colors.accent" height="80px" elevation="1">
      <v-toolbar-title>Role Invite</v-toolbar-title>
    </v-toolbar>
    <div id="wrapper">
      <v-row class="fill-height ma-0" align="center" justify="center">
        <div id="loader" v-if="loading">
          <v-progress-linear
            max-width="500"
            width="80%"
            :indeterminate="true"
            :color="Colors.accent"
          ></v-progress-linear>
        </div>
        <h1 v-if="errorOcurred && !loading">An Error Occured</h1>
        <div id="wrapperx" ref="form" v-if="!loading && !errorOcurred">
          <v-text-field
            name="Name"
            ref="name"
            label="Name"
            @keypress.enter="REGISTER"
            :readonly="isSigInUp"
            v-model.trim="name"
            type="text"
            outlined
            :rules="[
         ()=> !!name || 'This field is required',
         () =>  name.length >= 4 || 'At least 4 Characters']"
            rounded
            :append-icon="!!name && name.length ? 'mdi-account-check' : 'mdi-account-outline'"
            :color="Colors.accent"
          ></v-text-field>
          <v-text-field
            name="Email"
            ref="email"
            label="Email"
            :readonly="true"
            v-model.trim="email"
            type="email"
            outlined
            :rules="[
         ()=> !!email || 'This field is required',
         () =>  /.+@.+\..+/.test(email)  || 'Invalid E-mail']"
            rounded
            :append-icon="'mdi-email-outline'"
            :color="Colors.accent"
          ></v-text-field>

          <v-text-field
            name="Phone"
            label="Phone"
            ref="phone"
            hint="080XXXXXXXX"
            :readonly="isSigInUp"
            v-model.trim="phone"
            type="text"
            @keypress.enter="REGISTER"
            outlined
            :rules="[
         ()=> !!phone || 'This field is required',
          () => phone.length == 11 || 'Invaid Number']"
            rounded
            :color="Colors.accent"
            append-icon="mdi-phone"
          ></v-text-field>

          <v-text-field
            ref="password"
            name="Password"
            label="Password"
            hover-color="red"
            type="password"
            @keypress.enter="REGISTER"
            v-model.trim="password"
            :readonly="isSigInUp"
            :rules="[() => !!password || 'This field is required', 
         ()=> password.length >= 4 || 'Password is more than four Characters']"
            :append-icon="password === confirmpassword  && password !=='' ? 'mdi-lock-check' : 'mdi-lock-open-variant-outline'"
            outlined
            rounded
            :color="Colors.accent"
          ></v-text-field>
          <v-text-field
            v-if="password.length >= 4"
            ref="confirmpassword"
            name="Confirm password"
            label="Confirm password"
            @keypress.enter="REGISTER"
            type="password"
            v-model.trim="confirmpassword"
            :readonly="isSigInUp"
            :rules="[() => !!confirmpassword || 'This field is required', 
         ()=> confirmpassword === password || 'Confirmation wrong']"
            :append-icon="password === confirmpassword && password !=='' ? 'mdi-lock-check' : 'mdi-lock-open-variant-outline'"
            outlined
            rounded
            :color="Colors.accent"
          ></v-text-field>

          <v-btn
            @click="REGISTER"
            width="70%"
            style="display:block;margin:auto"
            dark
            :loading="isSigInUp"
            rounded
            :color="Colors.accent"
          >Register</v-btn>
        </div>
      </v-row>
    </div>
  </div>
</template>

<script>
import app_mixin from '~/mixins/app_mixin.js'
import device_mixin from '~/mixins/device_mixin.js'
import user_mixin from '~/mixins/user_mixin.js'
import utils_mixin from '~/mixins/utils_mixin.js'
import navigation_mixin from '~/mixins/navigation_mixin.js'
export default {
  mixins: [
    app_mixin,
    device_mixin,
    user_mixin,
    utils_mixin,
    navigation_mixin
  ],
  data() {
    return {
      loading: true,
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmpassword: '',
      isSigInUp: false,
      formHasErrors: false,
      role: '', //admin or transporter
      errorOcurred: false
    }
  },
  mounted() {
    this.getEmail()
  },

  methods: {
    getEmail() {
      this.loading = true
        //check db with route id
        this.email = ''
        //check role with route id
        this.role = 'ADMIN'
        //hide loader
        this.loading = false
    },
    REGISTER() {
      if (this.isSigInUp) {
        return
      } //to prevent doube click

      if (this.password.length < 4) {
        this.$refs.name.validate(true)
        this.$refs.email.validate(true)
        this.$refs.phone.validate(true)
        this.$refs.password.validate(true)
        return
      }
      this.formHasErrors = false

      Object.keys(this.form).forEach((f) => {
        if (!this.form[f]) {
          this.formHasErrors = true
        }
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

      if (
        this.name.length < 4 ||
        this.password < 4 ||
        this.password !== this.confirmpassword
      ) {
        return
      }

      if (this.formHasErrors) {
        return
      } //if form has error stop func

      ///PLEASE ALWAYS CONVERT PASSWORD TO LOWERCASE
      this.password.toLowerCase()

      this.isSigInUp = true

      setTimeout(() => {
        let details = {
          fullname: this.name,
          email: this.email,
          phone: this.phone,
          password: this.password
        }

        if (this.role == 'ADMIN') {
          this.setAdminDetails(details) //login user
          this.openNewPage('/admin', false)
        } else if (this.role == 'TRANSPORTER') {
          this.setTransporterDetails(details)
          this.openNewPage('/transporter', false)
        }
      }, 3000)
    }
  },
  computed: {
    form() {
      return {
        name: this.name,
        email: this.email,
        phone: this.phone,
        password: this.password,
        confirmpassword: this.confirmpassword
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#invite {
  width: 100%;
  height: 100%;
}

#wrapper {
  width: 100%;
  height: calc(100% - 80px);
}
#wrapperx {
  width: 80%;
  max-width: 400px;
  margin: auto;
}

#loader {
  width: 50%;
  max-width: 300px;
}
</style>