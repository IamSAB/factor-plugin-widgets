<template>
  <div>
    <factor-spinner v-if="loading" color-mode="text"/>
    <component v-else :is="widgetLayoutConfig.render" :layout-settings="layoutSettings" />
  </div>
</template>

<script lang="ts">
import { widgetLayoutConfigs, widgetTypeConfigs } from "./widget";
import { requestPostIndex, stored, setting } from "@factor/api";
import { factorSpinner } from "@factor/ui";
import { PostStatus } from "@factor/post/types";
import { widgetTypeConfig, widgetLayoutConfig } from "./types";
import { get as getKeyPath, camelCase } from "lodash-es"

const widgetHeader = setting("widget.components.header");
console.log(widgetHeader)

export default {
  components: {
    factorSpinner,
    widgetHeader
  },
  props: {
    position: {
      type: String,
      required: true
    },
    layout: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: true
    };
  },
  async mounted() {
    if (!this.index) {
      await requestPostIndex({
        postType: "widget",
        status: PostStatus.Published,
        conditions: {
          routes: { $in: this.routes }
        }
      });
    }
    this.loading = false;

    if (
      !this.positions.find(
        (position: Record<string, any>) => position.name == this.position
      )
    ) {
      console.log(`Position ${this.position} does not exist.`);
    }
  },
  computed: {
    index(this: any) {
      return stored("widget");
    },
    post() {
      return stored("post")
    },
    routes(this: any) {
      const routes = [];
      if (this.post) {
        routes.push(...[this.post._id, this.post.postType]);
      }
      else {
        routes.push(this.route.$path)
      }
      routes.push("all");
      return routes;
    },
    widgets(this: any) {
      let isMappedWidget;
      let widgetTypeConfig;
      return this.index.posts.reduce(
        (widgets: Array<Record<string, any>>, widget: Record<string, any>) => {
          isMappedWidget = widget.mappings.filter(
            (mapping: Record<string, any>) => {
              return this.routes.includes(mapping.route) && this.position == mapping.position;
            }
          ).length;
          if (isMappedWidget) {
            widgetTypeConfig = this.widgetTypeConfigs.find(
              (config: widgetTypeConfig) => config.id == widget.widgetType
            );
            widget.render = widgetTypeConfig.render;
            widgets.push(widget);
          }
          return widgets;
        },
        []
      );
    },
    widgetLayoutConfig(this: any) {
      const layouts = widgetLayoutConfigs();
      return layouts.find(
        (layout: widgetLayoutConfig) => layout.id == this.layout
      );
    },
    widgetTypeConfigs() {
      return widgetTypeConfigs() || [];
    },
    positions(): Record<string, any> {
      return setting("widget.positions");
    },
    layoutSettings() {
      if (this.post) {
        return getKeyPath(this.post, "settings.widget", {})
      }
      else {
        const key = camelCase(this.$route.path)
        return setting(`widget.layout.settings.${key}`) || {}
      }
    }
  },
  methods: {
    getKeyPath
  }
};
</script>