<template>
  <div>
    <v-card class="cardx">
      <span id="comp-title" v-if="isMobile">
        <span>Articles</span>
      </span>
      <v-list>
        <v-list-item link @click="showAboutUs = true">
          <v-list-item-content>About Us</v-list-item-content>
          <v-list-item-icon>
            <v-icon>mdi-chevron-up</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item  @click="showContactUs = true">
          <v-list-item-content>Contact Us</v-list-item-content>
          <v-list-item-icon>
            <v-icon>mdi-chevron-up</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item link @click="showTermAndConditions = true">
          <v-list-item-content>Terms and Conditions</v-list-item-content>
          <v-list-item-icon>
            <v-icon>mdi-chevron-up</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item link @click="showPrivacyPolicy = true">
          <v-list-item-content>Privacy Policy</v-list-item-content>
          <v-list-item-icon>
            <v-icon>mdi-chevron-up</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item link @click="showFrequentlyAsekdQuestions= true">
          <v-list-item-content>Frequently Asked Questions</v-list-item-content>
          <v-list-item-icon>
            <v-icon>mdi-chevron-up</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-card>

    <aboutus :canShow="showAboutUs" @cancel="showAboutUs = false" />
    <contactus :canShow="showContactUs" @cancel="showContactUs = false" />
    <termsandconditions :canShow="showTermAndConditions" @cancel="showTermAndConditions = false" />
    <privacypolicy :canShow="showPrivacyPolicy" @cancel="showPrivacyPolicy = false" />
    <frequentlyaskedquestions
      :canShow="showFrequentlyAsekdQuestions"
      @cancel="showFrequentlyAsekdQuestions = false"
    />
  </div>
</template>

<script>
import device_mixin from '~/mixins/device_mixin.js'
import utils_mixin from '~/mixins/utils_mixin.js'
import app_mixin from '~/mixins/app_mixin.js'
import aboutus from '~/components/admin/article/aboutus.vue'
import contactus from '~/components/admin/article/contactus.vue'
import termsandconditions from '~/components/admin/article/termsandconditions.vue'
import privacypolicy from '~/components/admin/article/privacypolicy.vue'
import frequentlyaskedquestions from '~/components/admin/article/frequentlyaskedquestions.vue'
export default {
  components: {
    aboutus,
    contactus,
    termsandconditions,
    privacypolicy,
    frequentlyaskedquestions
  },
  mixins: [device_mixin, utils_mixin,app_mixin],
  data() {
    return {
     
      showAboutUs: false,
      showContactUs:false,
      showTermAndConditions: false,
      showPrivacyPolicy: false,
      showFrequentlyAsekdQuestions: false
    }
  }
}
</script>

<style>
#comp-title {
  display: block;
  width: 100%;
  text-align: center;
  padding: 8px;
}

#comp-title span {
  padding: 10px;
  font-weight: bold;
  border-bottom: 3px solid #000000;
}

.cardx {
  width: 95%;
  max-width: 500px;
  margin: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>