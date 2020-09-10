<template>
  <div class="widget-card">
    <header>
      <load-image :source="widget.images"/>
    </header>
    <div>
      <hx class="title" :x="widget.widget.x">
        {{ widget.title }}
      </hx>
      <div v-if="widget.synopsis" class="synopsis">{{ widget.synopsis }}</div>
      <tags v-if="widget.tags" :tags="widget.tags" class="badges" />
      <markdown :content="widget.content" />
    </div>
  </div>
</template>

<script>
import { hx, markdown, tags } from "."

export default {
  components: {
    hx,
    markdown,
    tags
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