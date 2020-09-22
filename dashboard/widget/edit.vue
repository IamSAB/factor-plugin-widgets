<template>
  <dashboard-page :title="title">
    <template #actions>
      <dashboard-btn btn="primary" :loading="sending" @click="saveWidget()">Update</dashboard-btn>
    </template>
    <template #primary>
      <component v-if="config" :is="config.dashboard" :widget-id="widget.id" />
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
          v-model="widget.type"
          label="Type"
          :list="typeOptions"
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
      <mappings :widget-id="widget.id" />
      <slot name="meta" />
    </template>
    <template #secondary>
      <item-settings :widget-id="widget.id" />
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
import itemSettings from "./item.vue";
import mappings from "./mappings.vue";
import { WidgetTypeConfig } from 'widgets/types';
import { getWidgetTypes } from 'widgets';

export default {
  components: {
    dashboardInput,
    dashboardPage,
    dashboardPanel,
    dashboardBtn,
    factorLink,
    factorInputTags,
    factorInputEditor,
    itemSettings,
    mappings
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
    type: {
      get() {
        return (
          this.widget.type || this.$route.query.type
        );
      },
      set(this: any, v: string) {
        this.widget.type = v;
      }
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
      const mode = !("createdAt" in this.widget) ? "Add New" : "Edit";
      return `${mode} Widget`;
    },
    config(this: any): WidgetTypeConfig | undefined {
      return getWidgetTypes().find(_ => _.type == this.type);
    },
    typeOptions(this: any) {
      return getWidgetTypes().map(_ => ({
        value: _.type,
        name: _.name
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
          postType: "widget"
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