<template>
  <div id="lists">
    <v-row
      class="fill-height ma-0"
      align="center"
      justify="center"
      v-if="!loading && !errorLoading && items.length > 0"
    >
      <span id="comp-title" v-if="isMobile">
        <span>Store Lists</span>
      </span>
      <div
        id="item-container"
        v-for="(item, index) in items"
        :key="index"
        @click="linkTo(item.id)"
      >
        <div id="item-img">
          <v-img
            :src="formatImage(item.images)"
            :aspect-ratio="1 / 1"
            contain
            class="grey lighten-2"
            :style="{ borderRadius: '5px 5px 0px 0px' }"
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
        <span id="item-price">&#8358;{{ formatToCurrency(item.price) }}</span>
        <span id="item-orders-count" v-if="item.order_count > 1"
          >{{ formatToCurrency(item.order_count) }} orders</span
        >
        <span id="item-orders-count" v-if="item.order_count == 1"
          >{{ formatToCurrency(item.order_count) }} order</span
        >
        <span id="item-orders-count" v-if="item.cart_count > 1"
          >In {{ formatToCurrency(item.cart_count) }} Carts</span
        >
        <span id="item-orders-count" v-if="item.cart_count == 1"
          >In {{ formatToCurrency(item.cart_count) }} Cart</span
        >
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
          <br />please check your network connection
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

    <div id="create-btn">
      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-btn
            @click="createNewItem"
            v-on="on"
            :width="isMobile ? 50 : 70"
            :height="isMobile ? 50 : 70"
            :color="Colors.accent"
            fab
            dark
          >
            <v-icon :size="isMobile ? 25 : 38">mdi-plus</v-icon>
          </v-btn>
        </template>
        Add New Item to Store Listing...
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import device_mixin from '~/mixins/device_mixin.js'
import utils_mixin from '~/mixins/utils_mixin.js'
import app_mixin from '~/mixins/app_mixin.js'
export default {
  mixins: [device_mixin, utils_mixin, app_mixin],
  data() {
    return {
      loading: false,
      errorLoading: false,
      items: [],
      totalItems: 0,
      loadingMore: false,
      lastQueriedIndex: null
    }
  },
  mounted() {
    this.getTotalItem()
  },
  methods: {
    getTotalItem() {
      this.$axios
        .$get('/getcount?target=products')
        .then((res) => {
          this.totalItems = res
          this.getLists()
        })
        .catch((error) => {
          this.errorLoading = true
        })
    },
    loadMore() {
      if (this.loadingMore) {
        return
      }

      this.loadingMore = true

      this.$axios
        .$get(
          '/products?offset=' +
            this.calcOffset(this.totalItems, this.items.length)
        )
        .then((res) => {
          for (let i = 0; i < res.length; i++) {
            this.items.push(res[i])
          }

          this.loadingMore = false
        })
        .catch((error) => {
          this.snackBarMedia = true
          this.snackMessage = error
          this.loadingMore = false
        })
    },
    getLists() {
      this.$axios
        .$get('/products')
        .then((res) => {
          //  alert(res)
          this.items = res
          this.loading = false
          this.errorLoading = false
        })
        .catch((error) => {
          // alert(error)
          this.loading = false
          this.errorLoading = true
        })
    },
    linkTo(id) {
      this.$emit('openUrl', { url: '/admin/item/' + id, history: true })
    },
    createNewItem() {
      this.$emit('openUrl', {
        url: '/admin/item/create',
        history: true
      })
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
    calcOffset(total, current) {
      //calc dynmic offset for limit with array and total items
      var a = total - current
      var b = total - a
      return b
    }
  }
}
</script>

<style lang="scss" scoped>
#load-more-btn {
  display: block;
  width: 100%;
  padding: 5px;
}

#lists {
  width: 100%;
  height: 100%;
  overflow: auto;
}

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

#create-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

@media screen and (min-width: 767px) {
  #item-container {
    width: 40%;
    height: auto;
    box-shadow: 0px 2px 5px var(--shadow-color),
      -0px -0px 0px var(--shadow-color);
    border-radius: 5px;
    margin: 10px auto 5px auto;
    cursor: pointer;
  }

  #item-img {
    width: 100%;
    height: auto;
    border-radius: 5px 5px 0px 0px;
  }

  #item-title {
    width: 100%;
    display: block;
    color: var(--text-color);
    padding: 5px 8px;
    font-size: 18px;
  }

  #item-price {
    width: 100%;
    display: block;
    color: var(--subtext-color);
    padding: 5px 8px;
  }

  #item-orders-count {
    width: 100%;
    display: block;
    color: grey;
    padding: 5px 8px;
    font-weight: bold;
  }
}

@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: portrait) {
  #item-container {
    width: 90%;
    max-width: 450px;
    height: auto;
    box-shadow: 0px 1px 3px var(--shadow-color),
      -0px -0px 0px var(--shadow-color);
    border-radius: 5px;
    margin: 10px auto 5px auto;
  }

  #item-img {
    width: 100%;
    height: auto;
    border-radius: 5px 5px 0px 0px;
  }

  #item-title {
    width: 100%;
    display: block;
    color: var(--text-color);
    padding: 5px 8px;
    font-size: 18px;
  }

  #item-price {
    width: 100%;
    display: block;
    color: var(--subtext-color);
    padding: 5px 8px;
  }

  #item-orders-count {
    width: 100%;
    display: block;
    color: grey;
    padding: 5px 8px;
    font-weight: bold;
  }
}

@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {
  #item-container {
    width: 42%;
    max-width: 450px;
    height: auto;
    box-shadow: 0px 1px 3px var(--shadow-color),
      -0px -0px 0px var(--shadow-color);
    border-radius: 5px;
    margin: 10px auto 5px auto;
  }

  #item-img {
    width: 100%;
    height: auto;
    border-radius: 5px 5px 0px 0px;
  }

  #item-title {
    width: 100%;
    display: block;
    color: var(--text-color);
    padding: 5px 8px;
    font-size: 18px;
  }

  #item-price {
    width: 100%;
    display: block;
    color: var(--subtext-color);
    padding: 5px 8px;
  }

  #item-orders-count {
    width: 100%;
    display: block;
    color: grey;
    padding: 5px 8px;
    font-weight: bold;
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
    border-radius: 5px;
    margin: 10px auto 5px auto;
  }

  #item-img {
    width: 100%;
    height: auto;
    border-radius: 5px 5px 0px 0px;
  }

  #item-title {
    width: 100%;
    display: block;
    color: var(--text-color);
    padding: 5px 8px;
    font-size: 18px;
  }

  #item-price {
    width: 100%;
    display: block;
    color: var(--subtext-color);
    padding: 5px 8px;
  }

  #item-orders-count {
    width: 100%;
    display: block;
    color: grey;
    padding: 5px 8px;
    font-weight: bold;
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
    border-radius: 5px;
    margin: 10px auto 5px auto;
  }

  #item-img {
    width: 100%;
    height: auto;
    border-radius: 5px 5px 0px 0px;
  }

  #item-title {
    width: 100%;
    display: block;
    color: var(--text-color);
    padding: 5px 8px;
    font-size: 18px;
  }

  #item-price {
    width: 100%;
    display: block;
    color: var(--subtext-color);
    padding: 5px 8px;
  }

  #item-orders-count {
    width: 100%;
    display: block;
    color: grey;
    padding: 5px 8px;
    font-weight: bold;
  }
}
</style>