export const ColumnLayout = {
  id: "column",
  label: "Columns",
  description: "",
  layoutSettings: [
    {
      _id: "columnWidth",
      input: "text",
      label: "Column Width",
      description: "",
      _default: "200px"
    }
  ],
  render: (): Promise<any> => import("./layouts/column/render.vue")
}