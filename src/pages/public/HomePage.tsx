import React from 'react';
import { Hero } from '../../components/sections/Hero';
import { StatsBar } from '../../components/sections/StatsBar';
import { CelebrationVideoSection } from '../../components/sections/CelebrationVideoSection';
import { PostersSection } from '../../components/sections/PostersSection';
import { CoreValuesSection } from '../../components/sections/CoreValuesSection';
import { FeaturedCourses } from '../../components/sections/FeaturedCourses';
import { LatestEvents } from '../../components/sections/LatestEvents';
import { BannersSection } from '../../components/sections/BannersSection';
import { Testimonials } from '../../components/sections/Testimonials';
import { SocialMediaSection } from '../../components/sections/SocialMediaSection';
import { AnnouncementsTicker } from '../../components/common/AnnouncementsTicker';
import { PromotionalPopup } from '../../components/common/PromotionalPopup';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Dynamic Announcement Ticker Header */}
      <AnnouncementsTicker />

      {/* Dynamic Hero Slider */}
      <Hero />

      {/* Dynamic Quick Stats Bar */}
      <StatsBar />

      {/* Campus Achievement & Results Celebration Video */}
      <CelebrationVideoSection />

      {/* Dynamic Campus Posters & Notices */}
      <PostersSection />

      {/* Dynamic Core Values Section */}
      <CoreValuesSection />

      {/* Featured Courses (3 latest active) */}
      <FeaturedCourses />

      {/* Upcoming Campus Events (3 latest) */}
      <LatestEvents />

      {/* Dynamic Promotional Banners */}
      <BannersSection page="home" />

      {/* Dynamic Testimonials */}
      <Testimonials />

      {/* Dynamic Social Media Section */}
      <SocialMediaSection />

      {/* First-time Visit Promotional Popup */}
      <PromotionalPopup />
    </div>
  );
};
