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
      <v-toolbar-title>Edit Item</v-toolbar-title>
    </v-toolbar>
    <div id="wrapper-2" v-if="!isloading && !errorLoading">
      <div id="item-images">
        <v-slide-group v-model='seeingImage' :show-arrows="isMobile ? false : true" light mobile-break-point="320px">
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
        <v-card-title v-if="!publishing">Are you sure you want to Plusblish Changes ?</v-card-title>
        <v-card-title v-if="publishing">Publishing changes</v-card-title>
        <v-card-actions>
          <v-btn
            block
            :loading="publishing"
            dark
            @click="beginUpdate"
            :color="Colors.accent"
          >Proceed</v-btn>
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
      snackTimeout: 2000,
      confirmDialog: false,

      stylex: {
        height: '100%',
        width: '100%'
      },
      croppedImg: '',
      hasCropped: false,
      showCropper: false,

      imageEdited: false,
      imagePath: [],
      removedImages: [],
      imagePushed: false,
      newImagePath:[]
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
      } else if (this.isTransporterSignedIn) {
        this.openNewPage('/transporter', false)
        return
      }
    } else {
      this.openNewPage('/gateway', false)
      return
    }
    this.CANRENDER = true
    this.item.id = this.$route.params.id
    this.getItemDetails()
  },
  methods: {
      selectMainImage(index) {
      const changed = this.item.images.splice(index, 1)
      this.item.images.splice(0, 0, changed[0])
      this.mainImageDialog = false
      this.seeingImage = 0;
     
    },
    openFullScreen(index) {
      this.showFullScreen = true
      this.showNumber = index
    },
    removeImage() {
      if(!this.item.images[this.selectedImage].new){//if the image is not in server so no url yet
         this.removedImages.push(this.item.images[this.selectedImage]) //log removed image
      }else{//image is first in server
      //  this.imagePath.splice(this.selectedImage, 1) //remove image ref from array for edit
      }
      this.item.images.splice(this.selectedImage, 1) //remove from array
      
      if(this.item.images.length > 2){
       this.seeingImage = this.selectedImage -1
      }else{
        this.seeingImage = 0;
      }
      
      if (this.item.images.length === 0) {
        this.showFullScreen = false
      }
      this.confirmDialog = false
      this.imageEdited = true
    },

    viewedImage(result) {
      this.selectedImage = result
    },
    closeMe() {
      this.$emit('cancel', true)
    },

    verifyInputs() {
      if (this.item.images.length === 0) {
        this.snackMessage = 'Please Add ATLEAST ONE image'
        this.snackBar = true
        return
      }
      this.formHasErrors = false
      Object.keys(this.form).forEach((f) => {
        if (!this.form[f]) this.formHasErrors = true
        this.$refs[f].validate(true)
      })
      if (this.formHasErrors) {
        return
      }
      this.confirmPublishDialog = true
    },

    completeUpdate() {
     
      var itemRef = this.$fireStore.collection('items').doc(this.item.id)

      // Set the "capital" field of the city 'DC'
      itemRef
        .update({
          title: this.item.title,
          price: this.item.price,
          description: this.item.description,
          max_order: this.item.max_quantity,
          min_order: this.item.min_quantity,
          images: JSON.stringify(this.newImagePath)
        })
        .then(() => {
          this.confirmPublishDialog = false
          this.publishing = false
          this.snackBar = true
          this.snackMessage = 'Item Updated Sucessfully..'

          if (this.removedImages.length > 0) {
            console.log('deleting '+this.removedImages.length+' images');
            for (var i = 0; i < this.removedImages.length; i++) {
              this.deleteImageFromSever(this.removedImages[i].name)
            }
          }else{
            console.log('no images to be deleted')
          }
          setTimeout(() => {
            this.openNewPage('/admin/item/' + this.item.id, false)
          }, this.snackTimeout + 100)
        })
        .catch((error) => {
          this.publishing = false
          this.snackBar = true
          this.snackMessage = 'Error updating Item'
        })
    },

    getItemDetails() {
      this.errorLoading = false
      this.isloading = true
      //search server with item.id if id not found redirect home
      var docRef = this.$fireStore.collection('items').doc(this.item.id)
      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {//if item exist
            this.item.title = doc.data().title
            this.item.price = doc.data().price
            this.item.description = doc.data().description
            this.item.min_quantity = doc.data().min_order
            this.item.max_quantity = doc.data().max_order
            this.item.images = JSON.parse(doc.data().images)
         //   this.imagePath = JSON.parse(doc.data().images) //for image editor in firestore server

            this.isloading = false
          } else {//item doesn't exist
            
            this.openNewPage('/', false, true)
            this.isloading = false
            return
          }
        })
        .catch((error) => {
          this.errorLoading = true
          this.isloading = false
        })
    },

    /////////////////////////
    done() {
      this.item.images.push({
        src: this.croppedImg,
        new: true,
        name:Date.now() + '.png'
      })

    
    setTimeout(()=>{
        this.seeingImage = this.item.images.length -1;
    },100)

      this.showCropper = false
      this.croppedImg = ''
      this.hasCropped = false
      this.imageEdited = true
    },
    crop() {
      try {
        var imgx = this.$refs.cropper.getCroppedCanvas().toDataURL()
        this.croppedImg = imgx
        this.$refs.cropper.replace(imgx, false)
        this.hasCropped = true
      } catch (error) {
        this.showCropper = true
      }
    },

    getImage(e) {
      var file
      try {
        file = e.target.files[0]
      } catch (error) {
        this.canShow = false
      }
      if (file.type.indexOf('image/') === -1) {
        this.snackMessage = 'Please Select an IMAGE FILE'
        this.snackBar = true
        return
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
        reader.readAsDataURL(file)
      } else {
        this.snackMessage = 'An Error Occured'
        this.snackBar = true
      }
    },
    showFileChooser() {
      this.$refs.input.click()
    },
    beginUpdate() {
      var newimage = 0
      if (this.publishing) {
        return
      }
      this.publishing = true
      if (!this.imageEdited) {
        this.newImagePath = this.item.images//image wasn't edited so jes clone images
        //if image was not edited jes edit text only
        this.completeUpdate()
      } else {//image was edited
        try {
          for (var i = 0; i < this.item.images.length; i++) {
            if (this.item.images[i].new) {
              //if new image was added
              console.log('block1')
              this.imageUploader(this.item.images[i], i)
              console.log('block 2')
              newimage++//add to image count
              console.log('uploading... ' + i)
            }else{//old image so jes copy former url details
            console.log('block 3')
              this.imagePath.push({src:this.item.images[i].src,name:this.item.images[i].name})
            console.log('block 4')
            }
          }

          if (newimage == 0) {
             this.newImagePath = this.item.images//image wasn't edited so jes clone deleted
            console.log('block 5')
            //so no new image was added only deleted so we complete update
            this.completeUpdate();
          }
        } catch (error) {
          console.log(error)
        }
      }
    },
    deleteImageFromSever(name) {
      const firestorage = this.$fireStorage
      // Create a reference to the file to delete
      var desertRef = firestorage.refFromURL(
        'gs://mawatersofficial.appspot.com/item/' + name
      )

      // Delete the file
      desertRef
        .delete()
        .then(() => {
         //not doing anyting deleted
        
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
          if (error.code_ == 'storage/invalid-format') {
              //invalid image
          } else if (error.code == 'storage/object-not-found') {
              
           //file not found
          } else {
            //error unknown
            this.snackBar = true
            this.snackMessage = 'Error Occurred'
          }
    
        })
    },

    imageUploader(image, i) {
      const firestorage = this.$fireStorage
      const base64EncodedImageString = image.src.replace(
        /^data:image\/\w+;base64,/,
        ''
      )
       var name = image.name;
     
      var uploadTask = firestorage
        .ref('/item')
        .child(name)
        .putString(base64EncodedImageString, 'base64', {
          contentType: 'image/png'
        })
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(name + ' Upload is ' + progress + '% done')
        },(error) => {
          // Handle unsuccessful uploads
          console.log('error ' + error)
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            //console.log('File available at', downloadURL);
            this.imagePath.push({ src: downloadURL, name: name });
            this.imagePushed = true //so watcher can call completeUpdate specially
          })
        }
      )
    },
    getImagepath(pattern,source){
      var result = '';
      for(var i = 0; i < source.length; i++){
        if(pattern == source[i].name){
          result = source[i];
        }
      }
      return result;
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
      if (
        this.imagePath.length == this.item.images.length &&
        this.imagePushed
      ) {  
        for(var i = 0; i < this.item.images.length; i++){
          this.newImagePath.push(this.getImagepath(this.item.images[i].name,this.imagePath));
        }
        console.log('uploaded '+this.newImagePath.length+ ' images');
        this.completeUpdate()
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