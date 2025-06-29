"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal } from "../ui/modal";

const opportunitySchema = z.object({
  title: z.string().min(3),
  company: z.string(),
  location: z.string(),
  deadline: z.string(),
  description: z.string().min(10),
});

type OpportunityForm = z.infer<typeof opportunitySchema>;

export function CreateOpportunityModal() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OpportunityForm>({
    resolver: zodResolver(opportunitySchema),
  });

  const onSubmit = (data: OpportunityForm) => {
    console.log("Submitted opportunity:", data);
    // TODO: Send to API
    reset();
  };

  return (
    <Modal
      title="Create New Opportunity"
      trigger={<Button className="rounded-none">Create Opportunity</Button>}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            {...register("title")}
            placeholder="Opportunity Title"
            className="rounded-none"
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        <Input
          {...register("company")}
          placeholder="Company Name"
          className="rounded-none"
        />

        <Input
          {...register("location")}
          placeholder="Location"
          className="rounded-none"
        />

        <Input
          {...register("deadline")}
          placeholder="Deadline (YYYY-MM-DD)"
          className="rounded-none"
        />

        <div>
          <Textarea
            {...register("description")}
            placeholder="Opportunity Description"
            className="rounded-none"
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-none"
        >
          Submit
        </Button>
      </form>
    </Modal>
  );
}
