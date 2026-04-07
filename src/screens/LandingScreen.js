import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getIndustries, getJobs, getCompanies } from '../services/api';
import IndustryCard from '../components/IndustryCard';
import JobCard from '../components/JobCard';
import CompanyCard from '../components/CompanyCard';

const { width } = Dimensions.get('window');

const LandingScreen = ({ navigation }) => {
  const [industries, setIndustries] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fetchAllData = async () => {
  try {
    const [industryRes, jobRes, companyRes] = await Promise.all([
      getIndustries(),
      getJobs(),
      getCompanies(),
    ]);

    // helper — API response get arry
    const extractArray = (res) => {
      if (!res.success) return [];
      const d = res.data;
      const candidates = [
        d?.data?.data, d?.data, d?.industries, d?.jobs,
        d?.companies, d?.industry, d?.job, d?.company, d,
      ];
      for (const c of candidates) {
        if (Array.isArray(c) && c.length > 0) return c;
      }
      return [];
    };

    const industryList = extractArray(industryRes);
    const jobList = extractArray(jobRes);
    const companyList = extractArray(companyRes);

    // debug — API structure
    console.log('Industry sample:', JSON.stringify(industryList[0]));
    console.log('Job sample:', JSON.stringify(jobList[0]));
    console.log('Company sample:', JSON.stringify(companyList[0]));

    setIndustries(industryList);
    setJobs(jobList);
    setCompanies(companyList);

  } catch (err) {
    console.log('fetchAllData error:', err);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  useEffect(() => {
    fetchAllData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAllData();
  }, []);

  // filter jobs by search text
  const filteredJobs = jobs.filter((job) => {
    const title = job?.title || job?.job_title || '';
    const company = job?.company?.name || job?.company_name || '';
    const q = searchText.toLowerCase();
    return title.toLowerCase().includes(q) || company.toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a3c5e" />
        <Text style={styles.loadingText}>Loading BhcJobs...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1a3c5e']} />
        }
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerBrand}>BhcJobs</Text>
            <Text style={styles.headerTagline}>#1 Platform for Saudi Jobs</Text>
          </View>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>
        </View>

        {/* ── Hero / Banner ── */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <MaterialCommunityIcons name="star-circle" size={14} color="#f4c842" />
            <Text style={styles.heroBadgeText}>Verified Employers</Text>
          </View>
          <Text style={styles.heroTitle}>
            Find Your Dream Job{'\n'}in Saudi Arabia
          </Text>
          <Text style={styles.heroSubtitle}>
            Connecting Bangladeshi workforce with high-demand Saudi jobs
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{jobs.length}+</Text>
              <Text style={styles.statLabel}>Jobs Listed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{companies.length}+</Text>
              <Text style={styles.statLabel}>Companies</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{industries.length}+</Text>
              <Text style={styles.statLabel}>Industries</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.85}
          >
            <Text style={styles.registerBtnText}>Create Account – It's Free</Text>
            <MaterialCommunityIcons name="arrow-right" size={18} color="#1a3c5e" />
          </TouchableOpacity>
        </View>

        {/* ── Search ── */}
        <View style={styles.searchWrapper}>
          <MaterialCommunityIcons name="magnify" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs or companies..."
            placeholderTextColor="#aaa"
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <MaterialCommunityIcons name="close-circle" size={18} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Popular Industries ── */}
        {industries.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Industries</Text>
              <Text style={styles.seeAll}>See All</Text>
            </View>
            <FlatList
              data={industries}
              keyExtractor={(item, index) => String(item?.id || index)}
              renderItem={({ item }) => <IndustryCard item={item} />}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}
            />
          </View>
        )}

        {/* ── Recommended Jobs ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {searchText ? `Results for "${searchText}"` : 'Recommended Jobs'}
            </Text>
            <Text style={styles.seeAll}>See All</Text>
          </View>
          <View style={styles.jobsWrapper}>
            {filteredJobs.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="briefcase-search" size={40} color="#ccc" />
                <Text style={styles.emptyText}>
                  {searchText ? 'No jobs found' : 'No jobs available right now'}
                </Text>
              </View>
            ) : (
              filteredJobs.slice(0, 8).map((job, index) => (
                <JobCard key={job?.id || index} item={job} />
              ))
            )}
          </View>
        </View>

        {/* ── Popular Companies ── */}
        {companies.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Companies</Text>
              <Text style={styles.seeAll}>See All</Text>
            </View>
            <FlatList
              data={companies}
              keyExtractor={(item, index) => String(item?.id || index)}
              renderItem={({ item }) => <CompanyCard item={item} />}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}
            />
          </View>
        )}

        {/* ── CTA Footer ── */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to start your journey?</Text>
          <Text style={styles.ctaSubtitle}>
            Register now and apply to hundreds of verified Saudi jobs
          </Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaBtnText}>Get Started</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#1a3c5e',
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f6fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f6fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#555',
  },

  // Header
  header: {
    backgroundColor: '#1a3c5e',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerBrand: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  headerTagline: {
    fontSize: 11,
    color: '#a8c6e0',
    marginTop: 2,
  },
  loginBtn: {
    borderWidth: 1.5,
    borderColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  loginBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  // Hero
  hero: {
    backgroundColor: '#1a3c5e',
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244,200,66,0.15)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginBottom: 12,
    gap: 5,
  },
  heroBadgeText: {
    color: '#f4c842',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 34,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#a8c6e0',
    lineHeight: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  statLabel: {
    fontSize: 11,
    color: '#a8c6e0',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  registerBtn: {
    backgroundColor: '#f4c842',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  registerBtnText: {
    color: '#1a3c5e',
    fontWeight: '800',
    fontSize: 15,
    marginRight: 6,
  },

  // Search
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: -16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },

  // Sections
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  seeAll: {
    fontSize: 13,
    color: '#1a3c5e',
    fontWeight: '600',
  },
  jobsWrapper: {
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 10,
  },

  // CTA
  ctaSection: {
    backgroundColor: '#1a3c5e',
    margin: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 28,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 13,
    color: '#a8c6e0',
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 19,
  },
  ctaBtn: {
    backgroundColor: '#f4c842',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  ctaBtnText: {
    color: '#1a3c5e',
    fontWeight: '800',
    fontSize: 15,
  },
});

export default LandingScreen;