<template>
  <v-dialog v-model="canShow" fullscreen transition="slide-y-reverse-transition">
    <div id="shipping-wrapper">
      <v-toolbar color="#ffffff" dense light elevation="1">
        <v-btn :color="Colors.accent" icon @click="closeMe">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Shipping</v-toolbar-title>
      </v-toolbar>
      <div id="order-info">
        <span id="order-title">
          <v-icon :color="Colors.accent" size="26">mdi-shopping-outline</v-icon>Order Information
        </span>
        <span id="total">
          Total
          <span class="price">&#8358;{{formatToCurrency(order)}}</span>
        </span>
        <span id="delivery-price">
          Shipping cost
          <span class="price">&#8358;{{formatToCurrency(shipping)}}</span>
        </span>
        <v-divider></v-divider>
        <v-divider></v-divider>
        <span id="order-total">
          Order Total
          <span
            class="price"
            :style="{color:Colors.accent}"
          >&#8358;{{formatToCurrency(total)}}</span>
        </span>
      </div>
      <div id="order-info" ref="form">
        <span id="order-title">
          <v-icon :color="Colors.accent" size="30">mdi-map-marker-radius-outline</v-icon>Shipping Information
        </span>
        <v-text-field
          name="Name"
          v-model="name"
          label="Name"
          type="text"
          ref="name"
          :rules="[() => !!name || 'This field is required', 
         ()=> name.length >= 4 || 'Name must be more than four Characters' ]"
          :color="Colors.accent"
        ></v-text-field>
        <v-text-field
          v-model="phone"
          name="Phone"
          ref="phone"
          :rules="[()=> phone.length == 11 || 'Invalid phone number']"
          label="Phone"
          type="phone"
          :color="Colors.accent"
        ></v-text-field>
        <v-text-field
          name="E-mail"
          ref="email"
          :rules="[
         ()=> !!email || 'This field is required',
         () =>  /.+@.+\..+/.test(email)  || 'Invalid E-mail']"
          v-model="email"
          label="E-mail"
          type="email"
          :color="Colors.accent"
        ></v-text-field>

        <v-text-field
          name="Country"
          label="Country"
          ref="country"
          @focus="selectCountry = true"
          readonly
          v-model.trim="country"
          type="text"
          :rules="[
         ()=> !!country || 'This field is required']"
          :color="Colors.accent"
        ></v-text-field>

        <v-text-field
          name="State"
          label="State"
          ref="state"
          @focus="selectState = true"
          readonly
          :loading="statesLaoading"
          v-model.trim="state"
          type="text"
          :rules="[
         ()=> !!state || 'This field is required']"
          :color="Colors.accent"
        ></v-text-field>

        <v-text-field
          v-if="state !== ''"
          name="Town"
          label="Town"
          ref="town"
          :loading="townsLoading"
          @focus="selectTown = true"
          :readonly="true"
          v-model.trim="town"
          type="text"
          :rules="[
         ()=> !!town || 'This field is required']"
          @blur="addressWAtcher ? recalculatingShippingCostDialog = true : recalculatingShippingCostDialog = false"
          :color="Colors.accent"
        ></v-text-field>

        <v-text-field
          name="Address"
          ref="address"
          :rules="[
              () => !!address || 'This field is required',
              () => !!address && address.length > 5 || 'Invalid Address'
            ]"
          v-model="address"
          hint="Where the item(s) would be shipped to"
          label="Address"
          type="address"
          @focus="addressWAtcher = false"
          :color="Colors.accent"
        ></v-text-field>
      </div>
      <div id="proceed-btn">
        <v-btn
          v-if="state !== ''"
          :color="Colors.accent"
          dark
          width="70%"
          max-width="300px"
          @click="PROCEED"
        >Proceed</v-btn>
      </div>
    </div>

    <v-bottom-sheet
      light
      inset
      :persistent="isCalculating"
      v-model="recalculatingShippingCostDialog"
      max-width="500px"
    >
      <div id="recalculating">
        <v-row class="fill-height ma-0" align="center" justify="center" v-if="isCalculating">
          Recalculating Shipping Cost ...
          <br />
          <v-card elevation="0" width="100%" align="center" justify="center">
            <v-progress-linear indeterminate size="50" :color="Colors.accent"></v-progress-linear>
          </v-card>
        </v-row>
        <v-row class="fill-height ma-0" align="center" justify="center" v-if="!isCalculating">
          <v-card align="center" justify="center" elevation="0">
            <v-card-text>
              New Shipping Cost
              <br />
              <br />
              <span id="newShippingAmt">&#8358;{{formatToCurrency(shipping)}}</span>
            </v-card-text>
          </v-card>
        </v-row>
      </div>
    </v-bottom-sheet>

    <dynamicselect
      @selected="selectedCountry"
      @close="selectCountry = false"
      :color="Colors.accent"
      title="Select Country"
      :activate="selectCountry"
      :items="countryList"
    />

    <dynamicselect
      @selected="selectedState"
      @close="selectState = false"
      :color="Colors.accent"
      title="Select State"
      :activate="selectState"
      :items="stateList"
    />

    <dynamicselect
      @selected="selectedTown"
      @close="selectTown = false"
      :color="Colors.accent"
      title="Select Town"
      :activate="selectTown"
      :items="townList"
    />
  </v-dialog>
</template>

<script>
import app_mixin from '~/mixins/app_mixin.js'
import device_mixin from '~/mixins/device_mixin.js'
import utils_mixin from '~/mixins/utils_mixin.js'
import dynamicselect from '~/components/utils/dynamicselect.vue'
export default {
  components: {
    dynamicselect
  },
  mixins: [device_mixin, utils_mixin,app_mixin],
  props: {
    canShow: {
      type: Boolean,
      default: true
    },
    paymentInformation: {
      required: true
    },
    shippingDetails: {
      type: Object
    }
  },
  data() {
    return {
     
      locationDialog: false,
      recalculatingShippingCostDialog: false,
      isCalculating: false,
      addressWAtcher: false,
      showInfo: false,
      formHasErrors: false,
      name: '',
      email: '',
      phone: '',
      country: '',
      state: '',
      town: '',
      address: '',
      latitudePoint: 0,
      longitudePoint: 0,
      order: 0,
      shipping: 0,
      total: 0,

      countriesLoading: false,
      statesLaoading: false,
      townsLoading: false,
      countryList: [],
      stateList: [],
      townList: [],
      selectCountry: false,
      selectState: false,
      selectTown: false,
      canactivatewatcher: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.setShippingInfo(this.shippingDetails) //get shipping details from props
      this.order = this.paymentInformation.order
      this.shipping = this.paymentInformation.shipping
      this.total = this.paymentInformation.total
    }, 100)

    setTimeout(() => {
      this.canactivatewatcher = true
    }, 900)
  },
  methods: {
    setShippingInfo(info) {
      this.name = info.name
      this.email = info.email
      this.phone = info.phone
      this.country = info.country
      this.state = info.state
      this.address = info.address
      this.town = info.town
      this.longitudePoint = info.gpsLocation.longitude
      this.latitudePoint = info.gpsLocation.latitude
    },
    PROCEED() {
      this.formHasErrors = false
      Object.keys(this.form).forEach((f) => {
        if (!this.form[f]) this.formHasErrors = true
        this.$refs[f].validate(true)
      })
      let details = {
        name: this.name,
        email: this.email,
        phone: this.phone,
        country: this.country,
        state: this.state,
        address: this.address,
        town: this.town,
        gpsLocation: {
          longitude: this.longitudePoint,
          latitude: this.latitudePoint
        }
      }
      if (!this.formHasErrors) {
        //exit shipping component and send back details
        this.$emit('shipping', details)
      }
    },
    addressDetailsChanged() {
      this.recalculatingShippingCostDialog = true
      this.isCalculating = true

      //recalculate shipping fee
      setTimeout(() => {
        this.isCalculating = false
        this.shipping = Math.floor(Math.random() * 4000 + 700) //changing shiiping
        this.total = this.shipping + this.order //recalculate total price
        let price = {
          order: this.order,
          shipping: this.shipping,
          total: this.total
        }
        //emit price change
        this.$emit('priceChange', price)
      }, 3000)
    },
    closeMe() {
      this.$emit('cancel', true)
    },

    getCountryLists() {
      this.countriesLoading = true
      this.countryList = []
      setTimeout(() => {
        this.countryList = ['Nigeria', 'London']
        this.countriesLoading = false
      }, 2000)
    },

    getStateLists(v) {
      this.statesLaoading = true
      this.stateList = []
      setTimeout(() => {
        this.stateList = ['Edo', 'Lagos']
        this.statesLaoading = false
      }, 4000)
    },

    getTownList(v) {
      this.townsLoading = true
      this.townList = []
      setTimeout(() => {
        this.townList = ['Evboutubu', 'Ugbowor', 'Ikpoba Hill']
        this.townsLoading = false
      }, 4000)
    },

    selectedCountry(result) {
      this.country = result
    },
    selectedState(result) {
      this.state = result
    },

    selectedTown(result) {
      this.town = result
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
        address: this.address
      }
    }
  },
  watch: {
    shippingDetails(val) {
      this.setShippingInfo(val)
    },
    paymentInformation(val) {
      this.order = this.val.orderPrice
      this.shipping = this.val.shippingPrice
      this.total = this.val.totalPrice
    },
    address() {
      this.addressWAtcher = true
    },
    longitudePoint() {
      this.addressWAtcher = true
    },
    latitudePoint() {
      this.addressWAtcher = true
    },
    town() {
      this.addressWAtcher = true
    },
    locationDialog(val) {
      if (val) {
        this.addressWAtcher = false
        //change gps location manually mock
        this.longitudePoint = Math.floor(Math.random() * 300 + -300)
        this.latitudePoint = Math.floor(Math.random() * 300 + -300)
      } else {
        //when closed
        if (this.addressWAtcher) {
          //if true
          this.recalculatingShippingCostDialog = true
        } else {
          // fale
          this.recalculatingShippingCostDialog = false
        }
      }
    },
    recalculatingShippingCostDialog(val) {
      if (val) {
        this.addressDetailsChanged()
      }
    },

    selectCountry(val) {
      if (!this.canactivatewatcher) {
        return
      }
      if (this.countryList.length < 1) {
        this.getCountryLists()
      }
    },

    selectState(val) {
      //when about to be selected
      if (val) {
        if (this.stateList.length < 1) {
          this.getStateLists()
        }
      }
    },
    selectTown(val) {
      //when about to be selected
      if (val) {
        if (this.townList.length < 1) {
          this.getTownList()
        }
      }
    },

    country(val, oldVal) {
      if (!this.canactivatewatcher) {
        return
      }
      this.state = ''
      this.getStateLists(val, oldVal)
    },
    state(val, oldVal) {
      if (!this.canactivatewatcher) {
        return
      }
      this.town = ''
      if (val !== '') {
        this.getTownList(val, oldVal)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#shipping-wrapper {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
}
#order-info {
  width: 94%;
  max-width: 600px;
  margin: auto;
  margin-top: 10px;
  border-radius: 5px;
  height: auto;
  padding: 10px;
  box-shadow: 0px 1px 3px var(--shadow-color), -0px -0px 0px var(--shadow-color);
}

#order-title {
  display: block;
  width: 100%;
  font-weight: bold;
  border-bottom: 1px dotted lightgrey;
  margin-bottom: 10px;
  color: var(--accent-color);
}

#total,
#delivery-price,
#order-total {
  display: block;
  width: 100%;
  padding: 5px 0px 5px 0px;
}

.price {
  float: right;
  font-size: 15px;
  font-weight: bold;
}

#proceed-btn {
  width: 100%;
  text-align: center;
  padding: 10px;
}

#location-dialog-cover {
  max-width: 500px;
  min-width: 320px;
  height: auto;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0px 1px 3px var(--shadow-color), -0px -0px 0px var(--shadow-color);
}

#location-dialog-title {
  width: 100%;
  padding: 5px;
  display: block;
}

.location-info {
  width: 100%;
  padding: 5px;
  display: block;
  font-size: 14px;
  font-weight: bold;
}

#question-icon {
  color: var(--accent-color);
  border: 1px solid var(--accent-color);
  border-radius: 50%;
  font-size: 14px;
  padding: 2px 4px 1px 4px;
}

#mapCover {
  max-width: 500px;
  min-width: 320px;
  height: 320px;
  background-color: lightgrey;
  position: relative;
}

#zoom-in {
}

#zoom-out {
}

#location-action-btn {
  width: 100%;
  padding: 10px;
}
#gps {
  color: var(--subtext-color);
  font-size: 14px;
}

#recalculating {
  width: 100%;
  height: 200px;
  padding: 10px;
  background-color: #ffffff;
}

#newShippingAmt {
  color: green;
  display: block;
  width: 100%;
  font-size: 30px;
}
</style>