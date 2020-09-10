<template>
  <div class="columns" :style="style">
    <div v-for="widget in widgets" :key="widget._id">
      <component :is="widget.render" :widget="widget" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    widgets: { type: Array, required: true },
    settings: { type: Object, required: true }
  },
  computed: {
    style() {
      return {
        columnWidth: "200px",
        ...this.settings
      }
    }
  }
};
</script>
<style scoped lang="postcss">
.columns {
  column-count: 5;
  column-gap: 1rem;
  > div {
    padding: 1rem;
  }
}
</style>