
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Signatory } from '@/types/signatory';
import { supabase } from '@/integrations/supabase/client';

interface SignatoryFormProps {
  accountId: string;
  signatory?: Signatory | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const SignatoryForm = ({ accountId, signatory, onSuccess, onCancel }: SignatoryFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'authorized_user' as 'primary' | 'secondary' | 'authorized_user' | 'view_only',
    is_active: true,
    date_added: new Date().toISOString().split('T')[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (signatory) {
      setFormData({
        name: signatory.name,
        email: signatory.email,
        phone: signatory.phone || '',
        address: '', // This would need to be fetched from the database if stored
        role: signatory.role,
        is_active: signatory.is_active,
        date_added: signatory.start_date,
      });
    }
  }, [signatory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const signatoryData = {
        account_id: accountId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        address: formData.address || null,
        role: formData.role,
        is_active: formData.is_active,
        date_added: formData.date_added,
      };

      if (signatory) {
        // Update existing signatory
        const { error } = await supabase
          .from('signatories')
          .update(signatoryData)
          .eq('id', signatory.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Signatory updated successfully",
        });
      } else {
        // Create new signatory
        const { error } = await supabase
          .from('signatories')
          .insert([signatoryData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Signatory added successfully",
        });
      }

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
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
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
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="Enter full address"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="date_added">Effective Date *</Label>
        <Input
          id="date_added"
          type="date"
          value={formData.date_added}
          onChange={(e) => handleInputChange('date_added', e.target.value)}
          required
        />
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
