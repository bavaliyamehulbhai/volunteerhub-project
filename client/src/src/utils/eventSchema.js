import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(3),

  description: z.string().min(10),

  location: z.string().min(2),

  category: z.string(),

  eventDate: z.string(),

  requiredVolunteers:
    z.coerce.number().min(1),

  requiredSkills:
    z.string().optional()
});