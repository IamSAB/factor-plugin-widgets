<template>
  <div>
    <slot />
    <div v-formatted-text="content" />
  </div>
</template>

<script>
import { renderMarkdown } from "@factor/api";

export default {
  components: {
    heading: {
      props: {
        h: { type: Number, default: 2 }
      },
      render: function(h) {
        return h(`h${this.h}`, this.$slots.default);
      }
    }
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
    }
  }
};
</script>