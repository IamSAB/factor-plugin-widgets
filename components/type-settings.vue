<template>
  <dashboard-panel
    title="Widget Type Settings"
    note="Adjust settings specific to the chosen widget type."
  >
    <div v-if="fields.length == 0">No settings available the selected widget type.</div>
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
import { dashboardPanel } from "@factor/ui";
import { getDefaultTemplateSettings as getDefaultWidgetSettings } from "@factor/templates";
import { stored, storeItem } from "@factor/api";
import { getWidgetTypeConfig } from "../widget";
import { get } from "lodash-es";
import dashboardInput from "../form/input-dashboard.vue"

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
    widgetTypeConfig() {
      return getWidgetTypeConfig(this.widget.widgetType);
    },
    fields() {
      return this.widgetTypeConfig.settings || [];
    }
  },
  watch: {
    settings: {
      handler(this: any, v) {
        this.widget.settings = {
          ...this.widget.settings,
          widgetType: this.settings
        };
      },
      deep: true
    },
    "widget.widgetType": {
      handler() {
        if (!this.loadedSettings) {
          this.settings = getDefaultWidgetSettings(
            this.fields,
            get(this.widget, "settings.widgetType", {})
          );
          this.loadedSettings = true;
        } else {
          this.settings = getDefaultWidgetSettings(this.fields, {});
        }
      },
      immediate: true
    }
  }
};
</script>