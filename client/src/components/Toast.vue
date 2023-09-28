<template>
  <b-toast
    id="my-toast"
    :auto-hide-delay="3000"
    toaster="b-toaster-top-center"
    body-class="my-toast-body"
    header-class="my-toast-header"
    toast-class="my-toast-wrapper"
  >
    <template v-slot:toast-title>
      {{ toastTitle }}
    </template>
    {{ toastMessage }}
  </b-toast>
</template>

<script>
export default {
  data() {
    return {
      toastMessage: '',
      toastTitle: ''
    }
  },
  methods: {
    showToast(title, message) {
      this.toastTitle = title
      this.toastMessage = message
      this.$bvToast.show('my-toast')
    }
  }
}
</script>
