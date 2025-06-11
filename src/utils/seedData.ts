import { db } from '@/services/firebase';

export async function seedInitialData() {
  console.log('🌱 Starting data seeding process...');
  
  try {
    if (!db) {
      throw new Error('Firebase not initialized');
    }
    
    console.log('🎉 Firebase is ready for data operations!');
    console.log('ℹ️  You can now create your own data through the admin interface.');
  } catch (error) {
    console.error('💥 Error during seeding process:', error);
    throw error;
  }
} 