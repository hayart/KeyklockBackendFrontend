<template>
  <div id="app">
    <b-overlay
               spinner-variant="primary"
               spinner-type="grow"
               rounded="sm"
               variant="transparent"
    >

      <main class="main-content">
        <b-container fluid>
          <router-view/>
        </b-container>
      </main>
    </b-overlay>
  </div>
</template>

<script>
import ApiService from '@/services/api.service';

export default {
  components: {
  },
  data: () => ({
    unsubscribe: null,
  }),
  computed: {
    overlay() {
      return this.getOverlay
    }
  },
  created() {
    if(ApiService.getUserPrinciple().authenticated) {
      console.log(ApiService.getUserPrinciple().authenticated)
    }
  },
};
</script>

<style lang="scss" scoped>
.main-content {
  padding-top: 106px;
  padding-bottom: 46px;
}
</style>
