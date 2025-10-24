import { z } from 'zod';

export const basicInfoSchema = z.object({
  firstName: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),

  lastName: z.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),

  dateOfBirth: z.string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      return age >= 3 && age <= 18;
    }, "Child must be between 3 and 18 years old"),

  gender: z.enum(["male", "female", "other"], {
    message: "Please select a gender"
  }),

  grade: z.enum([
    "preschool", "kindergarten", "grade1", "grade2", "grade3", "grade4",
    "grade5", "grade6", "grade7", "grade8", "grade9", "grade10", "grade11", "grade12"
  ], {
    message: "Please select a grade"
  }),

  schoolName: z.string()
    .min(2, "School name is required")
    .max(100, "School name must be less than 100 characters")
});

export const emergencySchema = z.object({
  primaryContact: z.object({
    name: z.string()
      .min(2, "Contact name must be at least 2 characters")
      .max(50, "Contact name must be less than 50 characters"),
    relationship: z.enum([
      "parent", "guardian", "grandparent", "aunt", "uncle", "sibling", "other"
    ], {
      message: "Please select relationship"
    }),
    phone: z.string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be less than 15 digits")
      .regex(/^\+?[1-9]\d{0,14}$/, "Please enter a valid phone number")
  }),

  secondaryContact: z.object({
    name: z.string()
      .min(2, "Contact name must be at least 2 characters")
      .max(50, "Contact name must be less than 50 characters"),
    relationship: z.enum([
      "parent", "guardian", "grandparent", "aunt", "uncle", "sibling", "other"
    ], {
      message: "Please select relationship"
    }),
    phone: z.string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be less than 15 digits")
      .regex(/^\+?[1-9]\d{0,14}$/, "Please enter a valid phone number")
  })
});

export type BasicInfoForm = z.infer<typeof basicInfoSchema>;
export type EmergencyForm = z.infer<typeof emergencySchema>;

export type ChildFormData = BasicInfoForm & EmergencyForm;
