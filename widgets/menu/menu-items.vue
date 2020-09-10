<template>
  <ul>
    <li v-for="item in items" :key="item._id">
      <factor-link :path="item.path" :title="title" :target="item.target">
        <factor-icon v-if="item.icon" :icon="item.icon" />
        {{ item.label }}
      </factor-link>
      <span v-if="item.desc">{{ item.desc}}</span>
      <menu-items v-if="item.children.length" :items="item.children" :depth="depth+1"/>
    </li>
  </ul>
</template>
<script>
import { factorIcon, factorLink } from "@factor/ui"
export default {
  name: "menuItems",
  components: { factorIcon, factorLink },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    depth: {
      type: Number,
      default: 0
    }
  }
};
</script>