import { pushToFilter, applyFilters, setting } from "@factor/api"
import { widgetTypeConfig, widgetLayoutConfig } from "./types"

export const addWidgetType = (widgetType: widgetTypeConfig): void => {
  pushToFilter({
    key: widgetType.id,
    hook: "add-widget-type",
    item: widgetType
  })
}

export const widgetTypeConfigs = (): widgetTypeConfig[] => {
  return applyFilters("add-widget-type", [])
}

export const getWidgetTypeConfig = (type: string) => {
  return widgetTypeConfigs().find(config => config.id == type)
}

export const addWidgetLayout = (widgetLayoutConfig: widgetLayoutConfig): void => {
  pushToFilter({
    key: widgetLayoutConfig.id,
    hook: "add-widget-layout",
    item: widgetLayoutConfig,
  })
}

export const widgetLayoutConfigs = (): widgetLayoutConfig[] => {
  return applyFilters("add-widget-layout", [])
}

export const getWidgetLayoutConfig = (type: string) => {
  return widgetLayoutConfigs().find(config => config.id == type)
}

export const getWidgetLayoutConfigOfPosition = (position: string) => {
  const positionConfig = setting("widget.positions").find((p: Record<string, any>) => p.value == position)
  return positionConfig ? getWidgetLayoutConfig(positionConfig.layout) : {}
}