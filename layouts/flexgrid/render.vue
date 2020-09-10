<template>
  <div class="flex-grid">
    <div v-for="widget in widgets" :key="widget._id" :style="settings">
      <component :is="widget.render" :widget="widget" :style="widget.widget"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "flexGrid",
  props: {
    widgets: { type: Array, required: true },
    settings: { type: Object, required: true }
  }
};
</script>
<style scoped lang="postcss">
.flex-grid {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    > div {
        margin: 1rem;
        padding: 1rem;
    };
}

@media (max-width: 400px) {
  .flex-grid {
    display: block;
  }
}
</style>