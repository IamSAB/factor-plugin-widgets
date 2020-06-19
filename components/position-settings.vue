<template>
  <div class="position-settings">
    <nav>
      <dashboard-btn
        v-for="p in positions"
        :key="p.value"
        @click="position = p.value"
        :text="p.name"
        :btn="position == p.value ? 'primary' : 'default'"
        size="small"
      />
    </nav>
    <div v-if="fields.length == 0" class="no-options">No settings available for selected position.</div>
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
</template>
<script lang="ts">
import { dashboardBtn } from "@factor/ui";
import dashboardInput from "../form/input-dashboard.vue"
import { setting, stored, storeItem } from "@factor/api";
import { getWidgetLayoutConfigOfPosition } from "../widget";
import { getDefaultTemplateSettings as getDefaultLayoutSettings } from "@factor/templates";
import { set, get, cloneDeep } from "lodash-es";
export default {
  props: {
    postId: {
      type: String,
      required: true
    }
  },
  components: {
    dashboardInput,
    dashboardBtn
  },
  data() {
    return {
      settings: {},
      position: ""
    };
  },
  mounted() {
    let widgetLayoutConfig;
    const settings = this.post.positionSettings || {};
    this.positions.forEach(p => {
      widgetLayoutConfig = getWidgetLayoutConfigOfPosition(p.value);
      settings[p.value] = cloneDeep(getDefaultLayoutSettings(
          widgetLayoutConfig.layoutSettings,
          get(settings, p.value, {})
        ))
    });
    
    this.post = { ...this.post, positionSettings: settings};
    this.position = this.defaultPosition;
  },
  computed: {
    post: {
      get(this: any) {
        return stored(this.postId) || {};
      },
      set(this: any, v): void {
        storeItem(this.postId, v);
      }
    },
    defaultPosition() {
      return this.positions[0].value;
    },
    positions() {
      return setting("widget.positions");
    },
    widgetLayoutConfig() {
      return getWidgetLayoutConfigOfPosition(
        this.position || this.defaultPosition
      );
    },
    fields(this: any) {
      return this.widgetLayoutConfig.layoutSettings || [];
    }
  },
  watch: {
    settings: {
      handler: function(this: any, v) {
        this.post = {
          ...this.post,
          positionSettings: {
            ...this.post.positionSettings,
            [this.position]: v
          }
        }
      },
      deep: true
    },
    position: {
      handler: function(this: any, v) {
        this.settings = { ...this.post.positionSettings[v]}
      }
    }
  }
};
</script>
<style>
.position-settings nav {
  margin: 1rem 0 1rem 0;
}
</style>