const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios." });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = new User({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: "Usuario registrado con éxito." });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario.", error });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Usuario no encontrado");
      return res.status(401).json({ message: "Usuario no encontrado." });
    }
    console.log("Usuario encontrado:");

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      console.log("Contraseña incorrecta");
      return res.status(401).json({ message: "Contraseña incorrecta." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res
      .cookie("jwt", token, { httpOnly: true })
      .status(200)
      .json({ message: "Login exitoso." });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error al iniciar sesión.", error });
  }
};

exports.getCurrentUser = (req, res) => {
  if (req.user) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(401).json({ message: "No autenticado." });
  }
};
