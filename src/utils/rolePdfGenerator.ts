// Role Statistics interface
interface RoleStats {
  position: string;
  totalEmployees: number;
  totalAssessments: number;
  averageScore: number;
  topPerformer: string;
  topPerformerScore: number;
  skillsGap: string[];
  promotionReadiness: number;
  competencyBreakdown: Record<string, number>;
  semangatBreakdown: Record<string, number>;
  recommendationCounts: Record<string, number>;
  semangatAverage: number;
  employeeList: string[];
}

export const generateRoleReportPDF = async (roleStats: RoleStats[], selectedRole: string): Promise<Blob> => {
  // Dynamic import to avoid SSR issues
  const { pdf, Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer');
  const React = await import('react');

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      padding: 20,
      fontSize: 8,
      fontFamily: 'Helvetica',
    },
    header: {
      marginBottom: 20,
      paddingBottom: 10,
      borderBottomWidth: 2,
      borderBottomColor: '#8b5cf6',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 10,
      color: '#6b7280',
      marginBottom: 2,
    },
    section: {
      marginBottom: 15,
      padding: 8,
      backgroundColor: '#f9fafb',
      borderRadius: 4,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#374151',
      marginBottom: 8,
    },
    row: {
      flexDirection: 'row',
      marginBottom: 4,
    },
    twoColumn: {
      flexDirection: 'row',
      width: '100%',
    },
    column: {
      flex: 1,
      marginRight: 10,
    },
    label: {
      fontSize: 8,
      color: '#4b5563',
      width: '40%',
    },
    value: {
      fontSize: 8,
      color: '#111827',
      fontWeight: 'bold',
      width: '60%',
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    gridItem: {
      width: '48%',
      marginBottom: 4,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 2,
      paddingHorizontal: 4,
      backgroundColor: '#ffffff',
      borderRadius: 2,
    },
    gridLabel: {
      fontSize: 7,
      color: '#6b7280',
      flex: 1,
    },
    gridValue: {
      fontSize: 7,
      color: '#111827',
      fontWeight: 'bold',
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 4,
    },
    skillItem: {
      fontSize: 7,
      color: '#f59e0b',
      marginRight: 8,
      marginBottom: 2,
    },
    footer: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      textAlign: 'center',
      fontSize: 7,
      color: '#9ca3af',
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: '#e5e7eb',
    },
  });

  const RoleReportPDF = () => React.createElement(Document, null,
    React.createElement(Page, { size: "A4", style: styles.page },
      // Header
      React.createElement(View, { style: styles.header },
        React.createElement(Text, { style: styles.title }, "Role Assessment Report"),
        React.createElement(Text, { style: styles.subtitle }, 
          selectedRole ? `Role: ${selectedRole}` : 'All Roles'
        ),
        React.createElement(Text, { style: styles.subtitle }, 
          `Generated on: ${new Date().toLocaleDateString('id-ID')}`
        )
      ),

      // Role Statistics
      ...roleStats.map((stats, index) =>
        React.createElement(View, { key: index, style: styles.section },
          React.createElement(Text, { style: styles.sectionTitle }, stats.position),
          
          // Basic Stats
          React.createElement(View, { style: styles.twoColumn },
            React.createElement(View, { style: styles.column },
              React.createElement(View, { style: styles.row },
                React.createElement(Text, { style: styles.label }, "Total Employees:"),
                React.createElement(Text, { style: styles.value }, stats.totalEmployees.toString())
              ),
              React.createElement(View, { style: styles.row },
                React.createElement(Text, { style: styles.label }, "Total Assessments:"),
                React.createElement(Text, { style: styles.value }, stats.totalAssessments.toString())
              ),
              React.createElement(View, { style: styles.row },
                React.createElement(Text, { style: styles.label }, "Promotion Ready:"),
                React.createElement(Text, { style: styles.value }, `${stats.promotionReadiness}%`)
              )
            ),
            React.createElement(View, { style: styles.column },
              React.createElement(View, { style: styles.row },
                React.createElement(Text, { style: styles.label }, "Average Score:"),
                React.createElement(Text, { style: styles.value }, stats.averageScore.toFixed(1))
              ),
              React.createElement(View, { style: styles.row },
                React.createElement(Text, { style: styles.label }, "Semangat Average:"),
                React.createElement(Text, { style: styles.value }, stats.semangatAverage.toFixed(1))
              ),
              React.createElement(View, { style: styles.row },
                React.createElement(Text, { style: styles.label }, "Top Performer:"),
                React.createElement(Text, { style: styles.value }, `${stats.topPerformer} (${stats.topPerformerScore.toFixed(1)})`)
              )
            )
          ),

          // Skills Gap
          React.createElement(View, { style: { marginTop: 8 } },
            React.createElement(Text, { style: { fontSize: 9, fontWeight: 'bold', marginBottom: 4 } }, "Skills Gap:"),
            React.createElement(View, { style: styles.skillsContainer },
              ...stats.skillsGap.map((skill, skillIndex) =>
                React.createElement(Text, { key: skillIndex, style: styles.skillItem }, `• ${skill}`)
              )
            )
          ),

          // Competency Breakdown
          Object.keys(stats.competencyBreakdown).length > 0 &&
          React.createElement(View, { style: { marginTop: 8 } },
            React.createElement(Text, { style: { fontSize: 9, fontWeight: 'bold', marginBottom: 4 } }, "Competency Breakdown:"),
            React.createElement(View, { style: styles.gridContainer },
              ...Object.entries(stats.competencyBreakdown).map(([competency, score]) =>
                React.createElement(View, { key: competency, style: styles.gridItem },
                  React.createElement(Text, { style: styles.gridLabel }, 
                    competency.length > 25 ? competency.substring(0, 25) + '...' : competency
                  ),
                  React.createElement(Text, { style: styles.gridValue }, score.toFixed(1))
                )
              )
            )
          ),

          // Semangat Breakdown
          Object.keys(stats.semangatBreakdown).length > 0 &&
          React.createElement(View, { style: { marginTop: 8 } },
            React.createElement(Text, { style: { fontSize: 9, fontWeight: 'bold', marginBottom: 4 } }, "Semangat Breakdown:"),
            React.createElement(View, { style: styles.gridContainer },
              ...Object.entries(stats.semangatBreakdown).map(([question, score]) =>
                React.createElement(View, { key: question, style: styles.gridItem },
                  React.createElement(Text, { style: styles.gridLabel }, 
                    question.length > 25 ? question.substring(0, 25) + '...' : question
                  ),
                  React.createElement(Text, { style: styles.gridValue }, score.toFixed(1))
                )
              )
            )
          ),

          // Recommendation Counts
          Object.keys(stats.recommendationCounts).length > 0 &&
          React.createElement(View, { style: { marginTop: 8 } },
            React.createElement(Text, { style: { fontSize: 9, fontWeight: 'bold', marginBottom: 4 } }, "Recommendations:"),
            React.createElement(View, { style: styles.gridContainer },
              ...Object.entries(stats.recommendationCounts)
                .filter(([, count]) => count > 0)
                .map(([recommendation, count]) =>
                  React.createElement(View, { key: recommendation, style: styles.gridItem },
                    React.createElement(Text, { style: styles.gridLabel }, 
                      recommendation.length > 20 ? recommendation.substring(0, 20) + '...' : recommendation
                    ),
                    React.createElement(Text, { style: styles.gridValue }, count.toString())
                  )
                )
            )
          )
        )
      ),

      // Footer
      React.createElement(Text, { style: styles.footer }, "CRS Assessment System - Role Report")
    )
  );

  const doc = React.createElement(RoleReportPDF);
  return await pdf(doc).toBlob();
}; 