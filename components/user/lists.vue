<template>
  <div id="lists">
    <v-row
      class="fill-height ma-0"
      align="center"
      justify="center"
      v-if="!loading && !errorLoading && items.length > 0"
    >
      <div
        id="item-container"
        v-for="(item, index) in items"
        :key="index"
        @click="linkTo(item.id)"
      >
        <div id="item-img">
          <v-img
            :src="item.images[0]"
            :aspect-ratio="1 / 1"
            contain
            class="grey lighten-2"
            :style="{ borderRadius: '10px 10px 0px 0px' }"
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
        </div>
        <span id="item-title">{{ item.name }}</span>
        <span id="item-price">{{ item.price }}</span>
      </div>
      <div id="load-more-btn" v-if="totalItems > items.length">
        <v-btn
          @click="loadMore"
          :loading="loadingMore"
          block
          text
          :color="Colors.accent"
        >
          <v-icon left>mdi-chevron-down</v-icon>Load More
        </v-btn>
      </div>
    </v-row>
    <v-row
      class="fill-height ma-0"
      align="center"
      justify="center"
      v-if="loading && !errorLoading"
    >
      <v-progress-circular
        indeterminate
        size="50"
        :color="Colors.accent"
      ></v-progress-circular>
    </v-row>
    <v-row
      class="fill-height ma-0"
      align="center"
      justify="center"
      v-if="items.length === 0 && !loading && !errorLoading"
      >No items Right Now</v-row
    >
    <v-row
      class="fill-height ma-0"
      align="center"
      justify="center"
      v-if="errorLoading"
    >
      <v-card elevation="0" justify="center" align="center">
        <v-card-text>
          Error Loading..
          <br />Please check your network connection
          <br />
        </v-card-text>
        <v-btn
          @click="getTotalItem"
          :color="Colors.accent"
          dark
          rounded
          small
          outlined
          >Retry</v-btn
        >
      </v-card>
    </v-row>

    <v-snackbar v-model="snackBarMedia">
      Error Loading...
      <v-btn flat text @click.native="loadMore">Retry</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import device_mixin from '~/mixins/device_mixin.js'
import user_mixin from '~/mixins/user_mixin.js'
import app_mixin from '~/mixins/app_mixin.js'
export default {
  mixins: [device_mixin, user_mixin, app_mixin],
  data() {
    return {
      loading: false,
      errorLoading: false,
      items: [],
      imageQueue: [],
      totalItems: 0,
      lastQueriedIndex: null,
      loadingMore: false,
      snackBarMedia: false,
      snackMessage: '',
    }
  },
  mounted() {
    this.getTotalItem()
  },
  methods: {
    loadMore() {
      if (this.loadingMore) {
        return
      }

      this.loadingMore = true

      setTimeout(() => {
        this.loadingMore = false

        this.items.push(
          {
            name: 'Can  water 50x',
            price: 100,
            description: 'Very taseful',
            images: [require('~/static/canproduct1.png')],
            minimum_per_order: 5,
            maximum_per_order: 1000000,
            cart_count: 150,
            order_count: 80,
            created_at: '',
            updated_at: '',
          },
          {
            name: 'Can  water 10x',
            price: 100,
            description: 'Very taseful',
            images: [require('~/static/canproduct2.png')],
            minimum_per_order: 5,
            maximum_per_order: 1000000,
            cart_count: 150,
            order_count: 80,
            created_at: '',
            updated_at: '',
          },
          {
            name: 'Can  water 50x',
            price: 100,
            description: 'Very taseful',
            images: [require('~/static/canproduct1.png')],
            minimum_per_order: 5,
            maximum_per_order: 1000000,
            cart_count: 150,
            order_count: 80,
            created_at: '',
            updated_at: '',
          },
          {
            name: 'Can  water 50x',
            price: 100,
            description: 'Very taseful',
            images: [require('~/static/canproduct1.png')],
            minimum_per_order: 5,
            maximum_per_order: 1000000,
            cart_count: 150,
            order_count: 80,
            created_at: '',
            updated_at: '',
          },
          {
            name: 'Can  water 10x',
            price: 100,
            description: 'Very taseful',
            images: [require('~/static/canproduct2.png')],
            minimum_per_order: 5,
            maximum_per_order: 1000000,
            cart_count: 150,
            order_count: 80,
            created_at: '',
            updated_at: '',
          }
        )
      }, 800)

      // this.$axios
      //   .$get(
      //     '/products?offset=' +
      //       this.calcOffset(this.totalItems, this.items.length)
      //   )
      //   .then((res) => {
      //     for (let i = 0; i < res.length; i++) {
      //       this.items.push(res[i])
      //     }

      //     this.loadingMore = false

      //     //fetch new images
      //     for (var i = this.items.length - 5; i < this.items.length; i++) {
      //       this.getProductImage(i)
      //     }
      //   })
      //   .catch((error) => {
      //     this.snackBarMedia = true
      //     this.snackMessage = error
      //     this.loadingMore = false
      //   })
    },
    getTotalItem() {
      //get total item from database
      this.loading = true
      this.errorLoading = false
      this.totalItems = 15

      this.getLists()

      // this.$axios
      //   .$get('/getcount?target=products')
      //   .then((res) => {
      //     this.totalItems = res
      //     this.getLists()
      //   })
      //   .catch((error) => {
      //     this.errorLoading = true
      //   })
    },
    getLists() {
      // this.$axios
      //   .$get('/products')
      //   .then((res) => {
      //     //  alert(res)
      //     this.items = res
      //     this.loading = false
      //     this.errorLoading = false

      //     for(var i = 0; i < this.items.length; i++){
      //       this.getProductImage(i)
      //     }
      //   })
      //   .catch((error) => {
      //    // alert(error)
      //     this.loading = false
      //     this.errorLoading = true
      //   })

      setTimeout(() => {
        this.loading = false
        this.errorLoading = false

        this.items.push(
          {
            name: 'Can  water 50x',
            price: 100,
            description: 'Very taseful',
            images: [require('~/static/canproduct1.png')],
            minimum_per_order: 5,
            maximum_per_order: 1000000,
            cart_count: 150,
            order_count: 80,
            created_at: '',
            updated_at: '',
          },
          {
            name: 'Can  water 10x',
            price: 100,
            description: 'Very taseful',
            images: [require('~/static/canproduct2.png')],
            minimum_per_order: 5,
            maximum_per_order: 1000000,
            cart_count: 150,
            order_count: 80,
            created_at: '',
            updated_at: '',
          },
          {
            name: 'Can  water 50x',
            price: 100,
            description: 'Very taseful',
            images: [require('~/static/canproduct1.png')],
            minimum_per_order: 5,
            maximum_per_order: 1000000,
            cart_count: 150,
            order_count: 80,
            created_at: '',
            updated_at: '',
          },
          {
            name: 'Can  water 50x',
            price: 100,
            description: 'Very taseful',
            images: [require('~/static/canproduct1.png')],
            minimum_per_order: 5,
            maximum_per_order: 1000000,
            cart_count: 150,
            order_count: 80,
            created_at: '',
            updated_at: '',
          },
          {
            name: 'Can  water 10x',
            price: 100,
            description: 'Very taseful',
            images: [require('~/static/canproduct2.png')],
            minimum_per_order: 5,
            maximum_per_order: 1000000,
            cart_count: 150,
            order_count: 80,
            created_at: '',
            updated_at: '',
          }
        )
      }, 1000)
    },
    linkTo(id) {
      this.$emit('openUrl', { url: '/user/item/' + id, history: true })
    },
    formatImage(images) {
      //get only first image from dynamic aray string
      if (images == '') {
        //return place holder image
        return
      }
      try {
        var cimages = JSON.parse(images)
        return cimages[0]
      } catch (error) {
        //return place holder image
      }
    },

    getProductImage(index) {
      this.$axios
        .$get(this.baseURL + '/productimage?id=' + this.items[index].id)
        .then((res) => {
          this.items[index].images = this.baseURL + res[0].image_1
        })
    },

    calcOffset(total, current) {
      //calc dynmic offset for limit with array and total items
      var a = total - current
      var b = total - a
      return b
    },
  },
}
</script>

<style lang="scss" scoped>
#lists {
  width: 100%;
  height: 100%;
  overflow: auto;
}

#load-more-btn {
  display: block;
  width: 100%;
  padding: 5px;
}

@media screen and (min-width: 767px) {
  #item-container {
    width: 40%;
    height: auto;
    box-shadow: 0px 2px 5px var(--shadow-color),
      -0px -0px 0px var(--shadow-color);
    border-radius: 10px;
    margin: 10px auto 5px auto;
    cursor: pointer;
  }

  #item-img {
    width: 100%;
    height: auto;
    border-radius: 10px 10px 0px 0px;
  }

  #item-title {
    width: 100%;
    font-size: 21px;
    display: block;
    color: var(--text-color);
    padding: 10px 8px;
    text-align: center;
  }

  #item-price {
    width: 100%;
    font-size: 16px;
    display: block;
    color: var(--subtext-color);
    padding: 0px 8px;
    display: none;
  }
}

@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: portrait) {
  #item-container {
    width: 90%;
    max-width: 450px;
    height: auto;
    box-shadow: 0px 1px 3px var(--shadow-color),
      -0px -0px 0px var(--shadow-color);
    border-radius: 10px;
    margin: 10px auto 5px auto;
  }

  #item-img {
    width: 100%;
    height: auto;
    border-radius: 10px 10px 0px 0px;
  }

  #item-title {
    width: 100%;
    display: block;
    color: var(--text-color);
    padding: 10px 8px;
    text-align: center;
  }

  #item-price {
    width: 100%;
    display: block;
    color: var(--subtext-color);
    padding: 0px 8px;
    display: none;
  }
}

@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {
  #item-container {
    width: 42%;
    max-width: 450px;
    height: auto;
    box-shadow: 0px 1px 3px var(--shadow-color),
      -0px -0px 0px var(--shadow-color);
    border-radius: 10px;
    margin: 10px auto 5px auto;
  }

  #item-img {
    width: 100%;
    height: auto;
    border-radius: 10px 10px 0px 0px;
  }

  #item-title {
    width: 100%;
    display: block;
    color: var(--text-color);
    padding: 10px 8px;
    text-align: center;
  }

  #item-price {
    width: 100%;
    display: block;
    color: var(--subtext-color);
    padding: 0px 8px;
    display: none;
  }
}

//for iphone X and others needs to come last or it would confilct with laptop screen*/
@media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: portrait) {
  #item-container {
    width: 90%;
    max-width: 450px;
    height: auto;
    box-shadow: 0px 1px 3px var(--shadow-color),
      -0px -0px 0px var(--shadow-color);
    border-radius: 10px;
    margin: 10px auto 5px auto;
  }

  #item-img {
    width: 100%;
    height: auto;
    border-radius: 10px 10px 0px 0px;
  }

  #item-title {
    width: 100%;
    display: block;
    color: var(--text-color);
    padding: 10px 8px;
    text-align: center;
  }

  #item-price {
    width: 100%;
    display: block;
    color: var(--subtext-color);
    padding: 0px 8px;
    display: none;
  }
}

//for iphone X and others needs to come last or it would confilct with laptop screen*/
@media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
  #item-container {
    width: 40%;
    max-width: 450px;
    height: auto;
    box-shadow: 0px 1px 3px var(--shadow-color),
      -0px -0px 0px var(--shadow-color);
    border-radius: 10px;
    margin: 10px auto 5px auto;
  }

  #item-img {
    width: 100%;
    height: auto;
    border-radius: 10px 10px 0px 0px;
  }

  #item-title {
    width: 100%;
    display: block;
    color: var(--text-color);
    padding: 10px 8px;
    text-align: center;
  }

  #item-price {
    width: 100%;
    display: block;
    color: var(--subtext-color);
    padding: 0px 8px;
    display: none;
  }
}
</style>