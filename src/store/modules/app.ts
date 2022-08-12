import { defineStore } from 'pinia';

const useAppStore = defineStore('app', {
  state: () => ({
    systemTitle: import.meta.env.VITE_APP_TITLE, // 系统名称
    contentFullScreen: false, // 内容是否可全屏展示
    elementSize: 'default' as 'large' | 'default' | 'small', // element默认尺寸，支持 'large' | 'default' | 'small'
  }),
  persist: false,
});

export default useAppStore;
