'use client';

import { useState, useEffect } from 'react';
import { CSSProperties } from 'react';
import Slider from 'react-slick';
import { supabase } from '@/lib/supabase'; // Import the Supabase client
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ink = '#1C1510'; // Dark text
const cream = '#F9F6F0'; // Light background
const border = '#D9D0C1'; // Subtle border color
const green = '#1E8A4D'; // Button color
const display = "'Playfair Display', Georgia, serif";
const serif = "'Source Serif 4', Georgia, serif";
const wrap = '1120px';

const sectionLabelStyle: CSSProperties = {
  fontFamily: serif,
  fontSize: '11px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#9C8878',
  marginBottom: '14px',
};

const sectionHeadingStyle: CSSProperties = {
  fontFamily: display,
  fontSize: 'clamp(2rem, 4vw, 3rem)',
  fontWeight: 400,
  lineHeight: 1.15,
  color: ink,
  marginBottom: '24px',
};

const sectionTextStyle: CSSProperties = {
  fontFamily: serif,
  fontSize: '18px',
  lineHeight: 1.8,
  fontWeight: 300,
  color: '#5C4A38',
  maxWidth: '700px',
  marginBottom: '40px',
  marginLeft: 'auto',
  marginRight: 'auto',
};

const reviewCardStyle: CSSProperties = {
  background: '#FFF9F1',
  padding: '24px',
  borderRadius: '10px',
  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)',
  textAlign: 'center',
  maxWidth: '300px',
  marginLeft: 'auto',
  marginRight: 'auto',
};

const testimonialStyle: CSSProperties = {
  fontFamily: serif,
  fontSize: '16px',
  lineHeight: 1.6,
  fontStyle: 'italic',
  color: '#5C4A38',
  marginBottom: '16px',
};

const authorStyle: CSSProperties = {
  fontFamily: serif,
  fontSize: '14px',
  color: '#1C1510',
  fontWeight: 600,
};

const primaryButton: CSSProperties = {
  display: 'inline-block',
  fontFamily: serif,
  fontSize: '14px',
  fontWeight: 400,
  background: ink,
  color: cream,
  padding: '12px 24px',
  borderRadius: '9999px',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  textAlign: 'center',
  transition: 'background-color 0.3s ease',
  marginTop: '20px',
};

export default function ReviewSection() {
  const [reviews, setReviews] = useState<any[]>([]); // State to store reviews

  // Fetch reviews from Supabase on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('reviews') // Replace 'reviews' with your table name
        .select('*'); // Fetch all columns or adjust as needed

      if (error) {
        console.error('Error fetching reviews:', error);
      } else {
        setReviews(data); // Set fetched reviews to state
      }
    };

    fetchReviews();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div style={{ background: cream, minHeight: '100vh' }}>
      <Navbar />

      {/* Review Section */}
      <section style={{ padding: '100px 24px 80px', borderTop: `1px solid ${border}` }}>
        <div style={{ maxWidth: wrap, margin: '0 auto', textAlign: 'center' }}>
          <p style={sectionLabelStyle}>What Our Users Say</p>

          <h2 style={sectionHeadingStyle}>Current Reviews</h2>

          <p style={sectionTextStyle}>
            Here’s what our users have to say about our platform. Their feedback helps us improve and grow.
          </p>

          {/* Review Carousel */}
          <Slider {...settings}>
            {reviews.length > 0 ? (
              reviews.map((review: any, index: number) => (
                <div key={index} style={reviewCardStyle}>
                  <p style={testimonialStyle}>"{review.review_text}"</p>
                  <p style={authorStyle}>{review.author}</p>
                </div>
              ))
            ) : (
              <div style={reviewCardStyle}>
                <p style={testimonialStyle}>No reviews available.</p>
              </div>
            )}
          </Slider>

          {/* Google Reviews Link */}
          <Link
            href="https://g.page/r/CW5Zf9rFJ4f0EAI/review"
            target="_blank"
            style={primaryButton}
          >
            Leave a Google Review →
          </Link>

        </div>
      </section>

      <Footer />
    </div>
  );
}
