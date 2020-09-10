<template>
  <div v-if="source">
    <img :class="`h-full w-full object-${object}`" v-if="url" :src="url" />
    <div
      v-else
      class="flex flex-col justify-center items-center h-full border-solid border border-gray-400"
    >
      <svg class="h-12 stroke-current text-gray-400" viewBox="-4 -3 40 30" fill="none">
        <rect x="0" y="0" width="32" height="24" />
        <polyline points="4,20 12,12 18,18" />
        <polyline points="16,16 24,8 28,12" />
        <circle cx="8" cy="8" r="4" />
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { stored } from "@factor/api";
export default {
  props: {
    source: {
      type: String,
      default: ""
    },
    object: {
      type: String,
      default: () => "cover"
    }
  },
  computed: {
    url() {
      const image = stored(this.source);
      return image ? image.url : "";
    }
  }
};
</script>