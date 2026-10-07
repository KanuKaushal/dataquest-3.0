'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Upload, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { formatBytes, type UploadedFile } from '@/lib/new-request'
import { cn } from '@/lib/utils'

interface DropZoneProps {
  files: UploadedFile[]
  onAdd: (files: UploadedFile[]) => void
  onRemove: (id: string) => void
}

export function DropZone({ files, onAdd, onRemove }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function addFiles(list: FileList | null) {
    if (!list || list.length === 0) return
    onAdd(
      Array.from(list).map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
      })),
    )
  }

  return (
    <div>
      <motion.div
        animate={{ scale: dragging ? 1.01 : 1 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        onDragEnter={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false)
        }}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          addFiles(event.dataTransfer.files)
        }}
        className={cn(
          'rounded-md border border-dashed transition-colors duration-150',
          dragging ? 'border-accent bg-hover' : 'hover:bg-hover',
        )}
      >
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center gap-2 rounded-md px-6 py-9 text-center text-[13px] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
        >
          <Upload className="size-4 text-muted-foreground" strokeWidth={1.5} aria-hidden />
          <span>
            Drop photos or documents here, or{' '}
            <span className="underline decoration-border underline-offset-4">browse</span>
          </span>
          <span className="font-mono text-xs text-muted-foreground">JPG, PNG or PDF, up to 10 MB each</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,.pdf"
          tabIndex={-1}
          aria-label="Upload photos or documents"
          className="sr-only"
          onChange={(event) => {
            addFiles(event.target.files)
            event.target.value = ''
          }}
        />
      </motion.div>

      <ul className="divide-y">
        <AnimatePresence initial={false}>
          {files.map((file) => (
            <motion.li
              key={file.id}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-4 py-2.5 text-[13px]">
                <span className="min-w-0 flex-1 truncate">{file.name}</span>
                <span className="font-mono text-xs text-muted-foreground">{formatBytes(file.size)}</span>
                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => onRemove(file.id)}
                  className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <X className="size-3.5" strokeWidth={1.5} aria-hidden />
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}
