<template>
  <div class="flex-grid">
    <div v-for="widget in widgets" :key="widget._id" :style="settings">
      <div :style="widget.itemSettings">
        <component :is="widget.render" :widget="widget"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "flexGrid",
  props: {
    widgets: { type: Array, required: true },
    settings: { type: Object, required: true }
  },
  layoutSettings() {
    return [
    {
      _id: "flexDirection",
      input: "select",
      label: "Direction",
      description: "Position the widgets horizontally or vertically.",
      _default: "flex-col",
      list: [
        {
          value: "column",
          label: "Columns"
        },
        {
          value: "row",
          label: "Rows"
        }
      ],
    }
  ]
  },
  itemSettings() {
    return [
    {
      _id: "width",
      input: "text",
      label: "Width",
      description: "Choose the width either in %, px or as calc()",
    }
  ]
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