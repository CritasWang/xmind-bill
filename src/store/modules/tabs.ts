import { defineStore } from 'pinia';
import { TabPaneProps } from 'element-plus';
import router from '@/router/router';
import { HOME_URL, TABS_BLACK_LIST } from '@/config/app-config';

const useTabsStore = defineStore({
  id: 'useTabsState',
  state: () => ({
    tabsMenuValue: HOME_URL,
    tabsMenuList: [{
      title: '首页', path: HOME_URL, icon: 'home-filled', close: false,
    }] as Array<MenuOptions>,
  }),
  getters: {},
  actions: {
    async addTabs(tabItem: MenuOptions) {
      if (TABS_BLACK_LIST.includes(tabItem.path)) return;
      const tabInfo: MenuOptions = {
        title: tabItem.title,
        path: tabItem.path,
        close: tabItem.close,
      };
      if (this.tabsMenuList.every((item) => item.path !== tabItem.path)) {
        this.tabsMenuList.push(tabInfo);
      }
      this.setTabsMenuValue(tabItem.path);
      router.push(tabItem.path);
    },
    async removeTabs(tabPath: string) {
      let { tabsMenuValue } = this;
      const { tabsMenuList } = this;
      if (tabsMenuValue === tabPath) {
        tabsMenuList.forEach((item, index) => {
          if (item.path !== tabPath) return;
          const nextTab = tabsMenuList[index + 1] || tabsMenuList[index - 1];
          if (!nextTab) return;
          tabsMenuValue = nextTab.path;
          router.push(nextTab.path);
        });
      }
      this.tabsMenuValue = tabsMenuValue;
      this.tabsMenuList = tabsMenuList.filter((item) => item.path !== tabPath);
    },
    async changeTabs(tabItem: TabPaneProps) {
      this.tabsMenuList.forEach((item) => {
        if (item.title === tabItem.label) router.push(item.path);
      });
    },
    async setTabsMenuValue(tabsMenuValue: string) {
      this.tabsMenuValue = tabsMenuValue;
    },
    async setTabsMenuList(tabsMenuList: Array<MenuOptions>) {
      this.tabsMenuList = tabsMenuList;
    },
    async closeMultipleTab(tabsMenuValue?: string) {
      this.tabsMenuList = this.tabsMenuList.filter((item) => item.path === tabsMenuValue || item.path === HOME_URL);
    },
    async goHome() {
      router.push(HOME_URL);
      this.tabsMenuValue = HOME_URL;
    },
  },
  persist: {
    storage: sessionStorage,
  },
});
export default useTabsStore;
