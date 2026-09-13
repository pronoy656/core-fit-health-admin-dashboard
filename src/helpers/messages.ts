import { createElement, Fragment, type ReactNode } from "react";

import type { MessageDictionary, MessageValue } from "@/types/messages";

const isMessageDictionary = (value: MessageValue): value is MessageDictionary => {
  return typeof value === "object" && value !== null;
};

export const getMessage = (messages: MessageDictionary, key: string): string => {
  const segments = key.split(".");
  let current: MessageValue = messages;

  for (const segment of segments) {
    if (!isMessageDictionary(current) || !(segment in current)) {
      return key;
    }

    current = current[segment];
  }

  return typeof current === "string" ? current : key;
};

export const renderRichText = (
  message: string,
  map: Record<string, (chunks: string) => ReactNode>
): ReactNode => {
  const pattern = /<([a-zA-Z][\w-]*)>(.*?)<\/\1>/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null = null;

  while ((match = pattern.exec(message)) !== null) {
    if (match.index > lastIndex) {
      parts.push(message.slice(lastIndex, match.index));
    }

    const [fullMatch, tagName, content] = match;
    const renderer = map[tagName];

    if (renderer) {
      parts.push(createElement(Fragment, { key: `${tagName}-${match.index}` }, renderer(content)));
    } else {
      parts.push(content);
    }

    lastIndex = match.index + fullMatch.length;
  }

  if (lastIndex < message.length) {
    parts.push(message.slice(lastIndex));
  }

  return parts.length === 1 ? parts[0] : parts;
};
