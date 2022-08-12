import useCategoriesStore from '@/store/modules/categories';

export default function useFormat() {
  const categoriesStore = useCategoriesStore();
  categoriesStore.getAllCategories();
  return {
    formatType: (type: number) => (type === 1 ? '收入' : '支出'),
    formatCategory: (category: string) => {
      if (!category) return '--';
      const { categories } = categoriesStore;
      return categories.find((item) => item.id === category)?.name || '--';
    },
  };
}
