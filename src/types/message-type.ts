/**
 * 消息类型，与 [Mirai-api-http 消息类型一览](https://github.com/project-mirai/mirai-api-http/blob/master/MessageType.md) 保持一致
 * @packageDocumentation
 */

import * as Contact from "./contact";

interface BaseSingleMessage {
  type: string;
}

export interface Source extends BaseSingleMessage {
  type: "Source";
  /**
   * 	消息的识别号，用于引用回复（Source 类型永远为 chain 的第一个元素）
   */
  id: number;
  /**
   * 时间戳
   */
  time: number;
}

export interface Quote extends BaseSingleMessage {
  type: "Quote";
  /**
   * 	被引用回复的原消息的messageId
   */
  id: number;
  /**
   * 被引用回复的原消息所接收的群号，当为好友消息时为0
   */
  groupId?: number;
  /**
   * 被引用回复的原消息的发送者的QQ号
   */
  senderId?: number;
  /**
   * 被引用回复的原消息的接收者者的QQ号（或群号）
   */
  targetId?: number;
  /**
   * 被引用回复的原消息的消息链对象
   */
  origin?: MessageChain;
}

/**
 * 艾特某人
 */
export interface At extends BaseSingleMessage {
  type: "At";
  /**
   * 群员QQ号
   */
  target: number;
  /**
   * 	At时显示的文字，发送消息时无效，自动使用群名片
   */
  display: string;
}

/**
 * 艾特全体成员
 */
export interface AtAll extends BaseSingleMessage {
  type: "AtAll";
}

/**
 * 原生表情
 */
export interface Face extends BaseSingleMessage {
  type: "Face";
  /**
   * QQ表情编号，可选，优先高于name
   */
  faceId: number;
  /**
   * QQ表情拼音，可选
   */
  name: string;
}

/**
 * 文本
 */
export interface Plain extends BaseSingleMessage {
  type: "Plain";
  /**
   * 	文字消息
   */
  text: string;
}

/**
 * 图片
 */
export interface Image extends BaseSingleMessage {
  type: "Image";
  /**
   * 图片的imageId，群图片与好友图片格式不同。不为空时将忽略url属性
   */
  imageId: string;
  /**
   * 图片的URL，发送时可作网络图片的链接；接收时为腾讯图片服务器的链接，可用于图片下载
   */
  url: string;
  /**
   * 图片的路径，发送本地图片，相对路径于plugins/MiraiAPIHTTP/images
   */
  path: string;
}

/**
 * 闪照
 */
export interface FlashImage extends BaseSingleMessage {
  type: "FlashImage";
  /**
   * 图片的imageId，群图片与好友图片格式不同。不为空时将忽略url属性
   */
  imageId: string;
  /**
   * 图片的URL，发送时可作网络图片的链接；接收时为腾讯图片服务器的链接，可用于图片下载
   */
  url: string;
  /**
   * 图片的路径，发送本地图片，相对路径于plugins/MiraiAPIHTTP/images
   */
  path: string;
}

/**
 * 富文本消息（譬如合并转发）
 */
export interface Xml extends BaseSingleMessage {
  type: "Xml";
  /**
   * XML文本
   */
  xml: string;
}

export interface Json extends BaseSingleMessage {
  type: "Json";
  /**
   * Json文本
   */
  json: string;
}

/**
 * 小程序
 */
export interface App extends BaseSingleMessage {
  type: "App";
  /**
   * 内容
   */
  content: string;
}

/**
 * "Poke": 戳一戳
 * "ShowLove": 比心
 * "Like": 点赞
 * "Heartbroken": 心碎
 * "SixSixSix": 666
 * "FangDaZhao": 放大招
 */
export enum Pokes {
  Poke,
  ShowLove,
  Like,
  Heartbroken,
  SixSixSix,
  FangDaZhao,
}

export interface Poke extends BaseSingleMessage {
  type: "Poke";
  /**
   * 	戳一戳的类型
   */
  name: Pokes;
}

/**
 * FriendMessage | GroupMessage | TempMessage 下的 MessageChain 中的单条消息类型
 * 单条消息 此处命名与 mamoe/mirai-core 保持一致
 */
export type SingleMessage =
  | Source
  | Quote
  | At
  | AtAll
  | Face
  | Plain
  | Image
  | FlashImage
  | Xml
  | Json
  | App;
/**
 * 消息链
 */
export type MessageChain = Array<SingleMessage>;

interface BaseChatMessage extends BaseSingleMessage {
  type: "GroupMessage" | "TempMessage" | "FriendMessage";
  messageChain: MessageChain & {
    0: Source;
  };
  sender: Contact.User;
  reply: (msgChain: string | MessageChain, quote?: boolean) => Promise<void>;
  plain: string;
}
export interface FriendMessage extends BaseChatMessage {
  type: "FriendMessage";
  sender: Contact.Friend;
}
export interface GroupMessage extends BaseChatMessage {
  type: "GroupMessage";
  sender: Contact.Member;
}
export interface TempMessage extends BaseChatMessage {
  type: "TempMessage";
  sender: Contact.Member;
}

/**
 * 包括 FriendMessage GroupMessage TempMessage
 */
export type ChatMessage = GroupMessage | TempMessage | FriendMessage;

export type ChatMessageType = ChatMessage["type"];

export type ChatMessageMap = {
  message: ChatMessage;
  GroupMessage: GroupMessage;
  FriendMessage: FriendMessage;
  TempMessage: TempMessage;
};
