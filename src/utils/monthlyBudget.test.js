import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  WORKSPACES_KEY, createWorkspace, getMonthKey, initializeWorkspaces,
  summarizeExpenses, saveMonthlySnapshot, buildMonthlyTrend,
} from './monthlyBudget.js';
import { loadFromLocalStorage, saveToLocalStorage } from './localStorage.js';

const groceries = { id: '1', name: '점심', category: '식비', amount: 12000 };
const transport = { id: '2', name: '버스', category: '교통', amount: 1500 };

test('월 키는 UTC 변환 없이 사용자 달력의 연월을 사용한다', () => {
  assert.equal(getMonthKey(new Date(2026, 0, 1, 0, 1)), '2026-01');
  assert.equal(getMonthKey(new Date(2026, 11, 31, 23, 59)), '2026-12');
});

test('기존 예산과 내역을 현재 월로 가져오고 새 달에는 재가져오지 않는다', () => {
  const legacy = { budget: 80000, expenses: [groceries], hasSetupFixedCosts: true };
  const loadLegacy = (key, fallback) => legacy[key] ?? fallback;
  const first = initializeWorkspaces(loadLegacy, '2026-12');
  assert.deepEqual(first['2026-12'], legacy);
  const second = initializeWorkspaces((key, fallback) => key === WORKSPACES_KEY ? first : loadLegacy(key, fallback), '2027-01');
  assert.deepEqual(second['2026-12'], legacy);
  assert.deepEqual(second['2027-01'], createWorkspace(80000));
  assert.equal(initializeWorkspaces((key, fallback) => key === WORKSPACES_KEY ? second : fallback, '2026-12'), second);
});

test('같은 달의 재저장은 중복 없이 갱신하고 원본 지출 변경과 독립적이다', () => {
  const workspace = { ...createWorkspace(30000), expenses: [{ ...groceries }, { ...transport }] };
  const first = saveMonthlySnapshot([], '2026-10', workspace, new Date('2026-10-05T12:00:00Z'));
  workspace.expenses[0].amount = 18000;
  assert.equal(first[0].expenses[0].amount, 12000);
  const second = saveMonthlySnapshot(first, '2026-10', workspace);
  assert.equal(second.length, 1);
  assert.equal(first[0].expenses[0].amount, 12000);
  assert.equal(second[0].expenses[0].amount, 18000);
  workspace.expenses = [];
  assert.equal(second[0].expenses.length, 2);
});

test('총액 및 카테고리 합계를 계산하고 빈 월도 0원으로 저장한다', () => {
  assert.deepEqual(summarizeExpenses([groceries, transport, { ...groceries, amount: 8000 }]), {
    total: 21500, categories: { 식비: 20000, 교통: 1500 },
  });
  const saved = saveMonthlySnapshot([], '2026-10', createWorkspace(30000));
  assert.deepEqual(summarizeExpenses(saved[0].expenses), { total: 0, categories: {} });
});

test('연도 경계와 누락 월을 포함한 추세를 정렬하며 누락 월은 저장 기록에 넣지 않는다', () => {
  const history = [
    { month: '2027-02', budget: 10000, expenses: [transport] },
    { month: '2026-12', budget: 8000, expenses: [groceries] },
  ];
  const trend = buildMonthlyTrend(history);
  assert.deepEqual(trend.months, ['2026-12', '2027-01', '2027-02']);
  assert.deepEqual(trend.records.map(record => record.total), [12000, 1500]);
  assert.deepEqual(trend.categories, ['식비', '교통']);
  assert.equal(history[0].month, '2027-02');
  assert.deepEqual(buildMonthlyTrend([]), { months: [], records: [], categories: [] });
});

test('브라우저 저장 결과를 보고하며 저장 실패를 성공으로 처리하지 않는다', () => {
  const previousStorage = globalThis.localStorage;
  const previousError = console.error;
  try {
    const data = new Map();
    globalThis.localStorage = {
      setItem: (key, value) => data.set(key, value),
      getItem: key => data.get(key) ?? null,
    };
    const history = saveMonthlySnapshot([], '2026-10', { ...createWorkspace(), expenses: [groceries] });
    assert.equal(saveToLocalStorage('history', history), true);
    assert.deepEqual(loadFromLocalStorage('history', []), history);
    console.error = () => {};
    globalThis.localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
    assert.equal(saveToLocalStorage('history', []), false);
    assert.deepEqual(loadFromLocalStorage('history', []), history);
  } finally {
    globalThis.localStorage = previousStorage;
    console.error = previousError;
  }
});
