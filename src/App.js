import React, { useState, useEffect } from 'react'; // Import hooks
// Assuming Calendar, BitcoinDonationButton, and EthDonationButton are correctly imported
import Calendar from "./Calendar"; // Assuming this path is correct
import BitcoinDonationButton from "./Membership/Components/BitcoinDonationButton"; // Assuming this path is correct
import EthDonationButton from "./Membership/Components/EthDonationButton"; // Assuming this path is correct
// Keep react-router-dom Link for navigation
import { Link as RouterLink } from 'react-router-dom';

// Main App component
function App() {
  // --- State for Animation Visibility ---
  // We'll set these to true after mount to trigger transitions
  const [isLogoVisible, setIsLogoVisible] = useState(false);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isAddressVisible, setIsAddressVisible] = useState(false);
  const [isLinksVisible, setIsLinksVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isDividerVisible, setIsDividerVisible] = useState(false);
  const [isDonationVisible, setIsDonationVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  // --- Effect to Trigger Animations ---
  useEffect(() => {
    // Use timeouts to stagger the animations
    const timer1 = setTimeout(() => setIsLogoVisible(true), 100); // Logo first
    const timer2 = setTimeout(() => setIsTitleVisible(true), 200); // Then title
    const timer3 = setTimeout(() => setIsAddressVisible(true), 300); // Address
    const timer4 = setTimeout(() => setIsLinksVisible(true), 400); // Links
    const timer5 = setTimeout(() => setIsButtonVisible(true), 500); // Button
    const timer6 = setTimeout(() => setIsDividerVisible(true), 600); // Divider
    const timer7 = setTimeout(() => setIsDonationVisible(true), 700); // Donation section
    const timer8 = setTimeout(() => setIsCalendarVisible(true), 800); // Calendar last

    // Cleanup function to clear timeouts if component unmounts
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
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

  const titleStyle = {
    fontSize: 'clamp(2.5rem, 10vw, 4rem)',
    fontWeight: '800',
    marginBottom: '1rem',
    letterSpacing: '-0.03em',
    background: 'linear-gradient(90deg, #FACC15, #FF8C00)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    ...getAnimatedStyle(isTitleVisible), // Apply animation styles
    // Ensure transition doesn't break background-clip
    transition: `opacity 0.6s ease-out, transform 0.6s ease-out`,
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

  const membershipLinkWrapperStyle = {
    display: 'inline-block',
    marginBottom: '4rem',
    ...getAnimatedStyle(isButtonVisible), // Apply animation styles
  };

  const membershipButtonStyle = {
    borderRadius: '50px',
    background: 'linear-gradient(60deg, #FFEB3B, #FFC107)',
    color: '#212121',
    padding: '14px 32px',
    fontSize: 'clamp(1.05rem, 4.5vw, 1.2rem)',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 6px 20px 0 rgba(255, 215, 0, 0.35)',
    // Add transition for potential future interactive styles if needed
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
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

        {/* Apply animated style object */}
        <h1 style={titleStyle}>DCTRL</h1>
        {/* Apply animated style object */}
        <p style={addressStyle}>
          436 W Pender Street, Vancouver, BC
        </p>

        {/* Apply animated style object to container */}
        <div style={linksContainerStyle}>
          <a href="https://x.com/dctrlvan" target="_blank" rel="noopener noreferrer" style={linkStyle}>@dctrlvan</a>
          <a href="https://discord.gg/7rjEfhtsxe" target="_blank" rel="noopener noreferrer" style={linkStyle}>Discord</a>
          <a href="https://yvrsidewalk.com" target="_blank" rel="noopener noreferrer" style={linkStyle}>Sidewalk</a>
          <a href="https://yvrbepsi.com" target="_blank" rel="noopener noreferrer" style={linkStyle}>Drink Machine</a>
          <a href="https://door3.dctrl.wtf" target="_blank" rel="noopener noreferrer" style={linkStyle}>Door Access</a>
          <a href="https://0xtangle.notion.site/GENERAL-GUIDELINES-a4de149c5be1412f9e7723d2cc8381d3" target="_blank" rel="noopener noreferrer" style={linkStyle}>Community Guidelines</a>
        </div>

        {/* Apply animated style object to wrapper
        <RouterLink to="/membership" style={membershipLinkWrapperStyle}>
          <button style={membershipButtonStyle} type="button">
            Membership
          </button>
        </RouterLink> */}

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
          </div>
        </div>
      </div>

      {/* Apply animated style object */}
      <hr style={dividerStyle} />

      <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: '700', color: '#FFFFFF' }}>
        The Future of Crypto is DCTRL
      </h2>
      <img src="photo.webp" alt="DCTRL Members" style={{ marginTop: '2rem', maxWidth: '100%', borderRadius: '8px' }} />


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
