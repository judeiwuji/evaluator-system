export enum MessageBoxType {
  Info,
  Success,
  Warning,
  Error,
  Html,
}

export enum MessageBoxButton {
  Ok,
  Confirm,
  Cancel,
  Close,
}

export class MessageBoxSetting {
  constructor(
    public title: string,
    public message: string,
    public type: MessageBoxType
  ) {}
}
