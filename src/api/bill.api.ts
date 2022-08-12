import http from '@/utils/http';

export default class BillApi {
  static queryBills(params: Partial<BillQO & PageQuery>):HttpTableResponseP<Bill> {
    return http.get('/queryBills', { params });
  }

  static statistics(params: BillQO):HttpResponseP<BillStatistics> {
    return http.get('/statistics', { params });
  }

  static getBills(params: BillQO):HttpResponseP<Array<Bill>> {
    return http.get('/getBills', { params });
  }

  static addBill(data: Partial<Bill>) {
    return http.post('/addBill', data);
  }
}
