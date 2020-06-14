<template>
  <dashboard-panel
    title="Widget Default Settings"
    note="Adjust settings which apply to all widget types."
  >
    <div v-if="fields.length == 0">No settings available.</div>
    <template v-else>
      <dashboard-input
        v-for="(field, i) in fields"
        :key="i"
        v-model="settings[field._id]"
        :list="field.list"
        :input="`factor-input-${field.input}`"
        :label="field.label"
        :description="field.description"
        :class="['engine-input', field.input]"
        :settings="field.settings || []"
      />
    </template>
  </dashboard-panel>
</template>
<script lang="ts">
import { dashboardInput, dashboardPanel } from "@factor/ui";
import { getDefaultTemplateSettings as getDefaultSettings } from "@factor/templates";
import { stored, storeItem, setting } from "@factor/api";
import { set, get } from "lodash-es";
import { TemplateSettings } from "@factor/templates/types";

export default {
  components: { dashboardInput, dashboardPanel },
  props: {
    widgetId: { type: String, required: true }
  },
  data() {
    return {
      settings: {}
    };
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
    fields(): TemplateSettings[] {
      return setting("widget.settings");
    }
  },
  mounted() {
    this.settings = getDefaultSettings(
      this.fields,
      get(this.widget, "settings.default", {})
    );
  },
  watch: {
    settings: {
      handler: function(this: any, v) {
        const widget = this.widget;
        set(widget, "settings.default", v);
        this.widget = widget;
      },
      deep: true
    }
  }
};
</script>