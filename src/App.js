import { useState, useEffect } from 'react';
import Calendar from "./Calendar";
import BitcoinDonationButton from "./Components/BitcoinDonationButton";
import EthDonationButton from "./Components/EthDonationButton";
import GivethButton from "./Components/GivethButton";
import GeyserButton from "./Components/GeyserButton";
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

// Main App component
function App() {
  // --- State for Animation Visibility ---
  // We'll set these to true after mount to trigger transitions
  const [isLogoVisible, setIsLogoVisible] = useState(false);
  const [isNoticeVisible, setIsNoticeVisible] = useState(false);
  const [isAddressVisible, setIsAddressVisible] = useState(false);
  const [isLinksVisible, setIsLinksVisible] = useState(false);
  const [isDividerVisible, setIsDividerVisible] = useState(false);
  const [isDonationVisible, setIsDonationVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  // --- Effect to Trigger Animations ---
  useEffect(() => {
    // Use timeouts to stagger the animations
    const timer1 = setTimeout(() => setIsLogoVisible(true), 100); // Logo first
    const timer2 = setTimeout(() => setIsNoticeVisible(true), 200); // Notice
    const timer3 = setTimeout(() => setIsAddressVisible(true), 400); // Address
    const timer4 = setTimeout(() => setIsLinksVisible(true), 500); // Links
    const timer6 = setTimeout(() => setIsDividerVisible(true), 700); // Divider
    const timer7 = setTimeout(() => setIsDonationVisible(true), 800); // Donation section
    const timer8 = setTimeout(() => setIsCalendarVisible(true), 900); // Calendar last

    // Cleanup function to clear timeouts if component unmounts
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer6);
      clearTimeout(timer7);
      clearTimeout(timer8);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Base Styles (Mostly unchanged) ---
  const mainContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at bottom, #111827 0%, #1a2331 50%, #2c3a50 100%)',
    color: '#E5E7EB',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
    padding: '3rem 1.5rem',
    textAlign: 'center',
    overflowX: 'hidden',
  };

  const contentBlockStyle = {
    width: '100%',
    maxWidth: '48rem',
    textAlign: 'center',
    marginTop: '5vh',
    marginBottom: '12vh',
  };

  // --- Animated Styles ---
  // Function to generate common animation styles
  const getAnimatedStyle = (isVisible, delay = 0) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)', // Slide up effect
    transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`, // Added delay parameter if needed directly (though useEffect handles stagger)
  });

  const logoStyle = {
    width: 'clamp(180px, 45vw, 350px)',
    maxWidth: '100%',
    height: 'auto',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '2.5rem',
    ...getAnimatedStyle(isLogoVisible), // Apply animation styles
  };

  const noticeSectionStyle = {
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    border: '1px solid rgba(251, 191, 36, 0.4)',
    borderRadius: '12px',
    padding: '1.5rem 2rem',
    marginBottom: '2.5rem',
    textAlign: 'center',
    ...getAnimatedStyle(isNoticeVisible),
  };

  const noticeTitleStyle = {
    fontSize: 'clamp(1.1rem, 4.5vw, 1.4rem)',
    fontWeight: '700',
    color: '#FBBF24',
    marginBottom: '1rem',
    marginTop: '0',
  };

  const noticeTextStyle = {
    fontSize: 'clamp(0.95rem, 3.5vw, 1.05rem)',
    color: '#E5E7EB',
    lineHeight: '1.7',
    marginBottom: '1rem',
  };

  const noticeLinkStyle = {
    color: '#FBBF24',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.2s ease',
  };

  const addressStyle = {
    fontSize: 'clamp(1rem, 4vw, 1.15rem)',
    color: '#B0BEC5',
    marginBottom: '2.5rem',
    lineHeight: '1.7',
    ...getAnimatedStyle(isAddressVisible), // Apply animation styles
  };

  const linksContainerStyle = {
    marginBottom: '3rem',
    ...getAnimatedStyle(isLinksVisible), // Apply animation styles to the container
  };

  const linkStyle = { // Individual links don't need animation if container fades in
    display: 'block',
    color: '#82AAFF',
    textDecoration: 'none',
    marginBottom: '1rem',
    fontSize: 'clamp(1rem, 4vw, 1.1rem)',
    fontWeight: '500',
  };

  const dividerStyle = {
    height: '1px',
    width: '80%',
    maxWidth: '300px',
    border: 'none',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    margin: '4rem auto',
    ...getAnimatedStyle(isDividerVisible), // Apply animation styles
  };

  const donationSectionStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    padding: '2.5rem',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    ...getAnimatedStyle(isDonationVisible), // Apply animation styles
  };

  const donationTitleStyle = {
    fontSize: 'clamp(1.4rem, 5.5vw, 2rem)',
    fontWeight: '700',
    marginBottom: '1.25rem',
    color: '#FFFFFF',
  };

  const donationTextStyle = {
    color: '#E0E0E0',
    marginBottom: '2rem',
    lineHeight: '1.8',
    fontSize: 'clamp(0.95rem, 3.8vw, 1.05rem)',
  };

  const donationButtonsContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
  };

  const donationButtonWrapperStyle = {
    width: '100%',
    maxWidth: '400px',
  };

  const calendarContainerStyle = {
    width: '100%',
    maxWidth: '65rem',
    marginBottom: '4rem',
    ...getAnimatedStyle(isCalendarVisible), // Apply animation styles
  };

  // --- JSX Structure ---
  return (
    <div style={mainContainerStyle}>
      <div style={contentBlockStyle}>
        {/* Apply animated style object */}
        <img
          style={logoStyle}
          src={"/DCTRL_logo.png"}
          alt="Dctrl Logo"
          onError={(e) => { /* Error handling */ }}
        />

        {/* Urgent Notice Section */}
        <div style={noticeSectionStyle}>
          <h2 style={noticeTitleStyle}>Vancouver's Longest-Running Decentralized Tech Space</h2>
          <p style={noticeTextStyle}>
            We are urgently looking for support to transition to our new space for lease, purchase, or storage starting <strong>March 1st</strong>.
          </p>
          <p style={noticeTextStyle}>
            <a href="https://0xtangle.notion.site/vancouver-hub" target="_blank" rel="noopener noreferrer" style={noticeLinkStyle}>Read our vision →</a>
          </p>
          <p style={{...noticeTextStyle, marginBottom: 0}}>
            Contact us at <a href="mailto:hello@dctrl.wtf" style={noticeLinkStyle}>hello@dctrl.wtf</a>
          </p>
        </div>

        {/* Apply animated style object */}
        <p style={addressStyle}>
          436 W Pender Street, Vancouver, BC
        </p>

        {/* Apply animated style object to container */}
        <div style={linksContainerStyle}>
          <a href="https://x.com/dctrlvan" target="_blank" rel="noopener noreferrer" style={linkStyle}>@dctrlvan</a>
          <a href="https://discord.gg/7rjEfhtsxe" target="_blank" rel="noopener noreferrer" style={linkStyle}>Discord</a>
          <a href="https://yvrbepsi.com" target="_blank" rel="noopener noreferrer" style={linkStyle}>Drink Machine</a>
          <a href="https://door3.dctrl.wtf" target="_blank" rel="noopener noreferrer" style={linkStyle}>Door Access</a>
          <a href="https://0xtangle.notion.site/GENERAL-GUIDELINES-a4de149c5be1412f9e7723d2cc8381d3" target="_blank" rel="noopener noreferrer" style={linkStyle}>Community Guidelines</a>
        </div>

        {/* Apply animated style object */}
        <hr style={dividerStyle} />

        {/* Apply animated style object */}
        <div style={donationSectionStyle}>
          <h2 style={donationTitleStyle}>Consider making a donation</h2>
          <p style={donationTextStyle}>
            Donations are sent to the multisig address, help support the DCTRL community, and are greatly appreciated!
          </p>
          <div style={donationButtonsContainerStyle}>
            <div style={donationButtonWrapperStyle}><BitcoinDonationButton /></div>
            <div style={donationButtonWrapperStyle}><EthDonationButton /></div>
            <div style={donationButtonWrapperStyle}><GivethButton /></div>
            <div style={donationButtonWrapperStyle}><GeyserButton /></div>
          </div>
        </div>
      </div>

      {/* Apply animated style object */}
      <hr style={dividerStyle} />


      {/* Gallery Section */}
      <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: '700', color: '#FFFFFF', marginBottom: '2rem' }}>
        The Clubhouse
      </h2>
        <ImageGallery
          items={[
            {
              original: '/1.webp',
              thumbnail: '/1.webp',
              description: 'Museum of blockchain relics',
              originalAlt: 'Museum of blockchain relics',
              thumbnailAlt: 'Museum of blockchain relics',
            },
            {
              original: '/2.webp',
              thumbnail: '/2.webp',
              description: 'Co-founders Cam and Freddie with Vitalik Buterin',
              originalAlt: 'Co-founders Cam and Freddie with Vitalik Buterin',
              thumbnailAlt: 'Co-founders Cam and Freddie with Vitalik Buterin',
            },
            {
              original: '/3.webp',
              thumbnail: '/3.webp',
              description: 'Main event area',
              originalAlt: 'Main event area',
              thumbnailAlt: 'Main event area',
            },
            {
              original: '/4.webp',
              thumbnail: '/4.webp',
              description: 'Tea wall and vending machines',
              originalAlt: 'Tea wall and vending machines',
              thumbnailAlt: 'Tea wall and vending machines',
            },
            {
              original: '/5.webp',
              thumbnail: '/5.webp',
              description: 'Vancouver Mayor Ken Sim using the Bepsi',
              originalAlt: 'Vancouver Mayor Ken Sim using the Bepsi',
              thumbnailAlt: 'Vancouver Mayor Ken Sim using the Bepsi',
            },
            {
              original: '/6.webp',
              thumbnail: '/6.webp',
              description: 'Members meeting room',
              originalAlt: 'Members meeting room',
              thumbnailAlt: 'Members meeting room',
            },
            {
              original: '/7.webp',
              thumbnail: '/7.webp',
              description: 'Live stream equipment and piano',
              originalAlt: 'Live stream equipment and piano',
              thumbnailAlt: 'Live stream equipment and piano',
            },
            {
              original: '/8.webp',
              thumbnail: '/8.webp',
              description: 'One of many events from over the years',
              originalAlt: 'One of many events from over the years',
              thumbnailAlt: 'One of many events from over the years',
            },
            {
              original: '/9.webp',
              thumbnail: '/9.webp',
              description: 'Ethereum birthday party',
              originalAlt: 'Ethereum birthday party',
              thumbnailAlt: 'Ethereum birthday party',
            },
          ]}
          showThumbnails={true}
          showPlayButton={true}
          autoPlay={true}
          slideInterval={4000}
          showFullscreenButton={true}
          showBullets={true}
          showIndex={true}
        />


      {/* Apply animated style object */}
      <hr style={dividerStyle} />

      {/* Apply animated style object */}
      <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: '700', color: '#FFFFFF' }}>
        Calendar
      </h2>
      <div style={calendarContainerStyle}>
        <Calendar />
      </div>
    </div>
  );
}

export default App;
