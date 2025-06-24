
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Signatory } from '@/types/signatory';

interface SignatoryFormProps {
  accountId: string;
  signatory?: Signatory | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const SignatoryForm = ({ accountId, signatory, onSuccess, onCancel }: SignatoryFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    role: 'authorized_user' as 'primary' | 'secondary' | 'authorized_user' | 'view_only',
    is_active: true,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (signatory) {
      setFormData({
        name: signatory.name,
        title: signatory.title || '',
        email: signatory.email,
        phone: signatory.phone || '',
        role: signatory.role,
        is_active: signatory.is_active,
        start_date: signatory.start_date,
        end_date: signatory.end_date || '',
      });
    }
  }, [signatory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock implementation until database is ready
      console.log('Signatory data:', {
        account_id: accountId,
        ...formData,
      });

      toast({
        title: "Success",
        description: signatory ? "Signatory updated successfully" : "Signatory added successfully",
      });

      onSuccess();
    } catch (error) {
      console.error('Error saving signatory:', error);
      toast({
        title: "Error",
        description: "Failed to save signatory",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="title">Position/Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g., Director, Partner, Manager"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="role">Signing Authority</Label>
        <Select value={formData.role} onValueChange={(value: 'primary' | 'secondary' | 'authorized_user' | 'view_only') => handleInputChange('role', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">Primary Signatory</SelectItem>
            <SelectItem value="secondary">Secondary Signatory</SelectItem>
            <SelectItem value="authorized_user">Authorized User</SelectItem>
            <SelectItem value="view_only">View Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_date">Effective Date *</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => handleInputChange('start_date', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="end_date">End Date (Optional)</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => handleInputChange('end_date', e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => handleInputChange('is_active', checked)}
        />
        <Label htmlFor="is_active">Active Signatory</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : signatory ? 'Update' : 'Add'} Signatory
        </Button>
      </div>
    </form>
  );
};

export default SignatoryForm;
