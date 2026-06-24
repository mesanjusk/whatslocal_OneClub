import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Carousel } from "react-responsive-carousel"
import Image from "next/image"
import clsx from "clsx"

export default function ImageCarousel({
  aspectRatio,
  imageUrls,
  aesthetic,
  style = {},
  className,
  ...props
}) {
  return (
    <Carousel
      {...props}
      className={clsx(
        "overflow-hidden",
        !aesthetic || aspectRatio === "4/5" ? "rounded-lg" : null,
        !aesthetic ? "border-border border" : null
      )}
      showIndicators={false}
      showArrows={true}
      showStatus={true}
      showThumbs={false}
      centerMode={false}
      verticalSwipe="standard"
      dynamicHeight={true}
      preventMovementUntilSwipeScrollTolerance={true}
      transitionTime={100}
    >
      {imageUrls.map((i, idx) => (
        <Image
          src={i}
          key={`carousel-${idx}`}
          alt={`Carausel Image No. ${idx}`}
          width={500}
          height={500}
          className={clsx("object-cover", className)}
          style={{
            aspectRatio,
            ...style,
            height: aspectRatio === "16/9" ? "auto" : style?.height,
          }}
        />
      ))}
    </Carousel>
  )
}
