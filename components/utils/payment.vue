<template>
  <div>
    <v-btn @click="PAYNOW" block dark :color="Colors.accent">Pay Now</v-btn>
    <v-snackbar v-model="errorOccured">Error Occured Please Check your Internet Connection</v-snackbar>
  </div>
</template>

<script>
import app_mixin from '~/mixins/app_mixin.js'
import device_mixin from '~/mixins/device_mixin.js'
export default {
  mixins: [device_mixin, app_mixin],
  props: {
    transactionDetails: {
      type: Object,
      default: ''
      // {
      //   customer_name:'',
      //   transaction_id:'',
      //   customer_email:'',
      //   transaction_amount:''
      // }
    },
    apiKey: {
      default: 'pk_test_f8c2a324559a0569ef67f8cc6fbb8ecaffd9cd77'
    }
  },
  data() {
    return {
      errorOccured: false
    }
  },

  methods: {
    reference() {
      let text = ''
      let possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      for (let i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length))
      return text
    },
    PAYNOW() {
      const paystackOptions = {
        key: this.apiKey,
        email: this.transactionDetails.customer_email,
        amount: this.transactionDetails.transaction_amount + '00',
        ref: this.reference(),
        metadata: {
          custom_fields: [
            {
              display_name: 'Customer Name',
              variable_name: 'customer_name',
              value: this.transactionDetails.customer_name
            },
            {
              display_name: 'Transaction ID',
              variable_name: 'transaction_id',
              value: this.transactionDetails.transaction_id
            },
            {
              display_name: 'Customer Email',
              variable_name: 'customer_email',
              value: this.transactionDetails.customer_email
            },
            {
              display_name: 'Transaction Amount',
              variable_name: 'transaction_amount',
              value: this.transactionDetails.transaction_amount
            }
          ]
        },
        callback: (response) => {
          this.$emit('success', response)
        },
        onClose: () => {
          this.$emit('aborted')
        }
      }
      //console.log(JSON.stringify(paystackOptions.ref));
      try {
        const handler = window.PaystackPop.setup(paystackOptions)
        handler.openIframe()
      } catch (error) {
        this.errorOccured = true
      }
    }
  }
}
</script>