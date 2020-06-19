<template>
  <div :class="containerClasses">
    <div :class="wrapperClasses(widget)" v-for="widget in widgets" :key="widget._id">
      <component :is="widget.render" :widget="widget" />
    </div>
  </div>
</template>

<script>
import { get } from "lodash-es"
export default {
  props: {
    widgets: { type: Array, required: true },
    settings: { type: Object, required: true }
  },
  computed: {
    containerClasses() {
      return [
        "grid",
        this.settings.cols || "grid-cols-2",
        this.settings.gap || "gap-2"
      ];
    }
  },
  methods: {
    wrapperClasses(widget) {
      return Object.values(get(widget, "settings.layout", {}))
    }
  }
};
</script>
<style lang="postcss">
.grid {
  display: grid;
  &.grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  &.grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  &.grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  &.grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  &.grid-cols-5 {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
  &.gap-0 {
    gap: 0;
  }
  &.gap-1 {
    gap: 0.25rem;
  }
  &.gap-2 {
    gap: 0.5rem;
  }
  &.gap-3 {
    gap: 0.75rem;
  }
  &.gap-4 {
    gap: 1rem;
  }
  &.gap-5 {
    gap: 1.25rem;
  }
  .col-span-1 {
    grid-column: span 1 / span 1;
  }
  .col-span-2 {
    grid-column: span 2 / span 2;
  }
  .col-span-3 {
    grid-column: span 3 / span 3;
  }
  .col-span-4 {
    grid-column: span 4 / span 4;
  }
  .col-span-5 {
    grid-column: span 5 / span 5;
  }
}
</style>