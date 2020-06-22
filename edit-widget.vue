<template>
  <dashboard-page :title="title">
    <template #actions>
      <dashboard-btn btn="primary" :loading="sending" @click="saveWidget()">Update</dashboard-btn>
    </template>
    <template #primary>
      <component v-if="widgetTypeConfig" :is="widgetTypeConfig.edit" :widget-id="widget.id" />
      <dashboard-panel v-else class="compose">
        <div class="placeholder">Please select a widget type</div>
      </dashboard-panel>
    </template>
    <template #meta>
      <dashboard-panel class="widget-media">
        <dashboard-input
          v-model="widget.title"
          input="factor-input-text"
          label="Title"
          class="widget-title"
          description="By default only used as display name in the dashboard. Can be used as rendered title depending on the widget type."
        />
        <dashboard-input
          v-model="widget.status"
          label="Status"
          :list="['published', 'draft', 'trash']"
          input="factor-input-select"
        />
        <dashboard-input
          v-model="widget.widgetType"
          label="Type"
          :list="widgetTypeOptions"
          placeholder="Select widget type"
          input="factor-input-select"
          description="A widget type defines what content is how rendered."
        />
        <dashboard-input
          v-model="widget.position"
          label="Position"
          :list="positionOptions"
          placeholder="Select widget position"
          input="factor-input-select"
          description="Choose where on the page to show the widget."
        />
        <dashboard-input
          v-model="widget.source"
          input="factor-input-text"
          label="Source"
          description="Used when sharing DB in multiple apps"
        />
      </dashboard-panel>
      <widget-mappings :widget-id="widget.id" />
      <slot name="meta" />
    </template>
    <template #secondary>
      <type-settings :widget-id="widget.id" />
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
import typeSettings from "./components/type-settings.vue";
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
    typeSettings,
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
          this.widget.widgetType || this.$route.query.widgetType || "default"
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