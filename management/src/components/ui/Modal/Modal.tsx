/**
 * 模态框组件
 */

'use client'

import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '../Button'
import { cn } from '@/lib/utils'
import './Modal.css'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  className?: string
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
}: ModalProps) {
  // 处理ESC键关闭
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeOnEscape, onClose])

  // 防止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={cn(
        'modal-container',
        `modal-container--${size}`,
        className
      )}>
        {/* 头部 */}
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && (
              <h3 className="modal-title">
                {title}
              </h3>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="modal-close"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        )}

        {/* 内容 */}
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  )
}

// 模态框头部组件
export function ModalHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('modal-header', className)}>
      {children}
    </div>
  )
}

// 模态框内容组件
export function ModalBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('modal-body', className)}>
      {children}
    </div>
  )
}

// 模态框底部组件
export function ModalFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('modal-footer', className)}>
      {children}
    </div>
  )
}
