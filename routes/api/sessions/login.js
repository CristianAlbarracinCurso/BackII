const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
res.cookie('jwt', token, {
  httpOnly: true,   
  secure: false,    
  maxAge: 60 * 60 * 1000 
});
res.status(200).json({ message: 'Login exitoso', token });
