<template>
  <div class="position-settings">
    <nav>
      <dashboard-btn
        v-for="p in positions"
        :key="p.value"
        @click="position = p.value"
        :text="p.name"
        :btn="position == p.value ? 'primary' : 'default'"
        size="small"
      />
    </nav>
    <layout-settings v-for="p in positions" :post-id="postId" :position="p" :key="p.position" v-show="p.position == position"/>
  </div>
</template>
<script lang="ts">
import { dashboardBtn } from "@factor/ui";
import { setting } from "@factor/api";
import layoutSettings from "./layout.vue"

export default {
  props: {
    postId: {
      type: String,
      required: true
    }
  },
  components: {
    dashboardBtn,
    layoutSettings
  },
  data () {
    return {
      position: ""
    }
  },
  computed: {
    positions() {
      return setting("widget.positions");
    },
  }
};
</script>
<style>
.position-settings nav {
  margin: 1rem 0 1rem 0;
}
</style>