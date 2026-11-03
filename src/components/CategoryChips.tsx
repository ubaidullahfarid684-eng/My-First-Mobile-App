import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type CategoryChipsProps = {
  options: string[];
  selected: string;
  onSelect: (category: string) => void;
};

export function CategoryChips({ options, selected, onSelect }: CategoryChipsProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
      {options.map((option) => {
        const isSelected = option === selected;

        return (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            style={[styles.chip, isSelected && styles.chipSelected]}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{option}</Text>
          </Pressable>
        );
      })}
      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: 12,
  },
  chip: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#dfe3ea',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#f3f5f8',
  },
  chipSelected: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
  },
  chipTextSelected: {
    color: '#ffffff',
  },
  spacer: {
    width: 8,
  },
});
