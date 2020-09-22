<template>
  <dashboard-panel
    title="Widget Mappings"
    note="Map widget to all routes or a combination of routes for static sites, post types or single posts."
  >
    <div class="mappings">
      <ul v-if="mappings.length">
        <li v-for="(mapping, i) in mappings" :key="i" class="mapping">
          <div class="type">{{ getOptionName(mappingTypeOptions, mapping.type) }}</div>
          <div class="info">
            <div class="label">{{ mapping.routeLabel }}</div>
            <div class="path">{{ mapping.path }}</div>
            <dashboard-btn @click="remove(mapping)" size="small">
              Del
              <factor-icon icon="fas fa-times" />
            </dashboard-btn>
          </div>
        </li>
      </ul>
      <div v-else class="placeholder">You've made no mappings yet.</div>
    </div>
    <dashboard-btn
      v-if="!adding & !isMappedToAllRoutes"
      @click.native="adding = true"
      btn="primary"
    >
      New
      <factor-icon icon="fas fa-plus" />
    </dashboard-btn>
    <div v-else-if="isMappedToAllRoutes">Remove the "All route" mapping to add other mappings.</div>
    <div v-if="adding" class="adding">
      <factor-input-select
        v-model="mappingType"
        placeholder="Select mapping type"
        :list="mappingTypeOptions"
      />
      <div v-if="mappingType == 'contentRoute'">
        <factor-input-select
          v-if="contentRouteOptions.some(o => !o.disabled)"
          v-model="contentRoute"
          placeholder="Select content route"
          :list="contentRouteOptions"
        />
        <span v-else class="placeholder">No content routes assignable.</span>
      </div>
      <div v-if="mappingType == 'postType' || mappingType == 'singlePost'">
        <factor-input-select
          v-if="postTypeOptions.some(o => !o.disabled)"
          v-model="postType"
          placeholder="Select post type"
          :list="postTypeOptions"
        />
        <span v-else class="placeholder">No post types assignable.</span>
      </div>
      <div v-if="mappingType == 'singlePost' && postType">
        <factor-spinner v-if="loadingPosts" width="1.75rem" />
        <div v-else>
          <factor-input-select
            v-if="singlePostOptions.some(o => !o.disabled)"
            v-model="singlePost"
            placeholder="Select post"
            :list="singlePostOptions"
          />
          <span v-else class="placeholder">No single posts assignable.</span>
        </div>
      </div>
      <dashboard-btn
        v-if="mappingType == 'all' || validContentRoute || validPostType || validSinglePost"
        @click="add()"
        size="small"
        btn="primary"
      >
        Add
        <factor-icon icon="fas fa-plus" />
      </dashboard-btn>
    </div>
  </dashboard-panel>
</template>
<script lang="ts">
import {
  postTypesConfig,
  getPostTypeConfig,
  getKnownRoutePaths,
  stored,
  storeItem,
  postLink
} from "@factor/api";
import {
  dashboardInput,
  dashboardPanel,
  factorIcon,
  dashboardBtn,
  factorSpinner,
  factorInputSelect
} from "@factor/ui";
import { requestPostIndex } from "@factor/post/request";
import { capitalize, trim } from "lodash-es";

export default {
  components: {
    dashboardInput,
    dashboardPanel,
    factorIcon,
    dashboardBtn,
    factorSpinner,
    factorInputSelect
  },
  props: {
    widgetId: { type: String, required: true }
  },
  data() {
    return {
      adding: false,
      loadingPosts: false,
      contentRoute: "",
      postType: "",
      singlePost: "",
      mappingType: "all",
      mappingTypeOptions: [
        {
          name: "All routes",
          value: "all"
        },
        {
          name: "Content route",
          value: "contentRoute"
        },
        {
          name: "Post type",
          value: "postType"
        },
        {
          name: "Single post",
          value: "singlePost"
        }
      ]
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
    isMappedToAllRoutes() {
      return this.isMappedRoute("all");
    },
    validContentRoute(this: any) {
      return this.mappingType == "contentRoute" && this.contentRoute;
    },
    validPostType(this: any) {
      return this.mappingType == "postType" && this.postType;
    },
    validSinglePost(this: any) {
      return (
        this.mappingType == "singlePost" && this.postType && this.singlePost
      );
    },
    loadPosts() {
      return this.mappingType == "singlePost" && this.postType;
    },
    postTypeOptions() {
      return postTypesConfig().reduce(
        (publicPostTypes: Record<string, any>, c) => {
          if (c.addSitemap) {
            publicPostTypes.push({
              name: c.nameSingle,
              value: c.postType,
              disabled:
                this.mappingType == "postType" && this.isMappedRoute(c.postType)
            });
          }
          return publicPostTypes;
        },
        []
      );
    },
    contentRouteOptions() {
      return getKnownRoutePaths().map(route => {
        return {
          name: trim(capitalize(route.replace("/", ""))),
          value: route,
          disabled: this.isMappedRoute(route)
        };
      });
    },
    singlePostOptions() {
      const postIndex = stored(this.postType);
      if (postIndex) {
        return postIndex.posts.map((post: Record<string, any>) => ({
          value: post._id,
          name: post.title,
          disabled: this.isMappedRoute(post._id)
        }));
      } else {
        return [];
      }
    },
    mappings() {
      return this.widget.mappings.sort((a, b) => {
        return a.path.localeCompare(b.path);
      });
    }
  },
  watch: {
    async loadPosts(v) {
      if (v) {
        this.loadingPosts = true;
        await requestPostIndex({
          postType: this.postType
        });
        this.loadingPosts = false;
      }
    }
  },
  methods: {
    isMappedRoute(route: string): boolean {
      return this.widget.routes.some((r: string) => r == route);
    },
    add() {
      const routeMap: Record<string, any> = {
        all: "all",
        contentRoute: this.contentRoute,
        postType: this.postType,
        singlePost: this.singlePost
      };

      const routeLabelMap: Record<string, any> = {
        all: "Show always",
        contentRoute: this.getOptionName(
          this.contentRouteOptions,
          this.contentRoute
        ),
        postType: this.getOptionName(this.postTypeOptions, this.postType),
        singlePost: this.getOptionName(this.singlePostOptions, this.singlePost)
      };
      const fakePost = new Proxy(
        {},
        {
          get: function(obj, prop: string) {
            return `:${prop}`;
          }
        }
      );
      const pathMap: Record<string, any> = {
        all: "*",
        contentRoute: this.contentRoute,
        postType: getPostTypeConfig(this.postType).permalink(fakePost),
        singlePost: postLink(this.singlePost)
      };

      const mapping: Record<string, any> = {
        type: this.mappingType,
        path: pathMap[this.mappingType],
        route: routeMap[this.mappingType],
        routeLabel: routeLabelMap[this.mappingType]
      };

      if (this.mappingType == "all") {
        this.widget.routes = [];
        this.widget.mappings = [];
      }

      this.widget.routes.push(mapping.route);
      this.widget.mappings.push(mapping);

      const cleanUpMap: Record<string, CallableFunction> = {
        all: () => {},
        contentRoute: () => {
          const o = this.contentRouteOptions.find(o => !o.disabled);
          this.contentRoute = o ? o.value : "";
        },
        postType: () => {
          const o = this.postTypeOptions.find(o => !o.disabled);
          this.postType = o ? o.value : "";
        },
        singlePost: () => {
          const o = (this.singlePost = this.singlePostOptions.find(
            o => !o.disabled
          ));
          return o ? o.value : "";
        }
      };
      cleanUpMap[this.mappingType]();

      this.adding = false;
    },
    remove(mapping: Record<string, any>): void {
      const widget = this.widget;
      let index = widget.mappings.findIndex(m => m.route == mapping.route);
      widget.mappings.splice(index, 1);
      index = widget.routes.indexOf(mapping.route);
      widget.routes.splice(index, 1);
    },
    getOptionName(options: Record<string, any>, value: string): string {
      const option = options.find((o: Record<string, any>) => o.value == value);
      return option ? option.name || "" : "";
    }
  }
};
</script>
<style lang="postcss">
.mappings {
  margin-bottom: 1rem;
  ul {
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
  }
  .mapping {
    box-shadow: 0 0 0 1px var(--color-border);
    background: var(--color-bg-contrast);
    border-radius: 5px;
    margin: 0 0.5rem 0.5rem 0;
    padding: 0.25rem 0.5rem 0.25rem 0.5rem;
    .type {
      text-transform: uppercase;
      color: var(--color-text-secondary);
      font-size: 0.7rem;
      font-weight: 700;
    }
    .info {
      display: flex;
      align-items: center;
      > * {
        margin-right: 0.5rem;
      }
      .label {
      }
      .path {
        flex: none;
        color: var(--color-tertiary);
      }
      button {
        flex: none;
      }
    }
  }
}
.adding {
  font-size: 0.8rem;
  display: flex;
  flex-wrap: wrap;
  > * {
    margin-right: .5rem;
      margin-bottom: .5rem !important;
  }
}
</style>