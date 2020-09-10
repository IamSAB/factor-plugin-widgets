import { sanitizeHtml } from "@factor/api"
import { renderMarkdown } from "@factor/api/markdown";
import { widgetTypeConfig } from "../../types"
import { startCase } from "lodash-es"

export const CardWidget: widgetTypeConfig = {
  id: "markdown",
  label: "Markdown",
  description: "Pure markdown widget",
  edit: (): Promise<any> => import("./widgets/markdown/edit.vue"),
  render: (): Promise<any> => import("./widgets/markdown/render.vue"),
  settings: [
    {
      _id: "image",
      input: "image-upload",
      label: "Teaser",
    },
    {
      _id: "heading",
      label: "Heading",
      input: "select",
      description: "Wether to show the widget heading or what heading tag to render.",
      list: [
        {
          name: "Hide",
          value: 0,
        },
        ...Array.from({ length: 5 }, (_, n) => ({ name: `Heading ${n}`, value: n })),
      ],
      _default: 0
    },
  ]
}

export const hx = {
  props: { x: { type: Number, default: 2 } },
  render: function (this: any, h) {
    return h(`h${this.$props.x}`, this.$slots.default);
  }
}

export const markdown = {
  props: { content: { type: String, default: "" } },
  render: function (this: any, h) {
    return h("div", sanitizeHtml(renderMarkdown(this.$props.content)))
  }
}

export const tags = {
  props: { tags: { type: Array, default: [] } },
  render: function (this: any, h) {
    return h("ul", { class: "tags" }, this.$props.tags.map((tag: string) => {
      return h("li", startCase(tag))
    }))
  }
}