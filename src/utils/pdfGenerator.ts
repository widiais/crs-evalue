import { Employee, Assessment } from '@/types';

interface AccumulatedStats {
  totalAssessments: number;
  averageScore: number;
  competencyBreakdown: Record<string, number>;
  semangatAverage: number;
  semangatBreakdown: Record<string, number>;
  recommendationCounts: Record<string, number>;
  bestScore: number;
  worstScore: number;
  latestRecommendation: string;
}

export const generateEmployeePDF = async (
  employee: Employee,
  accumulatedStats: AccumulatedStats,
  selectedAssessment: string,
  assessments: Assessment[]
) => {
  // Import React and PDF renderer dynamically
  const React = (await import('react')).default;
  const { pdf, Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer');
  
  // Define compact styles for single page
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      padding: 20,
      fontFamily: 'Helvetica',
      fontSize: 9,
    },
    header: {
      marginBottom: 12,
      padding: 12,
      backgroundColor: '#f8fafc',
      borderRadius: 4,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 10,
      color: '#6b7280',
      marginBottom: 2,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
      gap: 8,
    },
    statCard: {
      flex: 1,
      padding: 8,
      backgroundColor: '#f8fafc',
      borderRadius: 4,
      alignItems: 'center',
    },
    statLabel: {
      fontSize: 7,
      color: '#6b7280',
      marginBottom: 2,
    },
    statValue: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#1f2937',
    },
    sectionContainer: {
      marginBottom: 10,
      padding: 10,
      backgroundColor: '#f8fafc',
      borderRadius: 4,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: 6,
    },
    breakdownGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
    },
    breakdownItemCompact: {
      width: '48%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 3,
      padding: 6,
      backgroundColor: '#ffffff',
      borderRadius: 3,
    },
    breakdownItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
      padding: 6,
      backgroundColor: '#ffffff',
      borderRadius: 3,
    },
    breakdownLabel: {
      fontSize: 8,
      color: '#374151',
      fontWeight: 'bold',
      flex: 1,
    },
    breakdownScore: {
      fontSize: 8,
      color: '#ffffff',
      backgroundColor: '#10b981',
      padding: '2 6',
      borderRadius: 8,
      textAlign: 'center',
      minWidth: 28,
    },
    footer: {
      marginTop: 10,
      padding: 8,
      backgroundColor: '#f3f4f6',
      borderRadius: 4,
    },
    footerText: {
      fontSize: 7,
      color: '#6b7280',
      textAlign: 'center',
    },
  });

  const selectedAssessmentData = assessments.find(a => a.id === selectedAssessment);

  // Create PDF Document with compact layout
  const MyDocument = React.createElement(Document, {}, 
    React.createElement(Page, { size: 'A4', style: styles.page }, [
      // Header
      React.createElement(View, { key: 'header', style: styles.header }, [
        React.createElement(Text, { key: 'title', style: styles.title }, employee.name),
        React.createElement(Text, { key: 'subtitle1', style: styles.subtitle }, 
          `${employee.position} • ${employee.location}${employee.division ? ` • ${employee.division}` : ''}`
        ),
        React.createElement(Text, { key: 'subtitle2', style: styles.subtitle }, 
          'Detail laporan penilaian assessment'
        ),
      ]),

      // Statistics (Compact Row)
      React.createElement(View, { key: 'stats', style: styles.statsContainer }, [
        React.createElement(View, { key: 'stat1', style: styles.statCard }, [
          React.createElement(Text, { key: 'label1', style: styles.statLabel }, 'Total'),
          React.createElement(Text, { key: 'value1', style: styles.statValue }, accumulatedStats.totalAssessments.toString())
        ]),
        React.createElement(View, { key: 'stat2', style: styles.statCard }, [
          React.createElement(Text, { key: 'label2', style: styles.statLabel }, 'Avg Score'),
          React.createElement(Text, { key: 'value2', style: styles.statValue }, accumulatedStats.averageScore.toFixed(1))
        ]),
        React.createElement(View, { key: 'stat3', style: styles.statCard }, [
          React.createElement(Text, { key: 'label3', style: styles.statLabel }, 'Tertinggi'),
          React.createElement(Text, { key: 'value3', style: styles.statValue }, accumulatedStats.bestScore.toFixed(1))
        ]),
        React.createElement(View, { key: 'stat4', style: styles.statCard }, [
          React.createElement(Text, { key: 'label4', style: styles.statLabel }, 'Semangat'),
          React.createElement(Text, { key: 'value4', style: styles.statValue }, accumulatedStats.semangatAverage.toFixed(1))
        ])
      ]),

      // Two column layout for breakdowns
      React.createElement(View, { key: 'content', style: { flexDirection: 'row', gap: 8 } }, [
        // Left Column
        React.createElement(View, { key: 'left-col', style: { flex: 1 } }, [
          // Competency Breakdown
          Object.keys(accumulatedStats.competencyBreakdown).length > 0 ? 
            React.createElement(View, { key: 'competency', style: styles.sectionContainer }, [
              React.createElement(Text, { key: 'competency-title', style: styles.sectionTitle }, 'Kompetensi'),
              ...Object.entries(accumulatedStats.competencyBreakdown).map(([category, score], index) =>
                React.createElement(View, { key: `comp-${index}`, style: styles.breakdownItem }, [
                  React.createElement(Text, { key: `comp-label-${index}`, style: styles.breakdownLabel }, 
                    category.length > 25 ? category.substring(0, 25) + '...' : category
                  ),
                  React.createElement(Text, { key: `comp-score-${index}`, style: styles.breakdownScore }, score.toFixed(1))
                ])
              )
            ]) : null,
        ]),

        // Right Column  
        React.createElement(View, { key: 'right-col', style: { flex: 1 } }, [
          // Semangat Breakdown
          Object.keys(accumulatedStats.semangatBreakdown).length > 0 ? 
            React.createElement(View, { key: 'semangat', style: styles.sectionContainer }, [
              React.createElement(Text, { key: 'semangat-title', style: styles.sectionTitle }, 'Semangat'),
              ...Object.entries(accumulatedStats.semangatBreakdown).map(([question, score], index) =>
                React.createElement(View, { key: `sem-${index}`, style: styles.breakdownItem }, [
                  React.createElement(Text, { key: `sem-label-${index}`, style: styles.breakdownLabel }, 
                    question.length > 25 ? question.substring(0, 25) + '...' : question
                  ),
                  React.createElement(Text, { key: `sem-score-${index}`, style: styles.breakdownScore }, score.toFixed(1))
                ])
              )
            ]) : null,
        ])
      ]),

      // Recommendation Counts (Full Width, Compact)
      Object.keys(accumulatedStats.recommendationCounts).length > 0 ? 
        React.createElement(View, { key: 'recommendations', style: styles.sectionContainer }, [
          React.createElement(Text, { key: 'rec-title', style: styles.sectionTitle }, 'Rekomendasi'),
          React.createElement(View, { key: 'rec-grid', style: styles.breakdownGrid }, 
            Object.entries(accumulatedStats.recommendationCounts)
              .filter(([_, count]) => count > 0)
              .map(([recommendation, count], index) =>
                React.createElement(View, { key: `rec-${index}`, style: styles.breakdownItemCompact }, [
                  React.createElement(Text, { key: `rec-label-${index}`, style: styles.breakdownLabel }, 
                    recommendation.length > 20 ? recommendation.substring(0, 20) + '...' : recommendation
                  ),
                  React.createElement(Text, { key: `rec-score-${index}`, style: styles.breakdownScore }, count.toString())
                ])
              )
          )
        ]) : null,

      // Footer (Compact)
      React.createElement(View, { key: 'footer', style: styles.footer }, [
        React.createElement(Text, { key: 'footer1', style: styles.footerText }, 
          `CRS E-Value Report • ${new Date().toLocaleDateString('id-ID')}`
        )
      ])
    ].filter(Boolean))
  );

  // Generate PDF and return blob
  const asPdf = pdf(MyDocument);
  return await asPdf.toBlob();
}; 