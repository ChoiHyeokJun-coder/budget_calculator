import React, { useState, useEffect } from 'react';
import { FaPlus, FaSave } from 'react-icons/fa';

const ExpenseForm = ({ addExpense, editExpenseData, updateExpense, clearEdit }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('식비');

  useEffect(() => {
    if (editExpenseData) {
      setName(editExpenseData.name);
      setAmount(editExpenseData.amount);
      setCategory(editExpenseData.category);
    } else {
      setName('');
      setAmount('');
      setCategory('식비');
    }
  }, [editExpenseData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount) return;

    if (editExpenseData) {
      updateExpense({ ...editExpenseData, name, amount: Number(amount), category });
    } else {
      addExpense({ name, amount: Number(amount), category });
    }

    setName('');
    setAmount('');
    setCategory('식비');
  };

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem' }}>
      <h3 style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {editExpenseData ? '지출 수정' : '지출 추가'}
        {editExpenseData && (
          <button type="button" className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={clearEdit}>
            취소
          </button>
        )}
      </h3>

      {/* 폼 로우: PC에서는 한 줄로, 모바일에서는 여러 줄로 자동 조절되는 반응형 UI 복구 */}
      <form onSubmit={handleSubmit} className="form-row">
        <div className="form-group" style={{ flex: 2 }}>
          <label className="form-label">지출 항목</label>
          <input type="text" className="form-input" placeholder="예: 스타벅스" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        
        <div className="form-group" style={{ flex: 1.5 }}>
          <label className="form-label">비용 (원)</label>
          <input type="number" className="form-input" placeholder="예: 4500" value={amount} onChange={(e) => setAmount(e.target.value)} required min="0" />
        </div>
        
        <div className="form-group" style={{ flex: 1.5 }}>
          <label className="form-label">카테고리</label>
          <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="식비">식비</option>
            <option value="교통">교통</option>
            <option value="주거">주거</option>
            <option value="쇼핑">쇼핑</option>
            <option value="여가">여가</option>
            <option value="고정비">고정비</option>
            <option value="기타">기타</option>
          </select>
        </div>
        
        <button type="submit" className="btn btn-primary" style={{ height: '45px', padding: '0 1.5rem' }}>
          {editExpenseData ? <FaSave /> : <FaPlus />}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
