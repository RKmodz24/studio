export default function Home() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial', 
      textAlign: 'center',
      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      minHeight: '100vh',
      color: 'black'
    }}>
      <h1>🎉 Golden Hours App</h1>
      <p>Complete tasks, earn diamonds, and cash out!</p>
      
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '10px',
        margin: '20px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
      }}>
        <h3>💰 Balance: P0.00</h3>
        <button style={{ 
          padding: '15px 30px', 
          background: 'black', 
          color: 'gold',
          border: 'none',
          borderRadius: '25px',
          fontSize: '18px',
          margin: '10px'
        }}>
          Earn Rewards
        </button>
      </div>
      
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '10px',
        margin: '20px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
      }}>
        <h3>📱 Tasks Available</h3>
        <p>• Daily Check-in: 100 💎</p>
        <p>• Watch Ads: 50 💎</p>
        <p>• Refer Friends: 1000 💎</p>
      </div>
    </div>
  )
}
