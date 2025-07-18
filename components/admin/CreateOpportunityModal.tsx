import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus } from 'lucide-react';
import { useCategories, useCreateOpportunity } from '@/lib/queries/useAdminOpportunities';
import { toast } from 'sonner';

const createOpportunitySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description must be less than 2000 characters'),
  company: z.string().min(1, 'Company is required').max(100, 'Company must be less than 100 characters'),
  location: z.string().min(1, 'Location is required').max(100, 'Location must be less than 100 characters'),
  deadline: z.string().min(1, 'Deadline is required'),
  application_url: z.string().url('Must be a valid URL'),
  image_url: z.string().url('Must be a valid URL'),
  category_id: z.string().min(1, 'Category is required'),
});

type CreateOpportunityFormData = z.infer<typeof createOpportunitySchema>;

export function CreateOpportunityModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const createOpportunity = useCreateOpportunity();

  const form = useForm<CreateOpportunityFormData>({
    resolver: zodResolver(createOpportunitySchema),
    defaultValues: {
      title: '',
      description: '',
      company: '',
      location: '',
      deadline: '',
      application_url: '',
      image_url: '',
      category_id: '',
    },
  });

  const onSubmit = async (data: CreateOpportunityFormData) => {
    try {
      await createOpportunity.mutateAsync(data);
      setIsOpen(false);
      form.reset();
    } catch (error) {
      // Error is handled by the mutation
      console.error('Failed to create opportunity:', error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create Opportunity</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Opportunity</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="e.g., Software Engineer Internship"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                {...form.register('company')}
                placeholder="e.g., Google Inc."
              />
              {form.formState.errors.company && (
                <p className="text-sm text-red-600">{form.formState.errors.company.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Describe the opportunity, requirements, and benefits..."
              rows={4}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-600">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                {...form.register('location')}
                placeholder="e.g., San Francisco, CA"
              />
              {form.formState.errors.location && (
                <p className="text-sm text-red-600">{form.formState.errors.location.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline *</Label>
              <Input
                id="deadline"
                type="date"
                {...form.register('deadline')}
              />
              {form.formState.errors.deadline && (
                <p className="text-sm text-red-600">{form.formState.errors.deadline.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_id">Category *</Label>
            <Select
              value={form.watch('category_id')}
              onValueChange={(value) => form.setValue('category_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categoriesLoading ? (
                  <SelectItem value="loading" disabled>
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Loading categories...</span>
                    </div>
                  </SelectItem>
                ) : (
                  categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {form.formState.errors.category_id && (
              <p className="text-sm text-red-600">{form.formState.errors.category_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="application_url">Application URL *</Label>
            <Input
              id="application_url"
              {...form.register('application_url')}
              placeholder="https://company.com/careers/apply"
            />
            {form.formState.errors.application_url && (
              <p className="text-sm text-red-600">{form.formState.errors.application_url.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL *</Label>
            <Input
              id="image_url"
              {...form.register('image_url')}
              placeholder="https://company.com/logo.png"
            />
            {form.formState.errors.image_url && (
              <p className="text-sm text-red-600">{form.formState.errors.image_url.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={createOpportunity.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createOpportunity.isPending}
              className="flex items-center space-x-2"
            >
              {createOpportunity.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Create Opportunity</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}