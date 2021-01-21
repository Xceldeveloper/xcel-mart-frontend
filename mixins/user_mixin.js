export default {
  data() {
    return {}
  },
  mounted() {
    this.getCustomerDetails();
    this.getTransporterDetails();
    this.getAdminDetails();
  },
  methods: {

    setCustomerDetails(info) {
      this.$store.commit('user/signInUser', info);
      localStorage.setItem("CUSTOMER_DETAILS", JSON.stringify(info));
      this.logoutTransporter();
      this.logoutAdmin();
    },
    editCustomerDetails(newDetails) {
      this.$store.commit('user/editUserProfile', newDetails);
      localStorage.setItem("CUSTOMER_DETAILS", JSON.stringify(newDetails));
    },
    getCustomerDetails() {
      if (this.getCustomer.id == '' || this.getCustomer.fullname == '' || this.getCustomer.email == '' || !this.isCutomerSignedIn) {
        var infox = localStorage.getItem("CUSTOMER_DETAILS");
        if (infox !== null) {
          try {
            this.$store.commit('user/signInUser', JSON.parse(infox));
          } catch (error) {
            //storge may be corupted purge it
            localStorage.removeItem("CUSTOMER_DETAILS");
            this.$store.commit('user/logoutCustomer');
          }
        } else {

        }
      }

    },
    logoutCustomer() {
      var infox = localStorage.getItem("CUSTOMER_DETAILS");
      if (infox !== null) {
        localStorage.removeItem("CUSTOMER_DETAILS")
      }
      this.$store.commit('user/logoutCustomer');
    },

    //////////////////////////////TRANSPORTER////////////////////////////////

    setTransporterDetails(info) {
      this.$store.commit('transporter/signInTransporter', info);
      localStorage.setItem("TRANSPORTER_DETAILS", JSON.stringify(info));
      this.logoutCustomer();
      this.logoutAdmin();
    },
    editTransporterDetails(newDetails) {
      this.$store.commit('transporter/editTransporterProfile', newDetails);
      localStorage.setItem("TRANSPORTER_DETAILS", JSON.stringify(newDetails));
    },
    getTransporterDetails() {
      if (this.getTransporter.id == '' || this.getTransporter.fullname == '' || this.getTransporter.email == '' || !this.istransporterSignedIn) {
        var infox = localStorage.getItem("TRANSPORTER_DETAILS");
        if (infox !== null) {
          try {
            this.$store.commit('transporter/signInTransporter', JSON.parse(infox));
          } catch (error) {
            //storge may be corupted purge it
            localStorage.removeItem("TRANSPORTER_DETAILS");
            this.$store.commit('transporter/logOutTransporter');
          }
        } else {

        }
      }

    },
    logoutTransporter() {
      var infox = localStorage.getItem("TRANSPORTER_DETAILS");
      if (infox !== null) {
        localStorage.removeItem("TRANSPORTER_DETAILS")
      }
      this.$store.commit('transporter/logOutTransporter');
      this.$store.commit('routestack/removeStack');
    },

//////////////////////ADMIN////////////////////////////

setAdminDetails(info) {
  this.$store.commit('admin/signInAdmin', info);
  localStorage.setItem("ADMIN_DETAILS", JSON.stringify(info));
  this.logoutCustomer();
  this.logoutTransporter();
},
editAdminDetails(newDetails) {
  this.$store.commit('admin/editAdminProfile', newDetails);
  localStorage.setItem("ADMIN_DETAILS", JSON.stringify(newDetails));
},
getAdminDetails() {
  if (this.getAdmin.id == '' || this.getAdmin.fullname == '' || this.getAdmin.email == '' || !this.isAdminSignedIn) {
    var infox = localStorage.getItem("ADMIN_DETAILS");
    if (infox !== null) {
      try {
        this.$store.commit('admin/signInAdmin', JSON.parse(infox));
      } catch (error) {
        //storge may be corupted purge it
        localStorage.removeItem("ADMIN_DETAILS");
        this.$store.commit('admin/logoutAdmin');
      }
    } else {

    }
  }

},
logoutAdmin() {
  var infox = localStorage.getItem("ADMIN_DETAILS");
  if (infox !== null) {
    localStorage.removeItem("ADMIN_DETAILS")
  }
  this.$store.commit('admin/logoutAdmin');
},



  },
  computed: {
    getCustomer() {
      return {
        id: this.$store.state.user.id,
        fullname: this.$store.state.user.fullname,
        email: this.$store.state.user.email,
        phone: this.$store.state.user.phone,
        country: this.$store.state.user.country,
        state: this.$store.state.user.state,
        town: this.$store.state.user.town,
      }
    },
    isCutomerSignedIn() {
      return this.$store.state.user.isLoggedIn
    },

    //////////////////CUSTOMER/////////

    getTransporter() {
      return {
        id: this.$store.state.transporter.id,
        fullname: this.$store.state.transporter.fullname,
        email: this.$store.state.transporter.email,
        phone: this.$store.state.transporter.phone,
      }
    },
    isTransporterSignedIn() {
      return this.$store.state.transporter.isLoggedIn
    },


    ///////////////ADMIN/////////////////
    getAdmin() {
      return {
        id: this.$store.state.admin.id,
        fullname: this.$store.state.admin.fullname,
        email: this.$store.state.admin.email,
        phone: this.$store.state.admin.phone,
        level: this.$store.state.admin.level
      }
    },
    isAdminSignedIn() {
      return this.$store.state.admin.isLoggedIn
    }
  }
}
