import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { RecordItem } from '@/hooks/useRecords';

type RecordCardProps = {
  item: RecordItem;
  onEdit: (item: RecordItem) => void;
  onDelete: (item: RecordItem) => void;
};

export function RecordCard({ item, onEdit, onDelete }: RecordCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.category}>{item.category}</Text>
        </View>
      </View>

      <Text style={styles.description}>{item.description}</Text>

      <Text style={styles.metaText}>Updated: {new Date(item.updatedAt).toLocaleDateString()}</Text>

      <View style={styles.actions}>
        <Pressable style={styles.editButton} onPress={() => onEdit(item)}>
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
        <Pressable style={styles.deleteButton} onPress={() => onDelete(item)}>
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#111827',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
    backgroundColor: '#dbeafe',
    alignSelf: 'flex-start',
    borderRadius: 999,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  description: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#e0f2fe',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  editText: {
    color: '#075985',
    fontWeight: '700',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#fee2e2',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  deleteText: {
    color: '#b91c1c',
    fontWeight: '700',
  },
});
