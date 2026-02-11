import User from '../models/User.js';

// Simple authentication (in production, use bcrypt for password hashing and JWT for tokens)
export const login = async (req, res) => {
  try {
    const { email, password, state } = req.body;

    if (!email || !password || !state) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, password, and state are required' 
      });
    }

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Create new user
      user = new User({
        email: email.toLowerCase(),
        password: password, // In production, hash this!
        name: email.split('@')[0],
        state: state
      });
      await user.save();
    } else {
      // Verify password (in production, use bcrypt.compare)
      if (user.password !== password) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }
      // Update state if changed
      if (user.state !== state) {
        user.state = state;
        await user.save();
      }
    }

    // Return user data (in production, return JWT token)
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        state: user.state
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        state: user.state
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
