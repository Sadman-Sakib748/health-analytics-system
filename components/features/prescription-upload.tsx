// components/PrescriptionUpload.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { analyzePrescriptionImage } from '@/lib/ai-service';  // ✅ Fixed: ai-service থেকে import

interface PrescriptionUploadProps {
  onPrescriptionAdded: (prescription: {
    id: string;
    medication: string;
    dosage: string;
    frequency: string;
    prescribedBy: string;
    date: string;
    analysis: string;
  }) => void;
}

export default function PrescriptionUpload({ onPrescriptionAdded }: PrescriptionUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    setError('');
    setSuccess('');

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setIsAnalyzing(true);
    try {
      const analysis = await analyzePrescriptionImage(file);

      if (analysis.success && analysis.data) {
        const prescription = {
          id: `presc-${Date.now()}`,
          medication: analysis.data.medication || 'Unknown Medication',
          dosage: analysis.data.dosage || 'Not specified',
          frequency: analysis.data.frequency || 'As directed',
          prescribedBy: analysis.data.prescribedBy || 'Unknown Doctor',
          date: new Date().toISOString().split('T')[0],
          analysis: analysis.data.summary || 'Prescription uploaded and analyzed',
        };

        onPrescriptionAdded(prescription);
        setSuccess('Prescription analyzed successfully!');
        setPreview(null);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(analysis.error || 'Failed to analyze prescription');
      }
    } catch (err) {
      setError('Error analyzing prescription. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border bg-card hover:border-primary/50'
        }`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          disabled={isAnalyzing}
          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="flex flex-col items-center justify-center text-center">
          <Upload className="w-12 h-12 text-muted-foreground mb-3" />
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {isAnalyzing ? 'Analyzing Prescription...' : 'Upload Prescription'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {isAnalyzing
              ? 'Processing with AI...'
              : 'Drag and drop your prescription image here or click to browse'}
          </p>
          {!isAnalyzing && (
            <Button size="sm" variant="outline">
              Choose File
            </Button>
          )}
        </div>
      </div>

      {preview && (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <img src={preview} alt="Prescription preview" className="w-full max-h-48 object-contain" />
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
          <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">{success}</p>
        </div>
      )}
    </div>
  );
}