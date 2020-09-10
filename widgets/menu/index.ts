import { widgetTypeConfig } from "../../types";

export const MenuWidget: widgetTypeConfig = {
  id: "menu",
  label: "Menu",
  description: "Choose links and render them as menu.",
  edit: (): Promise<any> => import("./edit.vue"),
  render: (): Promise<any> => import("./render.vue")
}