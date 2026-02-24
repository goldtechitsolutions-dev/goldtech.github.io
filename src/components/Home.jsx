import React from 'react';
import HeroVideo from './HeroVideo';
import Services from './Services';
import Industries from './Industries';
import Insights from './Insights';
import SocialFeeds from './SocialFeeds';
import Testimonials from './Testimonials';
import BookingModal from './BookingModal';
import ContactForm from './ContactForm';
import About from './About';
import Products from './Products';
import Career from './Career';
const Home = () => {
    return (
        <>
            <HeroVideo />

            <BookingModal /> {/* Call to Action area */}
            <Services />
            <Industries />
            <Insights />
            <About />
            <Products />
            <Career />
            <SocialFeeds /> {/* GitHub/LinkedIn */}
            <Testimonials /> {/* Google Reviews */}
            <ContactForm />
        </>
    );
};

export default Home;
