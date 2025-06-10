import { db } from '@/services/firebase';
import { employeeService } from '@/services/employees';
import { assessmentService } from '@/services/assessments';
import { locationService } from '@/services/locations';
import { templateService } from '@/services/templates';
import { divisionService } from '@/services/divisions';

export async function seedInitialData() {
  console.log('🌱 Starting data seeding process...');
  
  try {
    // Seed in order of dependency
    await seedSampleTemplates(); // Templates first
    await seedSampleDivisions(); // Then divisions
    await seedSampleLocations(); // Then locations
    await seedSampleEmployees(); // Then employees
    await seedSampleAssessments(); // Finally assessments that reference templates
    
    console.log('🎉 All sample data seeded successfully!');
  } catch (error) {
    console.error('💥 Error during seeding process:', error);
    throw error;
  }
}

async function seedSampleDivisions() {
  try {
    // Check if divisions already exist
    const existingDivisions = await divisionService.getAllDivisions();
    
    // Only count real Firebase divisions (not mock ones)
    const realDivisions = existingDivisions.filter(d => 
      !['HRD', 'Finance', 'Operations'].includes(d.name)
    );
    
    if (realDivisions.length > 0) {
      console.log('Sample divisions already exist in Firebase');
      return;
    }

    await divisionService.seedSampleDivisions();
    console.log('✅ Sample divisions seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding sample divisions:', error);
  }
}

async function seedSampleLocations() {
  try {
    // Check if locations already exist
    const existingLocations = await locationService.getAllLocations();
    
    // Only count real Firebase locations (not mock ones) 
    const realLocations = existingLocations.filter(l => 
      !['LC Margahayu', 'LC Dago'].includes(l.name)
    );
    
    if (realLocations.length > 0) {
      console.log('Sample locations already exist in Firebase');
      return;
    }

    await locationService.seedLocations();
    console.log('✅ Sample locations seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding sample locations:', error);
  }
}

async function seedSampleAssessments() {
  try {
    // Check if assessments already exist
    const existingAssessments = await assessmentService.getAllAssessments();
    
    // Only count real Firebase assessments (not mock ones)
    const realAssessments = existingAssessments.filter(a => 
      !a.id.startsWith('assessment_001') && !a.id.startsWith('assessment_002')
    );
    
    if (realAssessments.length > 0) {
      console.log('Sample assessments already exist in Firebase');
      return;
    }

    const sampleAssessments = [
      {
        title: 'Performance Review Q4 2024',
        templateIds: ['template_supervisor'],
        pin: 'PERF2024',
        isActive: true,
        createdAt: new Date(),
        createdBy: 'admin'
      },
      {
        title: 'Leadership Assessment Jan 2024',
        templateIds: ['template_team_leader'],
        pin: 'LEAD2024',
        isActive: true,
        createdAt: new Date(),
        createdBy: 'admin'
      },
      {
        title: 'Team Evaluation December 2024',
        templateIds: ['template_supervisor'],
        pin: 'TEAM2024',
        isActive: true,
        createdAt: new Date(),
        createdBy: 'admin'
      }
    ];

    for (const assessment of sampleAssessments) {
      await assessmentService.createAssessment(assessment);
    }

    console.log('✅ Sample assessments seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding sample assessments:', error);
  }
}

async function seedSampleEmployees() {
  try {
    // Check if employees already exist
    const existingEmployees = await employeeService.getAllEmployees();
    
    if (existingEmployees.length > 0) {
      console.log('Sample employees already exist');
      return;
    }

    await employeeService.seedEmployees();
    console.log('✅ Sample employees seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding sample employees:', error);
  }
}

async function seedSampleTemplates() {
  try {
    await templateService.seedTemplates();
    console.log('✅ Sample templates seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding sample templates:', error);
  }
}

// Function to test Firebase connection
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    if (!db) {
      console.log('Firebase not initialized');
      return false;
    }
    
    // Simple test to check if Firebase is working
    await locationService.getAllLocations();
    console.log('✅ Firebase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return false;
  }
} 