/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-import-module-exports */
import fs from 'fs';
import http from 'http';
// eslint-disable-next-line import/no-extraneous-dependencies
import express, { Express } from 'express';
// 加载csv
export default class BillServer {
  static innerServer: http.Server;

  server: Express;

  bills: Bill[] = [];

  categories: Category[] = [];

  constructor() {
    this.loadCsv('./mock-data/bill.csv').then((data: []) => {
      data.forEach((item: any) => {
        this.bills.push({
          type: Number.parseInt(item[0], 10),
          time: Number.parseInt(item[1], 10),
          category: item[2],
          amount: Number.parseInt(item[3], 10),
        });
      });
    });
    this.loadCsv('./mock-data/categories.csv').then((data: []) => {
      data.forEach((item: any) => {
        this.categories.push({
          id: item[0],
          type: Number.parseInt(item[1], 10),
          name: item[2],
        });
      });
    });
    this.initServer();
  }

  initServer() {
    this.server = express();
    this.server.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
    });
    this.server.get('/api/getAllCategories', (req, res) => this.getAllCategories(req, res));
    this.server.get('/api/queryBills', (req, res) => this.queryBills(req, res));
    this.server.get('/api/getBills', (req, res) => this.getBills(req, res));
    this.server.post('/api/addBill', express.json(), (req, res) => this.addBill(req, res));
    this.server.get('/api/statistics', (req, res) => this.statistics(req, res));
  }

  startServer(port: number) {
    if (global.__INNERSERVER__) {
      try {
        global.__INNERSERVER__.close(() => {
          this.innerStartServer(port);
        });
      } catch {
        this.innerStartServer(port);
      }
    } else {
      this.innerStartServer(port);
    }
  }

  private innerStartServer(port: number, isReStart: boolean = false) {
    global.__INNERSERVER__ = this.server.listen(port || 3000, () => {
      console.log(`Bill Server ${isReStart ? 'restart' : 'listening'} on port ${port}`);
    });
  }

  // 获取全部分类
  getAllCategories(req, res) {
    res.json(this.buildResult(this.categories));
  }

  // 分页查询账单
  queryBills(req, res) {
    const bills = this.filterBills(req);
    const page = Number.parseInt(req.query.page, 10);
    const size = Number.parseInt(req.query.size, 10);
    const start = page * size;
    const end = (page + 1) * size;
    const result = bills.slice(start, end);
    res.json(this.buildPageResult(page, size, bills.length, result));
  }

  // 查询账单列表
  getBills(req, res) {
    res.json(this.buildResult(this.filterBills(req)));
  }

  // 统计
  statistics(req, res) {
    const bills = this.filterBills(req);
    const result = bills.reduce((acc, cur) => {
      const { type, amount } = cur;
      if (!acc.incomeTotalAmount) {
        acc.incomeTotalAmount = 0;
      }
      if (type === 1) {
        acc.incomeTotalAmount += amount;
        const bill = acc.incomeBills.find((item) => item.category === cur.category);
        if (!bill) {
          acc.incomeBills.push({
            category: cur.category,
            amount,
          });
        } else {
          bill.amount += amount;
        }
      } else {
        acc.payTotalAmount += amount;
        const bill = acc.payBills.find((item) => item.category === cur.category);
        if (!bill) {
          acc.payBills.push({
            category: cur.category,
            amount,
          });
        } else {
          bill.amount += amount;
        }
      }
      return acc;
    }, {
      incomeTotalAmount: 0, payTotalAmount: 0, incomeBills: [], payBills: [],
    });
    result.incomeBills.sort((a, b) => b.amount - a.amount);
    result.payBills.sort((a, b) => b.amount - a.amount);
    res.json(this.buildResult(result));
  }

  // 筛选账单列表
  filterBills(req) {
    let result = this.bills;
    if (req.query.type) {
      result = result.filter((item) => item.type === Number.parseInt(req.query.type, 10));
    }
    if (req.query.category) {
      result = result.filter((item) => item.category === req.query.category);
    }
    if (req.query.startTime) {
      result = result.filter((item) => item.time >= Number.parseInt(req.query.startTime, 10));
    }
    if (req.query.endTime) {
      result = result.filter((item) => item.time < Number.parseInt(req.query.endTime, 10));
    }
    return result;
  }

  addBill(req, res) {
    const bill = req.body;
    if (!bill) {
      res.json(this.bulidErrorResult(1001, '请求参数错误'));
    } else if ([0, 1].indexOf(bill.type) === -1) {
      res.json(this.bulidErrorResult(1002, '账单类型不能为空'));
    } else if (!bill.amount && bill.amount !== 0) {
      res.json(this.bulidErrorResult(1003, '账单金额不能为空'));
    } else if (!bill.time) {
      res.json(this.bulidErrorResult(1004, '账单时间不能为空'));
    } else {
      this.bills.push(bill);
      res.json(this.buildResult(true));
    }
  }

  buildPageResult(page, size, total, content: any) {
    return this.buildResult({
      page,
      size,
      total,
      content,
      hasNext: page * size < total,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  buildResult(data: any) {
    return {
      success: true,
      errMessage: '',
      data,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  bulidErrorResult(errCode:number, errMessage: string) {
    return {
      success: false,
      errMessage,
      errCode,
    };
  }

  // 加载csv文件，返回除第一行的数组
  loadCsv(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf-8', (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(this.ConvertToList(data));
        }
      });
    }).then((data: any) => data);
  }

  // eslint-disable-next-line class-methods-use-this
  ConvertToList(context: string) {
    const data = context.toString();
    const list = [];
    let rows = [];
    rows = data.split('\n');
    // 第 0 行是表头，跳过从1开始
    for (let i = 1; i < rows.length; i += 1) {
      list.push(rows[i].split(','));
    }
    return list;
  }
}
