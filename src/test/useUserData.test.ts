Кликни в пустую область файла useUserData.test.ts в редакторе и вставь вот это (уже с исправлением бага в XP тесте):
typescriptimport { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUserData } from '../hooks/useUserData';

const STORAGE_KEY = 'mindmetric_history';

beforeEach(() => {
  localStorage.clear();
});

describe('useUserData — начальное состояние', () => {
  it('history пустой при отсутствии данных в localStorage', () => {
    const { result } = renderHook(() => useUserData());
    expect(result.current.history).toEqual([]);
  });
  it('xp равен 0 при пустой истории', () => {
    const { result } = renderHook(() => useUserData());
    expect(result.current.xp).toBe(0);
  });
  it('level равен 1 при нулевом xp', () => {
    const { result } = renderHook(() => useUserData());
    expect(result.current.level).toBe(1);
  });
  it('results — алиас для history', () => {
    const { result } = renderHook(() => useUserData());
    expect(result.current.results).toBe(result.current.history);
  });
});

describe('useUserData — сохранение результатов', () => {
  it('saveResult добавляет запись в history', () => {
    const { result } = renderHook(() => useUserData());
    act(() => { result.current.saveResult({ type: 'reaction', score: 245 }); });
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].type).toBe('reaction');
    expect(result.current.history[0].score).toBe(245);
  });
  it('saveResult присваивает id и timestamp', () => {
    const { result } = renderHook(() => useUserData());
    act(() => { result.current.saveResult({ type: 'stroop', score: 88 }); });
    const entry = result.current.history[0];
    expect(entry.id).toBeTruthy();
    expect(entry.timestamp).toBeGreaterThan(0);
  });
  it('saveResult сохраняет в localStorage', () => {
    const { result } = renderHook(() => useUserData());
    act(() => { result.current.saveResult({ type: 'memory', score: 7 }); });
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].score).toBe(7);
  });
  it('новые результаты добавляются в начало списка', () => {
    const { result } = renderHook(() => useUserData());
    act(() => { result.current.saveResult({ type: 'reaction', score: 200 }); });
    act(() => { result.current.saveResult({ type: 'stroop', score: 90 }); });
    expect(result.current.history[0].type).toBe('stroop');
    expect(result.current.history[1].type).toBe('reaction');
  });
});

describe('useUserData — XP и уровень', () => {
  it('каждый результат даёт 50 XP', () => {
    const { result } = renderHook(() => useUserData());
    act(() => { result.current.saveResult({ type: 'reaction', score: 200 }); });
    act(() => { result.current.saveResult({ type: 'memory', score: 7 }); });
    expect(result.current.xp).toBe(100);
  });
});

describe('useUserData — очистка истории', () => {
  it('clearHistory очищает history', () => {
    const { result } = renderHook(() => useUserData());
    act(() => { result.current.saveResult({ type: 'reaction', score: 200 }); });
    act(() => { result.current.clearHistory(); });
    expect(result.current.history).toHaveLength(0);
  });
  it('clearHistory удаляет данные из localStorage', () => {
    const { result } = renderHook(() => useUserData());
    act(() => { result.current.saveResult({ type: 'reaction', score: 200 }); });
    act(() => { result.current.clearHistory(); });
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});