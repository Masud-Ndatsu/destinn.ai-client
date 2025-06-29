"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { Category } from "@/lib/actions/api";

const opportunitySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  company: z.string().min(1, "Company name is required."),
  location: z.string().min(1, "Location is required."),
  deadline: z.string().min(1, "Deadline is required."),
  link: z.string().url("Link must be a valid URL."),
  category_id: z.string().min(1, "Category is required."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
});

type OpportunityForm = z.infer<typeof opportunitySchema>;

type OpportunityProp = {
  categories: Category[];
};

export function CreateOpportunityForm({ categories }: OpportunityProp) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OpportunityForm>({
    resolver: zodResolver(opportunitySchema),
  });

  const [banner, setBanner] = useState<File | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);

  const onBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBanner(file);
      setBannerError(null);
    } else {
      setBanner(null);
      setBannerError("Image is required");
    }
  };

  const onSubmit: SubmitHandler<OpportunityForm> = async (data) => {
    if (!banner) {
      setBannerError("Image is required");
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    formData.append("banner", banner);

    try {
      // Send formData to API
      console.log("Form submitted:", data);
      reset();
      setBanner(null);
      setBannerError(null);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register("title")}
        placeholder="Opportunity Title"
        className="rounded-none"
      />
      {errors.title && (
        <p className="text-sm text-red-500">{errors.title.message}</p>
      )}

      <Input
        {...register("company")}
        placeholder="Company Name"
        className="rounded-none"
      />
      {errors.company && (
        <p className="text-sm text-red-500">{errors.company.message}</p>
      )}

      <Input
        {...register("location")}
        placeholder="Location"
        className="rounded-none"
      />
      {errors.location && (
        <p className="text-sm text-red-500">{errors.location.message}</p>
      )}

      <Input
        {...register("deadline")}
        placeholder="Deadline (YYYY-MM-DD)"
        type="datetime-local"
        className="rounded-none"
      />
      {errors.deadline && (
        <p className="text-sm text-red-500">{errors.deadline.message}</p>
      )}

      <Input
        {...register("link")}
        placeholder="Application Link"
        className="rounded-none"
      />
      {errors.link && (
        <p className="text-sm text-red-500">{errors.link.message}</p>
      )}

      <div>
        <Label htmlFor="category_id" className="block mb-1 text-sm font-medium">
          Select Category
        </Label>
        <select
          {...register("category_id")}
          id="category_id"
          className="rounded-none border w-full p-2 text-black"
        >
          <option value="">-- Select a category --</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.category_id && (
          <p className="text-sm text-red-500">{errors.category_id.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="banner" className="block mb-1 text-sm font-medium">
          Opportunity Banner
        </Label>
        <Input
          id="banner"
          type="file"
          accept="image/*"
          onChange={onBannerChange}
          className="rounded-none"
        />
        {bannerError && <p className="text-sm text-red-500">{bannerError}</p>}
      </div>

      <Textarea
        {...register("description")}
        placeholder="Opportunity Description"
        className="rounded-none h-[250px]"
      />
      {errors.description && (
        <p className="text-sm text-red-500">{errors.description.message}</p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-none"
      >
        Submit
      </Button>
    </form>
  );
}
