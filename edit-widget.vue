<template>
  <dashboard-page :title="title">
    <template #actions>
      <dashboard-btn btn="primary" :loading="sending" @click="saveWidget()">Update</dashboard-btn>
    </template>
    <template #primary>
      <dashboard-panel class="compose">
        <dashboard-input
          v-model="widget.title"
          input="factor-input-text"
          label="Title"
          class="widget-title"
        />
        <component v-if="widgetTypeConfig" :is="widgetTypeConfig.edit" :widget-id="widget.id" />
        <div v-else class="placeholder">Please select a widget type</div>
      </dashboard-panel>
    </template>
    <template #meta>
      <dashboard-panel class="widget-media">
        <dashboard-input
          v-model="widget.status"
          label="Status"
          :list="['published', 'draft', 'trash']"
          input="factor-input-select"
        />
        <dashboard-input
          v-model="widget.widgetType"
          label="Widget Type"
          :list="widgetTypeOptions"
          placeholder="Select widget type"
          input="factor-input-select"
        />
        <dashboard-input
          v-model="widget.position"
          label="Widget Position"
          :list="positionOptions"
          placeholder="Select widget position"
          input="factor-input-select"
        />
        <dashboard-input
          v-model="widget.source"
          input="factor-input-text"
          label="Source"
          description="Used when sharing DB in multiple apps"
        />
      </dashboard-panel>
      <widget-mappings :widget-id="widget.id" />
      <default-settings :widget-id="widget.id" />
      <slot name="meta" />
    </template>
    <template #secondary>
      <widget-settings :widget-id="widget.id" />
      <layout-settings :widget-id="widget.id" />
      <slot name="edit" />
    </template>
  </dashboard-page>
</template>
<script lang="ts">
import {
  dashboardBtn,
  factorLink,
  factorInputTags,
  factorInputEditor,
  dashboardPage,
  dashboardPanel,
  dashboardInput
} from "@factor/ui";
import { emitEvent, stored, storeItem, setting } from "@factor/api";
import { requestPostSave } from "@factor/post/request";
import defaultSettings from "./components/default-settings.vue";
import widgetSettings from "./components/widget-settings.vue";
import layoutSettings from "./components/layout-settings.vue";
import widgetMappings from "./components/widget-mappings.vue";
import { widgetTypeConfigs } from "./widget";

export default {
  components: {
    dashboardInput,
    dashboardPage,
    dashboardPanel,
    dashboardBtn,
    factorLink,
    factorInputTags,
    factorInputEditor,
    defaultSettings,
    widgetSettings,
    layoutSettings,
    widgetMappings
  },
  data() {
    return {
      sending: false,
      sendingDraft: false,
      saveNeeded: false,
      willsave: null,
      settings: [],
      reactivePost: {}
    };
  },
  metaInfo(): Record<string, any> {
    return {
      title: this.title
    };
  },
  computed: {
    widgetType: {
      get() {
        return (
          this.widget.widgetType || this.$route.query.widgetType || "content"
        );
      },
      set(this: any, v: string) {
        this.widget.type = v;
      }
    },
    isNew() {
      return !("createdAt" in this.widget);
    },
    widget: {
      get(this: any) {
        return stored(this._id) || {};
      },
      set(this: any, v): void {
        storeItem(this._id, v);
      }
    },
    _id(this: any): string {
      return this.$route.query._id || "";
    },
    title(this: any) {
      const mode = this.isNew ? "Add New" : "Edit";
      const name = this.widgetTypeConfig.label;
      return `${mode} ${name} Widget`;
    },
    widgetTypeConfigs() {
      return widgetTypeConfigs();
    },
    widgetTypeConfig(this: any) {
      return this.widgetTypeConfigs.find(c => c.id == this.widgetType);
    },
    widgetTypeOptions() {
      return this.widgetTypeConfigs.map(c => ({
        value: c.id,
        name: c.label
      }));
    },
    positionOptions() {
      return setting("widget.positions");
    }
  },
  methods: {
    async saveWidget(this: any) {
      this.sending = true;
      emitEvent("save-post");
      let saved;
      try {
        saved = await requestPostSave({
          post: this.widget,
          postType: this.postType
        });
      } catch {
        this.sending = false;
      }
      if (saved) {
        this.widget = saved;
        emitEvent("notify", `Saved!`);
      }
      this.sending = false;
    }
  }
};
</script>
<style lang="postcss">
.settings-wrapper {
  .desc {
    margin-bottom: ;
  }
  .settings {
  }
  .no-settings {
    height: 1.75rem;
    line-height: 1.75rem;
    color: var(--color-text-secondary);
  }
}
</style>