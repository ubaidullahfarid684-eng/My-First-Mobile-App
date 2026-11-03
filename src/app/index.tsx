import { StyleSheet, Text, View } from 'react-native';

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deepbot-mini</Text>
      <Text style={styles.subtitle}>Your local records workspace and live API explorer.</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Included features</Text>
        <Text style={styles.cardText}>• CRUD records with local storage</Text>
        <Text style={styles.cardText}>• Search and category filtering</Text>
        <Text style={styles.cardText}>• Public API data screen</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eef4ff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },
});

export default Home;