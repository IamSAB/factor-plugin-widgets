<template>
  <div>
    <dashboard-input
      v-model="value.label"
      input="factor-input-text"
      label="Label"
      placeholder="Home"
      required
    />
    <dashboard-input
      v-model="value._linkType"
      input="factor-input-select"
      label="Link type"
      description="Choose a link type for the menu item"
      placeholder="Select Something"
      :list="linkTypeOptions"
      required
    />
    <div v-if="value._linkType == LinkType.Url">
      <dashboard-input
        v-model="value.path"
        input="factor-input-text"
        label="Url"
        description="Enter the url to your webpage"
        placeholder="http://..."
        required
      />
    </div>
    <template v-else-if="value._linkType == LinkType.Post">
      <dashboard-input
        v-model="value._postType"
        input="factor-input-select"
        label="Post type"
        description="Select a post type"
        placeholder="Select Something"
        :list="postTypeOptions"
        required
      />
      <template v-if="value._postType">
        <div class="input-wrap vertical" v-if="loadingPosts">
          <factor-spinner width="2rem" />
        </div>
        <dashboard-input
          v-else
          v-model="value._postId"
          input="factor-input-select"
          label="Post"
          description="Permalink to a post"
          placeholder="Select post"
          :list="postOptions"
          required
        />
      </template>
    </template>
    <dashboard-input
      v-else-if="value._linkType == LinkType.ContentRoute"
      v-model="value.path"
      input="factor-input-select"
      label="Content route"
      description="A static registered route"
      placeholder="Select content route"
      :list="contentRouteOptions"
      required
    />
    <dashboard-input
      v-model="value.desc"
      input="factor-input-text"
      label="Description"
      placeholder="Landing page"
    />
    <dashboard-input
      v-model="value.title"
      input="factor-input-text"
      label="Anchor title"
      placeholder="Home"
    />
    <dashboard-input
      v-model="value.icon"
      input="factor-input-text"
      label="Icon"
      placeholder="fa fas-home"
    />
    <dashboard-input
      v-model="value.target"
      input="factor-input-select"
      label="Link target"
      placeholder="Select target"
      :list="targetOptions"
      required
    />
  </div>
</template>
<script lang="ts">
import {
  postTypesConfig,
  getKnownRoutePaths,
  stored,
  postLink
} from "@factor/api";
import { requestPostIndex } from "@factor/post/request";
import {
  dashboardInput,
  factorSpinner,
  factorInputSubmit,
  factorForm
} from "@factor/ui";
import { TargetType, LinkType } from "./types";
import { startCase } from "lodash-es";

export default {
  components: {
    factorSpinner,
    dashboardInput,
    factorInputSubmit,
    factorForm
  },
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      loadingPosts: false,
      LinkType,
      linkTypeOptions: [
        { label: "Url", value: LinkType.Url },
        { label: "Content route", value: LinkType.ContentRoute },
        { label: "Post", value: LinkType.Post }
      ],
      targetOptions: [
        { value: TargetType.Default, label: "Default" },
        { value: TargetType.Blank, label: "Blank" },
        { value: TargetType.Parent, label: "Parent" },
        { value: TargetType.Top, label: "top" }
      ]
    };
  },
  watch: {
    loadPosts: {
      handler: async function(v) {
        if (v) {
          this.loadingPosts = true;
          await requestPostIndex({
            postType: this.value._postType
          });
          this.loadingPosts = false;
        }
      },
      immediate: true
    },
    "value._postId": {
      handler(id) {
        const post = stored(id);
        this.value.path = postLink(post._id);
        this.value.label = this.value.label || post.title;
        this.value.title = this.value.title || post.title;
      }
    },
    "value.path": {
      handler(p) {
        if (this.value._linkType == LinkType.ContentRoute) {
          const label = startCase(this.value.title);
          this.value.label = this.value.label || label;
          this.value.title = this.value.title || label;
        }
      }
    },
    value: {
      handler(v) {
        this.$emit("input", v);
      },
      deep: true
    }
  },
  computed: {
    loadPosts() {
      return (
        this.value._linkType == LinkType.Post && this.value._postType.length > 0
      );
    },
    postTypeOptions() {
      return postTypesConfig().reduce(
        (publicPostTypes: Record<string, any>, c) => {
          if (c.addSitemap) {
            publicPostTypes.push({
              label: c.nameSingle,
              value: c.postType
            });
          }
          return publicPostTypes;
        },
        []
      );
    },
    contentRouteOptions() {
      return getKnownRoutePaths().map(route => ({
        label: route,
        value: route
      }));
    },
    postOptions() {
      const postIndex = stored(this.value._postType);
      if (postIndex) {
        return postIndex.posts.map((post: Record<string, any>) => ({
          label: post.title,
          value: post._id
        }));
      } else {
        return [];
      }
    }
  }
};
</script>