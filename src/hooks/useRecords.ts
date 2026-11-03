import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

export type RecordCategory = 'Work' | 'Study' | 'Personal' | 'Ideas';

export type RecordItem = {
  id: string;
  title: string;
  description: string;
  category: RecordCategory | string;
  createdAt: string;
  updatedAt: string;
};

export type RecordDraft = {
  title: string;
  description: string;
  category: string;
};

const STORAGE_KEY = 'records-storage-v1';

export const recordCategories: string[] = ['Work', 'Study', 'Personal', 'Ideas'];

export function useRecords() {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadRecords() {
      try {
        const savedValue = await AsyncStorage.getItem(STORAGE_KEY);

        if (!savedValue) {
          if (isMounted) {
            setRecords([]);
          }
          return;
        }

        const parsed = JSON.parse(savedValue) as RecordItem[];

        if (Array.isArray(parsed) && isMounted) {
          setRecords(parsed);
        }
      } catch {
        if (isMounted) {
          setError('Unable to load saved records.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadRecords();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    async function persistRecords() {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        setError(null);
      } catch {
        setError('Unable to save records to local storage.');
      }
    }

    persistRecords();
  }, [loading, records]);

  const addRecord = useCallback((draft: RecordDraft) => {
    const now = new Date().toISOString();

    const nextRecord: RecordItem = {
      id: Date.now().toString(),
      title: draft.title.trim(),
      description: draft.description.trim(),
      category: draft.category.trim(),
      createdAt: now,
      updatedAt: now,
    };

    setRecords((currentRecords) => [...currentRecords, nextRecord]);
  }, []);

  const updateRecord = useCallback((id: string, draft: RecordDraft) => {
    const now = new Date().toISOString();

    setRecords((currentRecords) =>
      currentRecords.map((record) =>
        record.id === id
          ? {
              ...record,
              title: draft.title.trim(),
              description: draft.description.trim(),
              category: draft.category.trim(),
              updatedAt: now,
            }
          : record,
      ),
    );
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setRecords((currentRecords) => currentRecords.filter((record) => record.id !== id));
  }, []);

  return {
    records,
    loading,
    error,
    addRecord,
    updateRecord,
    deleteRecord,
    categories: recordCategories,
  };
}
