// ==========================================
// LocalStorage 유틸리티 (브라우저 저장소 관리)
// ==========================================
// 앱을 껐다 켜도 데이터가 날아가지 않게 브라우저의 'LocalStorage'에 
// 데이터를 저장하고 불러오는 역할을 하는 도우미 함수들입니다.

/**
 * 데이터를 브라우저에 저장하는 함수입니다.
 * @param {string} key - 저장할 이름표 (예: 'budget', 'expenses')
 * @param {any} value - 저장할 데이터 (배열이나 숫자 등)
 */
export const saveToLocalStorage = (key, value) => {
  try {
    // 배열이나 객체 형태의 데이터는 브라우저가 바로 이해하지 못하므로,
    // JSON.stringify()를 써서 '문자열' 형태로 변환한 뒤에 저장합니다.
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // 만약 저장 공간이 꽉 차는 등 에러가 나면 콘솔에 빨간색으로 경고를 띄웁니다.
    console.error(`Error saving to localStorage with key "${key}":`, error);
  }
};

/**
 * 브라우저에 저장된 데이터를 불러오는 함수입니다.
 * @param {string} key - 찾을 이름표 (예: 'budget')
 * @param {any} defaultValue - 만약 저장된 데이터가 아예 없다면 대신 반환할 '기본값'
 */
export const loadFromLocalStorage = (key, defaultValue) => {
  try {
    // 먼저 이름표(key)로 데이터를 꺼내봅니다.
    const stored = localStorage.getItem(key);
    
    // 데이터가 존재하면(stored), 아까 문자열로 바꿨던 것을 다시 원래 형태(배열/객체/숫자)로 복구(JSON.parse)해서 줍니다.
    // 데이터가 없다면 설정해둔 기본값(defaultValue)을 반환합니다.
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error loading from localStorage with key "${key}":`, error);
    // 에러가 나서 못 불러오면, 앱이 고장나지 않도록 안전하게 기본값을 반환합니다.
    return defaultValue; 
  }
};
