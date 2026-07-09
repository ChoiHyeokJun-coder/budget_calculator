import React, { useState, useEffect } from 'react';
import BudgetDisplay from './components/BudgetDisplay';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseChart from './components/ExpenseChart';
import FixedCostSetup from './components/FixedCostSetup';
import { saveToLocalStorage, loadFromLocalStorage } from './utils/localStorage';
import { v4 as uuidv4 } from 'uuid';
import { FaSyncAlt } from 'react-icons/fa';

const App = () => {
  const [budget, setBudget] = useState(() => loadFromLocalStorage('budget', 2000000));
  const [expenses, setExpenses] = useState(() => loadFromLocalStorage('expenses', []));
  const [editExpenseData, setEditExpenseData] = useState(null);
  const [hasSetupFixedCosts, setHasSetupFixedCosts] = useState(() => loadFromLocalStorage('hasSetupFixedCosts', false));

  const totalExpenses = expenses.reduce((acc, current) => acc + current.amount, 0);

  useEffect(() => {
    saveToLocalStorage('budget', budget);
    saveToLocalStorage('expenses', expenses);
    saveToLocalStorage('hasSetupFixedCosts', hasSetupFixedCosts);
  }, [budget, expenses, hasSetupFixedCosts]);

  const addExpense = (expense) => {
    const newExpense = { ...expense, id: uuidv4() };
    setExpenses([...expenses, newExpense]);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const clearExpenses = () => {
    if (window.confirm('정말 모든 지출 내역을 지우시겠습니까?')) {
      setExpenses([]);
    }
  };

  const updateExpense = (updatedExpense) => {
    setExpenses(expenses.map(expense => 
      expense.id === updatedExpense.id ? updatedExpense : expense
    ));
    setEditExpenseData(null);
  };

  const resetInitialSetup = () => {
    if (window.confirm('초기 설정(예산 및 고정비) 화면으로 돌아가시겠습니까?')) {
      setHasSetupFixedCosts(false);
    }
  };

  if (!hasSetupFixedCosts) {
    return (
      <div className="app-container">
        <h1 className="title">예산 계산기</h1>
        <FixedCostSetup 
          onComplete={() => setHasSetupFixedCosts(true)}
          addExpense={addExpense} 
          budget={budget}
          setBudget={setBudget}
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1 className="title">예산 계산기</h1>
      
      <BudgetDisplay 
        budget={budget} 
        setBudget={setBudget} 
        totalExpenses={totalExpenses} 
      />

      <ExpenseForm 
        addExpense={addExpense} 
        editExpenseData={editExpenseData}
        updateExpense={updateExpense}
        clearEdit={() => setEditExpenseData(null)}
      />
      
      <ExpenseChart expenses={expenses} />
        
      <ExpenseList 
        expenses={expenses} 
        deleteExpense={deleteExpense} 
        clearExpenses={clearExpenses}
        setEditExpenseData={setEditExpenseData}
      />

      {/* 설정 리셋 버튼 - 사용자가 언제든지 초기 설정 창을 다시 띄울 수 있도록 합니다. */}
      <div style={{ textAlign: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button 
          className="btn" 
          style={{ background: 'transparent', color: 'var(--text-muted)', fontSize: '0.85rem' }}
          onClick={resetInitialSetup}
        >
          <FaSyncAlt style={{ marginRight: '0.4rem' }}/> 초기 설정 화면 다시 열기
        </button>
      </div>
    </div>
  );
};

export default App;
