
export interface NotificationsState {
  list: Notification[]
}

export enum NotificationType {
  SUCCESS,
  INFO,
  WARNING,
  ERROR
}

export class NotificationError extends Error {};

export interface Notification {
  id?: string
  title: string
  subtitle?: string
  link?: string | null
  dismissible: boolean
  timeout?: number
  visible: boolean
  type: NotificationType
}
