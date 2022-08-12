import { RouteRecordRaw } from 'vue-router';

export declare interface RouteMeta {
  [key: string]: any;
  title?: string;
  hiddenMenu?: boolean; // 在菜单不显示，具有延续性
  abstract?: boolean; // 抽象路由，不能被激活，只能由子路由激活
  /**
     * 当只有一个子路由的时候，侧边栏会只显示子路由
     * 如果想一直在侧边栏显示父路由，则设置该属性为 true
     */
  alwaysShow?: boolean;
  permissions?: string[];
  hideClose?: boolean;
  label?: string,
}

export declare type RouteConfig = RouteRecordRaw & {
  name: string;
  path: string;
  component?: any;
  children?: RouteConfig[];
  meta: RouteMeta;
};

export declare type Menu = RouteConfig & {
  name?: string;
  title?: string;
  path: string;
  meta: RouteMeta;
  alwayShow?: boolean;
  children?: Menu[];
  hasParent?: false;
};

export declare interface MenuOptions {
  path: string;
  title: string;
  icon?: string;
  isLink?: string;
  close?: boolean;
  children?: MenuOptions[];
}
