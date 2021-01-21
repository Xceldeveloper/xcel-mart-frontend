<template>
  <div class="nuxt-error">
    <component :is="errorPage" :error="error" />
  </div>
</template>
<script>
import error404 from '~/components/error/404.vue';
import error500 from '~/components/error/500.vue';
export default {
  name: 'nuxt-error',
  layout: 'default', // optional
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
    data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
    head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  },
  computed: {
    errorPage() {
      if (this.error.statusCode === 404) {
        return error404;
      }
      // catch everything else
      return error500;
    },
}
}
</script>
