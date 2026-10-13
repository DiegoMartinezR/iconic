import { useState } from 'react';

export default function useEditorHistory(initialState) {
  const [history, setHistory] = useState([JSON.stringify(initialState)]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const addToHistory = (newState) => {
    const newHistory = [...history.slice(0, historyIndex + 1), JSON.stringify(newState)];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      return JSON.parse(history[historyIndex - 1]);
    }
    return null;
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      return JSON.parse(history[historyIndex + 1]);
    }
    return null;
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    currentState: JSON.parse(history[historyIndex]),
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo
  };
}