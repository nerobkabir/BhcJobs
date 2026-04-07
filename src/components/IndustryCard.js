import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const IndustryCard = ({ item }) => {
  const label = item?.name || item?.title || 'Industry';
  const jobCount = item?.jobs_count ?? item?.job_count ?? 0;
  const imageUrl = item?.image
    ? `https://dev.bhcjobs.com/storage/industry-image/${item.image}`
    : null;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.75}>
      <View style={styles.imgWrapper}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.img} resizeMode="cover" />
        ) : (
          <Text style={styles.fallbackText}>{label.charAt(0)}</Text>
        )}
      </View>
      <Text style={styles.label} numberOfLines={2}>{label}</Text>
      <Text style={styles.count}>{jobCount} Jobs</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginRight: 12,
    width: 110,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  imgWrapper: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#e8f0f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  img: {
    width: 56,
    height: 56,
  },
  fallbackText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a3c5e',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a3c5e',
    textAlign: 'center',
    marginBottom: 4,
  },
  count: {
    fontSize: 11,
    color: '#888',
  },
});

export default IndustryCard;