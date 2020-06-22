import { addPostType, pushToFilter, addFilter, postTypesConfig } from "@factor/api";
import { addWidgetType, addWidgetLayout } from "./widget";
import {
  factorInputEmail,
  factorInputDate,
  factorInputText,
  factorInputTags,
  factorInputPhone,
  factorInputCheckbox,
  factorInputBirthday,
  factorInputImageUpload,
  factorInputSelect,
  factorInputSubmit,
  factorInputPassword,
  factorInputTextarea,
  factorInputEditor,
  factorInputSortable
} from "@factor/ui"

addPostType({
  managePosts: true,
  schemaDefinition: {
    widgetType: { type: String, default: "default", index: true },
    routes: { type: [String], index: true },
    position: { type: String, default: "", index: true },
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
      definition.positionSettings = {}
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

const viewports = [
  {
    label: "Default",
    prefix: "",
  },
  {
    label: "Small",
    prefix: "sm:",
  },
  {
    label: "Medium",
    prefix: "md:",
  },
  {
    label: "Large",
    prefix: "lg:",
  },
  {
    label: "xLarge",
    prefix: "xl:",
  }
]

addWidgetLayout({
  id: "grid",
  label: "Grid",
  description: "Grid layout with fixed column or rows",
  layoutSettings: [
    {
      _id: "cols",
      input: "classes",
      label: "Columns",
      description: "Grid with n equally sized columns. Make it responsive with four viewports.",
      list: viewports.map(v => {
        return {
          label: v.label,
          options: Array.from({ length: 5 }, (_, n) => ({
            label: `${n+1} columns`,
            name: `${v.prefix}grid-cols-${n+1}`,
            value: `${v.prefix}grid-cols-${n+1}`
          }))
        } 
      }),
      _default: ["grid-cols-1", "sm:grid-cols-2", "md:grid-cols-3", "lg:grid-cols-4", "xl:grid-cols-5"]
    },
    {
      _id: "gap",
      input: "select",
      label: "Gap",
      description: "Control gutters between grid rows and columns.",
      list: Array.from({ length: 5 }, (_, n) => `gap-${n}`),
      _default: "gap-3"
    }
  ],
  widgetSettings: [
    {
      _id: "colSpan",
      input: "select",
      label: "Spanning columns",
      description: "Make the widget span n columns.",
      list: Array.from({ length: 5 }, (_, n) => `col-span-${n}`),
      _default: "col-span-1"
    }
  ],
  render: (): Promise<any> => import("./layouts/grid.vue")
})

addWidgetType({
  id: "default",
  label: "Default",
  description: "Simple content widget",
  settings: [
    {
      _id: "header",
      label: "Header",
      input: "select",
      description: "Wether to show the widget header or what heading tag to render.",
      list: [
        {
          name:"Hide",
          value: 0,
        },
        ...Array.from({length: 5}, (_, n) => ({name: `Heading ${n}`, value: n})),
      ],
      _default: 0
    },
    {
      _id: "classes",
      label: "Classes",
      input: "classes",
      description: "Add classes to your widget"
    },
  ],
  edit: (): Promise<any> => import("./widgets/default/edit.vue"),
  render: (): Promise<any> => import("./widgets/default/render.vue"),
})

addWidgetType({
  id: "menu",
  label: "Menu",
  description: "Create a menu with links to posts, post types, content routes and external sites.",
  edit: (): Promise<any> => import("./widgets/menu/edit.vue"),
  render: (): Promise<any> => import("./widgets/menu/render.vue"),
})

addFilter({
  key: "factorInputs",
  hook: "form-inputs",
  callback: (inputs) => {
    return {
      ...inputs,
      factorInputWrap: (): Promise<any> => import("./form/input-wrap.vue"),
      factorInputClasses: (): Promise<any> => import("./form/input-classes.vue"),
      factorInputEmail,
      factorInputDate,
      factorInputText,
      factorInputTags,
      factorInputPhone,
      factorInputCheckbox,
      factorInputBirthday,
      factorInputImageUpload,
      factorInputSelect,
      factorInputSubmit,
      factorInputPassword,
      factorInputTextarea,
      factorInputEditor,
      factorInputSortable
    }
  }
})