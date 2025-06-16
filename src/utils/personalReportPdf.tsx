import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, pdf } from '@react-pdf/renderer';
import { Employee } from '@/types';

// Register fonts (optional - using default fonts for simplicity)
// Font.register({
//   family: 'Roboto',
//   src: 'path/to/Roboto-Regular.ttf'
// });

interface KPIData {
  totalEmployees: number;
  totalAssessments: number;
  averageScore: number;
  semangatAverage: number;
  competencyBreakdown: Record<string, number>;
  semangatBreakdown: Record<string, number>;
  recommendationCounts: Record<string, number>;
  bestPerformer: { name: string; score: number };
  promotionReadiness: number;
}

interface EmployeeWithData extends Employee {
  assessmentCount: number;
  averageScore: number;
  averageSemangat: number;
  latestRecommendation: string;
  level?: string;
}

interface ReportData {
  title: string;
  generatedAt: string;
  filters: {
    pin: string;
    location: string;
    division: string;
    searchTerm: string;
  };
  kpi: KPIData;
  employees: EmployeeWithData[];
}

// Create cleaner styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 3,
    borderBottomColor: '#2563EB',
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 3,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 12,
    textAlign: 'center',
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingHorizontal: 10,
  },
  filterLabel: {
    fontSize: 10,
    color: '#374151',
    width: '30%',
    fontWeight: 'bold',
  },
  filterValue: {
    fontSize: 10,
    color: '#1F2937',
    width: '70%',
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  kpiCard: {
    width: '48%',
    padding: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#DBEAFE',
    marginBottom: 8,
    textAlign: 'center',
  },
  kpiTitle: {
    fontSize: 9,
    color: '#1E40AF',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
  },
  summaryLabel: {
    fontSize: 9,
    color: '#475569',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  tableContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1E40AF',
    padding: 10,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 3,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    minHeight: 35,
    alignItems: 'center',
  },
  tableRowAlt: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    minHeight: 35,
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 8,
    color: '#374151',
    textAlign: 'center',
    paddingHorizontal: 3,
    flexWrap: 'wrap',
  },
  tableCellBold: {
    fontSize: 8,
    color: '#1F2937',
    textAlign: 'center',
    fontWeight: 'bold',
    paddingHorizontal: 3,
    flexWrap: 'wrap',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    textAlign: 'center',
    fontSize: 8,
    color: '#9CA3AF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    fontSize: 8,
    color: '#6B7280',
  },
});

// Helper function to chunk array for pagination
const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// PDF Document Component
export const PersonalReportDocument: React.FC<{ data: ReportData }> = ({ data }) => {
  // Split employees into chunks for pagination (25 per page)
  const employeeChunks = chunkArray(data.employees, 25);
  
  return (
    <Document>
      {/* Page 1: Summary and KPI */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>PERSONAL ASSESSMENT REPORT</Text>
          <Text style={styles.subtitle}>Generated: {new Date(data.generatedAt).toLocaleString('id-ID')}</Text>
          <Text style={styles.subtitle}>CRS - Competency Review System</Text>
        </View>

        {/* Applied Filters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APPLIED FILTERS</Text>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Assessment PIN:</Text>
            <Text style={styles.filterValue}>{data.filters.pin}</Text>
          </View>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Location:</Text>
            <Text style={styles.filterValue}>{data.filters.location}</Text>
          </View>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Division:</Text>
            <Text style={styles.filterValue}>{data.filters.division}</Text>
          </View>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Search Term:</Text>
            <Text style={styles.filterValue}>{data.filters.searchTerm}</Text>
          </View>
        </View>

        {/* KPI Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>KEY PERFORMANCE INDICATORS</Text>
          <View style={styles.kpiContainer}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiTitle}>Total Employees</Text>
              <Text style={styles.kpiValue}>{data.kpi.totalEmployees}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiTitle}>Total Assessments</Text>
              <Text style={styles.kpiValue}>{data.kpi.totalAssessments}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiTitle}>Average Competency</Text>
              <Text style={styles.kpiValue}>{data.kpi.averageScore.toFixed(2)}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiTitle}>Average Semangat</Text>
              <Text style={styles.kpiValue}>{data.kpi.semangatAverage.toFixed(2)}</Text>
            </View>
          </View>

          {/* Additional KPI Info */}
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Best Performer</Text>
              <Text style={styles.summaryValue}>{data.kpi.bestPerformer.name}</Text>
              <Text style={styles.summaryLabel}>Score: {data.kpi.bestPerformer.score.toFixed(2)}/5.0</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Promotion Readiness</Text>
              <Text style={styles.summaryValue}>{data.kpi.promotionReadiness.toFixed(1)}%</Text>
            </View>
          </View>
        </View>

        {/* Competency Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>COMPETENCY BREAKDOWN</Text>
          <View style={styles.summaryGrid}>
            {Object.entries(data.kpi.competencyBreakdown).map(([category, score]) => (
              <View key={category} style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>{category}</Text>
                <Text style={styles.summaryValue}>{(score as number).toFixed(2)}/5.0</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recommendation Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RECOMMENDATION DISTRIBUTION</Text>
          <View style={styles.summaryGrid}>
            {Object.entries(data.kpi.recommendationCounts).map(([rec, count]) => (
              <View key={rec} style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>{rec}</Text>
                <Text style={styles.summaryValue}>{count} employees</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Personal Assessment Report | Generated by CRS System
        </Text>
        <Text style={styles.pageNumber}>Page 1</Text>
      </Page>

      {/* Employee Data Pages */}
      {employeeChunks.map((chunk, chunkIndex) => (
        <Page key={chunkIndex} size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>EMPLOYEE ASSESSMENT DETAILS</Text>
            <Text style={styles.subtitle}>
              Showing {chunkIndex * 25 + 1} - {Math.min((chunkIndex + 1) * 25, data.employees.length)} of {data.employees.length} employees
            </Text>
          </View>

          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Name</Text>
              <Text style={[styles.tableHeaderCell, { width: '12%' }]}>Level</Text>
              <Text style={[styles.tableHeaderCell, { width: '18%' }]}>Position</Text>
              <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Competency</Text>
              <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Semangat</Text>
              <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Total Assessment</Text>
            </View>

            {/* Table Rows */}
            {chunk.map((employee, index) => (
              <View 
                key={employee.id} 
                style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
              >
                <Text style={[styles.tableCell, { width: '20%' }]}>{employee.name}</Text>
                <Text style={[styles.tableCell, { width: '12%' }]}>{employee.level || 'N/A'}</Text>
                <Text style={[styles.tableCell, { width: '18%' }]}>{employee.position}</Text>
                <Text style={[styles.tableCellBold, { width: '15%' }]}>
                  {employee.averageScore.toFixed(2)}/5.0
                </Text>
                <Text style={[styles.tableCellBold, { width: '15%' }]}>
                  {employee.averageSemangat.toFixed(2)}/5.0
                </Text>
                <Text style={[styles.tableCellBold, { width: '20%' }]}>
                  {employee.assessmentCount} assessment{employee.assessmentCount !== 1 ? 's' : ''}
                </Text>
              </View>
            ))}
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            Personal Assessment Report | Generated by CRS System
          </Text>
          <Text style={styles.pageNumber}>Page {chunkIndex + 2}</Text>
        </Page>
      ))}

      {/* Semangat Analysis Page (if data available) */}
      {Object.keys(data.kpi.semangatBreakdown).length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>SEMANGAT ANALYSIS</Text>
            <Text style={styles.subtitle}>Detailed breakdown of work spirit evaluation</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SEMANGAT SCORE BREAKDOWN</Text>
            <View style={styles.summaryGrid}>
              {Object.entries(data.kpi.semangatBreakdown).map(([question, score]) => (
                <View key={question} style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>{question}</Text>
                  <Text style={styles.summaryValue}>{(score as number).toFixed(2)}/5.0</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PERFORMANCE INSIGHTS</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Overall Semangat Health</Text>
                <Text style={styles.summaryValue}>
                  {data.kpi.semangatAverage >= 4.0 ? 'Excellent' : 
                   data.kpi.semangatAverage >= 3.5 ? 'Good' : 
                   data.kpi.semangatAverage >= 3.0 ? 'Average' : 'Needs Improvement'}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Balance Assessment</Text>
                <Text style={styles.summaryValue}>
                  {Math.abs(data.kpi.averageScore - data.kpi.semangatAverage) < 0.3 ? 'Well Balanced' : 
                   data.kpi.averageScore > data.kpi.semangatAverage ? 'Skills > Motivation' : 'Motivation > Skills'}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Recommended Action</Text>
                <Text style={styles.summaryValue}>
                  {data.kpi.semangatAverage < 3.5 ? 'Focus on motivation programs' : 
                   data.kpi.averageScore < 3.5 ? 'Focus on skill development' : 'Continue current approach'}
                </Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            Personal Assessment Report | Generated by CRS System
          </Text>
          <Text style={styles.pageNumber}>Page {employeeChunks.length + 2}</Text>
        </Page>
      )}
    </Document>
  );
};

// Function to generate and download PDF
export const generatePersonalReportPDF = async (data: ReportData): Promise<Blob> => {
  const doc = <PersonalReportDocument data={data} />;
  const blob = await pdf(doc).toBlob();
  return blob;
};

// Helper function to download the generated PDF
export const downloadPersonalReportPDF = async (data: ReportData, filename?: string) => {
  try {
    const blob = await generatePersonalReportPDF(data);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `Personal_Assessment_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}; 