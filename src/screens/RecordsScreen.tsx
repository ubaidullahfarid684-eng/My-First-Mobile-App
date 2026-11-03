import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { CategoryChips } from '@/components/CategoryChips';
import { RecordCard } from '@/components/RecordCard';
import { RecordForm, type RecordFormValues } from '@/components/RecordForm';
import { useRecords, type RecordItem } from '@/hooks/useRecords';

export default function RecordsScreen() {
  const { records, loading, error, addRecord, updateRecord, deleteRecord, categories } = useRecords();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [formValues, setFormValues] = useState<RecordFormValues>({
    title: '',
    description: '',
    category: categories[0] || 'Work',
  });

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return records.filter((record) => {
      const matchesCategory = activeCategory === 'All' || record.category === activeCategory;
      const matchesQuery =
        query.length === 0 ||
        [record.title, record.description].some((field) => field.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, records, searchQuery]);

  const openCreateForm = () => {
    setEditingId(null);
    setFormValues({ title: '', description: '', category: categories[0] || 'Work' });
    setFormKey((current) => current + 1);
    setShowForm(true);
  };

  const openEditForm = (record: RecordItem) => {
    setEditingId(record.id);
    setFormValues({
      title: record.title,
      description: record.description,
      category: record.category,
    });
    setFormKey((current) => current + 1);
    setShowForm(true);
  };

  const handleSubmit = (values: RecordFormValues) => {
    const title = values.title.trim();
    const description = values.description.trim();
    const category = values.category.trim();

    const hasDuplicateTitle = records.some(
      (record) =>
        record.title.trim().toLowerCase() === title.toLowerCase() && record.id !== editingId,
    );

    if (hasDuplicateTitle) {
      Alert.alert('Duplicate title', 'Please use a unique record title.');
      return;
    }

    if (editingId) {
      updateRecord(editingId, { title, description, category });
    } else {
      addRecord({ title, description, category });
    }

    setShowForm(false);
    setEditingId(null);
  };

  const confirmDelete = (record: RecordItem) => {
    Alert.alert('Delete record', `Remove "${record.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteRecord(record.id),
      },
    ]);
  };

  const filterOptions = ['All', ...categories];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.heading}>Records</Text>
          <Text style={styles.subtitle}>Track your notes and tasks</Text>
        </View>
        <Pressable style={styles.addButton} onPress={openCreateForm}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search records"
        style={styles.searchInput}
        autoCapitalize="none"
      />

      <CategoryChips
        options={filterOptions}
        selected={activeCategory}
        onSelect={setActiveCategory}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading records...</Text>
        </View>
      ) : error ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredRecords}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => <RecordCard item={item} onEdit={openEditForm} onDelete={confirmDelete} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {records.length === 0 ? 'No records yet. Create your first one.' : 'No results found.'}
              </Text>
            </View>
          }
        />
      )}

      <RecordForm
        key={formKey}
        visible={showForm}
        title={editingId ? 'Update record' : 'Add record'}
        categories={categories}
        initialValues={formValues}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dfe3ea',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 15,
  },
  listContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#4b5563',
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
  },
});
