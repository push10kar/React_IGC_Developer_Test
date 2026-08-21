import React, { useState, useMemo } from 'react';
import {
  X,
  Plus,
  Trash2,
  Layers,
  FileText,
  Link2,
  Upload,
  Check,
  Lock,
  Calendar,
  User,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { useSourcing } from '../context/SourcingContext';
import type { SourcingLineItem, SourcingSourceType, ClarityType } from '../types/sourcing';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// Pre-defined Product Master Catalog for catalog selections
const PRODUCT_MASTER_CATALOG = [
  { id: 'PM-101', name: 'Galvanized I-Beam 200mm x 100mm', hsn: '7216.32', defaultPrice: 4200 },
  { id: 'PM-102', name: 'High-Tensile Anchor Fastener M16', hsn: '7318.15', defaultPrice: 85 },
  { id: 'PM-103', name: 'Epoxy Primer Coating Grade A (20L)', hsn: '3208.90', defaultPrice: 3800 },
  { id: 'PM-104', name: 'Cold Rolled Steel Sheet 1.2mm x 1250mm', hsn: '7209.16', defaultPrice: 5400 },
  { id: 'PM-105', name: 'Stainless Steel Flange 150# ANSI 4"', hsn: '7307.21', defaultPrice: 1950 },
];

export const AssignTargetModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { targets, createTarget, currentUser } = useSourcing();

  // Next sequential ID display calculation
  const nextSequentialId = useMemo(() => {
    const nextNum = targets.length + 1;
    return `BST-${nextNum.toString().padStart(3, '0')}`;
  }, [targets]);

  // Form states
  const [title, setTitle] = useState('');
  const [assignedToName, setAssignedToName] = useState(currentUser);
  const [startDate, setStartDate] = useState('2026-08-21');
  const [dueDate, setDueDate] = useState('2026-09-15');
  const [sourceType, setSourceType] = useState<SourcingSourceType>('MASTER');

  // Product Master Selection state
  const [selectedCatalogSku, setSelectedCatalogSku] = useState('');

  // Line items state
  const [lines, setLines] = useState<Array<{
    productId?: string;
    productName: string;
    hsnCode: string;
    targetPrice: number;
    sourceType: SourcingSourceType;
    clarityType: ClarityType;
    clarityValue: string;
    fileName?: string;
  }>>([
    {
      productName: '',
      hsnCode: '',
      targetPrice: 0,
      sourceType: 'MASTER',
      clarityType: 'text',
      clarityValue: '',
    }
  ]);

  if (!isOpen) return null;

  // Add line item from catalog
  const handleAddCatalogProduct = () => {
    if (!selectedCatalogSku) return;
    const item = PRODUCT_MASTER_CATALOG.find(p => p.id === selectedCatalogSku);
    if (!item) return;

    setLines(prev => [
      ...prev.filter(l => l.productName.trim() !== ''),
      {
        productId: item.id,
        productName: item.name,
        hsnCode: item.hsn,
        targetPrice: item.defaultPrice,
        sourceType: 'MASTER',
        clarityType: 'text',
        clarityValue: 'Standard master catalog tolerances and technical parameters apply.',
      }
    ]);
    setSelectedCatalogSku('');
  };

  // Add empty manual line item
  const handleAddManualLine = () => {
    setLines(prev => [
      ...prev,
      {
        productName: '',
        hsnCode: '',
        targetPrice: 0,
        sourceType: 'MANUAL',
        clarityType: 'text',
        clarityValue: '',
      }
    ]);
  };

  const handleRemoveLine = (index: number) => {
    setLines(prev => prev.filter((_, i) => i !== index));
  };

  const handleLineFieldChange = (index: number, field: string, value: any) => {
    setLines(prev => prev.map((line, i) => {
      if (i !== index) return line;
      return { ...line, [field]: value };
    }));
  };

  const handleFileUploadMock = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB limit.');
        return;
      }
      handleLineFieldChange(index, 'fileName', file.name);
      handleLineFieldChange(index, 'clarityValue', `Uploaded Document: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Target title is required.');
      return;
    }

    if (lines.length === 0 || lines.some(l => !l.productName.trim() || l.targetPrice <= 0)) {
      alert('Every line item must have a valid product name and target price greater than 0.');
      return;
    }

    if (new Date(dueDate) <= new Date(startDate)) {
      alert('Due Date must be later than the Start Date.');
      return;
    }

    const formattedLines: SourcingLineItem[] = lines.map((l, idx) => ({
      id: `line-${Date.now()}-${idx}`,
      productId: l.productId,
      productName: l.productName,
      hsnCode: l.hsnCode || '7200.00',
      targetPrice: Number(l.targetPrice),
      sourceType: l.sourceType,
      clarity: {
        type: l.clarityType,
        value: l.clarityValue || 'No technical notes specified.',
        fileName: l.fileName
      },
      isCompleted: false,
      mappings: []
    }));

    createTarget({
      title: title.trim(),
      sourceType,
      createdById: 'u-current',
      createdByName: currentUser,
      assignedToId: 'u-assigned',
      assignedToName,
      startDate,
      dueDate,
      lines: formattedLines,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#081E2D]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#A5F3FC]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0E7490] via-[#0891B2] to-[#22D3EE] px-6 py-4 text-white flex justify-between items-center relative overflow-hidden">
          <div className="flex items-center gap-3 z-10">
            <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shadow-inner">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs bg-white/25 px-2 py-0.5 rounded font-extrabold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> {nextSequentialId}
                </span>
                <h2 className="text-base font-black">Assign Sourcing Target</h2>
              </div>
              <p className="text-xs opacity-90">Initialize bulk purchasing specifications and allocate buyer target lines</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all z-10">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Target Parameters */}
          <div className="bg-[#F8FCFD] border border-[#E6F3F7] rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-[#0891B2]">
              <span>Step 1: Header Configuration</span>
              <span className="font-mono bg-white px-2 py-0.5 border rounded">Auto-Allocated ID</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="font-bold text-[#475569] uppercase text-[10px] block mb-1">
                  Sourcing Target Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Heavy Castings & Fasteners Q3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#0891B2]"
                />
              </div>

              <div>
                <label className="font-bold text-[#475569] uppercase text-[10px] block mb-1">
                  Assigned Buyer <span className="text-red-500">*</span>
                </label>
                <select
                  value={assignedToName}
                  onChange={(e) => setAssignedToName(e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-bold text-[#0C4A6E] focus:outline-none focus:border-[#0891B2]"
                >
                  <option value="Pushkar Sharma">Pushkar Sharma (Senior Sourcing Lead)</option>
                  <option value="Rajesh Nair">Rajesh Nair (Procurement Manager)</option>
                  <option value="Priya Patel">Priya Patel (Category Buyer)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[#475569] uppercase text-[10px] block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] rounded-xl px-2 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#475569] uppercase text-[10px] block mb-1">Due Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] rounded-xl px-2 py-2 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sourcing Source Selection */}
          <div className="space-y-2">
            <span className="font-extrabold text-[10px] uppercase tracking-wider text-[#0891B2] block">
              Step 2: Source Type Selection
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`border p-4 rounded-xl cursor-pointer flex items-center justify-between transition-all ${sourceType === 'MASTER' ? 'border-[#0891B2] bg-[#ECFEFF] shadow-sm' : 'border-[#E2E8F0] bg-[#FAFAFA]'
                }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="sourceType"
                    checked={sourceType === 'MASTER'}
                    onChange={() => setSourceType('MASTER')}
                    className="accent-[#0891B2]"
                  />
                  <div>
                    <span className="font-extrabold text-[#0C4A6E] block">Product Master Catalog</span>
                    <span className="text-[11px] text-[#64748B]">Pre-validated catalog items with standardized HSN & specs</span>
                  </div>
                </div>
              </label>

              <label className={`border p-4 rounded-xl cursor-pointer flex items-center justify-between transition-all ${sourceType === 'MANUAL' ? 'border-[#7C3AED] bg-[#F5F1FE] shadow-sm' : 'border-[#E2E8F0] bg-[#FAFAFA]'
                }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="sourceType"
                    checked={sourceType === 'MANUAL'}
                    onChange={() => setSourceType('MANUAL')}
                    className="accent-[#7C3AED]"
                  />
                  <div>
                    <span className="font-extrabold text-[#4C1D95] block">Manual / Ad-Hoc Entry</span>
                    <span className="text-[11px] text-[#64748B]">Bespoke or non-standard project items requiring new specs</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Line Items Specification Builder */}
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-[#E6F3F7] pb-2">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-[#0C4A6E]">Step 3: Line Items Specification</span>
                <span className="bg-[#E0FBFF] text-[#0891B2] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {lines.length} Line{lines.length > 1 ? 's' : ''}
                </span>
              </div>

              {sourceType === 'MASTER' ? (
                <div className="flex items-center gap-2">
                  <select
                    value={selectedCatalogSku}
                    onChange={(e) => setSelectedCatalogSku(e.target.value)}
                    className="border border-[#D8EEF4] rounded-lg px-2.5 py-1 text-xs bg-white"
                  >
                    <option value="">-- Choose from Catalog --</option>
                    {PRODUCT_MASTER_CATALOG.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (₹{p.defaultPrice})</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddCatalogProduct}
                    disabled={!selectedCatalogSku}
                    className="bg-[#0891B2] text-white px-3 py-1 rounded-lg font-bold hover:bg-[#0E7490] disabled:opacity-50"
                  >
                    Add Product
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleAddManualLine}
                  className="bg-[#7C3AED] text-white px-3 py-1 rounded-lg font-bold hover:bg-[#6D28D9] flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Custom Line
                </button>
              )}
            </div>

            {/* Line Cards List */}
            <div className="space-y-3">
              {lines.map((line, idx) => (
                <div key={idx} className="border border-[#E4EFF5] rounded-xl p-4 bg-white shadow-sm space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold text-[#64748B]">
                    <span className="bg-[#F1F8FB] text-[#0891B2] px-2 py-0.5 rounded">Line #{idx + 1}</span>
                    {lines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLine(idx)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>

                  {/* Product Details Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-[#64748B] block mb-1">Product Description *</label>
                      <input
                        type="text"
                        required
                        placeholder="Product name, grade, dimension"
                        value={line.productName}
                        onChange={(e) => handleLineFieldChange(idx, 'productName', e.target.value)}
                        className="w-full border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs focus:border-[#0891B2]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#64748B] block mb-1">HSN Code</label>
                      <input
                        type="text"
                        placeholder="e.g. 7216.32"
                        value={line.hsnCode}
                        onChange={(e) => handleLineFieldChange(idx, 'hsnCode', e.target.value)}
                        className="w-full border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs font-mono focus:border-[#0891B2]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#64748B] block mb-1">Target Rate (₹) *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="Estimated Unit Price"
                        value={line.targetPrice || ''}
                        onChange={(e) => handleLineFieldChange(idx, 'targetPrice', Number(e.target.value))}
                        className="w-full border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-[#0C4A6E] focus:border-[#0891B2]"
                      />
                    </div>
                  </div>

                  {/* Product Clarity Section */}
                  <div className="bg-[#F8FCFD] border border-[#E6F3F7] rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-[#0891B2] flex items-center gap-1">
                        <FileCheck className="w-3.5 h-3.5" /> Product Clarity & Technical Spec
                      </span>
                      <div className="inline-flex bg-white border border-[#D8EEF4] rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => handleLineFieldChange(idx, 'clarityType', 'text')}
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${line.clarityType === 'text' ? 'bg-[#0891B2] text-white' : 'text-[#64748B]'
                            }`}
                        >
                          Text Spec
                        </button>
                        <button
                          type="button"
                          onClick={() => handleLineFieldChange(idx, 'clarityType', 'link')}
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${line.clarityType === 'link' ? 'bg-[#0891B2] text-white' : 'text-[#64748B]'
                            }`}
                        >
                          External Link
                        </button>
                        <button
                          type="button"
                          onClick={() => handleLineFieldChange(idx, 'clarityType', 'pdf')}
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${line.clarityType === 'pdf' ? 'bg-[#0891B2] text-white' : 'text-[#64748B]'
                            }`}
                        >
                          Document / PDF
                        </button>
                      </div>
                    </div>

                    {line.clarityType === 'text' && (
                      <textarea
                        rows={2}
                        placeholder="Specify technical tolerances, material composition, coatings, or certification requirements..."
                        value={line.clarityValue}
                        onChange={(e) => handleLineFieldChange(idx, 'clarityValue', e.target.value)}
                        className="w-full bg-white border border-[#E2E8F0] rounded-lg p-2 text-xs focus:border-[#0891B2]"
                      />
                    )}

                    {line.clarityType === 'link' && (
                      <div className="flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-[#0891B2]" />
                        <input
                          type="url"
                          placeholder="https://specs.internal/cad-drawings/part-102.pdf"
                          value={line.clarityValue}
                          onChange={(e) => handleLineFieldChange(idx, 'clarityValue', e.target.value)}
                          className="w-full bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs"
                        />
                      </div>
                    )}

                    {line.clarityType === 'pdf' && (
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer bg-white border border-dashed border-[#0891B2] px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-[#ECFEFF]">
                          <Upload className="w-3.5 h-3.5 text-[#0891B2]" />
                          <span className="text-[11px] font-bold text-[#0891B2]">Upload Spec Sheet (PDF/PNG)</span>
                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(e) => handleFileUploadMock(idx, e)}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[11px] text-[#64748B] font-mono truncate max-w-xs">
                          {line.fileName || 'No file selected (Max 10MB)'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-[#E4EFF5] flex justify-end gap-3 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-[#E2E8F0] rounded-xl font-bold text-[#475569] hover:bg-[#F8FAFC] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-[#0891B2] to-[#0E7490] text-white rounded-xl font-extrabold shadow-md hover:brightness-105 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Save Sourcing Target
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};