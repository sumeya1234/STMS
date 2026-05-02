const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./db');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        done(null, users[0]);
    } catch (err) {
        done(err, null);
    }
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            passReqToCallback: true
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                // Check if user exists
                const [existing] = await pool.query('SELECT * FROM users WHERE google_id = ?', [profile.id]);
                if (existing.length > 0) {
                    return done(null, existing[0]);
                }

                // Or if email is already taken but not linked with Google
                const email = profile.emails[0].value;
                const [emailMatch] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

                if (emailMatch.length > 0) {
                    // Update existing with google_id
                    await pool.query('UPDATE users SET google_id = ?, email_verified = true WHERE id = ?', [profile.id, emailMatch[0].id]);
                    return done(null, emailMatch[0]);
                }

                // Create new user
                const [result] = await pool.query(
                    'INSERT INTO users (name, email, google_id, email_verified) VALUES (?, ?, ?, true)',
                    [profile.displayName, email, profile.id]
                );

                // Initialize preferences
                await pool.query('INSERT INTO user_preferences (user_id) VALUES (?)', [result.insertId]);

                const [newUser] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
                return done(null, newUser[0]);
            } catch (err) {
                console.error('Google Auth Strategy Error:', err);
                return done(err, null);
            }
        }
    )
);

module.exports = passport;
