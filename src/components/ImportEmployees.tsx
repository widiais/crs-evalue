'use client';

import { useState, useRef, useCallback } from 'react';
import { 
  DocumentArrowUpIcon, 
  DocumentArrowDownIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';
import { employeeService } from '@/services/employees';

interface ImportedEmployee {
  name: string;
  levelCode: number;
  storeCode: number;
  divisionCode: number;
}

interface ImportProps {
  onImportComplete: () => void;
  onClose: () => void;
}

export default function ImportEmployees({ onImportComplete, onClose }: ImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<ImportedEmployee[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      processFile(selectedFile);
    }
  }, []);

  const processFile = async (file: File) => {
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      const processedData = data.map((row: any, index: number) => ({
        name: row['Nama Karyawan'] || row['nama_karyawan'] || row['Nama'] || '',
        levelCode: parseInt(row['Kode Level'] || row['kode_level'] || row['Level'] || '0'),
        storeCode: parseInt(row['Kode Store'] || row['kode_store'] || row['Store'] || '0'),
        divisionCode: parseInt(row['Kode Divisi'] || row['kode_divisi'] || row['Divisi'] || '0')
      })).filter(item => item.name.trim() !== '');

      setImportData(processedData);
      setShowPreview(true);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('❌ Error membaca file Excel. Pastikan format file sesuai.');
    }
  };

  const handleImport = async () => {
    if (importData.length === 0) return;

    try {
      setImporting(true);
      const result = await employeeService.importEmployees(importData);
      setImportResult(result);
    } catch (error) {
      console.error('Error importing employees:', error);
      alert('❌ Gagal mengimpor data karyawan');
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = employeeService.getImportTemplate();
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'template_import_karyawan.xlsx');
  };

  const downloadReference = () => {
    const referenceData = employeeService.getImportReference();
    const wb = XLSX.utils.book_new();
    
    // Level data sheet
    const levelWs = XLSX.utils.json_to_sheet(referenceData.levelData);
    XLSX.utils.book_append_sheet(wb, levelWs, 'Kode Level');
    
    // Store data sheet
    const storeWs = XLSX.utils.json_to_sheet(referenceData.storeData);
    XLSX.utils.book_append_sheet(wb, storeWs, 'Kode Store');
    
    // Division data sheet
    const divisionWs = XLSX.utils.json_to_sheet(referenceData.divisionData);
    XLSX.utils.book_append_sheet(wb, divisionWs, 'Kode Divisi');
    
    XLSX.writeFile(wb, 'referensi_kode_import.xlsx');
  };

  const resetImport = () => {
    setFile(null);
    setImportData([]);
    setShowPreview(false);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (importResult) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 lg:p-8 w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Hasil Import</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{importResult.success}</div>
                <div className="text-sm font-medium text-green-700">Berhasil</div>
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{importResult.failed}</div>
                <div className="text-sm font-medium text-red-700">Gagal</div>
              </div>
            </div>
          </div>

          {importResult.errors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🚨 Error Details:</h3>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-h-60 overflow-y-auto">
                {importResult.errors.map((error: any, index: number) => (
                  <div key={index} className="mb-2 pb-2 border-b border-red-200 last:border-b-0">
                    <div className="text-sm font-medium text-red-800">
                      Row {error.row + 1}: {error.data.name || 'Unknown'}
                    </div>
                    <div className="text-sm text-red-600">{error.error}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={() => {
                onImportComplete();
                onClose();
              }}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Selesai
            </button>
            <button
              onClick={resetImport}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Import Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 lg:p-8 w-full max-w-4xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">📋 Import Karyawan dari Excel</h2>
            <p className="text-gray-600 mt-1">Upload file Excel dengan data karyawan</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Template dan Reference Downloads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={downloadTemplate}
            className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all"
          >
            <DocumentArrowDownIcon className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-blue-600 font-medium">Download Template Excel</span>
          </button>
          
          <button
            onClick={downloadReference}
            className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-green-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all"
          >
            <InformationCircleIcon className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-600 font-medium">Download Referensi Kode</span>
          </button>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Upload File Excel *
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-gray-400 transition-colors">
            <div className="space-y-1 text-center">
              <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload a file</span>
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept=".xlsx,.xls"
                    className="sr-only"
                    onChange={handleFileSelect}
                  />
                </label>
                <p className="pl-1">atau drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">XLSX, XLS up to 10MB</p>
            </div>
          </div>
          {file && (
            <div className="mt-2 text-sm text-gray-600">
              📄 Selected: {file.name}
            </div>
          )}
        </div>

        {/* Preview Data */}
        {showPreview && importData.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                👀 Preview Data ({importData.length} records)
              </h3>
              <button
                onClick={() => setShowReference(!showReference)}
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                {showReference ? 'Hide' : 'Show'} Reference
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 max-h-80 overflow-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">No</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Nama</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Level</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Store</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Divisi</th>
                  </tr>
                </thead>
                <tbody>
                  {importData.slice(0, 10).map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 px-3 text-sm text-gray-900">{index + 1}</td>
                      <td className="py-2 px-3 text-sm text-gray-900">{item.name}</td>
                      <td className="py-2 px-3 text-sm text-gray-600">{item.levelCode}</td>
                      <td className="py-2 px-3 text-sm text-gray-600">{item.storeCode}</td>
                      <td className="py-2 px-3 text-sm text-gray-600">{item.divisionCode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {importData.length > 10 && (
                <div className="text-center py-2 text-sm text-gray-500">
                  ... dan {importData.length - 10} data lainnya
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reference Data */}
        {showReference && (
          <div className="mb-6 bg-blue-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">📖 Referensi Kode</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Kode Divisi:</h4>
                <div className="space-y-1">
                  <div>1 = Operational Store</div>
                  <div>2 = FAD</div>
                  <div>3 = HCD</div>
                  <div>4 = IT</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Kode Level (contoh):</h4>
                <div className="space-y-1">
                  <div>1 = Magang</div>
                  <div>2 = Training</div>
                  <div>3 = Member</div>
                  <div>8 = Junior SPV</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Kode Store (contoh):</h4>
                <div className="space-y-1">
                  <div>1 = LC Ahmad Yani</div>
                  <div>2 = LC Alfathu</div>
                  <div>3 = LC Angkrek</div>
                  <div>4 = LC Antapani</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleImport}
            disabled={importData.length === 0 || importing}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
          >
            {importing ? (
              <>
                <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
                Import {importData.length} Karyawan
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Batal
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">📋 Format Excel yang Diperlukan:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• <strong>Nama Karyawan:</strong> Nama lengkap karyawan</li>
            <li>• <strong>Kode Level:</strong> Angka sesuai referensi level (1-15)</li>
            <li>• <strong>Kode Store:</strong> Angka sesuai referensi store (1-106)</li>
            <li>• <strong>Kode Divisi:</strong> Angka sesuai referensi divisi (1-4)</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 