import { widgetLayoutConfig } from "../../types"

export const FlexGridLayout: widgetLayoutConfig = {
  id: "flexgrid",
  label: "Flex Grid",
  description: "",
  layoutSettings: [
    {
      _id: "flexDirection",
      input: "select",
      label: "Direction",
      description: "Position the widgets horizontally or vertically.",
      _default: "flex-col",
      list: [
        {
          value: "column",
          label: "Columns"
        },
        {
          value: "row",
          label: "Rows"
        }
      ],
    }
  ],
  widgetSettings: [
    {
      _id: "width",
      input: "text",
      label: "Width",
      description: "Choose the width either in %, px or as calc()",
    }
  ],
  render: (): Promise<any> => import("./render.vue")
}