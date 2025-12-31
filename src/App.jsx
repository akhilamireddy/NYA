import React, { useState } from 'react';
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from './firebase';
import WishCard from './components/WishCard';
import { motion } from 'framer-motion';

const GENERIC_MESSAGES = [
  "May the New Year bring you lasting happiness, renewed hope, and countless opportunities to grow into the best version of yourself, surrounded by positivity and peace.",
  "Wishing you a New Year filled with meaningful moments, good health, and the strength to turn your dreams into steady and satisfying achievements.",
  "Here’s to a fresh beginning where past lessons guide you wisely and new opportunities inspire you to move forward with confidence and joy.",
  "May this year unfold gently for you, bringing unexpected happiness, personal growth, and reasons to be proud of how far you’ve come.",
  "Sending heartfelt wishes for a year full of success, calm days, supportive people, and moments that truly make life feel rewarding.",
  "Cheers to a New Year that gives you clarity in your goals, courage in your actions, and happiness in both small and big victories.",
  "May the coming year help you release old worries, embrace new possibilities, and build a future filled with purpose and balance.",
  "Wishing you patience for the journey ahead, motivation to keep going, and joy in every milestone you reach along the way.",
  "May this New Year be a time when your hard work pays off and your efforts are met with recognition, fulfillment, and peace of mind.",
  "Here’s to appreciating the past, living fully in the present, and stepping into the future with hope and determination.",
  "Wishing you a year where your health is strong, your mind is calm, and your heart is content with all that life offers.",
  "May every month bring steady progress, every challenge bring wisdom, and every success bring gratitude into your life.",
  "To a New Year filled with positive energy, steady growth, and moments that remind you why your journey matters.",
  "May your days be productive and your nights be restful, allowing you to move through the year with balance and clarity.",
  "Wishing you confidence in your decisions, strength in difficult times, and joy in the choices that shape your future.",
  "Here’s to turning thoughtful plans into real actions and long-held dreams into meaningful accomplishments.",
  "May kindness surround you, guide your actions, and return to you in ways that make the year truly special.",
  "Wishing you a New Year marked by balance, resilience, and progress that feels both earned and satisfying.",
  "May this year open new doors for learning, growth, and opportunities that align with your goals and values.",
  "Cheers to a year of perseverance, renewal, and reaching milestones that once felt just out of reach.",
  "Wishing you moments that matter, connections that uplift you, and memories that stay warm long after they’re made.",
  "May the New Year bring harmony between your personal life and responsibilities, creating space for joy and rest.",
  "Here’s to choosing growth over fear, patience over frustration, and joy over unnecessary worry this year.",
  "Wishing you inspiration to begin new chapters and the determination to see them through to the end.",
  "May each challenge strengthen you, each lesson guide you, and each success remind you of your potential.",
  "Sending warm wishes for a year rich with laughter, learning experiences, and genuine happiness.",
  "May this New Year be gentle with your heart and generous in rewarding your efforts and persistence.",
  "Wishing you strength on difficult days and gratitude on good days, helping you stay grounded throughout the year.",
  "Here’s to fresh ideas, thoughtful risks, and outcomes that leave you proud of the path you chose.",
  "May the New Year light your way forward and fill your journey with purpose and optimism.",
  "Wishing you success that feels meaningful and happiness that comes from within, not just from achievements.",
  "May your dedication be recognized, your voice be heard, and your dreams be supported in the year ahead.",
  "Cheers to a year focused on steady progress, self-respect, and living with intention.",
  "Wishing you a New Year filled with calm thoughts, supportive relationships, and a sense of fulfillment.",
  "May this year bring focus to your ambitions and joy to the everyday moments along the way.",
  "Here’s to growing wiser from experience, kinder through understanding, and stronger with each new step.",
  "Wishing you opportunities that challenge you positively and rewards that make the effort worthwhile.",
  "May the New Year bring meaningful work, personal satisfaction, and enough rest to truly enjoy both.",
  "Sending wishes for prosperity, peace of mind, and consistent positivity throughout the year.",
  "Here’s to a year where small wins add up to big changes and lasting happiness.",
  "Wishing you optimism to start each day and peace to end each night with gratitude.",
  "May your year be guided by hope, strengthened by effort, and rewarded with fulfillment.",
  "Cheers to a clean slate, renewed motivation, and endless possibilities waiting to be explored.",
  "Wishing you encouragement when you need it and pride in the progress you make each month.",
  "May the New Year bring steady steps forward and confidence in the direction you’re heading.",
  "Here’s to good health, genuine happiness, and relationships that add meaning to your life.",
  "Wishing you purpose in your plans and joy in the process of achieving them.",
  "May this year reflect your best intentions, honest efforts, and continued personal growth.",
  "Cheers to learning from the past, embracing the present, and building a hopeful future.",
  "Wishing you a New Year rich with purpose, peace, and moments that truly make you smile."
];

function App() {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    const normalizedName = name.trim().toLowerCase();

    try {
      // 1. Check User History first
      const historyQ = query(collection(db, "user_history"), where("name_lower", "==", normalizedName));
      const historySnapshot = await getDocs(historyQ);

      if (!historySnapshot.empty) {
        // User has been here before, give same message
        setMessage(historySnapshot.docs[0].data().message);
        setSubmitted(true);
        setLoading(false);
        return;
      }

      // 2. Check Personalized Wishes
      // We'll query for exact name match for simplicity, or could store lowercase in 'wishes' too.
      // Assuming 'wishes' has exact casing or we just try to match.
      const wishQ = query(collection(db, "wishes"), where("name", "==", name.trim()));
      const wishSnapshot = await getDocs(wishQ);

      let finalMessage = "";

      if (!wishSnapshot.empty) {
        finalMessage = wishSnapshot.docs[0].data().message;
      } else {
        finalMessage = GENERIC_MESSAGES[Math.floor(Math.random() * GENERIC_MESSAGES.length)];
      }

      setMessage(finalMessage);

      // 3. Save to History
      await addDoc(collection(db, "user_history"), {
        name: name.trim(),
        name_lower: normalizedName,
        message: finalMessage,
        timestamp: new Date()
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Error fetching wish:", error);
      const randomMsg = GENERIC_MESSAGES[Math.floor(Math.random() * GENERIC_MESSAGES.length)];
      setMessage(randomMsg);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (replyText) => {
    try {
      await addDoc(collection(db, "replies"), {
        name: name,
        message: replyText,
        timestamp: new Date()
      });
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setMessage('');
  };

  return (
    <div className="app-container">
      {!submitted ? (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <h1 style={{ fontFamily: "'Pacifico', cursive", color: '#ff6f61', fontSize: '3rem', marginBottom: '2rem' }}>
            Get Your New Year Wish ✨
          </h1>
          <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <input
              type="text"
              placeholder="Enter your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Looking for magic...' : 'Get My Wish! 🎁'}
            </button>
          </form>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <WishCard name={name} message={message} onReply={handleReply} />
          <button onClick={handleReset} style={{ marginTop: '2rem', background: '#fff', color: '#ff6f61', border: '2px solid #ff6f61' }}>
            Check Another Name
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
