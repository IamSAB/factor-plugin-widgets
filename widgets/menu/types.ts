export enum LinkType {
  Url,
  ContentRoute,
  Post
}

export enum TargetType {
  Default = "_self",
  Blank = "_blank",
  Parent = "_parent",
  Top = "_top",
}

export interface MenuItem {
  _id: String;
  _linkType?: LinkType;
  _postType?: String;
  _postId?: String;
  label?: String;
  path?: String;
  desc?: String;
  title?: String;
  icon?: String;
  target?: TargetType;
  children: MenuItem[];
}