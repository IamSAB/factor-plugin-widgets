export default {
  props: { tag: { type: Number, default: 2 } },
  render: function (this: any, h) {
    return h(`h${this.$props.tag}`, this.$slots.default);
  }
}