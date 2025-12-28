'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { TestimonialService } from '@/services/testimonial.service';
import { Testimonial } from '@/types/testimonial';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const data = await TestimonialService.getActiveTestimonials();
        if (data && data.length > 0) {
          setTestimonials(data);
        } else {
          setTestimonials([]);
        }
      } catch (error) {
        console.error("Failed to load testimonials:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe) {
      nextTestimonial()
    } else if (isRightSwipe) {
      prevTestimonial()
    }
  }

  if (loading) return null;
  if (testimonials.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Matched to Product Grid */}
        <div className="max-w-4xl mb-16 text-center mx-auto">
          <p className="text-xs font-bold text-black mb-4 uppercase tracking-widest">
            Testimonials
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-black mb-6 leading-tight">
            Client Stories
          </h2>
          <p className="text-gray-500 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
            Hear from our valued customers about their experience with our premium collection.
          </p>
        </div>

        {/* Testimonial Slider */}
        <div className="max-w-5xl mx-auto relative">
          <div
            className="overflow-hidden cursor-grab active:cursor-grabbing"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="min-w-full px-4 sm:px-12"
                >
                  <div className="flex flex-col items-center text-center">

                    {/* Quote Icon - Clearly visible now */}
                    <Quote className="w-10 h-10 text-black mb-6 fill-black opacity-10" />

                    {/* Review Text - Huge & Premium */}
                    <blockquote className="text-2xl sm:text-3xl md:text-4xl font-serif leading-tight text-black mb-10 max-w-4xl">
                      &ldquo;{testimonial.review}&rdquo;
                    </blockquote>

                    {/* Star Rating - Golden */}
                    <div className="flex items-center gap-1.5 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < testimonial.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-200'
                            }`}
                        />
                      ))}
                    </div>

                    {/* Reviewer Name */}
                    <div>
                      <cite className="not-italic text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-1">
                        {testimonial.reviewer_name}
                      </cite>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons - Minimal line arrows */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 p-3 text-black hover:scale-110 transition-transform hidden md:block"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-8 h-8 font-light" strokeWidth={1} />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 p-3 text-black hover:scale-110 transition-transform hidden md:block"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-8 h-8 font-light" strokeWidth={1} />
              </button>
            </>
          )}

          {/* Indicators */}
          {testimonials.length > 1 && (
            <div className="flex justify-center mt-12 gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-0.5 transition-all duration-300 ${activeIndex === index ? 'w-8 bg-black' : 'w-4 bg-gray-200 hover:bg-gray-400'
                    }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;