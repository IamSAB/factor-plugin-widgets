export interface WidgetTypeConfig {
  name?: string,
  type: string,
  dashboard: () => Promise<any>
  component: () => Promise<any>
}

export interface LayoutConfig {
  name?: string,
  layout: string,
  component: () => Promise<any>
}

export interface PositionConfig {
  name?: string,
  position: string,
  layout: string
}

export interface WidgetMapping {
  type: string,
  path: string,
  route: string,
  routeLabel: string
}