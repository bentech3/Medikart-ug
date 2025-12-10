import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  FileCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User,
  Calendar,
  AlertTriangle,
  Loader2,
  ImageOff,
  RefreshCw
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { usePrescriptions, useUpdatePrescriptionStatus, getPrescriptionImageUrl, Prescription } from '@/hooks/usePrescriptions';
import { useAuth } from '@/context/AuthContext';

const PharmacistDashboard: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: prescriptions, isLoading, error, refetch } = usePrescriptions();
  const updateStatus = useUpdatePrescriptionStatus();
  
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Fetch signed URLs for prescription images
  useEffect(() => {
    const fetchImageUrls = async () => {
      if (!prescriptions) return;
      
      const urls: Record<string, string> = {};
      for (const prescription of prescriptions) {
        try {
          const url = await getPrescriptionImageUrl(prescription.image_url);
          urls[prescription.id] = url;
        } catch (error) {
          console.error(`Failed to get image URL for ${prescription.id}:`, error);
        }
      }
      setImageUrls(urls);
    };
    
    fetchImageUrls();
  }, [prescriptions]);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    
    try {
      await updateStatus.mutateAsync({
        id,
        status: 'approved',
      });
      
      toast({
        title: 'Prescription Approved',
        description: 'The patient will be notified.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve prescription',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleOpenRejectDialog = (id: string) => {
    setSelectedPrescription(id);
    setRejectionReason('');
    setRejectDialogOpen(true);
  };

  const handleReject = async () => {
    if (!selectedPrescription) return;
    
    setProcessingId(selectedPrescription);
    setRejectDialogOpen(false);
    
    try {
      await updateStatus.mutateAsync({
        id: selectedPrescription,
        status: 'rejected',
        rejectionReason: rejectionReason.trim() || 'Prescription rejected by pharmacist',
      });
      
      toast({
        title: 'Prescription Rejected',
        description: 'The patient has been notified to submit a valid prescription.',
        variant: 'destructive',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reject prescription',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
      setSelectedPrescription(null);
      setRejectionReason('');
    }
  };

  const pendingPrescriptions = prescriptions?.filter((p) => p.status === 'pending') || [];
  const approvedPrescriptions = prescriptions?.filter((p) => p.status === 'approved') || [];
  const rejectedPrescriptions = prescriptions?.filter((p) => p.status === 'rejected') || [];

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
    if (diff < 60) return `${diff} min ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  const renderPrescriptionCard = (prescription: Prescription) => (
    <div
      key={prescription.id}
      className="bg-card p-4 md:p-6 rounded-xl border border-border"
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Image */}
        <div className="w-full md:w-40 aspect-square md:aspect-auto md:h-40 rounded-lg overflow-hidden bg-muted shrink-0">
          {imageUrls[prescription.id] ? (
            <img
              src={imageUrls[prescription.id]}
              alt="Prescription"
              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(imageUrls[prescription.id], '_blank')}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
            <div>
              <Badge
                variant={
                  prescription.status === 'pending'
                    ? 'outline'
                    : prescription.status === 'approved'
                    ? 'default'
                    : 'destructive'
                }
                className="mb-2"
              >
                {prescription.status === 'pending' && (
                  <Clock className="h-3 w-3 mr-1" />
                )}
                {prescription.status === 'approved' && (
                  <CheckCircle className="h-3 w-3 mr-1" />
                )}
                {prescription.status === 'rejected' && (
                  <XCircle className="h-3 w-3 mr-1" />
                )}
                {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
              </Badge>
              <h3 className="font-semibold text-lg">RX-{prescription.id.slice(0, 8).toUpperCase()}</h3>
            </div>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatTime(prescription.created_at)}
            </span>
          </div>

          <div className="space-y-2 text-sm mb-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{prescription.patient_name}</span>
              {prescription.patient_age && (
                <span className="text-muted-foreground">({prescription.patient_age} years)</span>
              )}
            </div>
            {prescription.notes && (
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                <span className="text-muted-foreground">{prescription.notes}</span>
              </div>
            )}
            {prescription.rejection_reason && prescription.status === 'rejected' && (
              <div className="flex items-start gap-2 p-2 bg-destructive/10 rounded">
                <XCircle className="h-4 w-4 text-destructive mt-0.5" />
                <span className="text-destructive text-sm">{prescription.rejection_reason}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          {prescription.status === 'pending' && (
            <div className="flex gap-3">
              <Button
                size="sm"
                className="gap-2"
                onClick={() => handleApprove(prescription.id)}
                disabled={processingId === prescription.id}
              >
                {processingId === prescription.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="gap-2"
                onClick={() => handleOpenRejectDialog(prescription.id)}
                disabled={processingId === prescription.id}
              >
                {processingId === prescription.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                Reject
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Failed to load prescriptions</h2>
            <p className="text-muted-foreground mb-4">Please try again later.</p>
            <Button onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Pharmacist Dashboard - MediKart UG</title>
      </Helmet>
      
      <Layout>
        <div className="container py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileCheck className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Pharmacist Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Review and verify prescription orders
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-warning/10 p-4 rounded-xl text-center">
              <p className="text-3xl font-bold text-warning">{pendingPrescriptions.length}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <div className="bg-success/10 p-4 rounded-xl text-center">
              <p className="text-3xl font-bold text-success">{approvedPrescriptions.length}</p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
            <div className="bg-destructive/10 p-4 rounded-xl text-center">
              <p className="text-3xl font-bold text-destructive">{rejectedPrescriptions.length}</p>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="pending">
            <TabsList className="mb-6">
              <TabsTrigger value="pending" className="gap-2">
                <Clock className="h-4 w-4" />
                Pending ({pendingPrescriptions.length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Approved
              </TabsTrigger>
              <TabsTrigger value="rejected" className="gap-2">
                <XCircle className="h-4 w-4" />
                Rejected
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {pendingPrescriptions.length > 0 ? (
                pendingPrescriptions.map(renderPrescriptionCard)
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success" />
                  <p>All prescriptions have been reviewed!</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              {approvedPrescriptions.length > 0 ? (
                approvedPrescriptions.map(renderPrescriptionCard)
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No approved prescriptions yet.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              {rejectedPrescriptions.length > 0 ? (
                rejectedPrescriptions.map(renderPrescriptionCard)
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No rejected prescriptions.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Layout>

      {/* Rejection Reason Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Prescription</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this prescription. This will be shared with the patient.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="e.g., Prescription is illegible, expired, or missing required information..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject Prescription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PharmacistDashboard;
