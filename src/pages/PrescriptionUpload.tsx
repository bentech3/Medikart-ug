import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  FileCheck, 
  X, 
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useSubmitPrescription } from '@/hooks/usePrescriptions';
import { useAuth } from '@/context/AuthContext';

const PrescriptionUpload: React.FC = () => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const submitPrescription = useSubmitPrescription();

  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    notes: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload images smaller than 10MB',
          variant: 'destructive',
        });
        return;
      }

      // Store the actual file for upload
      setImageFiles((prev) => [...prev, file]);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreviews((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (imageFiles.length === 0) {
      toast({
        title: 'No prescription uploaded',
        description: 'Please upload at least one prescription image',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.patientName.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please fill in patient name',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Not authenticated',
        description: 'Please login to submit a prescription',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Upload the first image (we'll extend to support multiple later)
      await submitPrescription.mutateAsync({
        imageFile: imageFiles[0],
        patientName: formData.patientName.trim(),
        patientAge: formData.patientAge ? parseInt(formData.patientAge) : undefined,
        notes: formData.notes.trim() || undefined,
      });

      setIsSubmitted(true);

      toast({
        title: 'Prescription submitted!',
        description: 'Our pharmacist will review it shortly.',
      });
    } catch (error: any) {
      toast({
        title: 'Submission failed',
        description: error.message || 'Failed to submit prescription. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmitAnother = () => {
    setIsSubmitted(false);
    setImageFiles([]);
    setImagePreviews([]);
    setFormData({
      patientName: '',
      patientAge: '',
      notes: '',
    });
  };

  if (isSubmitted) {
    return (
      <>
        <Helmet>
          <title>Prescription Submitted - MediKart UG</title>
        </Helmet>
        
        <Layout>
          <div className="container py-12">
            <div className="max-w-md mx-auto text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-success/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Prescription Submitted!
              </h1>
              <p className="text-muted-foreground mb-6">
                Our licensed pharmacist will review your prescription and contact you 
                via email within 30 minutes.
              </p>
              
              <div className="bg-muted p-4 rounded-xl mb-6 text-left">
                <h3 className="font-medium mb-2">What happens next?</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    Pharmacist reviews your prescription
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    We prepare a quote with available medicines
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    You confirm and we deliver to your door
                  </li>
                </ul>
              </div>

              <Button onClick={handleSubmitAnother}>
                Submit Another Prescription
              </Button>
            </div>
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Upload Prescription - MediKart UG</title>
        <meta
          name="description"
          content="Upload your prescription and get medicines delivered. Our licensed pharmacists verify all prescriptions for your safety."
        />
      </Helmet>
      
      <Layout>
        <div className="container py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Upload Prescription
              </h1>
              <p className="text-muted-foreground">
                Take a photo or upload your prescription. Our pharmacist will verify 
                and prepare your medicines.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Upload Area */}
              <div className="bg-card p-6 rounded-xl border border-border mb-6">
                <Label className="text-base font-semibold mb-4 block">
                  Prescription Image(s)
                </Label>

                {/* Uploaded Images */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {imagePreviews.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Prescription ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-24 border-dashed border-2"
                    onClick={() => cameraInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Camera className="h-6 w-6 text-primary" />
                      <span>Take Photo</span>
                    </div>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-24 border-dashed border-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon className="h-6 w-6 text-primary" />
                      <span>Upload from Gallery</span>
                    </div>
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Accepted formats: JPG, PNG • Max 10MB per file
                </p>
              </div>

              {/* Patient Details */}
              <div className="bg-card p-6 rounded-xl border border-border mb-6">
                <Label className="text-base font-semibold mb-4 block">
                  Patient Details
                </Label>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name *</Label>
                    <Input
                      id="patientName"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      placeholder="Enter patient name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patientAge">Patient Age (Optional)</Label>
                    <Input
                      id="patientAge"
                      name="patientAge"
                      type="number"
                      value={formData.patientAge}
                      onChange={handleInputChange}
                      placeholder="Enter patient age"
                      min="0"
                      max="150"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any additional information for the pharmacist..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 mb-6">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-1">
                      Prescription Requirements
                    </p>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Must be issued by a licensed doctor in Uganda</li>
                      <li>• Must be dated within the last 6 months</li>
                      <li>• Must show patient name and medication details clearly</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={submitPrescription.isPending || imageFiles.length === 0}
              >
                {submitPrescription.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FileCheck className="h-5 w-5" />
                    Submit for Verification
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default PrescriptionUpload;
