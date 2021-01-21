<template>
  <div id="profile" v-cloak v-if="CANRENDER">
    <style>
  :root{
   --accent-color:{{Colors.accent}};
     --text-color:{{Colors.text}};
      --subtext-color:{{Colors.subTextColor}};
     --inverttext-color:{{Colors.invertTextColor}};
     --background-color:{{Colors.background}};
     --texture-color:{{Colors.textTure}};
      --shadow-color:{{Colors.shadowColor}};
    }
    </style>
    <v-app-bar :color="Colors.accent" dark dense fixed width="100%">
      <v-btn icon @click="navBack">
        <v-icon color="#ffffff">mdi-chevron-left</v-icon>
      </v-btn>
      <v-toolbar-title class="mr-12 align-center" color="#ffffff">Profile</v-toolbar-title>
    </v-app-bar>
    <div id="profile-wrapper">
      <div id="profile-details">
        <v-list-item two-line>
          <v-list-item-avatar
            :width="isMobile ? 60 : 100"
            :height="isMobile ? 60 : 100"
            color="#ededed"
          >
            <v-icon :size="isMobile ? 35 : 50" :color="Colors.accent">mdi-account</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              <span class="username">{{getCustomer.fullname}}</span>
            </v-list-item-title>
            <v-list-item-subtitle>
              <span class="fullname" :style="{color:Colors.subTextColor}">{{getCustomer.email}}</span>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </div>
      <v-list>
        <v-list-item link @click="editProfileBottomSheet = true">
          <v-list-item-action>
            <v-icon :color="Colors.accent">mdi-account-cog-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/user/cart">
          <v-list-item-action>
            <v-icon :color="Colors.accent">mdi-cart-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>My Cart</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="editPasswordBottomSheet = true">
          <v-list-item-action>
            <v-icon :color="Colors.accent">mdi-key-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Change Password</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="canLogout = true">
          <v-list-item-action>
            <v-icon :color="Colors.accent">mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <br />
      <v-list>
        <v-divider></v-divider>
        <v-list-item link to="/termsandconditions">
          <v-list-item-content>
            <v-list-item-title>Terms and Conditions</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/privacypolicy">
          <v-list-item-content>
            <v-list-item-title>Privacy Policy</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="faqs">
          <v-list-item-content>
            <v-list-item-title>Frequently Asked Questions</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="about">
          <v-list-item-content>
            <v-list-item-title>About Us</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <br />
    </div>

    <!-- /////////////////////////// -->
    <v-dialog
      width="96%"
      max-width="400"
      v-model="editProfileBottomSheet"
      :persistent="changingProfile"
    >
      <div id="edit-profile-wrapper1">
        <v-card color>
          <v-card-title>Edit Profile</v-card-title>
          <v-card-text>
            <v-text-field
              name="Name"
              label="Name"
              v-model.trim="editFullname"
              :readonly="changingProfile"
              :error-messages="profileErrors.fullname"
              type="text"
              hint="Can be your Personal Name or Business Name"
              :color="Colors.accent"
            ></v-text-field>

            <v-text-field
              name="E-mail"
              v-model.trim="editEmail"
              :readonly="changingProfile"
              :error-messages="profileErrors.email"
              label="E-mail"
              type="email"
              :color="Colors.accent"
            ></v-text-field>

            <v-text-field
              name="Phone"
              v-model.trim="editPhone"
              :readonly="changingProfile"
              :error-messages="profileErrors.phone"
              label="Phone"
              type="text"
              :color="Colors.accent"
            ></v-text-field>

            <v-text-field
              name="Country"
              :loading="countriesLoading"
              :error-messages="profileErrors.country"
              v-model="editCountry"
              @focus="changingProfile ? selectCountry = false : selectCountry = true"
              :color="Colors.accent"
              label="Country"
              readonly
            ></v-text-field>

            <v-text-field
              v-if="editCountry != '' "
              name="State"
              :loading="statesLaoading"
              :error-messages="profileErrors.state"
              @focus="changingProfile ? selectState = false : selectState = true"
              :color="Colors.accent"
              v-model="editState"
              label="State"
              readonly
            ></v-text-field>

            <v-text-field
              v-if="editState != ''"
              name="Town"
              :loading="townsLoading"
              :error-messages="profileErrors.town"
              @focus="changingProfile ? selectTown = false : selectTown = true"
              :color="Colors.accent"
              v-model="editTown"
              label="Town"
              readonly
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn
              :loading="changingProfile"
              @click="EDIT_PROFILE"
              v-if="profileEdit"
              dark
              :color="Colors.accent"
            >save</v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-dialog>
    <v-snackbar v-model="profileupdateSnackBar" :timeout="2500">Profile Updated</v-snackbar>

    <!-- /////////////////////////////////////////////////////////////////////// -->
    <v-bottom-sheet
      width="90%"
      max-width="500"
      v-model="editPasswordBottomSheet"
      :persistent="verifyingPassword || changingPassWord"
    >
      <v-card justify="center" align="center">
        <v-card-title>Change Password</v-card-title>
        <v-card-text>
          <v-text-field
            v-if="!canChangePassWord"
            outlined
            rounded
            autofocus
            :readonly="verifyingPassword"
            name="Old Password"
            label="Current password"
            v-model.trim="oldPassWord"
            :error-messages="changePassword.oldpass"
            type="text"
            :color="Colors.accent"
            :append-icon="verifyingPassword ? 'mdi-loading mdi-spin' : 'mdi-send'"
            @click:append="proceedToConfirmPassword"
            @keyup.enter="proceedToConfirmPassword"
          ></v-text-field>
          <v-text-field
            v-if="canChangePassWord"
            name="New passowrd"
            label="New password"
            v-model.trim="newPassWord"
            @keyup.enter="CHANGE_PASSWORD"
            :readonly="changingPassWord"
            :error-messages="changePassword.newpass"
            type="password"
            :color="Colors.accent"
          ></v-text-field>
          <v-text-field
            v-if="canChangePassWord"
            :readonly="changingPassWord"
            name="Confirm password"
            label="Confirm password"
            v-model.trim="confirmPassWord"
            @keyup.enter="CHANGE_PASSWORD"
            :error-messages="changePassword.confirmpass"
            type="password"
            :color="Colors.accent"
          ></v-text-field>
        </v-card-text>
        <v-card-actions v-if="canChangePassWord">
          <v-btn
            :loading="changingPassWord"
            rounded
            dark
            @click="CHANGE_PASSWORD"
            :color="Colors.accent"
          >Change Password</v-btn>
        </v-card-actions>
      </v-card>
    </v-bottom-sheet>
    <v-snackbar v-model="passwordupdateSnackBar" :timeout="2500">Password Changed Successfully</v-snackbar>

    <dynamicselect
      @selected="selectedCountry"
      @close="selectCountry = false"
      :color="Colors.accent"
      title="Select Country"
      :activate="selectCountry"
      :items="countryList"
    />
    <dynamicselect
      name-key="state"
      @selected="selectedState"
      @close="selectState = false"
      :color="Colors.accent"
      title="Select State"
      :activate="selectState"
      :items="stateList"
    >
      <template v-slot:custom="{options}">
        <v-list-item link>
          <v-list-item-content>{{options.state}}</v-list-item-content>
        </v-list-item>
      </template>
    </dynamicselect>
    <dynamicselect
      name-key="town"
      @selected="selectedTown"
      @close="selectTown = false"
      :color="Colors.accent"
      title="Select Town"
      :activate="selectTown"
      :items="townLists"
    >
      <template v-slot:custom="{options}">
        <v-list-item link>
          <v-list-item-content>{{options.town}}</v-list-item-content>
        </v-list-item>
      </template>
    </dynamicselect>

    <v-snackbar v-model="snackbarMedia" :timeout="1000">{{snackbarMessage}}</v-snackbar>

    <v-snackbar v-model="canLogout" :timeout="3500">
      Are you Sure you want to logout?
      <v-btn text dark @click.native="loginOut">YES</v-btn>
    </v-snackbar>

     <installer/>
  </div>
</template>
<script>
import navigation_mixin from '~/mixins/navigation_mixin.js'
import user_mixin from '~/mixins/user_mixin.js'
import device_mixin from '~/mixins/device_mixin.js'
import app_mixin from '~/mixins/app_mixin.js'
import dynamicselect from '~/components/utils/dynamicselect.vue'
import installer from '~/components/utils/installer.vue'
export default {
  components: {
    dynamicselect,
     installer
  },
  mixins: [
    navigation_mixin,
    user_mixin,
    device_mixin,
    app_mixin
  ],
  data() {
    return {
      userId: 0,
      CANRENDER: false,
      editProfileBottomSheet: false,

      editFullname: '',
      editEmail: '',
      editPhone: '',
      editCountry: '',
      editState: '',
      editTown: '',
      countryList: [],
      countriesLoading: false,
      stateList: [],
      statesLaoading: false,
      townLists: [],
      townsLoading: false,
      profileEdit: false,
      profileErrors: {
        fullname: '',
        email: '',
        phone: '',
        state: '',
        town: ''
      },
      changingProfile: false,

      activateProfileEditWatcher: false, //to hold watcher from showing save btn onMounted()
      profileupdateSnackBar: false,

      currentPassWord: '',
      oldPassWord: '',
      newPassWord: '',
      confirmPassWord: '',
      verifyingPassword: false,
      changingPassWord: false,
      editPasswordBottomSheet: false,
      changePassword: {
        oldpass: '',
        newpass: '',
        confirmpass: ''
      },

      passwordupdateSnackBar: false,
      canChangePassWord: false,

      selectCountry: false,
      selectState: false,
      selectTown: false,

      snackbarMessage: '',
      snackbarMedia: false,
      canLogout: false
    }
  },
  mounted() {
    this.CANRENDER = false
    if (
      this.isTransporterSignedIn ||
      this.isCutomerSignedIn ||
      this.isAdminSignedIn
    ) {
      if (this.isTransporterSignedIn) {
        this.openNewPage('/transporter', false,true)
        return
      } else if (this.isAdminSignedIn) {
        this.openNewPage('/admin', false,true)
        return
      }
    } else {
      this.openNewPage('/gateway', false,true)
      return
    }
    this.CANRENDER = true
    this.editFullname = this.getCustomer.fullname
    this.editEmail = this.getCustomer.email
    this.editPhone = this.getCustomer.phone

    this.$axios.$get('/users?id='+this.getCustomer.id)
    .then((res)=>{
              if (res.length > 0) {
            this.setCustomerDetails(res[0])
             this.$axios.get('/locationdetails?location=country&id='+res[0].country_id)
    .then(resx=>{
 
    this.editCountry = 'hey'
    })
         }else{//user doesn't exist
           alert('not a user')
         }
      }
    ).catch(error =>{
    // this.editFullname = this.getCustomer.fullname
    // this.editEmail = this.getCustomer.email
    // this.editPhone = this.getCustomer.phone
    })


   


    // this.editCountry = this.getCustomer.country
    // this.editState = this.getCustomer.state
    // this.editTown = this.getCustomer.town

    setTimeout(() => {
      this.activateProfileEditWatcher = true
    }, 100)
  },
  methods: {
    proceedToConfirmPassword() {
      if (this.oldPassWord == '' && this.oldPassWord.length === 0) {
        this.changePassword.oldpass = 'invalid Input'
        return
      } else {
        this.changePassword.oldpass = ''
      }

      this.verifyingPassword = true
      setTimeout(() => {
        //get current password from server
        this.currentPassWord = '12345'
        //compare result from server
        if (this.currentPassWord !== this.oldPassWord) {
          //malke sure oldpassword == current password
          this.changePassword.oldpass = 'Current Password Not Correct'
          this.canChangePassWord = false
          this.verifyingPassword = false
          return
        } else {
          this.changePassword.oldpass = ''
        }
        //then
        this.canChangePassWord = true
        this.verifyingPassword = false
      }, 3000)
    },

    checkCountries() {
      //called from country model focus and when dialog opened
      if (this.countryList.length < 1) {
        this.countriesLoading = true
        setTimeout(() => {
          this.getCountryLists()
          this.countriesLoading = false
        }, 4000)
      }
    },

    selectedCountry(result) {
      this.editCountry = result
    },

    selectedState(result) {
      this.editState = result.state
    },
    selectedTown(result) {
      this.editTown = result.town
    },

    getCountryLists() {
      this.countriesLoading = true
      setTimeout(() => {
        this.countryList = ['Nigeria', 'London']
        this.countriesLoading = false
      }, 4000)
    },
    getStateLists(v) {
      //state list
      var statex = [
        {
          country: 'Nigeria',
          state: 'Edo'
        },
        {
          country: 'Nigeria',
          state: 'Lagos'
        },
        {
          country: 'London',
          state: 'Heathrow'
        },
        {
          country: 'UAE',
          state: 'Dubai'
        }
      ]

      this.stateList = statex
    },
    getTownLists(v) {
      var townx = [
        {
          state: 'Edo',
          town: 'Evboutubu'
        },
        {
          state: 'Edo',
          town: 'Ugbowo'
        },
        {
          state: 'Edo',
          town: 'Ekewan'
        },
        {
          state: 'Lagos',
          town: 'Ajegule'
        },
        {
          state: 'Lagos',
          town: 'Mile 2'
        }
      ]

      this.townLists = townx
    },
    EDIT_PROFILE() {
      let newDetails = {
        id: this.getCustomer.id, //need for local storage
        fullname: this.editFullname,
        email: this.editEmail,
        phone: this.editPhone,
        country: this.editCountry,
        state: this.editState,
        town: this.editTown
      }

      this.changingProfile = true
      setTimeout(() => {
        this.editCustomerDetails(newDetails)

        ////push new edit to server
        this.changingProfile = false //this first
        this.editProfileBottomSheet = false

        this.profileupdateSnackBar = true
      }, 4000)
    },

    CHANGE_PASSWORD() {
      if (this.changingPassWord) {
        return
      } //to prevent function from running twice
      if (this.newPassWord == '' && this.newPassWord.length === 0) {
        this.changePassword.newpass = 'Invalid Input'
        return
      } else {
        if (this.newPassWord.length < 4) {
          this.changePassword.newpass = 'Password must be at least 4 Characters'
          return
        } else {
          this.changePassword.newpass = ''
        }
      }

      if (
        this.newPassWord !== this.confirmPassWord ||
        this.confirmPassWord == '' ||
        this.confirmPassWord.length === 0
      ) {
        this.changePassword.confirmpass = 'Confirmation Wrong'
        return
      } else {
        this.changePassword.confirmpass = ''
      }

      this.changingPassWord = true
      setTimeout(() => {
        this.changingPassWord = false

        let newpassword = this.newPassWord //passed to server

        this.currentPassWord = this.newPassWord
        this.oldPassWord = ''
        this.newPassWord = ''
        this.confirmPassWord = ''

        this.editPasswordBottomSheet = false
        this.canChangePassWord = false
        this.passwordupdateSnackBar = true
      }, 3000)
    },

    queryStates(v) {
      this.statesLaoading = true
      this.stateList = []
      setTimeout(() => {
        this.getStateLists(v)
        this.statesLaoading = false
      }, 3000)
    },
    queryTown(v) {
      this.townsLoading = true
      this.townLists = []
      setTimeout(() => {
        this.getTownLists(v)
        this.townsLoading = false
      }, 3000)
    },

    beforeLeavingPage(to, from, next, callback) {
      var callBackFunc = callback || function() {}
      if (this.editPasswordBottomSheet || this.editProfileBottomSheet) {
        //prevent back btn press till all modals or bottom sheets are closed
        if (
          this.changingProfile ||
          this.changingPassWord ||
          this.verifyingPassword
        ) {
          this.snackbarMedia = true
          this.snackbarMessage = 'Please wait'
          return
        }
        this.editPasswordBottomSheet = false
        this.editProfileBottomSheet = false
        callBackFunc(false)
        this.editPasswordBottomSheet = false
        this.editProfileBottomSheet = false
      } else {
        callBackFunc(true)
      }
    },

    loginOut() {
      this.logoutCustomer()
      this.openNewPage('/gateway', false,true)
    }
  },
  watch: {
    editProfileBottomSheet(val) {
      this.editFullname = this.getCustomer.fullname
      this.editEmail = this.getCustomer.email
      this.editPhone = this.getCustomer.phone
      this.editCountry = this.getCustomer.country
      this.editState = this.getCustomer.state
      this.editTown = this.getCustomer.town
      if (val) this.profileEdit = false
    },
    editFullname(val) {
      if (!this.activateProfileEditWatcher) {
        return
      }

      if (val !== '' && val.length >= 4) {
        this.profileEdit = true
        this.profileErrors.fullname = ''
      } else if (val !== '' && val.length <= 4) {
        this.profileEdit = false
        this.profileErrors.fullname = 'Name must be more than 4 Characters'
      } else {
        this.profileEdit = false
        this.profileErrors.fullname = 'Invalid Name'
      }
    },
    editEmail(val) {
      if (!this.activateProfileEditWatcher) {
        return
      }
      if (
        val !== '' &&
        val.length > 0 &&
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          val
        ) &&
        this.activateProfileEditWatcher
      ) {
        this.profileEdit = true
        this.profileErrors.email = ''
      } else {
        this.profileEdit = false
        this.profileErrors.email = 'Invalid Email'
      }
    },
    editPhone(val) {
      if (!this.activateProfileEditWatcher) {
        return
      }
      if (val !== '' && val.length == 11 && this.activateProfileEditWatcher) {
        this.profileEdit = true
        this.profileErrors.phone = ''
      } else {
        this.profileEdit = false
        this.profileErrors.phone = 'Invalid Phone Number'
      }
    },
    editCountry(val) {
      if (!this.activateProfileEditWatcher) {
        return
      }

      if (val !== '') {
        this.profileErrors.country = ''
        this.queryStates(val) //when new value is selected query db
      } else {
        this.profileErrors.state = 'Please select a valid Country'
      }

      this.profileEdit = false ////leave here should always be false
      this.editState = ''
    },
    editState(val) {
      if (!this.activateProfileEditWatcher) {
        return
      }
      if (val !== '') {
        this.profileErrors.state = ''
        this.queryTown(val) //when new value is selected query db
      } else {
        this.profileErrors.state = 'Please select a valid State'
      }
      this.editTown = ''
    },

    editTown(val) {
      if (!this.activateProfileEditWatcher) {
        return
      }
      if (val !== '' ) {
        this.profileEdit = true
        this.profileErrors.town = ''
      } else {
        this.profileEdit = false
        this.profileErrors.town = 'Please select a valid town'
      }
    },
    editPasswordBottomSheet(val) {
      if (!val) {
        //when closing dialog
        this.oldPassWord = ''
        this.newPassWord = ''
        this.confirmPassWord = ''
        this.changePassword.oldpass = ''
        this.changePassword.newpass = ''
        this.changePassword.confirmpass = ''
        this.canChangePassWord = false
      } else {
      }
    },

    selectCountry(val) {
      if (this.countryList.length < 1 && val) {
        this.getCountryLists()
      }
    },
    selectState(val) {
      //when about to be selected
      if (val) {
        if (this.stateList.length < 1) {
          this.queryStates()
        }
      }
    },
    selectTown(val) {
      //when about to be selected
      if (val) {
        if (this.townLists.length < 1) {
          this.queryTown()
        }
      }
    }
  },
  computed: {}
}
</script>

<style lang="scss"scoped>
#profile-wrapper {
  margin-top: 48px;
  width: 100%;
  max-width: 767px;
  margin: 48px auto 0 auto;
  padding: 0px;
  height: calc(100vh - 48px);
  border: 1px solid lightgrey;
}

#profile-details {
  box-shadow: 0px 1px 2px var(--shadow-color);
  padding: 10px;
  margin-bottom: 5px;
}
#edit-profile-wrapper1 {
  width: 100%;
}

#edit-profile-wrapper {
  width: 100%;
  padding: 10px;
}
</style>