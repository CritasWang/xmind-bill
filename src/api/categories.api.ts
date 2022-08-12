import http from '@/utils/http';

export default class CategoriesApi {
  static getAllCategories() {
    return http.get('/getAllCategories').then((resp) => resp.data);
  }
}
