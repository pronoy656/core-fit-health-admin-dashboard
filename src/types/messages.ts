export type MessageValue = string | MessageDictionary;

export interface MessageDictionary {
  [key: string]: MessageValue;
}
