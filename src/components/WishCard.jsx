import React from 'react';
import { motion } from 'framer-motion';

const WishCard = ({ name, message, onReply }) => {
    const [reply, setReply] = React.useState('');
    const [sent, setSent] = React.useState(false);

    const handleSend = (e) => {
        e.preventDefault();
        if (reply.trim()) {
            onReply(reply);
            setSent(true);
        }
    };

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="wish-card"
        >
            <h2 style={{ color: '#ff6f61', fontFamily: "'Pacifico', cursive", fontSize: '2.5rem', marginBottom: '1rem' }}>
                Happy New Year, {name}!
            </h2>
            <p style={{ color: '#555', fontSize: '1.2rem', lineHeight: '1.6', fontFamily: "'Nunito', sans-serif" }}>
                {message}
            </p>
            <div style={{ fontSize: '3rem', marginTop: '1rem', marginBottom: '2rem' }}>
                🎉✨💖
            </div>

            {!sent ? (
                <form onSubmit={handleSend} style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                    <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '0.5rem' }}>Send a reply to the Akhil:</p>
                    <textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Type your message here..."
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '10px',
                            border: '1px solid #ddd',
                            fontFamily: 'inherit',
                            marginBottom: '10px',
                            resize: 'vertical',
                            minHeight: '60px'
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: '8px 20px',
                            fontSize: '1rem',
                            // background: '#ff6f61',
                            background: '#ff6f61'
                        }}
                    >
                        Send Reply 💌
                    </button>
                </form>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ color: '#4caf50', marginTop: '1rem', fontWeight: 'bold' }}
                >
                    Message sent! Thank you! ❤️
                </motion.div>
            )}
        </motion.div>
    );
};

export default WishCard;
