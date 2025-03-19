"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { firebaseDb } from "@/lib/firebase/config"
import { collection, getDocs, doc } from "firebase/firestore"

const fetchImages = async (eventId: string) => {
  const imagesCollection = collection(firebaseDb, "events", eventId, "images"); // Fetch images under a specific event
  const imageSnapshot = await getDocs(imagesCollection);
  const imageList = imageSnapshot.docs.map(doc => ({
      src: doc.data().url, 
      alt: doc.data().alt || "Image", 
  }));

  return imageList;
  };

export default function ImageSlider({ eventId, className, uploadConfirmed }: { eventId: string, className?: string, uploadConfirmed: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [images, setImages] = useState<{ src: string; alt: string }[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      const fetchedImages = await fetchImages(eventId);
      setImages(fetchedImages);
    };
    loadImages();
  }, [uploadConfirmed, eventId]);

  if (images.length === 0) {
    return <div>Det finnes ingen bilder enda</div>;
  }

  const handlePrevious = () => {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1))
  }

  const handleNext = () => {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1))
  }

  const handleImageClick = (index: number) => {
    setActiveIndex(index)
  }

  return (
    <div className={cn("relative w-full max-w-4xl mx-auto", className)}>
      <div className="relative overflow-hidden rounded-lg">
        <div className="flex items-center justify-center h-[500px] bg-muted">
          {/* Main image container */}
          <div className="relative flex items-center justify-center w-full">
            {/* Side images (left) */}
            <div className="absolute left-4 flex items-center h-full z-10 pointer-events-none">
              {activeIndex > 0 && (
                <div
                  className="w-24 h-36 mr-2 rounded overflow-hidden opacity-50 grayscale transition-all duration-300 transform -translate-x-4 pointer-events-auto cursor-pointer"
                  onClick={() => handleImageClick(activeIndex - 1)}
                >
                  <img
                    src={images[activeIndex - 1].src || "/placeholder.svg"}
                    alt={images[activeIndex - 1].alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Active image */}
            <div className="w-full max-w-2xl h-full flex items-center justify-center transition-all duration-500 ease-in-out">
              <img
                src={images[activeIndex].src || "/placeholder.svg"}
                alt={images[activeIndex].alt}
                className="max-h-full max-w-full object-contain shadow-lg transition-all duration-500"
              />
            </div>

            {/* Side images (right) */}
            <div className="absolute right-4 flex items-center h-full z-10 pointer-events-none">
              {activeIndex < images.length - 1 && (
                <div
                  className="w-24 h-36 ml-2 rounded overflow-hidden opacity-50 grayscale transition-all duration-300 transform translate-x-4 pointer-events-auto cursor-pointer"
                  onClick={() => handleImageClick(activeIndex + 1)}
                >
                  <img
                    src={images[activeIndex + 1].src || "/placeholder.svg"}
                    alt={images[activeIndex + 1].alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={handlePrevious}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={handleNext}
          aria-label="Next image"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Image indicators */}
      <div className="flex justify-center mt-4 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={cn("w-2 h-2 rounded-full transition-all", activeIndex === index ? "bg-primary w-4" : "bg-muted")}
            onClick={() => handleImageClick(index)}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}