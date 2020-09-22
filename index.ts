import { setting } from "@factor/api"
import { addPostType, pushToFilter, applyFilters, addFilter, postTypesConfig } from "@factor/api";
import { WidgetTypeConfig, LayoutConfig, PositionConfig } from "./types"

// manage widget types
export const addWidgetType = (config: WidgetTypeConfig): void => {
  pushToFilter({
    key: config.type,
    hook: "widget-types",
    item: config
  })
}
export const getWidgetTypes = (): WidgetTypeConfig[] => {
  return applyFilters("widget-types", [])
}
export const getWidgetType = (type: string) => {
  return getWidgetTypes().find(_ => _.type == type)
}

// manage position layouts
export const addLayout = (config: LayoutConfig): void => {
  pushToFilter({
    key: config.layout,
    hook: "position-layouts",
    item: config,
  })
}
export const getLayouts = (): LayoutConfig[] => {
  return applyFilters("position-layouts", [])
}
export const getLayout = (layout: string) => {
  return getLayouts().find(_ => _.layout == layout)
}
export const getPositions = (): PositionConfig[] => {
  return setting("widget.positions", [])
}
export const getLayoutForPosition = (position: string) => {
  const config = getPositions().find(_ => _.position == position)
  return config ? getLayouts().find(_ => _.layout == config.layout) : undefined
}
// add widget post type
addPostType({
  managePosts: true,
  schemaDefinition: {
    type: { type: String, default: "html", index: true },
    position: { type: String },
    itemSettings: { type: Object},
    routes: { type: [String], index: true },
    mappings: { type: [Object] }
  },
  postType: "widget",
  editTemplate: (): Promise<any> => import("./dashboard/widget/edit.vue")
})

// alter public posts and their dashboard
const publicPostTypeConfigs = postTypesConfig().filter(c => c.addSitemap);
publicPostTypeConfigs.forEach(c => {
  addFilter({
    key: "alterPublicPostSchemaForWidgetPositionSettings",
    hook: `schema-definition-${c.postType}`,
    callback: (schema) => {
      schema.positionsLayoutSettings = {}
      return schema
    },
  })
})
pushToFilter({
  key: "addWidgetLayoutSettings",
  hook: "post-edit-components",
  item: {
    postType: publicPostTypeConfigs.map(c => c.postType),
    name: "Widget Positions: Layout Settings",
    component: (): Promise<any> => import("./dashboard/post/positions.vue"),
  },
})

// add widget layouts
addLayout({
  name: "Flex Grid",
  layout: "flexgrid",
  component: (): Promise<any> => import("./layouts/flexgrid.vue"),
})

// add widget types
addWidgetType({
  name: "HTML",
  type: "html",
  dashboard: (): Promise<any> => import("./widgets/html/dashboard.vue"),
  component: (): Promise<any> => import("./widgets/html/component.vue"),
})
addWidgetType({
  name: "Menu",
  type: "menu",
  dashboard: (): Promise<any> => import("./widgets/menu/dashboard.vue"),
  component: (): Promise<any> => import("./widgets/menu/component.vue"),
})

// add dashboard inputs
addFilter({
  key: "factorInputs",
  hook: "form-inputs",
  callback: (inputs) => {
    return {
      ...inputs,
      factorInputClasses: (): Promise<any> => import("./form/input-classes.vue"),
    }
  }
})