import { Notification, NotificationType, NotificationError } from './types';
import configuration from 'infrastructure/util/configuration';

export class NotificationAlert implements Notification {

  public id?: string;
  public timeout: number;
  public visible: boolean;
  public link?: string;
  public subtitle?: string;
  public dismissible: boolean;

  constructor(public title: string, public type: NotificationType) {
    this.timeout = configuration.DEFAULT_NOTIFICATION_TIMING;
    this.visible = false;
    this.dismissible = false;
  }

}

export class NotificationBuilder {

  static ofType(type: NotificationType): NotificationBuilder {
    const builder = new NotificationBuilder(type);
    return builder;
  }

  private title: string | null;
  private subtitle?: string;
  private link?: string;
  private _dismissible: boolean | null;
  private _timeout: number | null;

  constructor(private type: NotificationType) {
    this.title = null;
    this._dismissible = null;
    this._timeout = null;
  }

  withData(title: string, subtitle?: string, link?: string) {
    this.title = title;
    this.subtitle = subtitle;
    this.link = link;
    return this;
  }

  dismissible(): NotificationBuilder {
    this._dismissible = true;
    return this;
  }

  timeable(timeout?: number): NotificationBuilder {
    this._dismissible = false;
    if (timeout != null) {
      this._timeout = timeout;
    }
    return this;
  }

  build(): NotificationAlert {
    if (this.title == null) throw new NotificationError('you must provide a notification title');
    
    const notification = new NotificationAlert(this.title, this.type);
    
    if (this.subtitle != null) notification.subtitle = this.subtitle;
    if (this.link != null) notification.link = this.link;
    if (this._dismissible != null) notification.dismissible = this._dismissible;
    if (this._timeout != null) notification.timeout = this._timeout;

    return notification;
  }

}

export default class NotificationFactory {

  static ofType(type: NotificationType, title: string, subtitle?: string, link?: string): NotificationBuilder {
    return NotificationBuilder.ofType(type).withData(title, subtitle, link);
  }

  static success(title: string, subtitle?: string, link?: string): NotificationBuilder {
    return NotificationFactory.ofType(NotificationType.SUCCESS, title, subtitle, link);
  }

  static warning(title: string, subtitle?: string, link?: string): NotificationBuilder {
    return NotificationFactory.ofType(NotificationType.WARNING, title, subtitle, link);
  }

  static info(title: string, subtitle?: string, link?: string): NotificationBuilder {
    return NotificationFactory.ofType(NotificationType.INFO, title, subtitle, link);
  }

  static error(title: string, subtitle?: string, link?: string): NotificationBuilder {
    return NotificationFactory.ofType(NotificationType.ERROR, title, subtitle, link);
  }

}