<template>
  <div>
    <div v-if="fields.length == 0" class="no-options">No settings available for selected position.</div>
    <template v-else>
      <div class="layout">Layout: {{ layout.name || layout.layout }}</div>
      <dashboard-input
        v-for="(field, i) in fields"
        :key="i"
        v-model="settings[field._id]"
        v-bind="field"
        :class="['engine-input', field.input]"
        :post-id="postId"
        :values="settings"
      />
    </template>
  </div>
</template>
<script lang="ts">
import { dashboardPanel, dashboardInput } from "@factor/ui";
import { getDefaultTemplateSettings } from "@factor/templates";
import { stored, storeItem } from "@factor/api";
import { getLayout } from "../../"

export default {
  components: { dashboardInput, dashboardPanel },
  props: {
    postId: { type: String, required: true },
    position: { type: Object, required: true}
  },
  data() {
    return {
      settings: {},
      layout: {},
      fields: []
    };
  },
  computed: {
    post: {
      get(this: any) {
        return stored(this.postId) || {};
      },
      set(this: any, v): void {
        storeItem(this.postId, v);
      }
    }
  },
  async mounted () {
    this.layout = getLayout(this.position.layout)
    if (this.layout) {
      const {
        default: {
          layoutSettings
        }
      } = await this.layout.component()
      this.fields = layoutSettings().map(_ => {
        _.input = `factor-input-${_.input}`
        return _
      })
      this.settings = getDefaultTemplateSettings(this.fields, this.settings)
    }
    else {
      this.fields = []
    }
  },
  watch: {
    settings: {
      handler: function (this: any, v: Record<string, any>) {
        this.post = {
            ...this.post,
            positionsLayoutSettings: {
                ...this.post.positionsLayoutSettings,
                [this.position.position]: v
            }
        }
      },
      deep: true,
    }
  }
};
</script>