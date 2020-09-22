<template>
    <nav class="widget-menu">
      <menu-items :items="widget.list" />
    </nav>
</template>

<script>
import menuItems from "./menu-items.vue"
export default {
  name: "menu",
  components: {
    menuItems
  },
  props: {
    widget: {
      type: Object,
      required: true
    }
  },
};
</script>