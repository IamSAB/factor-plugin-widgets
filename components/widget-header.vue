<template>
  <header class="widget-header">
    <heading class :tag="tag">{{ widget.title }}</heading>
  </header>
</template>
<script lang="ts">
import heading from "./heading";
import {get} from "lodash-es"

export default {
  components: { heading },
  props: {
    widget: { type: Object, required: true }
  },
  computed: {
    tag() {
      return get(this.widget, "settings.widget.tag", 2);
    }
  }
};
</script>