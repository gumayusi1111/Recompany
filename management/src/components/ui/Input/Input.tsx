/**
 * 输入框组件
 */

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import './Input.css'

const inputVariants = cva(
  'input-base',
  {
    variants: {
      variant: {
        default: 'input-default',
        filled: 'input-filled',
        outline: 'input-outline',
      },
      size: {
        sm: 'input-sm',
        md: 'input-md',
        lg: 'input-lg',
      },
      state: {
        default: '',
        error: 'input-error',
        success: 'input-success',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      state: 'default',
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  success?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  containerClassName?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant, 
    size, 
    state,
    label,
    error,
    success,
    helperText,
    leftIcon,
    rightIcon,
    containerClassName,
    ...props 
  }, ref) => {
    const inputState = error ? 'error' : success ? 'success' : state

    return (
      <div className={cn('input-container', containerClassName)}>
        {label && (
          <label className="input-label">
            {label}
            {props.required && <span className="input-required">*</span>}
          </label>
        )}
        
        <div className="input-wrapper">
          {leftIcon && (
            <div className="input-icon input-icon--left">
              {leftIcon}
            </div>
          )}
          
          <input
            className={cn(
              inputVariants({ variant, size, state: inputState, className }),
              leftIcon && 'input--with-left-icon',
              rightIcon && 'input--with-right-icon'
            )}
            ref={ref}
            {...props}
          />
          
          {rightIcon && (
            <div className="input-icon input-icon--right">
              {rightIcon}
            </div>
          )}
        </div>

        {(error || success || helperText) && (
          <div className="input-message">
            {error && <span className="input-error-text">{error}</span>}
            {success && <span className="input-success-text">{success}</span>}
            {!error && !success && helperText && (
              <span className="input-helper-text">{helperText}</span>
            )}
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
