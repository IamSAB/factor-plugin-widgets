<template>
  <dashboard-panel name="HTML">
    <codemirror v-model="widget.content" :options="options" />
  </dashboard-panel>
</template>
<script lang="ts">
import { stored, storeItem } from "@factor/api";
import { dashboardPanel } from "@factor/ui";
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";

export default {
  components: {
    codemirror,
    dashboardPanel
  },
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
    }
  },
  data() {
    return {
      options: {
        tabSize: 2,
        mode: 'htmlmixed',
        theme: 'default',
        lineNumbers: true,
        line: true,
        pollInterval: 2000
      }
    };
  }
};
</script>