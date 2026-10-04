export const WORKSPACES_KEY = 'monthlyBudgetWorkspaces';
export const HISTORY_KEY = 'monthlyBudgetHistory';

export const getMonthKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

export const formatMonth = (month) => {
  const [year, number] = month.split('-');
  return `${year}년 ${Number(number)}월`;
};

export const createWorkspace = (budget = 2000000) => ({
  budget,
  expenses: [],
  hasSetupFixedCosts: false,
});

// 기존 단일 예산/지출은 최초 한 번 현재 월로 가져옵니다.
export const initializeWorkspaces = (load, month) => {
  const saved = load(WORKSPACES_KEY, null);
  if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
    if (saved[month]) return saved;
    const latestMonth = Object.keys(saved).filter(key => key < month).sort().at(-1);
    return { ...saved, [month]: createWorkspace(saved[latestMonth]?.budget) };
  }
  return {
    [month]: {
      budget: load('budget', 2000000),
      expenses: load('expenses', []),
      hasSetupFixedCosts: load('hasSetupFixedCosts', false),
    },
  };
};

export const summarizeExpenses = (expenses) => {
  const categories = new Map();
  let total = 0;
  for (const expense of expenses) {
    total += expense.amount;
    categories.set(expense.category, (categories.get(expense.category) || 0) + expense.amount);
  }
  return { total, categories: Object.fromEntries(categories) };
};

export const saveMonthlySnapshot = (history, month, workspace, now = new Date()) => {
  const snapshot = {
    month,
    budget: workspace.budget,
    expenses: workspace.expenses.map(expense => ({ ...expense })),
    savedAt: now.toISOString(),
  };
  return [...history.filter(record => record.month !== month), snapshot]
    .sort((a, b) => a.month.localeCompare(b.month));
};

export const buildMonthlyTrend = (history) => {
  const records = [...history].sort((a, b) => a.month.localeCompare(b.month))
    .map(record => ({ ...record, ...summarizeExpenses(record.expenses) }));
  if (records.length === 0) return { months: [], records, categories: [] };

  // 저장하지 않은 월은 그래프에서 빈 값으로 남겨 0원 지출과 구분합니다.
  const months = [];
  let [year, month] = records[0].month.split('-').map(Number);
  const lastMonth = records.at(-1).month;
  while (true) {
    const key = `${year}-${String(month).padStart(2, '0')}`;
    months.push(key);
    if (key === lastMonth) break;
    month += 1;
    if (month > 12) { month = 1; year += 1; }
  }
  const categories = [...new Set(records.flatMap(record => Object.keys(record.categories)))];
  return { months, records, categories };
};
