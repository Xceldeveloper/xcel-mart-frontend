<template>
  <div id="page-wrapper">
    <v-row class="fill-height ma-0" align="center" justify="center">
      <br />
      <div id="wrapper" ref="form">
        <img src="~/static/icon.png" id="logo" />
        <span id="page-title">Create Account</span>
        <v-text-field
          name="Name"
          ref="name"
          label="Name"
          @keypress.enter="REGISTER"
          hint="Can be your personal name or business name"
          :readonly="isSigInUp"
          v-model.trim="name"
          type="text"
          outlined
          :rules="[
            () => !!name || 'This field is required',
            () => name.length >= 4 || 'At least 4 Characters'
          ]"
          rounded
          :append-icon="
            !!name && name.length ? 'mdi-account-check' : 'mdi-account-outline'
          "
          :color="Colors.accent"
        ></v-text-field>
        <v-text-field
          name="Email"
          ref="email"
          label="Email"
          @keypress.enter="REGISTER"
          :readonly="isSigInUp || checkingEmail"
          v-model.trim="email"
          type="email"
          @blur="verifyEmail"
          outlined
          :rules="[
            () => !!email || 'This field is required',
            () => /.+@.+\..+/.test(email) || 'Invalid E-mail'
          ]"
          rounded
          :append-icon="
            checkingEmail
              ? 'mdi-loading mdi-spin'
              : emailVerified
              ? 'mdi-email-check'
              : 'mdi-email-outline'
          "
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
            () => !!phone || 'This field is required',
            () => phone.length == 11 || 'Invaid Number'
          ]"
          rounded
          :color="Colors.accent"
          append-icon="mdi-phone"
        ></v-text-field>

        <v-text-field
          name="Country"
          label="Country"
          ref="country"
          @focus="selectCountry = true"
          :readonly="true"
          v-model.trim="country"
          type="text"
          @keypress.enter="REGISTER"
          outlined
          :rules="[() => !!country || 'This field is required']"
          rounded
          :color="Colors.accent"
          append-icon="mdi-map-legend"
        ></v-text-field>

        <v-text-field
          v-if="
            country !== '' &&
              emailVerified &&
              !!name &&
              name.length >= 4 &&
              phone.length == 11
          "
          name="State"
          label="State"
          ref="state"
          @focus="selectState = true"
          :readonly="true"
          v-model.trim="state"
          type="text"
          @keypress.enter="REGISTER"
          outlined
          :rules="[() => !!state || 'This field is required']"
          rounded
          :color="Colors.accent"
          :append-icon="
            stateList.length === 0
              ? 'mdi-loading mdi-spin'
              : 'mdi-toy-brick-marker-outline'
          "
        ></v-text-field>

        <v-text-field
          v-if="state !== ''"
          name="Town"
          label="Town"
          ref="town"
          @focus="selectTown = true"
          :readonly="true"
          @keypress.enter="REGISTER"
          v-model.trim="town"
          type="text"
          outlined
          :rules="[() => !!town || 'This field is required']"
          rounded
          :color="Colors.accent"
          :append-icon="
            townList.length === 0
              ? 'mdi-loading mdi-spin'
              : 'mdi-city-variant-outline'
          "
        ></v-text-field>

        <v-text-field
          v-if="state !== '' && town !== ''"
          ref="password"
          name="Password"
          label="Password"
          hover-color="red"
          type="password"
          @keypress.enter="REGISTER"
          v-model.trim="password"
          :readonly="isSigInUp"
          :rules="[
            () => !!password || 'This field is required',
            () =>
              password.length >= 4 || 'Password is more than four Characters'
          ]"
          :append-icon="
            password === confirmpassword && password !== ''
              ? 'mdi-lock-check'
              : 'mdi-lock-open-variant-outline'
          "
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
          :rules="[
            () => !!confirmpassword || 'This field is required',
            () => confirmpassword === password || 'Confirmation wrong'
          ]"
          :append-icon="
            password === confirmpassword && password !== ''
              ? 'mdi-lock-check'
              : 'mdi-lock-open-variant-outline'
          "
          outlined
          rounded
          :color="Colors.accent"
        ></v-text-field>
        <span v-if="password === confirmpassword && password !== ''" id="agree">
          By clicking
          <b>Register</b> you agree to our
          <nuxt-link to="/privacypolicy">Privacy policy</nuxt-link>and also
          <nuxt-link to="/termsandconditions">Terms and Conditions</nuxt-link>
        </span>
        <v-btn
          @click="REGISTER"
          width="70%"
          style="display:block;margin:auto"
          dark
          :loading="isSigInUp"
          rounded
          :color="Colors.accent"
          >Register</v-btn
        >
        <span v-if="!isSigInUp" @click="noAccount" class="no-account"
          >Already have an account ?</span
        >
      </div>
    </v-row>
    <v-snackbar v-model="snackBarMedia" :timeout="3000">{{
      snackMessage
    }}</v-snackbar>

    <dynamicselect
      @selected="selectedCountry"
      @close="selectCountry = false"
      :color="Colors.accent"
      :name-key="'name'"
      title="Select Country"
      :activate="selectCountry"
      :items="countryList"
    >
      <template v-slot:custom="{ options }">
        <div id="plan-wrapper">
          <span class="plan-value">{{ options.name }}</span>
        </div>
      </template>
    </dynamicselect>

    <dynamicselect
      @selected="selectedState"
      @close="selectState = false"
      :color="Colors.accent"
      title="Select State"
      :name-key="'name'"
      :activate="selectState"
      :items="stateList"
    >
      <template v-slot:custom="{ options }">
        <div id="plan-wrapper">
          <span class="plan-value">{{ options.name }}</span>
        </div>
      </template>
    </dynamicselect>

    <dynamicselect
      @selected="selectedTown"
      @close="selectTown = false"
      :color="Colors.accent"
      :name-key="'name'"
      title="Select Town"
      :activate="selectTown"
      :items="townList"
    >
      <template v-slot:custom="{ options }">
        <div id="plan-wrapper">
          <span class="plan-value">{{ options.name }}</span>
        </div>
      </template>
    </dynamicselect>

    <v-dialog
      v-model="verifyEmailDialog"
      max-width="350px"
      :persistent="true"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title>Verify Email</v-card-title>

        <v-card-text>
          Welcome
          <b>{{ name }}</b
          >, Please to Complete your Registration Please Check your email
          <b>"{{ email }}"</b> to follow instructions on how to verify your
          email. IT IS VERY IMPORTANT
        </v-card-text>

        <v-card-actions>
          <v-btn
            @click="openLink({ url: '/', history: false, clear: true })"
            dark
            small
            :color="Colors.accent"
            >OK Got it</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import app_mixin from '~/mixins/app_mixin.js'
import device_mixin from '~/mixins/device_mixin.js'
import user_mixin from '~/mixins/user_mixin.js'
import utils_mixin from '~/mixins/utils_mixin.js'
import navigation_mixin from '~/mixins/navigation_mixin.js'
import dynamicselect from '~/components/utils/dynamicselect.vue'
export default {
  components: {
    dynamicselect
  },
  mixins: [device_mixin, navigation_mixin, app_mixin, user_mixin],
  data() {
    return {
      name: '',
      email: '',
      phone: '',
      country: '',
      countryList: [],
      state: '',
      stateList: [],
      town: '',
      townList: [],
      password: '',
      confirmpassword: '',
      selectCountry: false,
      selectState: false,
      selectTown: false,
      emailVerified: false,
      checkingEmail: false,
      formHasErrors: false,
      isSigInUp: false,
      isSigInUp: false,
      snackMessage: '',
      snackBarMedia: false,
      verifyEmailDialog: false,
      selectedCountryDetails: {
        id: null,
        name: null,
        currency: null,
        currency_abbr: null,
        currency_symbol: null,
        flag: null
      },
      selectedStateDetails: {
        id: null,
        name: null,
        country: null
      },
      selectedTownDetails: {
        id: null,
        name: null,
        location: null,
        remote: null,
        state: null
      }
    }
  },

  methods: {
    REGISTER() {
      if (this.isSigInUp) {
        return
      } //to prevent doube click

      if (
        this.country === '' ||
        !this.emailVerified ||
        this.name === '' ||
        this.name.length < 4 ||
        this.phone.length !== 11
      ) {
        ///second check point
        this.$refs.name.validate(true)
        this.$refs.email.validate(true)
        this.$refs.phone.validate(true)
        this.$refs.country.validate(true)
        return
      }

      if (this.state === '') {
        ///second check point
        this.$refs.state.validate(true)
        return
      } else if (this.town === '') {
        this.$refs.town.validate(true)
        return
      }

      if (this.password === '') {
        ///third check point
        this.$refs.password.validate(true)
        return
      } else if (this.confirmpassword === '') {
        this.$refs.confirmpassword.validate(true)
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
      //  this.password.toLowerCase()

      this.isSigInUp = true

      var details = {
        // id:-1,
        fullname: this.name,
        email: this.email,
        phone: this.phone,
        country_id: this.selectedCountryDetails.id,
        country: this.selectedCountryDetails.name,

        state_id: this.selectedStateDetails.id,
        state: this.selectedStateDetails.name,

        town_id: this.selectedTownDetails.id,
        town: this.selectedTownDetails.name,
        password: this.password.toLowerCase(),
        level: 1,
        role: 'CUSTOMER',
        status: true
      }

      

      this.$axios
        .$post('createuser/', details)
        .then((res) => {
          this.setCustomerDetails(details) //login user
          this.verifyEmailDialog = true // show email verification notice
           this.snackMessage =
             'Welcome, Please Check your Email to verify your account'
           this.snackBarMedia = true
          this.isSigInUp = false

          setTimeout(() => {
            this.$router.replace('/') //redirect home
          }, 3000)
        })
        .catch((err) => {
          this.snackMessage =
             'Error Occurred'
           this.snackBarMedia = true
           this.isSigInUp = false

        })


    },
    noAccount() {
      if (this.isSigInUp) {
        return
      } //if creating account stop function
      this.$emit('login')
    },

    openLink(link) {
      this.$emit('redirect', {
        url: link.url,
        history: link.history,
        clear: link.clear
      })
    },

    verifyEmail() {
      if (
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          this.email
        )
      ) {


        //check if it is a valid email
        //then check db if email is not exist
        this.checkingEmail = true

         this.$axios
        .$get('/checkemail?email=' + this.email)
        .then((res) => {
          if(res == 0 || res == ''){
            this.emailVerified = true
              this.checkingEmail = false
          }else{
             this.emailVerified = false
              this.checkingEmail = false
              this.snackMessage = 'Email is Already in Use Please Change'
              this.snackBarMedia = true
          }
        })
        .catch((err) => {})


        
      }
    },

    getCountryLists() {
      this.$axios
        .$get('/listcountries')
        .then((res) => {
          this.countryList = res
        })
        .catch((err) => {})
    },

    getStateLists() {
      this.$axios
        .$get('/liststates?country=' + this.selectedCountryDetails.id)
        .then((res) => {
          this.stateList = res
        })
        .catch((err) => {})
    },

    getTownList() {
      this.$axios
        .$get('/liststowns?state=' + this.selectedStateDetails.id)
        .then((res) => {
          this.townList = res
        })
        .catch((err) => {})
    },

    selectedCountry(result) {
      this.country = result.name

      this.selectedCountryDetails.id = result.id
      this.selectedCountryDetails.name = result.name
      this.selectedCountryDetails.currency = result.currency
      this.selectedCountryDetails.currency_abbr = result.currency_abbr
      this.selectedCountryDetails.currency_symbol = result.currency_symbol
      this.selectedCountryDetails.flag = result.flag
    },
    selectedState(result) {
      this.state = result.name

      this.selectedStateDetails.id = result.id
      this.selectedStateDetails.name = result.name
      this.selectedStateDetails.country = result.country
    },

    selectedTown(result) {
      this.town = result.name

      this.selectedTownDetails.id = result.id
      this.selectedTownDetails.name = result.name
      this.selectedTownDetails.location = result.location
      this.selectedTownDetails.remote = result.remote
      this.selectedTownDetails.state = result.state
    }
  },

  computed: {
    form() {
      return {
        name: this.name,
        email: this.email,
        phone: this.phone,
        country: this.country,
        state: this.state,
        town: this.town,
        password: this.password,
        confirmpassword: this.confirmpassword
      }
    }
  },
  watch: {
    selectCountry(val) {
      if (this.countryList.length === 0) {
        this.getCountryLists()
      }
    },
    country(val, oldVal) {
      this.state = ''
      this.getStateLists(val, oldVal)
    },
    state(val, oldVal) {
      this.town = ''
      this.getTownList(val, oldVal)
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

#agree {
  font-size: 12px;
  padding: 5px;
  display: block;
  text-align: center;
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