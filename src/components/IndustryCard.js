import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// icon map -- add more as needed based on industry names from API
const INDUSTRY_ICONS = {
  Construction: 'hammer-wrench',
  Hotel: 'bed',
  Agriculture: 'sprout',
  Factory: 'factory',
  Restaurant: 'food',
  Cafes: 'coffee',
  Facilities: 'office-building-cog',
  Contracting: 'tools',
  default: 'briefcase',
};

const getIcon = (name = '') => {
  const key = Object.keys(INDUSTRY_ICONS).find((k) =>
    name.toLowerCase().includes(k.toLowerCase())
  );
  return INDUSTRY_ICONS[key] || INDUSTRY_ICONS.default;
};

const IndustryCard = ({ item }) => {
  const iconName = getIcon(item?.name || item?.title || '');
  const label = item?.name || item?.title || 'Industry';
  const jobCount = item?.jobs_count ?? item?.job_count ?? item?.jobs ?? 0;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.75}>
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons name={iconName} size={26} color="#1a3c5e" />
      </View>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
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
  iconWrapper: {
    backgroundColor: '#e8f0f8',
    borderRadius: 50,
    padding: 12,
    marginBottom: 8,
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