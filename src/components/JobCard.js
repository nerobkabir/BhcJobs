import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const JobCard = ({ item }) => {
  const title = item?.job_title || item?.title || 'Job Title';
  const company = item?.company?.name || item?.company_name || 'Company';
  const location = item?.country?.name || item?.city?.name || 'Saudi Arabia';
  const industry = item?.industry_name || item?.company?.industry?.name || '';
  const type = item?.type || '';

  const minSalary = item?.min_salary;
  const maxSalary = item?.max_salary;
  const currency = item?.currency || 'SAR';

  const salaryText = minSalary && maxSalary
    ? `${currency} ${minSalary} - ${maxSalary}`
    : minSalary
      ? `${currency} ${minSalary}`
      : '';

  const deadline = item?.expiry || item?.deadline || '';
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.logoPlaceholder}>
          {item?.company?.image ? (
            <Image
              source={{ uri: `https://dev.bhcjobs.com/storage/company-image/${item.company.image}` }}
              style={{ width: 44, height: 44, borderRadius: 10 }}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.logoText}>{company.charAt(0)}</Text>
          )}
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.company} numberOfLines={1}>{company}</Text>
        </View>
        {!!type && (
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{type.toUpperCase()}</Text>
          </View>
        )}
      </View>

      {!!salaryText && (
        <View style={styles.row}>
          <MaterialCommunityIcons name="cash" size={14} color="#2a7d4f" />
          <Text style={styles.salary}>{salaryText} / month</Text>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.tag}>
          <MaterialCommunityIcons name="map-marker" size={12} color="#1a3c5e" />
          <Text style={styles.tagText}>{location}</Text>
        </View>
        {!!industry && (
          <View style={styles.industryTag}>
            <Text style={styles.industryText}>{industry}</Text>
          </View>
        )}
      </View>

      {!!deadline && (
        <Text style={styles.deadline}>Deadline: {formatDate(deadline)}</Text>
      )}

      <TouchableOpacity style={styles.applyBtn} activeOpacity={0.85}>
        <Text style={styles.applyText}>Apply Now</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#1a3c5e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  company: {
    fontSize: 13,
    color: '#666',
  },
  typeBadge: {
    backgroundColor: '#fff3e0',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  typeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#e65100',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  salary: {
    fontSize: 13,
    color: '#2a7d4f',
    fontWeight: '600',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f0f8',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 3,
  },
  tagText: {
    fontSize: 11,
    color: '#1a3c5e',
    fontWeight: '600',
    marginLeft: 2,
  },
  industryTag: {
    backgroundColor: '#f3e5f5',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  industryText: {
    fontSize: 11,
    color: '#6a1b9a',
    fontWeight: '500',
  },
  deadline: {
    fontSize: 11,
    color: '#e05c2e',
    fontWeight: '500',
    marginBottom: 10,
  },
  applyBtn: {
    backgroundColor: '#1a3c5e',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  applyText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default JobCard;