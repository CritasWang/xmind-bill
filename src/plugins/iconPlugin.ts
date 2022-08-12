import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { App } from 'vue';

export const iconPlugin = {
  install: (app: App) => {
    const icons = Object.entries(ElementPlusIconsVue);
    icons.forEach(([key, component]) => {
      app.component(key, component);
    });
  },
};

export default iconPlugin;
