import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  updateDoc,
  deleteDoc,
  query, 
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';
import { Employee } from '@/types';

// Import data mappings
const levelDataMap = {
  1: "Magang",
  2: "Trainning", 
  3: "Member",
  4: "Star",
  5: "All Star",
  6: "TL1",
  7: "TL2",
  8: "Junior Supervisor",
  9: "Middle Supervisor",
  10: "Senior Supervisor",
  11: "Junior Manager",
  12: "Middle Manager", 
  13: "Senior Manager",
  14: "Regional Manager",
  15: "Division Head"
};

const storeDataMap = {
  1: "LC Ahmad Yani",
  2: "LC Alfathu",
  3: "LC Angkrek",
  4: "LC Antapani",
  5: "LC Anyer",
  6: "LC Babakansari",
  7: "LC Baleendah",
  8: "LC BANTENG",
  9: "LC Baros",
  10: "LC Batununggal",
  11: "LC BBS",
  12: "LC BHAYANGKARA",
  13: "LC Bojonegara",
  14: "LC Bojongsoang",
  15: "LC Bukit Barisan",
  16: "LC Bulak Laut",
  17: "LC CAGAR ALAM",
  18: "LC Caringin",
  19: "LC Cibaraja",
  20: "LC Cibeber",
  21: "LC Cibinong",
  22: "LC Cidahu",
  23: "LC cihampelas",
  24: "LC CIKAJANG",
  25: "LC Cikande",
  26: "LC Cileunyi",
  27: "LC Cimanggu",
  28: "LC CIMANUK",
  29: "LC CIPASIR",
  30: "LC Cipocok",
  31: "LC Ciracas",
  32: "LC Ciruas",
  33: "LC Cisoka",
  34: "LC Ciwaru",
  35: "LC Ciwaruga",
  36: "LC Ciwidey",
  37: "LC Derwati",
  38: "LC Gading Tutuka",
  39: "LC Galuhmas",
  40: "LC Gardu Tanjak",
  41: "LC GEGERKALONG",
  42: "LC Grogol",
  43: "LC Indihiang",
  44: "LC Jatos",
  45: "LC Jombang",
  46: "LC Juanda",
  47: "LC Kaligandu",
  48: "LC Kalitimbang",
  49: "LC Kasemen",
  50: "LC Katapang",
  51: "LC Kebon Dalam",
  52: "LC Kelapa Dua",
  53: "LC Kragilan",
  54: "LC Kramatwatu",
  55: "LC Krenceng",
  56: "LC Labuan",
  57: "LC Lebak Indah",
  58: "LC Legok",
  59: "LC Lopang",
  60: "LC MAJALENGKA",
  61: "LC Majasari",
  62: "LC Margaasih",
  63: "LC Margahayu",
  64: "LC Mega Regency",
  65: "LC Menes",
  66: "LC Merak",
  67: "LC Multatuli",
  68: "LC Munjul",
  69: "LC ONA SILIWANGI",
  70: "LC Pakupatan",
  71: "LC Palabuhan Ratu",
  72: "LC Panam Simpang Satria",
  73: "LC PANDANWANGI",
  74: "LC Panimbang",
  75: "LC PCI",
  76: "LC Pemuda",
  77: "LC PERJUANGAN",
  78: "LC PERMATA CIMAHI",
  79: "LC Perumnas Cirebon",
  80: "LC Petir",
  81: "LC Pipitan",
  82: "LC RANCAMANYAR",
  83: "LC Rumbai",
  84: "LC Sarimanah",
  85: "LC Seneja",
  86: "LC Serdang",
  87: "LC Siliwangi Tasik",
  88: "LC SIMPANG LIMA",
  89: "LC Singaparna",
  90: "LC Sudirman Indramayu",
  91: "LC Sukagalih",
  92: "LC Sukamenak",
  93: "LC SUMBER",
  94: "LC Taman Cilegon Indah",
  95: "LC Tegal",
  96: "LC Tegal Cabe",
  97: "LC Temu Putih",
  98: "LC TUBAGUS ISMAIL",
  99: "LC Ujung berung",
  100: "LC Waringin Kurung",
  101: "LC Warnasari",
  102: "LC WARUNG GUNUNG",
  103: "OFC Cibatu",
  104: "OFC CiCURUG",
  105: "OFC Koncara",
  106: "OFC legok jabar",
  901: "HEAD OFFICE",
  902: "BUSANA MUSLIM SEDJATI",
  903: "AGRICULTURAL",
  904: "RUMAH BERLAJAR",
};

const divisionDataMap = {
  1: "STORE OPERATIONAL",
  2: "FAD", 
  3: "HCD",
  4: "DIGITAL TEKNOLOGI",
  5: "FOODLAB",
  6: "OPERATIONAL & NETWORK",
  7: "FASHION",
  8: "AGRO BISNIS",
  9: "BUSINESS DEVELOPMENT",

};

interface ImportEmployeeData {
  name: string;
  levelCode: number;
  storeCode: number; 
  divisionCode: number;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    error: string;
    data: any;
  }>;
}

export const employeeService = {
  // Get all employees
  async getAllEmployees(): Promise<Employee[]> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const q = query(collection(db, 'employees'), orderBy('name', 'asc'));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Employee[];
    } catch (error) {
      console.error('Error getting employees:', error);
      throw error;
    }
  },

  // Get employees by location
  async getEmployeesByLocation(location: string): Promise<Employee[]> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const q = query(
        collection(db, 'employees'),
        where('location', '==', location),
        orderBy('name', 'asc')
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Employee[];
    } catch (error) {
      console.error('Error getting employees by location:', error);
      throw error;
    }
  },

  // Get employees by position
  async getEmployeesByPosition(position: string): Promise<Employee[]> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const q = query(
        collection(db, 'employees'),
        where('position', '==', position),
        orderBy('name', 'asc')
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Employee[];
    } catch (error) {
      console.error('Error getting employees by position:', error);
      throw error;
    }
  },

  // Get employees by location and position
  async getEmployeesByLocationAndPosition(location: string, position: string): Promise<Employee[]> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const q = query(
        collection(db, 'employees'),
        where('location', '==', location),
        where('position', '==', position),
        orderBy('name', 'asc')
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Employee[];
    } catch (error) {
      console.error('Error getting employees by location and position:', error);
      throw error;
    }
  },

  // Add new employee
  async addEmployee(employee: Omit<Employee, 'id'>): Promise<string> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const docRef = await addDoc(collection(db, 'employees'), employee);
      return docRef.id;
    } catch (error) {
      console.error('Error adding employee:', error);
      throw error;
    }
  },

  // Update employee
  async updateEmployee(id: string, employee: Partial<Employee>): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const employeeRef = doc(db, 'employees', id);
      await updateDoc(employeeRef, employee);
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  },

  // Delete employee
  async deleteEmployee(id: string): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const employeeRef = doc(db, 'employees', id);
      await deleteDoc(employeeRef);
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  },

  // Import employees from Excel data
  async importEmployees(employeeData: ImportEmployeeData[]): Promise<ImportResult> {
    const result: ImportResult = {
      success: 0,
      failed: 0,
      errors: []
    };

    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      for (let i = 0; i < employeeData.length; i++) {
        const row = i + 2; // Excel row number (assuming header at row 1, data starts at row 2)
        const data = employeeData[i];

        try {
          // Validate required fields
          if (!data.name?.trim()) {
            throw new Error('Nama karyawan tidak boleh kosong');
          }

          // Validate levelCode
          if (!data.levelCode || typeof data.levelCode !== 'number') {
            throw new Error('Kode level harus berupa angka');
          }
          
          if (!levelDataMap[data.levelCode as keyof typeof levelDataMap]) {
            throw new Error(`Kode level ${data.levelCode} tidak valid. Kode level yang tersedia: ${Object.keys(levelDataMap).join(', ')}`);
          }

          // Validate storeCode
          if (!data.storeCode || typeof data.storeCode !== 'number') {
            throw new Error('Kode store harus berupa angka');
          }
          
          if (!storeDataMap[data.storeCode as keyof typeof storeDataMap]) {
            throw new Error(`Kode store ${data.storeCode} tidak valid. Silakan cek daftar kode store yang tersedia`);
          }

          // Validate divisionCode  
          if (!data.divisionCode || typeof data.divisionCode !== 'number') {
            throw new Error('Kode divisi harus berupa angka');
          }
          
          if (!divisionDataMap[data.divisionCode as keyof typeof divisionDataMap]) {
            throw new Error(`Kode divisi ${data.divisionCode} tidak valid. Kode divisi yang tersedia: ${Object.keys(divisionDataMap).join(', ')}`);
          }

          // Map codes to actual values
          const position = levelDataMap[data.levelCode as keyof typeof levelDataMap];
          const location = storeDataMap[data.storeCode as keyof typeof storeDataMap];
          const division = divisionDataMap[data.divisionCode as keyof typeof divisionDataMap];

          // Check if employee already exists (same name and location)
          const existingQuery = query(
            collection(db, 'employees'),
            where('name', '==', data.name.trim()),
            where('location', '==', location)
          );
          const existingSnapshot = await getDocs(existingQuery);

          if (!existingSnapshot.empty) {
            throw new Error(`Karyawan ${data.name} sudah ada di lokasi ${location}`);
          }

          // Add employee
          const employeeData = {
            name: data.name.trim(),
            position,
            location,
            division,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          await addDoc(collection(db, 'employees'), employeeData);
          result.success++;
          
        } catch (error) {
          result.failed++;
          result.errors.push({
            row,
            error: error instanceof Error ? error.message : 'Unknown error',
            data
          });
        }
      }

      return result;
    } catch (error) {
      console.error('Error importing employees:', error);
      throw error;
    }
  },

  // Get template for Excel import
  getImportTemplate(): Array<{
    'Nama Karyawan': string;
    'Kode Level': string;
    'Kode Store': string;
    'Kode Divisi': string;
  }> {
    return [
      {
        'Nama Karyawan': 'John Doe',
        'Kode Level': '3',
        'Kode Store': '1',
        'Kode Divisi': '1'
      },
      {
        'Nama Karyawan': 'Jane Smith', 
        'Kode Level': '5',
        'Kode Store': '901',
        'Kode Divisi': '2'
      }
    ];
  },

  // Get reference data for import
  getImportReference() {
    return {
      levelData: Object.entries(levelDataMap).map(([kode, level]) => ({ 
        kode: parseInt(kode), 
        level,
        display: `${kode} - ${level}`
      })).sort((a, b) => a.kode - b.kode),
      
      storeData: Object.entries(storeDataMap).map(([kode, nama_store]) => ({ 
        kode: parseInt(kode), 
        nama_store,
        display: `${kode} - ${nama_store}`
      })).sort((a, b) => a.kode - b.kode),
      
      divisionData: Object.entries(divisionDataMap).map(([kode, nama_division]) => ({ 
        kode: parseInt(kode), 
        nama_division,
        display: `${kode} - ${nama_division}`
      })).sort((a, b) => a.kode - b.kode)
    };
  }
}; 