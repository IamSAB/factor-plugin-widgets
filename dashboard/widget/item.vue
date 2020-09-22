<template>
  <dashboard-panel
    title="Item Settings"
    note="Adjust settings for the wrapper of the selected widget position layout."
  >
    <div class="settings">
      <div v-if="widget.position">
        <div v-if="fields.length == 0" class="no-options">No settings available for selected position.</div>
        <template v-else>
          <dashboard-input
            v-for="(field, i) in fields"
            :key="i"
            v-model="settings[field._id]"
            v-bind="field"
            :class="['engine-input', field.input]"
            :values="settings"
          />
        </template>
      </div>
      <div v-else class="no-settings">Please select a widget position.</div>
    </div>
  </dashboard-panel>
</template>
<script lang="ts">
import { dashboardPanel, dashboardInput } from "@factor/ui";
import { getDefaultTemplateSettings } from "@factor/templates";
import { stored, storeItem } from "@factor/api";
import { getLayoutForPosition } from "../../";

export default {
  components: { dashboardInput, dashboardPanel },
  props: {
    widgetId: { type: String, required: true }
  },
  data() {
    return {
      settings: {},
      position: "",
      fields: []
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
    }
  },
  watch: {
    settings: {
      handler: function (this: any, v: Record<string, any>) {
        this.widget = { ...this.widget, wrapperSettings: v }
      },
      deep: true,
    },
    position: {
      handler: async function (this: any, v: string) {
        const config = getLayoutForPosition(v)
        if (config) {
          const {
            default: {
              itemSettings
            }
          } = await config.component()
          this.fields = itemSettings().map(_ => {
            _.input = `factor-input-${_.input}`
            return _
          })
          this.settings = getDefaultTemplateSettings(this.fields, this.settings)
        }
        else {
          this.fields = []
        }
      },
    },
    "widget.position": {
      handler: function (this: any, v: string) {
        if (v && v != this.position) {
          this.position = v
        }
      },
      immediate: true,
    }
  }
};
</script>