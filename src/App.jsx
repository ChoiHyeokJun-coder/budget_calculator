import React, { useState, useEffect } from 'react';
import BudgetDisplay from './components/BudgetDisplay';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseChart from './components/ExpenseChart';
import FixedCostSetup from './components/FixedCostSetup';
import MonthlyHistory from './components/MonthlyHistory';
import { saveToLocalStorage, loadFromLocalStorage } from './utils/localStorage';
import {
  WORKSPACES_KEY, HISTORY_KEY, getMonthKey, formatMonth, createWorkspace,
  initializeWorkspaces, saveMonthlySnapshot,
} from './utils/monthlyBudget';
import { v4 as uuidv4 } from 'uuid';
import { FaSyncAlt } from 'react-icons/fa';

const App = () => {
  const [month, setMonth] = useState(() => getMonthKey());
  const [workspaces, setWorkspaces] = useState(() => initializeWorkspaces(loadFromLocalStorage, getMonthKey()));
  const [history, setHistory] = useState(() => loadFromLocalStorage(HISTORY_KEY, []));
  const [saveMessage, setSaveMessage] = useState(null);
  const [draftSaveFailed, setDraftSaveFailed] = useState(false);
  const [editExpenseData, setEditExpenseData] = useState(null);
  const { budget, expenses, hasSetupFixedCosts } = workspaces[month];

  const totalExpenses = expenses.reduce((acc, current) => acc + current.amount, 0);

  useEffect(() => {
    setDraftSaveFailed(!saveToLocalStorage(WORKSPACES_KEY, workspaces));
  }, [workspaces]);

  const updateWorkspace = (update) => {
    setSaveMessage(null);
    setWorkspaces(previous => ({ ...previous, [month]: { ...previous[month], ...update(previous[month]) } }));
  };
  const setBudget = (value) => updateWorkspace(() => ({ budget: value }));
  const setHasSetupFixedCosts = (value) => updateWorkspace(() => ({ hasSetupFixedCosts: value }));

  const changeMonth = (event) => {
    const nextMonth = event.target.value;
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(nextMonth) || nextMonth < '1900-01' || nextMonth > getMonthKey()) return;
    setWorkspaces(previous => previous[nextMonth] ? previous : {
      ...previous, [nextMonth]: createWorkspace(previous[month].budget),
    });
    setMonth(nextMonth);
    setEditExpenseData(null);
    setSaveMessage(null);
  };

  const saveMonth = () => {
    if (!Number.isFinite(budget) || budget < 0 ||
      expenses.some(expense => !Number.isFinite(expense.amount) || expense.amount < 0)) {
      setSaveMessage({ error: true, text: '예산과 지출 금액을 0 이상의 유효한 숫자로 입력해주세요.' });
      return;
    }
    if (history.some(record => record.month === month) &&
      !window.confirm(`${formatMonth(month)}의 저장 기록을 현재 예산과 지출 내역으로 갱신할까요?`)) return;
    const nextHistory = saveMonthlySnapshot(history, month, workspaces[month]);
    if (!saveToLocalStorage(HISTORY_KEY, nextHistory)) {
      setSaveMessage({ error: true, text: '저장하지 못했습니다. 브라우저 저장 공간과 설정을 확인한 뒤 다시 시도해주세요.' });
      return;
    }
    setHistory(nextHistory);
    setSaveMessage({ error: false, text: `${formatMonth(month)}의 지출 ${expenses.length}건과 예산을 저장했습니다.` });
  };

  const addExpense = (expense) => {
    const newExpense = { ...expense, id: uuidv4() };
    updateWorkspace(current => ({ expenses: [...current.expenses, newExpense] }));
  };

  const deleteExpense = (id) => {
    updateWorkspace(current => ({ expenses: current.expenses.filter(expense => expense.id !== id) }));
  };

  const clearExpenses = () => {
    if (window.confirm('정말 모든 지출 내역을 지우시겠습니까?')) {
      updateWorkspace(() => ({ expenses: [] }));
      setEditExpenseData(null);
    }
  };

  const updateExpense = (updatedExpense) => {
    updateWorkspace(current => ({ expenses: current.expenses.map(expense =>
      expense.id === updatedExpense.id ? updatedExpense : expense
    ) }));
    setEditExpenseData(null);
  };

  const resetInitialSetup = () => {
    if (window.confirm('초기 설정(예산 및 고정비) 화면으로 돌아가시겠습니까?')) {
      setHasSetupFixedCosts(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">예산 계산기</h1>

      <div className="monthly-workspace-picker">
        <label htmlFor="workspace-month" className="form-label">관리할 월</label>
        <input id="workspace-month" type="month" className="form-input" value={month}
          min="1900-01" max={getMonthKey()} onChange={changeMonth} />
        <p className="monthly-muted">{formatMonth(month)}의 예산과 지출을 관리하고 있습니다.</p>
      </div>
      {draftSaveFailed && <p className="alert alert-danger" role="alert">입력 중인 내역을 자동 저장하지 못했습니다. 브라우저 저장 공간과 설정을 확인해주세요.</p>}

      {!hasSetupFixedCosts ? (
        <FixedCostSetup key={month}
          onComplete={() => setHasSetupFixedCosts(true)} addExpense={addExpense}
          budget={budget} setBudget={setBudget} />
      ) : (
        <>
          <BudgetDisplay key={month} budget={budget} setBudget={setBudget}
            totalExpenses={totalExpenses} />
          <ExpenseForm key={month} addExpense={addExpense} editExpenseData={editExpenseData}
            updateExpense={updateExpense} clearEdit={() => setEditExpenseData(null)} />
          <ExpenseChart expenses={expenses} />
          <ExpenseList expenses={expenses} deleteExpense={deleteExpense}
            clearExpenses={clearExpenses} setEditExpenseData={setEditExpenseData} />
        </>
      )}

      <MonthlyHistory history={history} month={month} onSave={saveMonth}
        canSave={hasSetupFixedCosts} saveMessage={saveMessage} />

      {/* 설정 리셋 버튼 - 사용자가 언제든지 초기 설정 창을 다시 띄울 수 있도록 합니다. */}
      <footer style={{ textAlign: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button 
          className="btn" 
          style={{ background: 'transparent', color: 'var(--text-muted)', fontSize: '0.85rem' }}
          onClick={resetInitialSetup}
        >
          <FaSyncAlt style={{ marginRight: '0.4rem' }}/> 초기 설정 화면 다시 열기
        </button>
      </footer>
    </div>
  );
};

export default App;
