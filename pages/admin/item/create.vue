<template>
  <div id="wrapper" v-cloak v-if="CANRENDER">
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
    <v-toolbar dark :color="Colors.accent" dense light elevation="1">
      <v-btn icon @click="navBack">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-toolbar-title>Create New Item</v-toolbar-title>
    </v-toolbar>
    <div id="wrapper-2" v-if="!isloading && !errorLoading">
      <div id="item-images">
        <v-slide-group
          v-model="seeingImage"
          :show-arrows="isMobile ? false : true"
          light
          mobile-break-point="500px"
        >
          <v-slide-item v-if="item.images.length == 0">
            <v-btn
              @click="showFileChooser"
              :style="{height:'250px',width:'100%'}"
              :color="Colors.accent"
              text
            >
              <v-icon left>mdi-plus</v-icon>Image
            </v-btn>
          </v-slide-item>
          <v-slide-item v-for="(item, index) in item.images" :key="index">
            <div id="image-cover">
              <v-img
                :src="item.src"
                :aspect-ratio="1/1"
                contain
                class="dark"
                width="100%"
                height="100%"
                @click="openFullScreen(index)"
              >
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate :color="Colors.accent"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </div>
          </v-slide-item>
        </v-slide-group>
        <v-btn
          v-if="item.images.length > 0 && item.images.length < 5"
          @click="showFileChooser"
          :style="{margin:'15px auto',display:'block'}"
          :color="Colors.accent"
          text
        >
          <v-icon left>mdi-plus</v-icon>Add Image
        </v-btn>

        <div id="image-thumnail-wrapper">
          <div
            id="main-image"
            @click="item.images.length > 1 ? mainImageDialog = true : mainImageDialog = false"
          >
            <v-img
              :src="item.images.length > 0 ? item.images[0].src : ''"
              :aspect-ratio="1/1"
              contain
              class="dark"
              width="100%"
              height="100%"
            />
          </div>

          <div class="thumbnails">
            <div
              id="thumbnail"
              v-for="(item, index) in item.images"
              :key="index"
              @click="seeingImage = index"
            >
              <v-img
                :src="item.src"
                :aspect-ratio="1/1"
                contain
                class="dark"
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </div>

        <v-bottom-sheet v-model="mainImageDialog">
          <v-card>
            <v-card-title>Select Item Main Image</v-card-title>
            <v-divider></v-divider>
            <v-card-text justify="center" align="center">
              <div id="images">
                <div
                  id="thumbnail"
                  v-for="(item, index) in item.images"
                  :key="index"
                  @click="selectMainImage(index)"
                >
                  <v-img
                    :src="item.src"
                    :aspect-ratio="1/1"
                    contain
                    class="dark"
                    width="98%"
                    height="100%"
                  />
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-bottom-sheet>
      </div>
      <div id="form-wrapper" ref="form">
        <v-text-field
          name="Name"
          ref="title"
          label="Name"
          type="text"
          :readonly="publishing"
          :color="Colors.accent"
          v-model.trim="item.title"
          :rules="[
         ()=> !!item.title || 'This field is required']"
        ></v-text-field>

        <v-text-field
          name="Price"
          ref="price"
          label="Price"
          type="number"
          :readonly="publishing"
          :color="Colors.accent"
          v-model.trim="item.price"
          :rules="[
         ()=> !!item.price || 'This field is required',
         ()=> typeof item.price == 'number' || 'Invalid Price']"
        ></v-text-field>

        <v-text-field
          name="Minimum Per Order"
          ref="minimum"
          label="Minimum Per Order"
          type="number"
          :readonly="publishing"
          :color="Colors.accent"
          v-model.trim="item.min_quantity"
          :rules="[
         ()=> !!item.min_quantity || 'This field is required']"
        ></v-text-field>

        <v-text-field
          name="Maximum Per Order"
          ref="maximum"
          label="Maximum Per Order"
          type="number"
          :readonly="publishing"
          :color="Colors.accent"
          v-model.trim="item.max_quantity"
          :rules="[
         ()=> !!item.max_quantity || 'This field is required']"
        ></v-text-field>

        <v-textarea
          name="Description"
          width="100px"
          ref="description"
          label="Description"
          type="text"
          :readonly="publishing"
          :color="Colors.accent"
          rows="1"
          auto-grow
          row-height="13"
          v-model.trim="item.description"
          :rules="[
         ()=> !!item.description || 'This field is required']"
        ></v-textarea>
      </div>

      <div id="buy-wrapper" v-if="!isloading && !errorLoading">
        <v-btn
          :color="Colors.accent"
          dark
          width="80%"
          @click="verifyInputs"
          :style="{borderRadius:'5px'}"
        >
          <v-icon left size="20">mdi-pencil-outline</v-icon>Publish
        </v-btn>
      </div>
    </div>

    <v-bottom-sheet max-width="550px" inset v-model="confirmPublishDialog" :persistent="publishing">
      <v-card style="2px">
        <v-card-title v-if="!publishing">Are you sure you want to Plusblish ?</v-card-title>
        <v-card-title v-if="publishing">Publishing Item...</v-card-title>
        <v-card-actions>
          <v-btn block :loading="publishing" dark @click="Publish" :color="Colors.accent">Proceed</v-btn>
        </v-card-actions>
      </v-card>
    </v-bottom-sheet>

    <v-dialog v-model="showFullScreen" fullscreen>
      <v-app-bar color="rgba(0,0,0,0.3)" dark absolute v-if="float">
        <v-btn icon height="50px" @click="showFullScreen = !showFullScreen">
          <v-icon size="28px">mdi-chevron-down</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn icon height="50px" @click="confirmDialog = true">
          <v-icon size="28px">mdi-delete-outline</v-icon>
        </v-btn>
      </v-app-bar>
      <div id="fullscreen">
        <v-hover v-slot:default="{ hover }" close-delay="800">
          <imageviewpager
            @clicked="float = !float"
            @current="viewedImage"
            :images="item.images"
            :onHover="hover"
            :restart="true"
            :select="showNumber"
          />
        </v-hover>
      </div>
    </v-dialog>

    <v-row class="fill-height ma-0" align="center" justify="center" v-if="isloading">
      <v-progress-circular indeterminate size="50" :color="Colors.accent"></v-progress-circular>
    </v-row>
    <v-row
      class="fill-height ma-0"
      align="center"
      justify="center"
      v-if="errorLoading && !isloading"
    >
      <v-card elevation="0" justify="center" align="center">
        <v-card-text>
          Error Loading..
          <br />Please check your network connection
          <br />
        </v-card-text>
        <v-btn @click="getItemDetails" :color="Colors.accent" dark rounded small outlined>Retry</v-btn>
      </v-card>
    </v-row>

    <v-snackbar v-model="snackBar">{{snackMessage}}</v-snackbar>
    <v-bottom-sheet inset v-model="confirmDialog" max-width="450px">
      <v-card :style="{padding:'5px'}">
        <v-card-title>Confirm Delete Image</v-card-title>
        <v-btn
          :style="{borderRadius:'0px'}"
          block
          :color="Colors.accent"
          dark
          @click="removeImage"
        >Yes</v-btn>
        <v-btn block text :color="Colors.accent" @click="confirmDialog = false">No</v-btn>
      </v-card>
    </v-bottom-sheet>
    <input
      style="display:none"
      ref="input"
      type="file"
      name="image"
      accept="image/*"
      @change="getImage"
    />

    <div id="image-editor" v-if="showCropper">
      <div class="crop-header">
        <v-app-bar color="#000000" dark dense>
          <v-btn icon @click="showCropper = !showCropper">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Crop</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="#000000" @click="done" v-if="hasCropped">Done</v-btn>
          <v-btn icon @click="showFileChooser">
            <v-icon>mdi-reply</v-icon>
          </v-btn>
          <v-btn icon @click="crop">
            <v-icon>mdi-crop</v-icon>
          </v-btn>
        </v-app-bar>
      </div>
      <div class="cropper-container">
        <vue-cropper
          ref="cropper"
          :minCropBoxWidth="200"
          :minCropBoxHeight="200"
          :src="croppedImg"
          :viewMode="1"
          :autoCropArea="1"
          :aspectRatio="1/1"
          :containerStyle="stylex"
          :guides="false"
        />
      </div>
    </div>
  </div>
</template>
<script>
import app_mixin from '~/mixins/app_mixin.js'
import device_mixin from '~/mixins/device_mixin.js'
import user_mixin from '~/mixins/user_mixin.js'
import utils_mixin from '~/mixins/utils_mixin.js'
import navigation_mixin from '~/mixins/navigation_mixin.js'
import imageviewpager from '~/components/utils/imageviewpager.vue'

import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
export default {
  mixins: [device_mixin, user_mixin, utils_mixin, navigation_mixin, app_mixin],
  components: {
    imageviewpager,
    VueCropper
  },
  data() {
    return {
      CANRENDER: false,
      float: true,
      isloading: false,
      errorLoading: false,
      seeingImage: null,
      mainImageDialog: false,
      item: {
        id: 0,
        title: '',
        price: '',
        description: '',
        min_quantity: 0,
        max_quantity: 0,
        images: []
      },
      showNumber: 0,
      publishing: false,
      formHasErrors: false,
      confirmPublishDialog: false,
      showFullScreen: false,
      selectedImage: 0,
      snackBar: false,
      snackMessage: '',
      confirmDialog: false,

      stylex: {
        height: '100%',
        width: '100%'
      },
      croppedImg: '',
      croppedBlob:'',
      hasCropped: false,
      showCropper: false,
      imagePath: []
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
      } else if (this.isTransporterSignedIn) {
        this.openNewPage('/transporter', false, true)
      }
    } else {
      this.openNewPage('/gateway', false, true)
    }
    this.CANRENDER = true
  },
  methods: {
    selectMainImage(index) {
      const changed = this.item.images.splice(index, 1)
      this.item.images.splice(0, 0, changed[0])
      this.mainImageDialog = false
      this.seeingImage = 0
    },
    openFullScreen(index) {
      this.showFullScreen = true
      this.showNumber = index
    },
    removeImage() {
      this.item.images.splice(this.selectedImage, 1)
      if (this.item.images.length === 0) {
        this.showFullScreen = false
      }
      this.confirmDialog = false

      if (this.item.images.length > 2) {
        this.seeingImage = this.selectedImage - 1
      } else {
        this.seeingImage = 0
      }
    },

    viewedImage(result) {
      this.selectedImage = result
    },
    closeMe() {
      this.$emit('cancel', true)
    },

    verifyInputs() {
      if (this.item.images.length === 0) {
        this.snackMessage = 'Please Add ATLEAST ONE ITEM IMAGE'
        this.snackBar = true
        return
      }
      this.formHasErrors = false
      Object.keys(this.form).forEach((f) => {
        if (!this.form[f]) this.formHasErrors = true
        this.$refs[f].validate(true)
      })
      // if (this.formHasErrors) {
      //   return
      // }
      this.confirmPublishDialog = true
    },

    Publish() {
      if (this.publishing) {
        return
      }
      // this.uploadImage()
      this.insertItem()
      this.publishing = true
    },

    insertItem(){
      var item = {
        name:this.item.title,
        price:this.item.price,
        description:this.item.description,
        minimum_per_order:this.item.min_quantity,
        maximum_per_order:this.item.max_quantity,
        cart_count:0,
        order_count:0
      }

      this.$axios.$post('createproduct/',item).then((res)=>{
        this.item.id = res.id
         this.deployImage()
      }).catch((error)=>{
         this.publishing = false
          this.snackBar = true
          this.snackMessage = 'Error adding Item'
          console.log('error adding item:' +error)
      })
    },

    deployImage(){
      console.log('deploying image')
      var image_data = new FormData();
      image_data.append('product_id',this.item.id)
      for(var i = 0; i < this.item.images.length; i++){
        if(i == 0){image_data.append('image_1',this.item.images[i].blob,this.item.title + Date.now() + '.png')}
          if(i == 1){image_data.append('image_2',this.item.images[i].blob,this.item.title + Date.now() + '.png')}
            if(i == 2){image_data.append('image_3',this.item.images[i].blob,this.item.title + Date.now() + '.png')}
              if(i == 3){image_data.append('image_4',this.item.images[i].blob,this.item.title + Date.now() + '.png')}
                if(i == 4){image_data.append('image_5',this.item.images[i].blob,this.item.title + Date.now() + '.png')}
      }


      this.$axios.$post('uploadproductimage/',image_data,{  headers: {
        'content-type': 'multipart/form-data'
      }}).then(res=>{
          this.openNewPage('/admin/item/' + this.item.id, false)
        
      }).catch(err =>{
        //error retry or delete from db
      })

    },
    completePublish() {
      var item = {
        title: this.item.title,
        price: this.item.price,
        description: this.item.description,
        min_order: this.item.min_quantity,
        max_order: this.item.max_quantity,
        images: JSON.stringify(this.imagePath),
        carted: 0,
        orders: 0
      }
      console.log('completeing publishing')

      this.$fireStore
        .collection('items')
        .add(item)
        .then((docRef) => {
          //docRef is id returned by firebase
          this.openNewPage('/admin/item/' + docRef.id, false)
        })
        .catch((error) => {
          this.publishing = false
          this.snackBar = true
          this.snackMessage = 'Error adding Item'
        })
    },

    uploadImage() {
      for (var i = 0; i < this.item.images.length; i++) {
        this.imageUploader(this.item.images[i].src)
      }
    },



    imageUploader(image) {
      const ref = Date.now() + '.png'
      const firestorage = this.$fireStorage
      const base64EncodedImageString = image.replace(
        /^data:image\/\w+;base64,/,
        ''
      )
      var uploadTask = firestorage
        .ref('/item')
        .child(ref)
        .putString(base64EncodedImageString, 'base64', {
          contentType: 'image/png'
        })
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('Upload is ' + progress + '% done')
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.imagePath.push({ src: downloadURL, name: ref })
          })
        }
      )
    },

    /////////////////////////
    done() {
      this.item.images.push({
        src: this.croppedImg,
        blob:this.croppedBlob
      })

      setTimeout(() => {
        this.seeingImage = this.item.images.length - 1
      }, 100)

      this.showCropper = false
      this.croppedImg = ''
      this.hasCropped = false
    },
    crop() {
      var imgx = this.$refs.cropper.getCroppedCanvas().toDataURL()

      this.$refs.cropper.getCroppedCanvas().toBlob((blob) => {
              this.croppedBlob =  blob
      });

      this.croppedImg = imgx
      this.$refs.cropper.replace(imgx, false)
      this.hasCropped = true
    },

    getImage(e) {
      var file
      try {
        file = e.target.files[0]
      } catch (error) {
        this.canShow = false
      }
      try {
        if (file.type.indexOf('image/') === -1) {
          this.snackMessage = 'Please Select an IMAGE FILE'
          this.snackBar = true
          return
        }
      } catch (error) {
        this.snackMessage = 'Please Select an IMAGE FILE'
        this.snackBar = true
      }

      if (typeof FileReader === 'function') {
        const reader = new FileReader()
        reader.onload = (event) => {
          this.croppedImg = event.target.result

          this.showCropper = true

          try {
            // rebuild cropperjs with the updated source
            this.$refs.cropper.replace(event.target.result)
          } catch (error) {}
        }

        try {
          reader.readAsDataURL(file)
        } catch (error) {
          this.snackMessage = 'Please Select an IMAGE FILE'
          this.snackBar = true
        }
      } else {
        this.snackMessage = 'An Error Occured'
        this.snackBar = true
      }
    },
    showFileChooser() {
      this.$refs.input.click()
    }
  },

  computed: {
    form() {
      return {
        title: this.item.title,
        price: this.item.price,
        minimum: this.item.min_quantity,
        maximum: this.item.max_quantity,
        description: this.item.description
      }
    }
  },
  watch: {
    imagePath() {
      if (this.imagePath.length == this.item.images.length) {
        this.completePublish()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#fullscreen {
  width: 100%;
  height: 100%;
  background-color: #000000;
}

#wrapper {
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
}

#wrapper-2 {
  width: 100vw;
  max-width: 700px;
  margin: 0px auto;
  height: calc(100vh - 48px);
  overflow: auto;
  border: 1px solid lightgrey;
}

#item-images {
  width: 100%;
  height: auto;
  overflow: auto;
}

#image-cover {
  width: 250px;
  height: auto;
  margin-right: 5px;
}
#form-wrapper {
  padding: 25px;
}

#buy-wrapper {
  width: 100%;
  text-align: center;
  padding: 3px;
  background-color: #ffffff;
}

#image-editor {
  width: 100%;
  height: 100%;
  background-color: #000000;
  position: fixed;
  top: 0px;
  z-index: 100;
}

.crop-header {
  width: 100%;
  height: 48px;
}
.cropper-container {
  width: 100%;
  height: calc(100% - 48px);
}

.crop-footer {
  width: 100%;
  height: 50px;
}

#image-thumnail-wrapper {
  width: 100%;
  height: 70px;
  display: flex;
  margin: 10px 0px;
}

.thumbnails {
  flex: 1;
  height: 50px;
  margin: 5px 0px;
  white-space: nowrap;
  overflow: auto;
}

#main-image {
  width: 60px;
  height: 60px;
  border-radius: 10px;
}

#thumbnail {
  width: 50px;
  height: 50px;
  background-color: var(--accent-color);
  margin-left: 5px;
  display: inline-block;
}
</style>