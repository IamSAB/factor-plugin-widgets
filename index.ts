import { addPostType, pushToFilter, addFilter, postTypesConfig } from "@factor/api";
import { addWidgetType, addWidgetLayout } from "./widget";


addPostType({
  managePosts: true,
  schemaDefinition: {
    widgetType: { type: String, default: "content" },
    routes: { type: [String], index: true },
    position: { type: String, default: "" },
    mappings: { type: [Object] }
  },
  postType: "widget",
  editTemplate: (): Promise<any> => import("./edit-widget.vue"),
})

const publicPostTypeConfigs = postTypesConfig().filter(c => c.addSitemap);

publicPostTypeConfigs.forEach(c => {
  addFilter({
    key: "addApiKey",
    hook: `schema-definition-${c.postType}`,
    callback: (definition) => {
      definition.widgetPositionSettings = {}
      return definition
    },
  })
})

pushToFilter({
  key: "widgetsLayoutSettings",
  hook: "post-edit-components",
  item: {
    postType: publicPostTypeConfigs.map(c => c.postType),
    name: "Widget Positions",
    component: (): Promise<any> => import("./components/position-settings.vue"),
  },
})

addWidgetLayout({
  id: "grid",
  label: "Grid",
  description: "Grid layout with fixed column or rows",
  layoutSettings: [
    {
      _id: "cols",
      input: "select",
      label: "Columns",
      description: "Grid with n equally sized columns.",
      list: Array.from({length: 5}, (_, n) => `grid-cols-${n}`),
      _default: "grid-cols-2"
    },
    {
      _id: "gap",
      input: "select",
      label: "Gap",
      description: "Control gutters between grid rows and columns.",
      list: Array.from({length: 5}, (_, n) => `gap-${n}`),
      _default: "gap-3"
    }
  ],
  widgetSettings: [
    {
      _id: "colSpan",
      input: "select",
      label: "Spanning columns",
      description: "Make the widget span n columns.",
      list: Array.from({length: 5}, (_, n) => `col-span-${n}`)
    }
  ],
  render: (): Promise<any> => import("./layouts/grid.vue")
})

addWidgetType({
  id: "content",
  label: "Content",
  description: "Simple content widget",
  settings: [
    {
      _id: "test",
      input: "text",
      label: "Input 1"
    },
    {
      _id: "email",
      input: "email",
      label: "Input 2"
    }
  ],
  edit: (): Promise<any> => import("./widgets/content/edit.vue"),
  render: (): Promise<any> => import("./widgets/content/render.vue"),
})