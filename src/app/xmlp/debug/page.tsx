import React from 'react';

/**
 * Internal Developer Verification Page
 * Securely rendered on the server.
 */
export default function DevProofPage() {
    const developerName = "MR PATEL";
    const projectYear = "2026";
    const message = `I’m mr PATEL — and when I really think about it, I realize I’m a deeply thoughtful and introspective man who reflects before reacting. I care more than I show, and not everyone gets access to that softer side of me. I carry a quiet strength within me that helps me push through difficult situations. My mind is naturally curious — I don’t just accept things, I want to understand how they truly work. I’m emotionally intense, even though I often appear calm on the outside. I value loyalty and honesty over popularity or temporary attention. When I love, I love genuinely and with my whole heart. I’m resilient — life may shake me, but it doesn’t break me. I have the ability to read between the lines and sense what people don’t say out loud. My creativity shows in the way I think, solve problems, and express myself. I’m ambitious, even though sometimes I doubt how capable I really am. My mentality is built around growth — I always want to improve and become better. I do overthink at times and replay situations in my head more than I should. I can be very hard on myself, expecting more from me than anyone else does. I prefer deep, meaningful conversations over shallow small talk. I know I have leadership qualities, even if I don’t always step forward to show them. Once I decide on something, my determination becomes my biggest strength. One of my weaknesses is that I sometimes trust the wrong people or give too much of myself. I’m both logical and emotional, which makes me balanced but also complex. Overall, I’m still a work in progress — strong, evolving, imperfect, and full of potential. ✨`;

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
            color: '#ededed',
            fontFamily: 'Inter, sans-serif',
            padding: '2rem',
            textAlign: 'center'
        }}>
            <div style={{
                maxWidth: '600px',
                border: '1px solid #333',
                padding: '3rem',
                borderRadius: '8px',
                backgroundColor: '#111',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>
                <h1 style={{ fontSize: '1.2rem', fontWeight: '500', marginBottom: '1.5rem', color: '#888' }}>
                    VERIFICATION_PASSED
                </h1>

                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ fontSize: '0.9rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Identity</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '600', marginTop: '0.25rem' }}>{developerName}</div>
                </div>

                <div style={{ marginBottom: '2.5rem', textAlign: 'left', lineHeight: '1.6', fontSize: '1rem', color: '#ccc' }}>
                    {message}
                </div>

                <div style={{ borderTop: '1px solid #222', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#444' }}>SIGNED_OFF_{projectYear}</span>
                    <span style={{ fontSize: '0.8rem', color: '#444' }}>#7H3Kx</span>
                </div>
            </div>
        </div>
    );
}
