import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { fetchProducts, type ApiProduct } from '@/api/products';

export default function ApiDataScreen() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async (isRefresh = false) => {
    const controller = new AbortController();

    if (!isRefresh) {
      setLoading(true);
    }

    try {
      const data = await fetchProducts(controller.signal);
      setProducts(data);
      setError(null);
    } catch (loadError: unknown) {
      if (typeof loadError === 'object' && loadError !== null && 'name' in loadError) {
        const err = loadError as { name?: string; code?: string };
        if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
          return;
        }
      }

      setError('The API could not load right now. Please retry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }

    return () => controller.abort();
  }, []);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      if (!active) {
        return;
      }

      const cleanup = await loadProducts(false);
      if (cleanup) {
        cleanup();
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [loadProducts]);

  const retryLoad = () => {
    if (loading) {
      return;
    }

    loadProducts(false);
  };

  const renderItem = ({ item }: { item: ApiProduct }) => (
    <View style={styles.card}>
      {item.thumbnail ? <Image source={{ uri: item.thumbnail }} style={styles.image} /> : null}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.meta}>{item.brand} • {item.category}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.row}>
        <Text style={styles.price}>${item.price}</Text>
        <Text style={styles.rating}>★ {item.rating}</Text>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.stateText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={retryLoad}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>API Data</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadProducts(true);
            }}
            tintColor="#2563eb"
          />
        }
        ListEmptyComponent={<Text style={styles.emptyText}>No items available.</Text>}
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
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#111827',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#e2e8f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontWeight: '700',
    color: '#1d4ed8',
    fontSize: 15,
  },
  rating: {
    color: '#f59e0b',
    fontWeight: '700',
  },
  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fb',
  },
  stateText: {
    marginTop: 12,
    fontSize: 16,
    color: '#475569',
  },
  errorText: {
    fontSize: 16,
    color: '#b91c1c',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  retryText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    color: '#475569',
    fontSize: 15,
    paddingVertical: 24,
  },
});
