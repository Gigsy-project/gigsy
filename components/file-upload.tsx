"use client"

import type React from "react"

import { useState, useRef, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import { useLanguage } from "./language-provider"
import { APP_CONFIG } from "@/lib/constants"

interface FileUploadProps {
  label: string
  multiple?: boolean
  accept?: string
  onChange: (files: File[]) => void
  variant?: "default" | "circle" | "id"
  buttonText?: string
  maxSize?: number
}

const FilePreview = memo(({ file, onRemove }: { file: File; onRemove: () => void }) => {
  const isImage = file.type.startsWith("image/")
  const previewUrl = isImage ? URL.createObjectURL(file) : null

  return (
    <div className="relative">
      {isImage && previewUrl ? (
        <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-muted">
          <Upload className="h-10 w-10 text-muted-foreground" />
        </div>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/80"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  )
})

FilePreview.displayName = "FilePreview"

export const FileUpload = memo<FileUploadProps>(
  ({
    label,
    multiple = false,
    accept,
    onChange,
    variant = "default",
    buttonText,
    maxSize = APP_CONFIG.maxFileSize,
  }) => {
    const { t } = useLanguage()
    const [files, setFiles] = useState<File[]>([])
    const [error, setError] = useState<string>("")
    const inputRef = useRef<HTMLInputElement>(null)

    const validateFile = useCallback(
      (file: File): string | null => {
        if (file.size > maxSize) {
          return `El archivo ${file.name} es demasiado grande. Máximo ${Math.round(maxSize / 1024 / 1024)}MB.`
        }
        return null
      },
      [maxSize],
    )

    const handleFileChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return

        const fileArray = Array.from(e.target.files)
        const validFiles: File[] = []
        let errorMessage = ""

        for (const file of fileArray) {
          const validationError = validateFile(file)
          if (validationError) {
            errorMessage = validationError
            break
          }
          validFiles.push(file)
        }

        if (errorMessage) {
          setError(errorMessage)
          return
        }

        setError("")
        const newFiles = multiple ? [...files, ...validFiles] : validFiles
        setFiles(newFiles)
        onChange(newFiles)
      },
      [files, multiple, onChange, validateFile],
    )

    const handleRemoveFile = useCallback(
      (index: number) => {
        const newFiles = files.filter((_, i) => i !== index)
        setFiles(newFiles)
        onChange(newFiles)
      },
      [files, onChange],
    )

    const handleClick = useCallback(() => {
      inputRef.current?.click()
    }, [])

    const renderVariant = () => {
      switch (variant) {
        case "circle":
          return (
            <div className="flex flex-col items-center">
              <div
                className="h-36 w-36 rounded-full bg-muted/50 flex items-center justify-center cursor-pointer hover:bg-muted/70 transition-colors border-2 border-dashed border-muted-foreground/20"
                onClick={handleClick}
              >
                {files.length > 0 ? (
                  <div className="relative h-full w-full rounded-full overflow-hidden">
                    <FilePreview file={files[0]} onRemove={() => handleRemoveFile(0)} />
                  </div>
                ) : (
                  <Upload className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <Button variant="outline" className="mt-4" onClick={handleClick}>
                {buttonText || t("form.upload")}
              </Button>
            </div>
          )

        case "id":
          return (
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/30 transition-colors h-40 flex flex-col items-center justify-center"
              onClick={handleClick}
            >
              {files.length > 0 ? (
                <div className="relative w-full h-full">
                  <FilePreview file={files[0]} onRemove={() => handleRemoveFile(0)} />
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Haz clic para subir o arrastra y suelta</p>
                </>
              )}
            </div>
          )

        default:
          return (
            <div
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={handleClick}
            >
              <div className="flex flex-col items-center justify-center gap-1">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">{t("form.upload")}</p>
                <p className="text-xs text-muted-foreground">
                  {multiple
                    ? "Arrastra y suelta archivos aquí o haz clic para seleccionar"
                    : "Arrastra y suelta un archivo aquí o haz clic para seleccionar"}
                </p>
              </div>
            </div>
          )
      }
    }

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}

        {renderVariant()}

        <input
          type="file"
          ref={inputRef}
          className="hidden"
          onChange={handleFileChange}
          multiple={multiple}
          accept={accept}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        {variant === "default" && files.length > 0 && (
          <ul className="mt-2 space-y-2">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between bg-muted/50 p-2 rounded-md"
              >
                <span className="text-sm truncate max-w-[80%]">{file.name}</span>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveFile(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  },
)

FileUpload.displayName = "FileUpload"
