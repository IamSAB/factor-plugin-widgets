export const HtmlWidget = {
  id: "html",
  label: "HTML",
  description: "Pure html widget",
  edit: (): Promise<any> => import("./edit.vue"),
  render: (): Promise<any> => import("./render.vue")
}