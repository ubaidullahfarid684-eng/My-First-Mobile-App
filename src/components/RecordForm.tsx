import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { CategoryChips } from './CategoryChips';

export type RecordFormValues = {
  title: string;
  description: string;
  category: string;
};

type RecordFormProps = {
  visible: boolean;
  title: string;
  categories: string[];
  initialValues?: RecordFormValues;
  onClose: () => void;
  onSubmit: (values: RecordFormValues) => void;
};

const defaultValues: RecordFormValues = {
  title: '',
  description: '',
  category: '',
};

export function RecordForm({
  visible,
  title,
  categories,
  initialValues,
  onClose,
  onSubmit,
}: RecordFormProps) {
  const getInitialForm = () => ({
    ...defaultValues,
    ...initialValues,
    category: initialValues?.category || categories[0] || '',
  });

  const [form, setForm] = useState<RecordFormValues>(getInitialForm);
  const [errorMessage, setErrorMessage] = useState('');

  const requiredFields = useMemo(
    () => [form.title.trim(), form.description.trim(), form.category.trim()],
    [form.category, form.description, form.title],
  );

  const handleSubmit = () => {
    const isValid = requiredFields.every((value) => value.length > 0);

    if (!isValid) {
      setErrorMessage('Please fill in all required fields before saving.');
      return;
    }

    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
    });
  };

  const currentCategory = form.category || categories[0] || '';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.sheet}>
          <Text style={styles.heading}>{title}</Text>

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              value={form.title}
              onChangeText={(value) => setForm((current) => ({ ...current, title: value }))}
              placeholder="Record title"
              style={styles.input}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              value={form.description}
              onChangeText={(value) => setForm((current) => ({ ...current, description: value }))}
              placeholder="Add details"
              multiline
              numberOfLines={5}
              style={[styles.input, styles.textArea]}
              textAlignVertical="top"
            />

            <Text style={styles.label}>Category</Text>
            <CategoryChips
              options={categories}
              selected={currentCategory}
              onSelect={(category) => setForm((current) => ({ ...current, category }))}
            />

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          </ScrollView>

          <View style={styles.actions}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.saveText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 20,
    maxHeight: '88%',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dbe3f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    backgroundColor: '#f9fafb',
    color: '#111827',
  },
  textArea: {
    minHeight: 110,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#eef2ff',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e3a8a',
  },
  saveButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#2563eb',
  },
  saveText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  errorText: {
    fontSize: 13,
    color: '#dc2626',
    marginBottom: 10,
  },
});
