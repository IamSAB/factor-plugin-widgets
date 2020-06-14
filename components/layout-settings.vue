<template>
  <dashboard-panel
    title="Widget Layout Settings"
    note="Adjust settings for the layout of the selected  widget position."
  >
    <div class="settings">
      <div v-if="widget.position">
        <div v-if="fields.length == 0" class="no-options">No settings available.</div>
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
      </div>
      <div v-else class="no-settings">Please select a widget position.</div>
    </div>
  </dashboard-panel>
</template>
<script lang="ts">
import { dashboardInput, dashboardPanel } from "@factor/ui";
import { getDefaultTemplateSettings as getDefaultLayoutSettings } from "@factor/templates";
import { stored, storeItem } from "@factor/api";
import { getWidgetLayoutConfigOfPosition } from "../widget";
import { get } from "lodash-es";

export default {
  components: { dashboardInput, dashboardPanel },
  props: {
    widgetId: { type: String, required: true }
  },
  data() {
    return {
      settings: {},
      loadedSettings: false
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
    widgetLayoutConfig() {
      return getWidgetLayoutConfigOfPosition(this.widget.position);
    },
    fields() {
      return this.widgetLayoutConfig.widgetSettings || [];
    }
  },
  watch: {
    settings: {
      handler: function(this: any, v) {
        this.widget.settings = {
          ...this.widget.settings,
          layout: this.settings
        };
      },
      deep: true
    },
    "widget.widgetType": {
      handler() {
        if (!this.loadedSettings) {
          this.settings = getDefaultLayoutSettings(
            this.fields,
            get(this.widget, "settings.layout", {})
          );
          this.loadedSettings = true;
        } else {
          this.settings = getDefaultLayoutSettings(this.fields, {});
        }
      },
      immediate: true
    }
  }
};
</script>