<template>
  <ul>
    <li v-for="item in items" :key="item._id">
      <a :href="item.path" :title="item.title" :target="item.target">{{ item.label }}</a>
      <span v-if="item.desc">{{ item.desc}}</span>
      <menu-items v-if="item.children.length" :items="item.children" />
    </li>
  </ul>
</template>
<script>
export default {
  name: "menuItems",
  props: {
    items: {
      type: Array,
      default: () => []
    }
  }
};
</script>