"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const incomeExpenseSchedule_1 = require("common/calculate-monthly-income-expense/incomeExpenseSchedule");
const request = require("supertest");
const app_1 = require("main/app");
const hooks_1 = require("test/routes/hooks");
const paths_1 = require("paths");
const HttpStatus = require("http-status-codes");
describe('Monthly Income Expenses Calculation', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('when income expense details are correct', () => {
        it('should return OK ', async () => {
            const incomeExpenseSources = {
                incomeExpenseSources: [
                    {
                        'amount': 100,
                        'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH.value
                    }
                ]
            };
            await request(app_1.app)
                .post(paths_1.Paths.totalIncomeOrExpensesCalculation.uri)
                .send(incomeExpenseSources)
                .expect(HttpStatus.OK, { 'totalMonthlyIncomeExpense': 100 });
        });
    });
    describe('when income expense details are incorrect', () => {
        it('should return error when `schedule` is invalid in one of the `incomeExpenseSources` items', async () => {
            const incomeExpenseSources = {
                incomeExpenseSources: [
                    {
                        'amount': 100,
                        'schedule': 'INVALID'
                    }
                ]
            };
            await request(app_1.app)
                .post(paths_1.Paths.totalIncomeOrExpensesCalculation.uri)
                .send(incomeExpenseSources)
                .expect(HttpStatus.UNPROCESSABLE_ENTITY);
        });
        it('should return error when `schedule` is missing in one of the `incomeExpenseSources` items', async () => {
            const incomeExpenseSources = {
                incomeExpenseSources: [
                    {
                        'amount': 100
                    }
                ]
            };
            await request(app_1.app)
                .post(paths_1.Paths.totalIncomeOrExpensesCalculation.uri)
                .send(incomeExpenseSources)
                .expect(HttpStatus.UNPROCESSABLE_ENTITY);
        });
        it('should return error when `amount` is invalid in one of the `incomeExpenseSources` items', async () => {
            const incomeExpenseSources = {
                incomeExpenseSources: [
                    {
                        'amount': 20.123,
                        'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
                    }
                ]
            };
            await request(app_1.app)
                .post(paths_1.Paths.totalIncomeOrExpensesCalculation.uri)
                .send(incomeExpenseSources)
                .expect(HttpStatus.UNPROCESSABLE_ENTITY);
        });
        it('should return error when `amount` is missing in one of the `incomeExpenseSources` items', async () => {
            const incomeExpenseSources = {
                incomeExpenseSources: [
                    {
                        'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
                    }
                ]
            };
            await request(app_1.app)
                .post(paths_1.Paths.totalIncomeOrExpensesCalculation.uri)
                .send(incomeExpenseSources)
                .expect(HttpStatus.UNPROCESSABLE_ENTITY);
        });
        it('should return error when `incomeExpenseSources` is not an array', async () => {
            const incomeExpenseSources = {
                incomeExpenseSources: 'not an array'
            };
            await request(app_1.app)
                .post(paths_1.Paths.totalIncomeOrExpensesCalculation.uri)
                .send(incomeExpenseSources)
                .expect(HttpStatus.UNPROCESSABLE_ENTITY);
        });
    });
});
