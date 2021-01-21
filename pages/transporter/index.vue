<template>
  <div id="admin" v-cloak v-if="CANRENDER">
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
    <v-navigation-drawer
      v-model="drawer"
      app
      width="290"
      clipped
      :mini-variant.sync="mini"
      mini-variant-width="80"
      :color="Colors.background"
    >
      <template v-slot:prepend v-if="mini != true">
        <v-list-item two-line @click="editProfileBottomSheet = true">
          <v-list-item-avatar
            color="#ededed"
            :width="isMobile ? 70 : 100"
            :height="isMobile ? 70 : 100"
          >
            <v-icon :size="isMobile ? 35 : 50" :color="Colors.accent">mdi-account</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{editFullname}}</v-list-item-title>
            <v-list-item-subtitle>{{editEmail}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-list>
        <v-divider></v-divider>
        <v-list-item link @click="selectComponent('packages')">
          <v-list-item-action>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-icon :color="Colors.accent" v-on=" mini ? on : null">mdi-package-variant-closed</v-icon>
              </template>
              <span>Packages</span>
            </v-tooltip>
          </v-list-item-action>
          <v-list-item-content>
            <span :style="{color:selectedComponent == 'packages' ? Colors.accent : '#1b1b1b'}">
              <b>Packages</b>
            </span>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="selectComponent('enroute')">
          <v-list-item-action>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-icon :color="Colors.accent" v-on=" mini ? on : null">mdi-truck-fast</v-icon>
              </template>
              <span>En Route</span>
            </v-tooltip>
          </v-list-item-action>
          <v-list-item-content>
            <span :style="{color:selectedComponent == 'enroute' ? Colors.accent : '#1b1b1b'}">
              <b>En Route</b>
            </span>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="selectComponent('pending')">
          <v-list-item-action>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-icon :color="Colors.accent" v-on=" mini ? on : null">mdi-truck-delivery</v-icon>
              </template>
              <span>Pending Deliveries</span>
            </v-tooltip>
          </v-list-item-action>
          <v-list-item-content>
            <span
              :style="{color:selectedComponent == 'pending' ? Colors.accent : '#1b1b1b'}"
            >Pending Deliveries</span>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="selectComponent('completed')">
          <v-list-item-action>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-icon :color="Colors.accent" v-on=" mini ? on : null">mdi-truck-check</v-icon>
              </template>
              <span>Completed Deliveries</span>
            </v-tooltip>
          </v-list-item-action>
          <v-list-item-content>
            <span
              :style="{color:selectedComponent == 'completed' ? Colors.accent : '#1b1b1b'}"
            >Completed Deliveries</span>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="selectComponent('canceled')">
          <v-list-item-action>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-icon :color="Colors.accent" v-on=" mini ? on : null">mdi-cancel</v-icon>
              </template>
              <span>Canceled Deliveries</span>
            </v-tooltip>
          </v-list-item-action>
          <v-list-item-content>
            <span
              :style="{color:selectedComponent == 'canceled' ? Colors.accent : '#1b1b1b'}"
            >Canceled Deliveries</span>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <br />
      <v-list>
        <v-divider></v-divider>
        <v-list-item link @click="editPasswordBottomSheet = true">
          <v-list-item-action>
            <v-icon>mdi-key</v-icon>
          </v-list-item-action>
          <v-list-item-content>Change password</v-list-item-content>
        </v-list-item>
        <v-list-item link @click="canLogout = true">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>Logout</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app clipped-left dark :color="Colors.accent" dense>
      <v-app-bar-nav-icon :color="Colors.text" @click.stop="toggleMini" />
      <img src="~/static/icon.png" alt="logo" style="width:37px;height:37px" />
      <v-toolbar-title class="mr-12 align-center">
        <span class="title">Transporter</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-chip color="white" light v-if="!isMobile && mini" @click="editProfileBottomSheet = true">
        <v-avatar>
          <v-icon :color="Colors.accent" size="20">mdi-account</v-icon>
        </v-avatar>
        {{editFullname}}
      </v-chip>
      <v-btn @click="selectedComponent = 'notifications'" icon>
        <v-icon v-if="selectedComponent !== 'notifications'">mdi-bell-outline</v-icon>
        <v-icon v-else>mdi-bell</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <div id="wrapper">
        <component @itemDelivered="dynamicSelect" @openUrl="loadlink" :is="selectedComponent"></component>
      </div>
    </v-content>

    <v-snackbar v-model="canLogout" :timeout="3500">
      Are you Sure you want to logout?
      <v-btn text dark @click.native="loginOut">YES</v-btn>
    </v-snackbar>

    <!-- ////////////////// -->
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
              :readonly="changingProfile"
              v-model.trim="editFullname"
              :error-messages="profileErrors.fullname"
              type="text"
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

    <!-- //////////////////////////////////////////////////// -->
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
            :readonly="changingPassWord"
            :error-messages="changePassword.newpass"
            @keyup.enter="CHANGE_PASSWORD"
            type="password"
            :color="Colors.accent"
          ></v-text-field>
          <v-text-field
            v-if="canChangePassWord"
            :readonly="changingPassWord"
            name="Confirm password"
            label="Confirm password"
            v-model.trim="confirmPassWord"
            :error-messages="changePassword.confirmpass"
            type="password"
            @keyup.enter="CHANGE_PASSWORD"
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
  </div>
</template>
<script>
import app_mixin from '~/mixins/app_mixin.js'
import device_mixin from '~/mixins/device_mixin.js'
import utils_mixin from '~/mixins/utils_mixin.js'
import navigation_mixin from '~/mixins/navigation_mixin.js'
import user_mixin from '~/mixins/user_mixin.js'
import packages from '~/components/transporter/packages.vue'
import pending from '~/components/transporter/pending.vue'
import enroute from '~/components/transporter/enroute.vue'
import completed from '~/components/transporter/completed.vue'
import canceled from '~/components/transporter/canceled.vue'
import notifications from '~/components/transporter/notifications.vue'
export default {
  mixins: [device_mixin, utils_mixin, navigation_mixin, user_mixin, app_mixin],
  components: {
    packages: packages,
    pending: pending,
    enroute: enroute,
    completed: completed,
    canceled: canceled,
    notifications: notifications
  },
  data() {
    return {
      CANRENDER: false,
      drawer: null,
      mini: true,
      selectedComponent: 'packages',
      canLogout: false,
      editProfileBottomSheet: false,

      editFullname: '',
      editEmail: '',
      editPhone: '',
      profileEdit: false,
      profileErrors: {
        fullname: '',
        email: '',
        phone: ''
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

      snackbarMessage: '',
      snackbarMedia: false
    }
  },
  mounted() {
    this.CANRENDER = false
    if (
      this.isTransporterSignedIn ||
      this.isCutomerSignedIn ||
      this.isAdminSignedIn
    ) {
      if (this.isCutomerSignedIn) {
        this.openNewPage('/', false)
        return
      } else if (this.isAdminSignedIn) {
        this.openNewPage('/admin', false)
        return
      }
    } else {
      this.openNewPage('/gateway', false)
      return
    }

    this.CANRENDER = true

    if (this.isDesktop || this.is4KMAX || this.isLaptop) {
      this.drawer = true
      this.mini = false
    }
    // this.checkScreenSize()
    // window.addEventListener('resize', this.checkScreenSize, { passive: true })
    this.editFullname = this.getTransporter.fullname
    this.editEmail = this.getTransporter.email
    this.editPhone = this.getTransporter.phone
    setTimeout(() => {
      this.activateProfileEditWatcher = true
    }, 100)

    this.dynamicSelect()
  },
  methods: {
    selectComponent(component) {
      this.selectedComponent = component

      if (this.isMobile) {
        // hide nav bar on click in mobile device
        this.drawer = null
      }
    },
    loadlink(result) {
      this.openNewPage(result.url, result.history)
    },

    dynamicSelect() {
      this.selectedComponent = 'packages'
    },
    toggleMini() {
      if (this.isMobile) {
        this.mini = false
        this.drawer = null
        this.drawer = !this.drawer
      } else if (this.isTablet) {
        this.drawer = true
        this.mini = false
      } else if (this.isLaptop) {
        // this.drawer = !this.drawer
        // this.mini = false
        this.drawer = true
        this.mini = !this.mini
      } else if (this.isDesktop || this.is4KMAX) {
        this.drawer = true
        this.mini = !this.mini
      }
      //  alert(this.$vuetify.breakpoint.name);
    },

    EDIT_PROFILE() {
      let newDetails = {
        id: this.getTransporter.id, //need for local storage
        fullname: this.editFullname,
        email: this.editEmail,
        phone: this.editPhone
      }
      this.changingProfile = true
      setTimeout(() => {
        this.editTransporterDetails(newDetails)

        ////push new edit to server
        this.editProfileBottomSheet = false
        this.changingProfile = false
        this.profileupdateSnackBar = true
      }, 4000)
    },

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
      this.logoutTransporter()
      this.openNewPage('/gateway', false, true)
    }
  },

  watch: {
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

    editProfileBottomSheet(val) {
      this.editFullname = this.getTransporter.fullname
      this.editEmail = this.getTransporter.email
      this.editPhone = this.getTransporter.phone
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
    }
  }
}
</script>

<style lang="scss" scoped>
#wrapper {
  width: 100%;
  height: calc(100vh - 48px);
}
</style>