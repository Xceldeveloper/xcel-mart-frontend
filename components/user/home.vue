<template>
  <div id="home">
    <div id="img-container">
      <v-responsive
        max-height="94vh"
        :aspect-ratio="
          isMobile || isTablet
            ? deviceOrientation.portrait
              ? 4 / 3
              : 16 / 6
            : 16 / 6
        "
      >
        <v-carousel
          :hide-delimiter-background="true"
          :hide-delimiters="true"
          height="auto"
          :continuous="true"
          :cycle="true"
          :show-arrows="false"
          :interval="4000"
        >
          <v-carousel-item v-for="(item, index) in coverImage" :key="index">
            <v-img
              max-height="94vh"
              :aspect-ratio="
                isMobile || isTablet
                  ? deviceOrientation.portrait
                    ? 4 / 3
                    : 16 / 6
                  : 16 / 6
              "
              :src="item"
              gradient="to bottom , rgb(0, 0, 0, 0.17),rgb(0, 0, 0, 0.3),rgb(0, 0, 0, 0.4)"
            >
              <template v-slot:placeholder>
                <v-skeleton-loader loading type="image"></v-skeleton-loader>
                <v-skeleton-loader loading type="image"></v-skeleton-loader>
                <v-skeleton-loader loading type="image"></v-skeleton-loader>
                <v-skeleton-loader loading type="image"></v-skeleton-loader>
                <v-skeleton-loader loading type="image"></v-skeleton-loader>
                <v-skeleton-loader loading type="image"></v-skeleton-loader>
              </template>
            </v-img>
          </v-carousel-item>
        </v-carousel>
      </v-responsive>
    </div>

    <div id="top-scroller">
      <div id="balancer">
        <v-responsive
          :width="isMobile || isTablet ? '70%' : '70%'"
          max-height="94vh"
          :aspect-ratio="
            isMobile || isTablet
              ? deviceOrientation.portrait
                ? 4 / 3
                : 16 / 6
              : 16 / 6
          "
        ></v-responsive>
      </div>

      <div id="box-wrapper">
        <v-row align="center" justify="center">
          <v-col class="text-center" :cols="12">
            <v-hover v-slot:default="{ hover }" close-delay="200">
              <v-card class="box" :elevation="hover ? 16 : 2">
                <v-btn
                  width="60px"
                  height="60px"
                  dark
                  class="arrange-center"
                  fab
                  elevation="1"
                  :color="Colors.accent"
                >
                  <v-img width="40px" height="40px" :src="logo" />
                </v-btn>
                <span id="box-title">{{ AppName }}</span>
                <div id="speech">Quench your thirst with something Good...</div>
              </v-card>
            </v-hover>
          </v-col>

          <v-col class="text-center" :cols="isMobile ? 12 : 4">
            <v-hover v-slot:default="{ hover }" close-delay="200">
              <v-card class="box" :elevation="hover ? 16 : 2">
                <v-btn
                  elevation="1"
                  dark
                  absolute
                  top
                  right
                  fab
                  :color="Colors.accent"
                >
                  <v-icon>mdi-truck-fast</v-icon> </v-btn
                >Fast Delivery
                <div id="speech">
                  We Deliver Our products anywhere you want it, and the time you
                  want it, be it A Marraige Ceremony, Birthday Celebration ...
                  and we also deliver to Other Businesses In Record Time.
                </div>
              </v-card>
            </v-hover>
          </v-col>

          <v-col class="text-center" :cols="isMobile ? 12 : 4">
            <v-hover v-slot:default="{ hover }" close-delay="200">
              <v-card class="box" :elevation="hover ? 16 : 2">
                <v-btn
                  elevation="1"
                  dark
                  absolute
                  top
                  right
                  fab
                  :color="Colors.accent"
                >
                  <v-icon>mdi-clock</v-icon> </v-btn
                >24 Hours Support
                <div id="speech">
                  We provide 24 Hours support to all our Customers regarding any
                  issues that may arise
                </div>
              </v-card>
            </v-hover>
          </v-col>

          <v-col class="text-center" :cols="isMobile ? 12 : 4">
            <v-hover v-slot:default="{ hover }" close-delay="200">
              <v-card class="box" :elevation="hover ? 16 : 2">
                <v-btn
                  elevation="1"
                  dark
                  absolute
                  top
                  right
                  fab
                  :color="Colors.accent"
                >
                  <v-icon>mdi-cash</v-icon> </v-btn
                >Payment Method
                <div id="speech">
                  We accept Payment through Online Systems, Bank Transfer and
                  Cash on Delivery or any other options you may be comfortable
                  with
                </div>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </div>

      <div id="footer">
        <v-btn
          v-if="store.googleplay !== ''"
          @click="openAppStore('PLAYSTORE')"
          width="70px"
          height="70px"
          dark
          icon
        >
          <v-icon size="50px">mdi-google-play</v-icon>
        </v-btn>
        <v-btn
          v-if="store.applestore !== ''"
          @click="openAppStore('APPLESTORE')"
          width="70px"
          height="70px"
          dark
          icon
        >
          <v-icon size="50px">mdi-apple</v-icon>
        </v-btn>

        <div
          id="social-wrapper"
          v-if="
            social.facebook !== '' ||
            social.instagram !== '' ||
            social.twitter !== '' ||
            social.youtube !== ''
          "
        >
          <span id="social-btns">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <a v-on="on" href="mailto:xceldeveloper@gmail.com"
                  ><v-btn large icon dark><v-icon>mdi-gmail</v-icon></v-btn></a
                >
              </template>
              <span>xceldeveloper@gmail.com</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <a v-on="on" href="https://twitter.com/xceldeveloper"
                  ><v-btn large icon dark
                    ><v-icon>mdi-twitter</v-icon></v-btn
                  ></a
                >
              </template>
              <span>xceldeveloper</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <a
                  v-on="on"
                  href="https://linkedin.com/in/overcomer-emiator-5573141b2"
                  ><v-btn large icon dark
                    ><v-icon>mdi-linkedin</v-icon></v-btn
                  ></a
                >
              </template>
              <span>Overcomer Emiator</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <a v-on="on" href="https://github.com/xceldeveloper"
                  ><v-btn large icon dark><v-icon>mdi-github</v-icon></v-btn></a
                >
              </template>
              <span>xceldeveloper</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <a v-on="on" href="https://wa.me/2348158696460"
                  ><v-btn large icon dark
                    ><v-icon>mdi-whatsapp</v-icon></v-btn
                  ></a
                >
              </template>
              <span>+2348158696460</span>
            </v-tooltip>
          </span>
        </div>

        <span id="article">
          <nuxt-link to="/about">About Us</nuxt-link>
          <b>|</b>
          <nuxt-link to="/termsandconditions">Terms and Conditions</nuxt-link>
          <b>|</b>
          <nuxt-link to="/faqs">FAQs</nuxt-link>
        </span>

        <span id="article">
          &copy;
          <b>{{ AppName }} {{ new Date().getFullYear() }}</b>
        </span>

        <span id="powered-by">
          Powered by
          <a href="https://xceldeveloper.com">
            <v-btn :style="{ padding: '0px', fontSize: '12px' }" dark text>
              <b>Xceldeveloper</b>
            </v-btn>
          </a>
        </span>
      </div>
    </div>

    <v-bottom-sheet v-model="developerDialog" max-width="500px" width="100%">
      <v-card align="center" justify="center">
        <v-card-title>Powered By Xceldeveloper</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div id="dev-btns">
            <v-btn
              @click="contactDeveloper('LINKEDIN')"
              v-if="developer.linkedin !== ''"
              width="50px"
              height="50px"
              elevation="1"
              fab
            >
              <v-icon size="28px">mdi-linkedin</v-icon>
            </v-btn>
            <v-btn
              @click="contactDeveloper('INSTAGRAM')"
              v-if="developer.instagram !== ''"
              width="50px"
              height="50px"
              elevation="1"
              fab
            >
              <v-icon size="28px">mdi-instagram</v-icon>
            </v-btn>
            <v-btn
              @click="contactDeveloper('TWITTER')"
              v-if="developer.twitter !== ''"
              width="50px"
              height="50px"
              elevation="1"
              fab
            >
              <v-icon size="28px">mdi-twitter</v-icon>
            </v-btn>

            <v-btn
              @click="contactDeveloper('EMAIL')"
              v-if="developer.email !== ''"
              width="50px"
              height="50px"
              elevation="1"
              fab
            >
              <v-icon size="28px">mdi-gmail</v-icon>
            </v-btn>
          </div>
          <v-chip
            @click="contactDeveloper('WEBSITE')"
            v-if="developer.website !== ''"
            :style="{ margin: '15px 0px 5px 0px' }"
          >
            <v-icon left>mdi-web</v-icon>
            {{ developer.website }}
          </v-chip>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script>
import device_mixin from '~/mixins/device_mixin.js'
import app_mixin from '~/mixins/app_mixin.js'
export default {
  mixins: [device_mixin, app_mixin],
  data() {
    return {
      developerDialog: false,
      coverImage: [
        require('~/static/icon.png'),
        require('~/static/cover1.png'),
        require('~/static/cover2.png'),
        require('~/static/cover3.jpg'),
      ],
      // coverImage: require('~/static/drake.jpg'),
      logo: require('~/static/icon.png'),
      social: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: '',
      },
      store: {
        googleplay: '',
        applestore: '',
      },
      developer: {
        linkedin: '',
        email: '',
        instagram: '',
        twitter: '',
        website: '',
      },
    }
  },
  mounted() {
    this.getDeveloperContacts()
    this.getAppStoreDetails()
    this.getSocialSocialLinks()
  },
  methods: {
    contactDeveloper(which) {
      if (which == 'EMAIL') {
        console.log('email')
      } else if (which == 'LINKEDIN') {
        console.log('linkedin')
      } else if (which == 'INSTAGRAM') {
        console.log('instagram')
      } else if (which == 'TWITTER') {
        console.log('twitter')
      } else if (which == 'WEBSITE') {
        console.log('website')
      }
    },
    getDeveloperContacts() {
      //from developer own firebase
      this.developer.linkedin = 'linkedin'
      this.developer.email = 'xceldeveloper@gmail.com'
      this.developer.instagram = 'xceldeveloper'
      this.developer.twitter = 'xceldeveloper'
      this.developer.website = 'xceldeveloper.com'
    },
    openAppStore(which) {
      if (which == 'PLAYSTORE') {
        console.log('play store')
      } else if (which == 'APPLESTORE') {
        console.log('apple store')
      }
    },
    getAppStoreDetails() {
      //hard coded
      this.store.googleplay = '/'
      this.store.applestore = '/'
    },
    socialButtons(which) {
      if (which == 'FACEBOOK') {
        console.log('facebook')
      } else if (which == 'INSTAGRAM') {
        console.log('instagram')
      } else if (which == 'TWITTER') {
        console.log('twitter')
      } else if (which == 'YOUTUBE') {
        console.log('youtube')
      }
    },

    getSocialSocialLinks() {
      //from db
      this.social.facebook = ''
      this.social.instagram = 'xceldeveloper'
      this.social.twitter = 'xceldeveloper'
      this.social.youtube = ''
    },
  },
}
</script>

<style lang="scss" scoped>
#home {
  width: 100%;
  height: 100%;
  position: relative;
}

#img-container {
  width: 100%;
  height: auto;
  background-color: var(--accent-color);
}

#balancer {
  width: 100%;
  height: auto;
}

#top-scroller {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: auto;
  text-align: center;
}
#box-wrapper {
  width: 99%;
  height: auto;
  overflow-x: hidden;
  padding-top: 50px;
}

.box {
  width: 90%;
  border-radius: 10px;
  max-width: 500px;
  margin: 5px auto;
  height: auto;
  padding: 20px 10px 10px 10px;
  background-color: var(--accent-color);
  color: #ededed;
}

#speech {
  margin: 30px;
  font-size: 17px;
}

.box:hover {
  color: #ffffff;
}

#box-title {
  width: auto;
  font-size: 20px;
  font-weight: bold;
  border: none;
  padding: 5px 15px;
  border-bottom: 3px solid #ffffff;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
    'Lucida Sans', Arial, sans-serif;
}
.arrange-center {
  top: -50px;
  left: 50%;
  position: absolute;
  transform: translate(-50%, 15px);
}

#footer {
  width: 100%;
  height: auto;
  padding: 5px;
  background-color: var(--accent-color);
  text-align: center;
}

#social-wrapper {
  width: 100%;
  text-align: center;
  height: auto;
  padding: 5px;
}
#social-btns {
  width: auto;
  padding: 10px 15px;
  border: 2px solid #ffffff;
  border-radius: 50px;
}

#article {
  display: block;
  margin: 10px auto;
  color: #ffffff;
  font-size: 17px;
  text-decoration: none;
  word-spacing: 4px;
}

a {
  text-decoration: none;
  color: #ffffff;
  word-spacing: 0px;
  font-size: 14px;
}

#powered-by {
  display: block;
  margin: 10px auto;
  color: #ffffff;
  font-size: 12px;
  word-spacing: 0px;
}
#dev-btns {
  width: 100%;
  height: auto;
  text-align: center;
  margin: 10px 0px 10px 0px;
  word-spacing: 20px;
}
</style>