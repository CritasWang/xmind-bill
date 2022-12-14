<template>
  <div
    class="menu"
    :style="{ width: isCollapse ? '65px' : '220px' }">
    <div class="logo flex-center">
      <img
        src="@/assets/vue.svg"
        alt="logo">
      <span v-show="!isCollapse">{{ systemTitle }}</span>
    </div>
    <el-scrollbar>
      <el-menu
        :default-active="activeMenu"
        :router="true"
        :collapse="isCollapse"
        :collapse-transition="false"
        :unique-opened="true"
        background-color="#20222a"
        text-color="#bdbdc0"
        active-text-color="#fff">
        <layout-menu-sub-item :menu-list="menuList" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { RouteRecordRaw, useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import useMenuStore from '@/store/modules/menu';
import useAppStore from '@/store/modules/app';
import LayoutMenuSubItem from './components/layout-menu-sub-item.vue';

const appStore = useAppStore();

const { systemTitle } = storeToRefs(appStore);

const route = useRoute();
const menuStore = useMenuStore();
const router = useRouter();
const allRoutes = computed(() => router.options.routes);

const getRoutePath = (routeItem: RouteRecordRaw, parentPath: string) => {
  const path = routeItem.path.indexOf('/') === 0 ? routeItem.path : `${parentPath}/${routeItem.path}`;
  return path.replaceAll('//', '/');
};

const routesToMenu = (routeItem: RouteRecordRaw, parentPath: string) => {
  const path = getRoutePath(routeItem, parentPath);
  const menu = {
    path,
    title: routeItem.meta?.title,
    icon: routeItem.meta?.icon,
    isLink: routeItem.meta?.isLink,
    close: routeItem.meta?.close,
    alwayShow: routeItem.meta?.alwayShow,
    order: routeItem.meta?.order,
  } as MenuOptions;
  if (routeItem.children && routeItem.children.length > 0) {
    if (routeItem.children.length === 1 && !routeItem.meta?.alwayShow) {
      menu.path = getRoutePath(routeItem.children[0], path);
    } else {
      const routesHasTitle = routeItem.children.filter((item) => item?.meta?.title && !item.meta?.hiddenMenu);
      routesHasTitle.forEach((item) => {
        if (!menu.children) {
          menu.children = [];
        } menu.children.push(routesToMenu(item, menu.path));
      });
    }
  }
  return menu;
};

const getMenuList = () => {
  const menuList = [] as Array<MenuOptions>;
  const routesHasTitle = allRoutes.value.filter((item) => item?.meta?.title && !item.meta?.hiddenMenu);
  routesHasTitle.forEach((item) => {
    menuList.push(routesToMenu(item, ''));
  });

  return menuList;
};

onMounted(async () => {
  menuStore.setMenuList(getMenuList());
});

const activeMenu = computed((): string => route.path);
const isCollapse = computed((): boolean => menuStore.isCollapse);
const menuList = computed((): MenuOptions[] => menuStore.menuList);

const screenWidth = ref<number>(0);
const screenHeight = ref<number>(0);
// ??????????????????
const listeningWindow = () => {
  window.onresize = () => (() => {
    screenWidth.value = document.body.clientWidth;
    screenHeight.value = document.body.clientHeight;
    if (isCollapse.value === false && screenWidth.value < 1200) menuStore.setCollapse();
    if (isCollapse.value === true && screenWidth.value > 1200) menuStore.setCollapse();
  })();
};
listeningWindow();
</script>

<style scoped lang="scss">
.menu {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #20222a;
  transition: all 0.3s ease;

  .logo {
    box-sizing: border-box;
    height: 55px;
    border-bottom: 2px solid #1d1e26;
    box-shadow: 2px 0 6px rgb(0 21 41 / 35%);

    span {
      font-size: 22px;
      font-weight: bold;
      color: #dadada;
      white-space: nowrap;
    }

    img {
      width: 30px;
      object-fit: contain;
      margin-right: 8px;
    }
  }

  .el-scrollbar {
    height: calc(100% - 55px);

    .el-menu {
      flex: 1;
      overflow: auto;
      overflow-x: hidden;
      border-right: none;

      &::-webkit-scrollbar {
        background-color: #20222a;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #41444b;
      }
    }
  }
}
</style>
