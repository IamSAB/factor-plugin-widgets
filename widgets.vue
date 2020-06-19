<template>
  <div :id="this.position">
    <factor-spinner v-if="loading" color-mode="text"/>
    <component v-else :is="widgetLayoutConfig.render" :settings="positionSettings" :widgets="widgets" />
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

export default {
  components: {
    factorSpinner,
    widgetHeader
  },
  props: {
    position: {
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
        routes.push(this.$route.path)
      }
      routes.push("all");
      return routes;
    },
    widgets(this: any) {
      let widgetTypeConfig;
      return this.index.posts.reduce(
        (widgets: Array<Record<string, any>>, widget: Record<string, any>) => {
          if (widget.position == this.position) {
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
      console.log(layouts)
      return layouts.find(
        (layout: widgetLayoutConfig) => layout.id == this.positionConfig.layout
      );
    },
    widgetTypeConfigs() {
      return widgetTypeConfigs() || [];
    },
    positionConfig(): Record<string, any> {
      const positions = setting("widget.positions");
      return positions.find(p => p.value == this.position)
    },
    positionSettings() {
      if (this.post) {
        return getKeyPath(this.post, `positionSettings.${this.position}`, {})
      }
      else {
        const key = camelCase(this.$route.path)
        return setting(`widget.positionSettings.${key}.${this.position}`) || {}
      }
    }
  },
  methods: {
    getKeyPath
  }
};
</script>