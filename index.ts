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
import { FlexGridLayout } from "./layouts/flexgrid";
import { HtmlWidget } from "./widgets/html"
import { MenuWidget } from "./widgets/menu"

addPostType({
  managePosts: true,
  schemaDefinition: {
    type: { type: String, default: "default", index: true },
    position: { type: String, default: "", index: true },
    widget: {},
    layout: {},
    routes: { type: [String], index: true },
    mappings: { type: [Object] }
  },
  postType: "widget",
  editTemplate: (): Promise<any> => import("./edit-widget.vue")
})

const publicPostTypeConfigs = postTypesConfig().filter(c => c.addSitemap);

publicPostTypeConfigs.forEach(c => {
  addFilter({
    key: "alterPublicPostSchemaForWidgetPositionSettings",
    hook: `schema-definition-${c.postType}`,
    callback: (definition) => {
      definition.position = {}
      return definition
    },
  })
})

pushToFilter({
  key: "addWidgetLayoutSettings",
  hook: "post-edit-components",
  item: {
    postType: publicPostTypeConfigs.map(c => c.postType),
    name: "Widget Positions",
    component: (): Promise<any> => import("./components/position-settings.vue"),
  },
})

// add widget layouts
addWidgetLayout(FlexGridLayout)

// add widget types
addWidgetType(HtmlWidget)
addWidgetType(MenuWidget)

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