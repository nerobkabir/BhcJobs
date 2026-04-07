import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const CompanyCard = ({ item }) => {
  const name = item?.name || 'Company';
  const jobCount = item?.jobs_count ?? item?.job_count ?? 0;
  const imageUrl = item?.image
    ? `https://dev.bhcjobs.com/storage/company-image/${item.image}`
    : null;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.75}>
      <View style={styles.imgWrapper}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.img} resizeMode="contain" />
        ) : (
          <Text style={styles.fallbackText}>{name.charAt(0)}</Text>
        )}
      </View>
      <Text style={styles.name} numberOfLines={2}>{name}</Text>
      <Text style={styles.jobs}>{jobCount} Jobs</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginRight: 12,
    width: 120,
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
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
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
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a2e',
    textAlign: 'center',
    marginBottom: 4,
  },
  jobs: {
    fontSize: 11,
    color: '#888',
  },
});

export default CompanyCard;