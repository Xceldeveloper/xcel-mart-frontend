<template>
  <div id="image-view-pager" ref="viewpager">
    <v-carousel
      v-model="model"
      :hide-delimiter-background="hideDelimitersBackground"
      :hide-delimiters="hideDelimiters"
      height="100%"
      :continuous="restart"
      :cycle="isAuto"
      :interval="interval"
      :show-arrows="isMobile==true ? false:onHover"
    >
      <v-carousel-item v-for="(item, index) in images" :key="index">
        <v-img :src="item.src" contain class="dark" width="100%" height="100%" @click="emitCliked">
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate :color="Colors.accent"></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>
<script>
import device_mixin from '~/mixins/device_mixin.js'
import app_mixin from '~/mixins/app_mixin.js'
export default {
 mixins: [device_mixin,app_mixin],
  props: {
    activated: {
      type: Boolean,
      default: false
    },
    images: {
      type: Array,
      default: []
    },
    select: {
      type: Number,
      default: 0
    },
    keyPressed: {
      type: Object
    },
    hideDelimiters: {
      type: Boolean,
      default: true
    },
    hideDelimitersBackground: {
      type: Boolean,
      default: true
    },
    isAuto: {
      type: Boolean,
      default: false
    },
    restart: {
      type: Boolean,
      default: false
    },
    onHover: {
      type: Boolean,
      default: false
    },
    interval: {
      type: Number,
      default: 3000
    }
  },
  data() {
    return {
     
      model: 0
    }
  },
  mounted() {},
  methods: {
    emitCliked() {
      this.$emit('clicked')
    }
  },
  watch: {
    keyPressed() {
      if (this.keyPressed.key == 'ArrowRight') {
        this.model++
      } else if (this.keyPressed.key == 'ArrowLeft') {
        this.model--
      }
    },
    model(val) {
      this.$emit('current', val)
    },
    select(val) {
      if(val == -1){
        this.model = this.images.length - 1;
        return;
      }
      this.model = val
    }
  }
}
</script>

<style lang="scss" scoped>
#image-view-pager {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>