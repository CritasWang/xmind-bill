import { defineStore } from 'pinia';
import CategoriesApi from '@/api/categories.api';

const useCategoriesStore = defineStore({
  id: 'CategoriesStore',
  state: () => ({
    categories: [] as Array<Category>,
  }),
  getters: {},
  actions: {
    async getAllCategories() {
      if (this.categories.length > 0) {
        return Promise.resolve(this.categories);
      }
      return CategoriesApi.getAllCategories().then((resp) => {
        this.categories = resp.data;
        return this.categories;
      });
    },
  },
  persist: false,
});

export default useCategoriesStore;
