<template>
  <dashboard-panel name="Markdown">
    <dashboard-input
      v-model="widget.content"
      input="factor-input-editor"
      label="Content"
      class="widget-content"
    />
  </dashboard-panel>
</template>
<script lang="ts">
import { stored, storeItem } from "@factor/api";
import { dashboardInput } from "@factor/ui";

export default {
  components: { dashboardInput },
  props: {
    widgetId: {
      type: String,
      required: true
    }
  },
  computed: {
    widget: {
      get(this: any) {
        return stored(this.widgetId) || {};
      },
      set(this: any, v): void {
        storeItem(this.widgetId, v);
      }
    },
  }
};
</script>