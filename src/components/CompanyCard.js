import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CompanyCard = ({ item }) => {
  const name = item?.name || item?.company_name || 'Company';
  const jobCount = item?.jobs_count ?? item?.job_count ?? item?.jobs ?? 0;

  // pick a background based on first letter for variety
  const colors = ['#1a3c5e', '#2a7d4f', '#c0392b', '#8e44ad', '#d35400', '#16a085'];
  const colorIndex = name.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.75}>
      <View style={[styles.avatar, { backgroundColor: bgColor }]}>
        <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {name}
      </Text>
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
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