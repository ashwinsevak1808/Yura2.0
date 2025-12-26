'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    position: 'Marketing Director',
    company: 'Global Innovations',
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg',
    quote: 'The quality of Office Wear\'s clothing is exceptional. I\'ve received numerous compliments on their suits, and the fabric holds up beautifully even with daily wear.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Mark Reynolds',
    position: 'Senior Financial Analyst',
    company: 'Vertex Capital',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    quote: 'Their business casual collection helped me elevate my everyday office style. The fit is perfect and the pieces are versatile enough to mix and match.',
    rating: 4,
  },
  {
    id: 3,
    name: 'Jennifer Chen',
    position: 'Corporate Attorney',
    company: 'Pacific Law Partners',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    quote: 'As a legal professional, I need clothing that projects confidence and competence. Office Wear\'s women\'s suits are both stylish and appropriate for courtroom appearances.',
    rating: 5,
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-8 md:mb-12">
          <h2 className="text-sm font-medium text-black mb-3 uppercase tracking-wider">
            Testimonials
          </h2>
          <h3 className="text-3xl sm:text-4xl font-serif font-bold mb-4 text-black">
            What Our Customers Say
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Hear from professionals who trust us to elevate their workplace presence
          </p>
        </div>

        {/* Testimonial Slider */}
        <div className="max-w-4xl mx-auto relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out-expo"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="min-w-full px-4"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 mb-6 relative">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>

                    <div className="flex items-center mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < testimonial.rating
                            ? 'text-orange-400 fill-orange-400'
                            : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>

                    <blockquote className="text-xl sm:text-2xl font-serif italic text-gray-800 mb-6">
                      "{testimonial.quote}"
                    </blockquote>

                    <div>
                      <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">
                        {testimonial.position}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={prevTestimonial}
              className="p-2 border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextTestimonial}
              className="p-2 border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 ${activeIndex === index ? 'bg-orange-400' : 'bg-gray-300'
                  } transition-colors duration-300`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;