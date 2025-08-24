import { useState } from 'react'
import imageCompression from 'browser-image-compression'

interface CompressionOptions {
  maxSizeMB?: number
  maxWidthOrHeight?: number
  useWebWorker?: boolean
  fileType?: string
}

interface UseImageCompressionReturn {
  compressImage: (file: File, options?: CompressionOptions) => Promise<File>
  isCompressing: boolean
  error: string | null
}

export const useImageCompression = (): UseImageCompressionReturn => {
  const [isCompressing, setIsCompressing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const compressImage = async (
    file: File, 
    options: CompressionOptions = {}
  ): Promise<File> => {
    const {
      maxSizeMB = 0.5,
      maxWidthOrHeight = 256,
      useWebWorker = true,
      fileType = 'image/webp'
    } = options

    setIsCompressing(true)
    setError(null)

    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB,
        maxWidthOrHeight,
        useWebWorker,
        fileType
      })

      return compressedFile
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setIsCompressing(false)
    }
  }

  return {
    compressImage,
    isCompressing,
    error
  }
}
