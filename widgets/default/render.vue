<template>
  <div>
    <header class="widget-header">
      <heading class :tag="tag">{{ widget.title }}</heading>
    </header>
    <div v-formatted-text="content" />
  </div>
</template>

<script>
import { renderMarkdown } from "@factor/api";
import heading from "./heading"

export default {
  components: {
    heading
  },
  props: {
    widget: {
      type: Object,
      required: true
    }
  },
  computed: {
    content() {
      return renderMarkdown(this.widget.content);
    },
    tag() {
      return get(this.widget, "settings.default.header", 2);
    }
  }
};
</script>