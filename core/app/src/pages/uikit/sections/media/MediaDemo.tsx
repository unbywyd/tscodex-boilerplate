import { useState } from 'react'
import { User } from 'lucide-react'
import { Avatar, AvatarRoot, AvatarImage, AvatarFallback } from '@/components/ui/Avatar'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from '@/components/ui/Carousel'
import { Lightbox, LightboxImage } from '@/components/ui/Lightbox'
import {
  ImageUpload,
  AvatarUpload,
  CoverUpload,
  MultiImageUpload,
} from '@/components/ui/ImageUpload'
import { FileUpload } from '@/components/ui/FileUpload'
import { Button } from '@/components/ui/Button'
import { CodeBlock } from '../../components/CodeBlock'
import { SectionHeader } from '../../components/SectionHeader'
import { DemoCard } from '../../components/DemoCard'
import { useScrollToSection } from '../../hooks/useScrollToSection'

const sampleImages = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
]

export function MediaDemo() {
  useScrollToSection()
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [multiImages, setMultiImages] = useState<(string | File)[]>([])
  const [lightboxOpen, setLightboxOpen] = useState(false)

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Media Components"
        description="Avatars, carousels, lightboxes, and image/file upload components."
      />

      {/* Avatar */}
      <DemoCard id="avatar" title="Avatar - User Profile Picture">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            User avatars with fallback initials. Built on Radix UI Avatar.
          </p>
          <CodeBlock
            code={`<Avatar
  src="https://github.com/shadcn.png"
  alt="John Doe"
  size="md"
/>

// With fallback
<Avatar
  alt="John Doe"
  fallback="JD"
  size="lg"
/>

// Different sizes: sm, md, lg, xl`}
            id="avatar"
          />
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <Avatar
                src="https://github.com/shadcn.png"
                alt="User 1"
                size="sm"
              />
              <Avatar
                src="https://github.com/shadcn.png"
                alt="User 2"
                size="md"
              />
              <Avatar
                src="https://github.com/shadcn.png"
                alt="User 3"
                size="lg"
              />
              <Avatar
                src="https://github.com/shadcn.png"
                alt="User 4"
                size="xl"
              />
            </div>

            <div className="flex items-center gap-4">
              <Avatar alt="John Doe" fallback="JD" size="md" />
              <Avatar alt="Jane Smith" fallback="JS" size="md" />
              <Avatar alt="Bob Wilson" fallback="BW" size="md" />
              <Avatar fallback="?" size="md" />
            </div>

            <div className="flex items-center gap-4">
              <Avatar
                src="https://invalid-url.png"
                alt="Broken Image"
                fallback="BI"
                size="md"
              />
              <AvatarRoot className="w-10 h-10">
                <AvatarImage src="https://github.com/shadcn.png" alt="Custom" />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </AvatarRoot>
            </div>
          </div>
        </div>
      </DemoCard>

      {/* Carousel */}
      <DemoCard id="carousel" title="Carousel - Image Slider">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Responsive carousel with navigation and dots. Built on Embla Carousel.
          </p>
          <CodeBlock
            code={`<Carousel autoplay={{ delay: 3000 }}>
  <CarouselContent>
    <CarouselItem>
      <img src="..." alt="Slide 1" />
    </CarouselItem>
    <CarouselItem>
      <img src="..." alt="Slide 2" />
    </CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
  <CarouselDots />
</Carousel>`}
            id="carousel"
          />
          <div className="pt-2">
            <Carousel className="w-full max-w-xl mx-auto" autoplay>
              <CarouselContent>
                {sampleImages.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={img}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
              <CarouselDots />
            </Carousel>
          </div>

          <div className="pt-4">
            <p className="text-xs font-medium mb-2 text-muted-foreground">
              Multiple items per view:
            </p>
            <Carousel
              className="w-full"
              opts={{ slidesToScroll: 1, align: 'start' }}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <CarouselItem key={num} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3">
                    <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                      <span className="text-2xl font-bold text-muted-foreground">{num}</span>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </DemoCard>

      {/* Lightbox */}
      <DemoCard id="lightbox" title="Lightbox - Fullscreen Image Viewer">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Fullscreen image viewer with zoom, navigation, and keyboard support.
          </p>
          <CodeBlock
            code={`// Single image
<LightboxImage
  src="image.jpg"
  alt="Photo"
  caption="Beautiful landscape"
/>

// Multiple images
<Lightbox
  images={[
    { src: 'img1.jpg', alt: 'Photo 1', caption: 'Caption 1' },
    { src: 'img2.jpg', alt: 'Photo 2', caption: 'Caption 2' },
  ]}
  initialIndex={0}
  open={open}
  onOpenChange={setOpen}
/>`}
            id="lightbox"
          />
          <div className="grid grid-cols-3 gap-4 pt-2">
            {sampleImages.map((img, i) => (
              <LightboxImage
                key={i}
                src={img}
                alt={`Nature ${i + 1}`}
                caption={`Beautiful landscape photo ${i + 1}`}
                className="aspect-square rounded-lg object-cover border"
              />
            ))}
          </div>

          <div className="pt-4">
            <Button onClick={() => setLightboxOpen(true)}>
              Open Gallery Lightbox
            </Button>
            <Lightbox
              images={sampleImages.map((src, i) => ({
                src,
                alt: `Photo ${i + 1}`,
                caption: `Gallery image ${i + 1}`,
              }))}
              open={lightboxOpen}
              onOpenChange={setLightboxOpen}
            />
          </div>
        </div>
      </DemoCard>

      {/* ImageUpload */}
      <DemoCard id="image-upload" title="ImageUpload - Image Picker with Preview">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Image upload with drag & drop, preview, and crop support. Built on react-dropzone.
          </p>
          <CodeBlock
            code={`// Square image upload
<ImageUpload
  value={file}
  onChange={setFile}
  shape="square"
  size="md"
/>

// Avatar upload
<AvatarUpload
  value={file}
  onChange={setFile}
  fallback="JD"
  size="lg"
/>

// Cover image upload
<CoverUpload
  value={file}
  onChange={setFile}
  height="md"
/>

// Multiple images
<MultiImageUpload
  value={images}
  onChange={setImages}
  maxImages={6}
/>`}
            id="image-upload"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div>
              <p className="text-xs font-medium mb-2">Avatar Upload:</p>
              <AvatarUpload
                value={avatarFile}
                onChange={setAvatarFile}
                fallback="JD"
                size="lg"
              />
            </div>

            <div>
              <p className="text-xs font-medium mb-2">Square Image:</p>
              <ImageUpload
                value={null}
                onChange={() => {}}
                shape="square"
                size="lg"
              />
            </div>

            <div>
              <p className="text-xs font-medium mb-2">Circle Image:</p>
              <ImageUpload
                value={null}
                onChange={() => {}}
                shape="circle"
                size="lg"
              />
            </div>
          </div>

          <div className="pt-4">
            <p className="text-xs font-medium mb-2">Cover Upload:</p>
            <CoverUpload
              value={coverFile}
              onChange={setCoverFile}
              height="md"
            />
          </div>

          <div className="pt-4">
            <p className="text-xs font-medium mb-2">Multiple Images (Gallery):</p>
            <MultiImageUpload
              value={multiImages}
              onChange={setMultiImages}
              maxImages={6}
            />
          </div>
        </div>
      </DemoCard>

      {/* FileUpload */}
      <DemoCard id="file-upload" title="FileUpload - File Picker">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            File upload with drag & drop and file type filtering.
          </p>
          <CodeBlock
            code={`<FileUpload
  accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
  maxFiles={5}
  maxSize={10 * 1024 * 1024} // 10MB
  onFilesSelected={(files) => console.log(files)}
  showFileList
/>

// Compact mode
<FileUpload
  compact
  accept={{ 'application/pdf': ['.pdf'] }}
  multiple={false}
/>`}
            id="file-upload"
          />
          <div className="space-y-6 pt-2">
            <div>
              <p className="text-xs font-medium mb-2 text-muted-foreground">
                Full mode (images):
              </p>
              <FileUpload
                accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] }}
                maxFiles={3}
                onFilesSelected={(files) => console.log('Files:', files)}
              />
            </div>

            <div>
              <p className="text-xs font-medium mb-2 text-muted-foreground">
                Compact mode (PDF only):
              </p>
              <FileUpload
                compact
                accept={{ 'application/pdf': ['.pdf'] }}
                multiple={false}
                title="Upload PDF"
                description="Drag and drop or click to browse"
              />
            </div>

            <div>
              <p className="text-xs font-medium mb-2 text-muted-foreground">
                Documents:
              </p>
              <FileUpload
                compact
                accept={{
                  'application/pdf': ['.pdf'],
                  'application/msword': ['.doc', '.docx'],
                  'text/plain': ['.txt'],
                }}
                maxFiles={5}
              />
            </div>
          </div>
        </div>
      </DemoCard>

      {/* Props Reference */}
      <DemoCard title="Props Reference">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">Component</th>
                <th className="text-left py-2 pr-4">Key Props</th>
                <th className="text-left py-2">Notes</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              <tr className="border-b">
                <td className="py-2 pr-4">Avatar</td>
                <td className="py-2 pr-4">src, alt, fallback, size</td>
                <td className="py-2">Built on Radix UI</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">Carousel</td>
                <td className="py-2 pr-4">autoplay, opts, orientation</td>
                <td className="py-2">Built on Embla Carousel</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">Lightbox</td>
                <td className="py-2 pr-4">images, initialIndex, open</td>
                <td className="py-2">Zoom, navigation, keyboard</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">ImageUpload</td>
                <td className="py-2 pr-4">shape, size, maxSize, aspectRatio</td>
                <td className="py-2">Built on react-dropzone</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">AvatarUpload</td>
                <td className="py-2 pr-4">fallback, size</td>
                <td className="py-2">Circle shape for profiles</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">CoverUpload</td>
                <td className="py-2 pr-4">height (sm/md/lg)</td>
                <td className="py-2">Wide rectangle for banners</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">FileUpload</td>
                <td className="py-2 pr-4">accept, maxFiles, maxSize, compact</td>
                <td className="py-2">Any file type support</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DemoCard>
    </div>
  )
}
