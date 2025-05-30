import { TestData, validateTestData } from './questions';

// 로컬 스토리지에서 테스트 데이터 불러오기
export async function loadTestData(): Promise<TestData> {
  try {
    // 서버 사이드에서는 fetch를 사용하여 JSON 파일 로드
    const data = await import('./english_test_questions.json').then(
      (module) => module.default as TestData
    );
    
    // 데이터 유효성 검증
    const validation = validateTestData(data);
    if (!validation.valid) {
      console.error('테스트 데이터 유효성 검증 실패:', validation.errors);
      throw new Error('테스트 데이터가 유효하지 않습니다.');
    }
    
    return data;
  } catch (error) {
    console.error('테스트 데이터 로드 실패:', error);
    throw error;
  }
}

// 브라우저 로컬 스토리지에 테스트 데이터 저장
export function saveTestDataToLocalStorage(data: TestData): void {
  if (typeof window !== 'undefined') {
    try {
      const validation = validateTestData(data);
      if (!validation.valid) {
        console.error('저장할 테스트 데이터 유효성 검증 실패:', validation.errors);
        throw new Error('유효하지 않은 테스트 데이터는 저장할 수 없습니다.');
      }
      
      localStorage.setItem('english_test_data', JSON.stringify(data));
    } catch (error) {
      console.error('테스트 데이터 저장 실패:', error);
      throw error;
    }
  }
}

// 브라우저 로컬 스토리지에서 테스트 데이터 불러오기
export function loadTestDataFromLocalStorage(): TestData | null {
  if (typeof window !== 'undefined') {
    try {
      const dataString = localStorage.getItem('english_test_data');
      if (!dataString) return null;
      
      const data = JSON.parse(dataString) as TestData;
      
      // 데이터 유효성 검증
      const validation = validateTestData(data);
      if (!validation.valid) {
        console.error('로컬 스토리지 테스트 데이터 유효성 검증 실패:', validation.errors);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('로컬 스토리지에서 테스트 데이터 로드 실패:', error);
      return null;
    }
  }
  return null;
}

// 테스트 데이터 초기화 (로컬 스토리지 데이터 삭제)
export function resetTestData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('english_test_data');
  }
}
