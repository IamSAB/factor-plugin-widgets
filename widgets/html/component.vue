<template>
  <div v-html="widget.content" />
</template>

<script>
export default {
  props: {
    widget: {
      type: Object,
      required: true
    }
  }
};
</script>