// FileUpload / Dropzone - File upload with drag and drop
// Built on react-dropzone
import * as React from 'react'
import { useDropzone, type Accept } from 'react-dropzone'
import { cn } from '@/lib/utils'
import { Upload, File, X, Image, FileText, Film, Music, Archive, Loader2 } from 'lucide-react'
import { Button } from './Button'

interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  // Accepted file types
  accept?: Accept
  // Max files
  maxFiles?: number
  // Max file size in bytes
  maxSize?: number
  // Multiple files
  multiple?: boolean
  // Disabled
  disabled?: boolean
  // On files selected
  onFilesSelected?: (files: File[]) => void
  // On file removed
  onFileRemoved?: (file: File) => void
  // Show file list
  showFileList?: boolean
  // Compact mode
  compact?: boolean
  // Custom text
  title?: string
  description?: string
  // Loading state
  loading?: boolean
}

// Get icon for file type
const getFileIcon = (file: File) => {
  const type = file.type
  if (type.startsWith('image/')) return Image
  if (type.startsWith('video/')) return Film
  if (type.startsWith('audio/')) return Music
  if (type.includes('pdf') || type.includes('document')) return FileText
  if (type.includes('zip') || type.includes('rar') || type.includes('archive')) return Archive
  return File
}

// Format file size
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      className,
      accept,
      maxFiles = 10,
      maxSize = 10 * 1024 * 1024, // 10MB
      multiple = true,
      disabled = false,
      onFilesSelected,
      onFileRemoved,
      showFileList = true,
      compact = false,
      title = 'Upload files',
      description = 'Drag and drop files here, or click to browse',
      loading = false,
      ...props
    },
    ref
  ) => {
    const [files, setFiles] = React.useState<File[]>([])

    const onDrop = React.useCallback(
      (acceptedFiles: File[]) => {
        const newFiles = multiple ? [...files, ...acceptedFiles].slice(0, maxFiles) : acceptedFiles.slice(0, 1)
        setFiles(newFiles)
        onFilesSelected?.(newFiles)
      },
      [files, maxFiles, multiple, onFilesSelected]
    )

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
      onDrop,
      accept,
      maxFiles: multiple ? maxFiles : 1,
      maxSize,
      multiple,
      disabled: disabled || loading,
    })

    const removeFile = (fileToRemove: File) => {
      const newFiles = files.filter((f) => f !== fileToRemove)
      setFiles(newFiles)
      onFileRemoved?.(fileToRemove)
      onFilesSelected?.(newFiles)
    }

    if (compact) {
      return (
        <div ref={ref} className={cn('space-y-2', className)} {...props}>
          <div
            {...getRootProps()}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border-2 border-dashed cursor-pointer transition-colors',
              isDragActive && 'border-primary bg-primary/5',
              isDragReject && 'border-red-500 bg-red-50',
              !isDragActive && !isDragReject && 'border-muted-foreground/25 hover:border-primary/50',
              (disabled || loading) && 'opacity-50 cursor-not-allowed'
            )}
          >
            <input {...getInputProps()} />
            <div className="p-2 rounded-lg bg-muted">
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                <Upload className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{title}</p>
              <p className="text-xs text-muted-foreground truncate">{description}</p>
            </div>
            <Button variant="outline" size="sm" disabled={disabled || loading}>
              Browse
            </Button>
          </div>

          {/* File list */}
          {showFileList && files.length > 0 && (
            <div className="space-y-1">
              {files.map((file, index) => {
                const Icon = getFileIcon(file)
                return (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm truncate flex-1">{file.name}</span>
                    <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                    <button
                      onClick={() => removeFile(file)}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )
    }

    return (
      <div ref={ref} className={cn('space-y-4', className)} {...props}>
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={cn(
            'flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed cursor-pointer transition-colors',
            isDragActive && 'border-primary bg-primary/5',
            isDragReject && 'border-red-500 bg-red-50',
            !isDragActive && !isDragReject && 'border-muted-foreground/25 hover:border-primary/50',
            (disabled || loading) && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input {...getInputProps()} />
          <div className="p-3 rounded-full bg-muted mb-4">
            {loading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <p className="text-sm font-medium mb-1">{title}</p>
          <p className="text-xs text-muted-foreground text-center mb-3">{description}</p>
          <Button variant="outline" size="sm" disabled={disabled || loading}>
            Browse files
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Max {formatFileSize(maxSize)} per file
            {multiple && ` • Up to ${maxFiles} files`}
          </p>
        </div>

        {/* File list */}
        {showFileList && files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">{files.length} file(s) selected</p>
            <div className="grid gap-2">
              {files.map((file, index) => {
                const Icon = getFileIcon(file)
                return (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                  >
                    <div className="p-2 rounded-lg bg-muted">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      onClick={() => removeFile(file)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }
)
FileUpload.displayName = 'FileUpload'

export { FileUpload, formatFileSize }
