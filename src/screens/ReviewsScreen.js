import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { useApp } from '../services/AppContext';
import { ScreenHeader, AnimatedScreen, EmptyState } from '../components';

export default function ReviewsScreen() {
  const { reviews, setCurrentScreen } = useApp();
  const [filterRating, setFilterRating] = useState('All'); // All, 5, 4, 3, 2, 1

  // Calculate stats
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1) : '5.0';

  // Calculate counts for breakdown
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    if (counts[r.rating] !== undefined) {
      counts[r.rating]++;
    }
  });

  const filteredReviews = reviews.filter(r => {
    if (filterRating === 'All') return true;
    return r.rating === parseInt(filterRating);
  });

  const renderStars = (rating) => {
    let stars = '';
    for (let i = 0; i < 5; i++) {
      stars += i < rating ? '★' : '☆';
    }
    return <Text style={styles.starString}>{stars}</Text>;
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScreenHeader
        title="Reviews & Ratings"
        backLabel="← Home"
        onBack={() => setCurrentScreen('DASHBOARD')}
      />

      <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.scrollContent}>
        <AnimatedScreen animation="fade">
          {/* Rating Overview Card */}
          <View style={globalStyles.card}>
            <View style={styles.overviewRow}>
              <View style={styles.bigRatingBox}>
                <Text style={styles.bigRatingText}>{averageRating}</Text>
                <View style={styles.starsRow}>{renderStars(Math.round(parseFloat(averageRating)))}</View>
                <Text style={styles.totalReviewsLabel}>{totalReviews} Reviews</Text>
              </View>

              {/* Progress breakdown */}
              <View style={styles.breakdownCol}>
                {[5, 4, 3, 2, 1].map(stars => {
                  const count = counts[stars] || 0;
                  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  return (
                    <View key={stars} style={styles.breakdownRow}>
                      <Text style={styles.breakdownStarLabel}>{stars} ★</Text>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${percentage}%` }]} />
                      </View>
                      <Text style={styles.breakdownCountLabel}>{count}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Filters */}
          <View style={styles.filterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              {['All', '5', '4', '3', '2', '1'].map(val => (
                <TouchableOpacity 
                  key={val} 
                  style={[styles.filterTab, filterRating === val ? styles.filterTabActive : null]}
                  onPress={() => setFilterRating(val)}
                >
                  <Text style={[styles.filterTabText, filterRating === val ? styles.filterTabTextActive : null]}>
                    {val === 'All' ? 'All Reviews' : `${val} ★`}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Reviews List */}
          <Text style={styles.sectionHeader}>Customer Testimonials</Text>
          {filteredReviews.length === 0 ? (
            <EmptyState
              icon="⭐"
              title="No reviews matching this filter"
            />
          ) : (
            filteredReviews.map(rev => (
              <View key={rev.id} style={globalStyles.card}>
                <View style={styles.reviewHeader}>
                  <View>
                    <Text style={styles.reviewAuthor}>{rev.author}</Text>
                    <Text style={styles.reviewService}>{rev.service}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <View style={styles.starContainer}>{renderStars(rev.rating)}</View>
                    <Text style={styles.reviewDate}>{rev.date}</Text>
                  </View>
                </View>
                <Text style={styles.reviewComment}>"{rev.comment}"</Text>
              </View>
            ))
          )}
        </AnimatedScreen>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 56,
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  backBtn: {
    paddingVertical: 5,
  },
  backBtnText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  headerTitle: {
    color: colors.textWhite,
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  overviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bigRatingBox: {
    alignItems: 'center',
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    width: '40%',
  },
  bigRatingText: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.secondary,
  },
  starsRow: {
    marginTop: 4,
  },
  starString: {
    color: colors.star,
    fontSize: 15,
    letterSpacing: 2,
  },
  totalReviewsLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 6,
    fontWeight: '600',
  },
  breakdownCol: {
    flex: 1,
    paddingLeft: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  breakdownStarLabel: {
    width: 25,
    fontSize: 11,
    fontWeight: '700',
    color: colors.textLight,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.background,
    borderRadius: 3,
    marginHorizontal: 8,
  },
  progressFill: {
    height: 6,
    backgroundColor: colors.star,
    borderRadius: 3,
  },
  breakdownCountLabel: {
    width: 15,
    fontSize: 11,
    textAlign: 'right',
    color: colors.textLight,
    fontWeight: '600',
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterScroll: {
    paddingVertical: 5,
  },
  filterTab: {
    backgroundColor: colors.card,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 99,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterTabText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: colors.textWhite,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.secondary,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginLeft: 4,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    color: colors.textLight,
    fontSize: 13,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
  },
  reviewService: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
  },
  reviewDate: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 3,
  },
  reviewComment: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 18,
    fontStyle: 'italic',
    marginTop: 4,
  },
  starContainer: {
    flexDirection: 'row',
  }
});
