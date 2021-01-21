<template>
  <v-dialog v-model="canShow" fullscreen>
    <v-toolbar dark dense :color="Colors.accent">
      <v-btn icon @click="closeMe">
        <v-icon>mdi-chevron-down</v-icon>
      </v-btn>
      <v-toolbar-title>About Us</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        @click="confirmPublishDialog = true"
        v-if="hasChanged "
        :loading="isPublishing"
      >Publish</v-btn>
      <v-btn v-if="!isLoading" icon dark @click="canEdit = !canEdit">
        <v-icon v-if="!canEdit">mdi-pen</v-icon>
        <v-icon v-if="canEdit">mdi-pen-off</v-icon>
      </v-btn>
    </v-toolbar>
    <div id="wrapper">
      <v-row class="fill-height ma-0" align="center" justify="center" v-if="isLoading">
        <v-card width="80%" max-width="550px" elevation="0" align="center" justify="center">
          <v-card-text>
            <v-progress-linear width="100%" :color="Colors.accent" :indeterminate="true" />
          </v-card-text>
        </v-card>
      </v-row>
      <div id="preview" v-if="!canEdit" v-html="preview">
        <v-row class="fill-height ma-0" align="center" justify="center" v-if="preview == ''">
          <v-card width="80%" max-width="550px" elevation="0" align="center" justify="center">
            <v-card-text>Write YourAAbout us Article Here</v-card-text>
          </v-card>
        </v-row>
      </div>
      <div id="editor" v-if="canEdit">
        <vue-editor
          style="height:calc(100% - 50px)"
          v-model.trim="article"
          :editor-toolbar="customToolbar"
        />
      </div>
    </div>
    <v-bottom-sheet max-width="500px" inset v-model="confirmPublishDialog">
      <v-card>
        <v-card-title>Are you sure you want to publish changes?</v-card-title>
        <v-card-text>
          <v-btn
            @click="confirmPublish"
            dark
            block
            :color="Colors.accent"
            :style="{boderRadius:'0px'}"
          >Yes</v-btn>
          <v-btn block :color="Colors.accent" text @click="confirmPublishDialog = false">No</v-btn>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>

    <div>
      <v-snackbar v-model="snackBar" :timeout="snackDurr">{{snackMessage}}</v-snackbar>
    </div>
  </v-dialog>
</template>
<script>
import app_mixin from '~/mixins/app_mixin.js'
import device_mixin from '~/mixins/device_mixin.js'
import utils_mixin from '~/mixins/utils_mixin.js'

let VueEditor

if (process.client) {
  VueEditor = require('vue2-editor').VueEditor
}
export default {
  components: { VueEditor },
  mixins: [device_mixin, utils_mixin,app_mixin],
  props: {
    canShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
     
      confirmPublishDialog: false,
      isPublishing: false,
      isLoading: false,
      canEdit: false,
      hasChanged: false,
      snackBar: false,
      snackMessage: '',
      snackDurr: 2500,
      article: '',
      customToolbar: [
        [
          {
            header: [false, 1, 2, 3, 4, 5, 6]
          }
        ],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [
          {
            indent: '-1'
          },
          {
            indent: '+1'
          }
        ],
        [
          {
            align: ''
          },
          {
            align: 'center'
          },
          {
            align: 'right'
          },
          {
            align: 'justify'
          }
        ],
        [
          {
            color: []
          },
          {
            background: []
          }
        ]
      ]
    }
  },
  methods: {
    closeMe() {
      if (!this.isPublishing) this.$emit('cancel', true)
      else this.snackBar = true
      this.snackMessage = 'Please Wait'
    },

    getArticle() {
      this.isLoading = true

      setTimeout(() => {
        this.article = ''
        
        this.isLoading = false;
        if (this.article === '') {
          this.canEdit = true
        }
      }, 3000)
    },

    confirmPublish() {
      if (this.isPublishing) {
        return
      }
      this.confirmPublishDialog = false
      this.isPublishing = true
       this.canEdit = false;
      setTimeout(() => {
        this.snackMessage = 'ABOUT US updated'
        this.snackBar = true
        this.isPublishing = false
      }, 3000)
    }
  },
  watch: {
    canShow(val) {
      if (val && this.article == '') this.getArticle()
    },
    article(val) {
      if (val.length !== 0 && !!val) {
        this.hasChanged = true
      } else {
        this.hasChanged = false
      }
    }
  },

  computed: {
    preview() {
      return this.article.replace('\n', '<br>')
    }
  }
}
</script>

<style lang="scss" scoped>
#wrapper {
  width: 100%;
  height: calc(100vh - 48px);
  margin: auto;
  background-color: #ffffff;
}

#editor,
#preview {
  width: 100%;
  height: 100%;
  overflow: auto;
  max-width: 900px;
  border: 1px solid lightgrey;
  margin: auto;
}

#progress-wrapper {
  width: 100%;
  padding: 3px;
}
</style>