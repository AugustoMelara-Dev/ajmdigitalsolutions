// src/lib/validation.js
import { z } from 'zod';

const phoneOptional = z
  .string()
  .optional()
  .transform((v) => (v ?? '').trim())
  .refine((v) => v === '' || /^[\d\s\-+()]{8,15}$/.test(v), 'Teléfono inválido')
  .transform((v) => (v ? v.replace(/\D/g, '') : ''));

export const ContactSchema = z.object({
  nombre: z
    .string()
    .min(2, 'Mínimo 2 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo letras y espacios'),
  email: z.string().email('Email inválido').max(100).transform((s) => s.toLowerCase()),
  telefono: phoneOptional,
  mensaje: z.string().min(10, 'Mínimo 10 caracteres').max(500).trim(),
  website: z.string().max(0, 'Campo debe estar vacío').optional().transform((v) => v ?? ''),
});

export default ContactSchema;
