"use client"

import { useState, useCallback } from "react"
import { validateEmail, validatePhone } from "@/lib/utils"
import type { FormData, ValidationErrors } from "@/lib/types"

interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
}

interface ValidationRules {
  [key: string]: ValidationRule
}

export const useFormValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<ValidationErrors>({})

  const validateField = useCallback(
    (name: string, value: any): string | null => {
      const rule = rules[name]
      if (!rule) return null

      if (rule.required && (!value || (typeof value === "string" && !value.trim()))) {
        return `${name} es requerido`
      }

      if (typeof value === "string") {
        if (rule.minLength && value.length < rule.minLength) {
          return `${name} debe tener al menos ${rule.minLength} caracteres`
        }

        if (rule.maxLength && value.length > rule.maxLength) {
          return `${name} no puede tener más de ${rule.maxLength} caracteres`
        }

        if (rule.pattern && !rule.pattern.test(value)) {
          return `${name} tiene un formato inválido`
        }
      }

      if (rule.custom) {
        return rule.custom(value)
      }

      return null
    },
    [rules],
  )

  const validateForm = useCallback(
    (formData: FormData): boolean => {
      const newErrors: ValidationErrors = {}

      Object.keys(rules).forEach((fieldName) => {
        const error = validateField(fieldName, formData[fieldName])
        if (error) {
          newErrors[fieldName] = error
        }
      })

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    },
    [rules, validateField],
  )

  const clearError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[fieldName]
      return newErrors
    })
  }, [])

  const clearAllErrors = useCallback(() => {
    setErrors({})
  }, [])

  return {
    errors,
    validateForm,
    validateField,
    clearError,
    clearAllErrors,
  }
}

// Common validation rules
export const commonValidationRules = {
  email: {
    required: true,
    custom: (value: string) => (validateEmail(value) ? null : "Email inválido"),
  },
  phone: {
    required: true,
    custom: (value: string) => (validatePhone(value) ? null : "Teléfono inválido"),
  },
  password: {
    required: true,
    minLength: 8,
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
}
