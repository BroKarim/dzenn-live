"use client";

import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/kibo-ui/marquee";
import {
  Testimonial,
  TestimonialAuthor,
  TestimonialAuthorName,
  TestimonialAuthorTagline,
  TestimonialAvatar,
  TestimonialAvatarImg,
  TestimonialAvatarRing,
  TestimonialQuote,
  TestimonialVerifiedBadge,
} from "@/components/testimonials-marquee";

const testimonials = [
  {
    quote: "This is super useful for creators. Simple, fast, and beautifully built. Well done!",
    author: "Ajay Patel",
    tagline: "Co-founder & CEO @ CleVision",
    avatar: "https://dqy38fnwh4fqs.cloudfront.net/UHKKD8JAKENEDMR1JK6GEBDAMJDD/hkkd8jakenedmr1jk6gebdamjdd-599-profile.webp",
  },
  {
    quote: "it's a great product tbh.",
    author: "Fardeen Mansoori",
    tagline: "founding engineer @Naia",
    avatar: "https://pbs.twimg.com/profile_images/1958473274725142528/aPD_fzlo_400x400.jpg",
  },
  {
    quote: "Loved the minimalist and smooth onboarding flow.",
    author: "Shoeb Ilyas",
    tagline: "Software Developer",
    avatar: "https://media.licdn.com/dms/image/v2/D5603AQFy4SdZiGvOeA/profile-displayphoto-shrink_800_800/B56ZfcInXvHoAc-/0/1751744935891?e=1769040000&v=beta&t=wO9BaNqD1jJ66KO8020Aw10dp5324JQDlzI6xWEekk0",
  },
  {
    quote: "Setting up my profile took less than 5 minutes. The interface is intuitive and the customization options are perfect for my brand.",
    author: "Sylvester Marquant",
    tagline: "Creator. Product Designer.",
    avatar: "https://pbs.twimg.com/profile_images/1962870790753341440/mHGEUcOi_400x400.jpg",
  },
  {
    quote: "Man you are goated, used it now added all the socials and portfolio to it.",
    author: "Prateek Dwivedi",
    tagline: "Full Stack Engineer",
    avatar: "https://pbs.twimg.com/profile_images/1973113812418174979/YBec6oLk_400x400.jpg",
  },
  {
    quote: "This is definitely something I’ll check out, nice one. I love all these new tools and services popping up now.",
    author: "Daniel",
    tagline: "Been doing SEO for 20+ years.",
    avatar: "https://pbs.twimg.com/profile_images/2000436415079792651/WvLaJG2t_400x400.jpg",
  },
  {
    quote: "Prioritizing performance aligns better with user needs.",
    author: "Junji Lim",
    tagline: "Building ScaleX.",
    avatar: "https://pbs.twimg.com/profile_images/1891459986687135744/G4z5Oa8e_400x400.jpg",
  },
  {
    quote: "This is what I would call minimalism.",
    author: "Misbah Ansari",
    tagline: "Web2 & Web3",
    avatar: "https://pbs.twimg.com/profile_images/1971879592693571584/R_jAPxxY_400x400.jpg",
  },
  {
    quote: "goes so hard. neat and minimal, love it",
    author: "shobhit",
    tagline: "Fullstack engineer",
    avatar: "https://pbs.twimg.com/profile_images/1595381969990217728/WLhyEQ6C_400x400.jpg",
  },
];

export function LandingTestimonials() {
  return (
    <section className="border-t-2 border-dashed border-zinc-200 pt-24 md:pt-32 pb-24 md:pb-32 bg-zinc-100">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-medium mb-2">
            Loved by creators
          </h2>
          <p className="text-sm text-zinc-600">
            See what people are saying about OneURL
          </p>
        </div>

        <Marquee className="[--duration:40s]">
          <MarqueeFade side="left" className="from-zinc-100" />
          <MarqueeContent>
            {testimonials.map((testimonial, index) => (
              <MarqueeItem key={index} className="w-[350px]">
                <Testimonial className="h-full bg-zinc-100 rounded-lg border border-zinc-200 shadow-sm">
                  <TestimonialQuote>{testimonial.quote}</TestimonialQuote>
                  <TestimonialAuthor>
                    <TestimonialAvatar>
                      <TestimonialAvatarImg
                        src={testimonial.avatar}
                        alt={testimonial.author}
                      />
                      <TestimonialAvatarRing />
                    </TestimonialAvatar>
                    <TestimonialAuthorName>
                      {testimonial.author}
                      <TestimonialVerifiedBadge />
                    </TestimonialAuthorName>
                    <TestimonialAuthorTagline>
                      {testimonial.tagline}
                    </TestimonialAuthorTagline>
                  </TestimonialAuthor>
                </Testimonial>
              </MarqueeItem>
            ))}
          </MarqueeContent>
          <MarqueeFade side="right" className="from-zinc-100" />
        </Marquee>
      </div>
    </section>
  );
}

