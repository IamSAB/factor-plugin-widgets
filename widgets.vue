<template>
  <div :id="position">
    <factor-spinner v-if="loading" color-mode="text"/>
    <component v-else :is="layoutConfig.component" :settings="positionSettings" :widgets="widgets" />
  </div>
</template>

<script lang="ts">
import { requestPostIndex, stored, setting } from "@factor/api";
import { factorSpinner } from "@factor/ui";
import { PostStatus } from "@factor/post/types";
import { getLayoutForPosition, getWidgetTypes } from ".";
import { WidgetTypeConfig } from "./types";
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
      const _all = getWidgetTypes()
      let _res;
      return this.index.posts.reduce(
        (widgets: Array<Record<string, any>>, widget: Record<string, any>) => {
          if (widget.position == this.position) {
            _res = _all.find(
              (config: WidgetTypeConfig) => {
                return config.type == widget.type
              }
            );
            if (_res) {
              widget.component = _res.component;
              widgets.push(widget);
            }
          }
          return widgets;
        },
        []
      );
    },
    layoutConfig(this: any) {
      return getLayoutForPosition(this.position)
    },
    positionSettings() {
      if (this.post) {
        return getKeyPath(this.post, `positionsLayoutSettings.${this.position}`, {})
      }
      else {
        const key = camelCase(this.$route.path)
        return setting(`widget.layoutSettings.${key}.${this.position}`) || {}
      }
    }
  },
  methods: {
    getKeyPath
  }
};
</script>