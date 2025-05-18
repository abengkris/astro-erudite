'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Share2,
  Copy,
  X,
  Twitter,
  Facebook,
  Linkedin,
  Link2,
  Instagram,
  Mail,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { useMobile } from '@/hooks/use-mobile.ts'

interface ShareButtonProps {
  title: string
  url?: string
  description?: string
}

export function ShareButton({ title, url, description }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMobile()

  // Use the current URL if none provided
  const shareUrl =
    url || (typeof window !== 'undefined' ? window.location.href : '')

  // Handle native sharing (Web Share API)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        })
        toast('Berhasil dibagikan', {
          duration: 2000,
        })
      } catch (error) {
        // User cancelled or share failed
        if ((error as Error).name !== 'AbortError') {
          setIsOpen(true) // Fallback to manual share dialog
        }
      }
    } else {
      setIsOpen(true) // Fallback to manual share dialog
    }
  }

  // Handle copy link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    toast('Berhasil menyalin tautan ke papan klip', {
      duration: 2000,
    })
    setIsOpen(false)
  }

  // Generate social media share URLs
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
  const emailShareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this article: ${shareUrl}`)}`

  // Handle social media sharing
  const handleSocialShare = (platform: string, shareUrl: string) => {
    window.open(shareUrl, `share-${platform}`, 'width=600,height=400')
    setIsOpen(false)
    toast(`Berhasil dibagikan ke ${platform}`, {
      duration: 2000,
    })
  }

  // Shared content for both dialog and drawer
  const ShareOptions = () => (
    <div className="grid grid-cols-4 gap-4 py-4">
      <button
        onClick={() => handleSocialShare('Twitter', twitterShareUrl)}
        className="flex flex-col items-center gap-2 rounded-lg p-3 transition-colors hover:bg-gray-800"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1DA1F2]">
          <Twitter className="h-6 w-6 text-white" />
        </div>
        <span className="text-sm">Twitter</span>
      </button>

      <button
        onClick={() => handleSocialShare('Facebook', facebookShareUrl)}
        className="flex flex-col items-center gap-2 rounded-lg p-3 transition-colors hover:bg-gray-800"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1877F2]">
          <Facebook className="h-6 w-6 text-white" />
        </div>
        <span className="text-sm">Facebook</span>
      </button>

      <button
        onClick={() => handleSocialShare('LinkedIn', linkedinShareUrl)}
        className="flex flex-col items-center gap-2 rounded-lg p-3 transition-colors hover:bg-gray-800"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0A66C2]">
          <Linkedin className="h-6 w-6 text-white" />
        </div>
        <span className="text-sm">LinkedIn</span>
      </button>

      <button
        onClick={() => handleSocialShare('Email', emailShareUrl)}
        className="flex flex-col items-center gap-2 rounded-lg p-3 transition-colors hover:bg-gray-800"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-700">
          <Mail className="h-6 w-6 text-white" />
        </div>
        <span className="text-sm">Email</span>
      </button>

      <button
        onClick={handleCopyLink}
        className="flex flex-col items-center gap-2 rounded-lg p-3 transition-colors hover:bg-gray-800"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-700">
          <Link2 className="h-6 w-6 text-white" />
        </div>
        <span className="text-sm">Copy Link</span>
      </button>

      <button
        onClick={() => handleSocialShare('Instagram', 'https://instagram.com')}
        className="flex flex-col items-center gap-2 rounded-lg p-3 transition-colors hover:bg-gray-800"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500">
          <Instagram className="h-6 w-6 text-white" />
        </div>
        <span className="text-sm">Instagram</span>
      </button>
    </div>
  )

  const LinkCopySection = () => (
    <div className="mt-2 flex items-center justify-between">
      <div className="mr-2 flex-1 truncate rounded-lg bg-gray-800 p-2 text-sm text-gray-400">
        {shareUrl}
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={handleCopyLink}
        className="flex-shrink-0"
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  )

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleNativeShare}
        aria-label="Share this article"
      >
        <Share2 className="h-5 w-5" />
      </Button>

      {isMobile ? (
        // Mobile: Drawer Component
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className="rounded-t-xl bg-[#1e1f24] text-gray-200">
            <div className="mx-auto my-3 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-700" />
            <DrawerHeader>
              <DrawerTitle className="text-xl">
                Bagikan Postingan ini
              </DrawerTitle>
              <DrawerDescription className="text-gray-400">
                Pilih cara Anda ingin membagikan postingan ini
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4">
              <ShareOptions />
              <LinkCopySection />
            </div>
            <DrawerFooter className="pt-2 pb-6">
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  Close
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        // Desktop: Dialog Component
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="border-gray-800 bg-[#1e1f24] text-gray-200 sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">
                Bagikan Postingan ini
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Pilih cara Anda ingin membagikan postingan ini
              </DialogDescription>
            </DialogHeader>

            <ShareOptions />
            <LinkCopySection />

            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
