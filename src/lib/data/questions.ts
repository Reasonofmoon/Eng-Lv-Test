import { z } from 'zod';

// 문항 유효성 검증을 위한 Zod 스키마 정의
export const OptionSchema = z.string().min(1, "옵션은 비어있을 수 없습니다");

export const QuestionSchema = z.object({
  id: z.string().min(1, "ID는 필수입니다"),
  question_type: z.string().min(1, "문제 유형은 필수입니다"),
  difficulty: z.string().min(1, "난이도는 필수입니다"),
  question: z.string().min(1, "문제 내용은 필수입니다"),
  options: z.array(OptionSchema).min(2, "최소 2개 이상의 옵션이 필요합니다"),
  answer: z.string().min(1, "정답은 필수입니다"),
  explanation: z.string().optional(),
});

export const ReadingPassageSchema = z.object({
  id: z.string().min(1, "ID는 필수입니다"),
  passage_title: z.string().min(1, "지문 제목은 필수입니다"),
  passage_text: z.string().min(1, "지문 내용은 필수입니다"),
  questions: z.array(
    z.object({
      question_id_in_passage: z.string().min(1, "문제 ID는 필수입니다"),
      question: z.string().min(1, "문제 내용은 필수입니다"),
      options: z.array(OptionSchema).min(2, "최소 2개 이상의 옵션이 필요합니다"),
      answer: z.string().min(1, "정답은 필수입니다"),
      explanation: z.string().optional(),
    })
  ).min(1, "최소 1개 이상의 문제가 필요합니다"),
});

export const ListeningScriptSchema = z.object({
  id: z.string().min(1, "ID는 필수입니다"),
  script_title: z.string().min(1, "스크립트 제목은 필수입니다"),
  script: z.string().min(1, "스크립트 내용은 필수입니다"),
  audioSrc: z.string().min(1, "오디오 소스는 필수입니다"),
  questions: z.array(
    z.object({
      question_id_in_script: z.string().min(1, "문제 ID는 필수입니다"),
      question: z.string().min(1, "문제 내용은 필수입니다"),
      options: z.array(OptionSchema).min(2, "최소 2개 이상의 옵션이 필요합니다"),
      answer: z.string().min(1, "정답은 필수입니다"),
      explanation: z.string().optional(),
    })
  ).min(1, "최소 1개 이상의 문제가 필요합니다"),
});

export const TestDataSchema = z.object({
  testSettings: z.object({
    totalTimeMinutes: z.number().min(1, "테스트 시간은 최소 1분 이상이어야 합니다"),
    sections: z.array(z.string()).min(1, "최소 1개 이상의 섹션이 필요합니다"),
  }),
  vocabulary: z.array(QuestionSchema),
  grammar: z.array(QuestionSchema),
  reading_comprehension: z.array(ReadingPassageSchema),
  listening_comprehension: z.array(ListeningScriptSchema),
});

export type Question = z.infer<typeof QuestionSchema>;
export type ReadingPassage = z.infer<typeof ReadingPassageSchema>;
export type ListeningScript = z.infer<typeof ListeningScriptSchema>;
export type TestData = z.infer<typeof TestDataSchema>;

// 'n' 표기 문제 해결을 위한 옵션 처리 함수
export function parseOptionValue(option: string): string {
  // 옵션 문자열에서 첫 번째 문자(A, B, C, D 등)를 추출
  const match = option.match(/^([A-Z])\)/);
  if (match && match[1]) {
    return match[1];
  }
  // 첫 글자가 알파벳이면 그것을 반환
  if (/^[A-Z]/i.test(option)) {
    return option[0].toUpperCase();
  }
  // 기본값으로 빈 문자열 반환
  return '';
}

// 문항 유효성 검증 함수
export function validateQuestion(question: any): { valid: boolean; errors?: string[] } {
  try {
    QuestionSchema.parse(question);
    return { valid: true };
  } catch (error: any) {
    if (error.errors) {
      return {
        valid: false,
        errors: error.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return { valid: false, errors: ['알 수 없는 오류가 발생했습니다'] };
  }
}

// 테스트 데이터 전체 유효성 검증 함수
export function validateTestData(data: any): { valid: boolean; errors?: string[] } {
  try {
    TestDataSchema.parse(data);
    return { valid: true };
  } catch (error: any) {
    if (error.errors) {
      return {
        valid: false,
        errors: error.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return { valid: false, errors: ['알 수 없는 오류가 발생했습니다'] };
  }
}
