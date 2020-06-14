export interface widgetTypeConfig {
  id: string,
  label?: string,
  description?: string,
  settings?: Record<string, any>,
  edit: () => Promise<any>,
  render: () => Promise<any>
}

export interface widgetLayoutConfig {
  id: string,
  label?: string,
  description?: string,
  widgetSettings?: Record<string, any>
  layoutSettings?: Record<string, any>
  render: () => Promise<any>
}