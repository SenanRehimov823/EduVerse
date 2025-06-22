import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Subject from "../model/subject.js";
import Class from "../model/class.js";
import { createUser } from "../utils/createUser.js";
// const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: Number(process.env.EMAIL_PORT),
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

export const register = async (req, res) => {
  try {
    const { name, email, password, image } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Bütün xanaları doldurun" });
    }

    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      return res.status(400).json({
        message: "Şifrə minimum 8 simvol, 1 böyük hərf və 1 rəqəm içərməlidir",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email artıq mövcuddur" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      image: image || "",
      role: "pending",
      isVerified: true,
    });

    await user.save();

    res.status(201).json({
      message: "Qeydiyyat uğurludur",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Serverdə xəta baş verdi", error: error.message });
  }
};



// export const verifyOtp = async (req, res) => {
//   try {
//     const { userId, otp } = req.body;

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "İstifadəçi tapılmadı" });

//     if (user.otp !== otp || user.otpExpires < Date.now()) {
//       return res.status(400).json({ message: "OTP yanlışdır və ya vaxtı keçib" });
//     }

//     user.isVerified = true;
//     user.otp = null;
//     user.otpExpires = null;
//     await user.save();

//     res.status(200).json({ message: "Email təsdiqləndi. İndi daxil ola bilərsiniz." });
//   } catch (error) {
//     res.status(500).json({ message: "Server xətası"});
//   }
// };


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email və ya şifrə yanlışdır" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email və ya şifrə yanlışdır" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: user.role === "pending"
        ? "Giriş uğurludur, amma admin təsdiqləməyib"
        : "Giriş uğurludur",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};


export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Çıxış uğurludur" });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "İstifadəçi tapılmadı" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi" });
  }
};


export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Köhnə şifrə yanlışdır" });

    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword))
      return res.status(400).json({
        message: "Yeni şifrə minimum 8 simvol, 1 böyük hərf, 1 rəqəm və 1 xüsusi simvol içərməlidir",
      });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Şifrə uğurla dəyişdirildi" });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi" });
  }
};


export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "İstifadəçi tapılmadı" });

    await User.findByIdAndDelete(userId);

    res.clearCookie("token"); 
    res.status(200).json({ message: "Hesab silindi" });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};
export const registerStudent = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, grade } = req.body;

    if (!name || !email || !password || !confirmPassword || !grade)
      return res.status(400).json({ message: "Bütün xanaları doldurun" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Şifrələr uyğun deyil" });

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password))
      return res.status(400).json({
        message: "Şifrə minimum 8 simvol, 1 böyük hərf, 1 rəqəm və 1 xüsusi simvol içərməlidir",
      });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email artıq mövcuddur" });

    await createUser({
      name,
      email,
      password,
      role: "pending",
      grade: grade.toString()
    });

    res.status(201).json({ message: "Şagird qeydiyyatdan keçdi, admin təsdiqləməlidir." });
  } catch (err) {
    res.status(500).json({ message: "Xəta baş verdi", error: err.message });
  }
};


export const registerTeacher = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, subjectName } = req.body;

    if (!name || !email || !password || !confirmPassword || !subjectName)
      return res.status(400).json({ message: "Bütün xanaları doldurun" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Şifrələr uyğun deyil" });

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password))
      return res.status(400).json({
        message: "Şifrə minimum 8 simvol, 1 böyük hərf, 1 rəqəm və 1 xüsusi simvol içərməlidir",
      });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email artıq mövcuddur" });

    await createUser({
      name,
      email,
      password,
      role: "pending"
    });

    res.status(201).json({ message: "Müəllim qeydiyyatdan keçdi, admin təsdiqləməlidir." });
  } catch (err) {
    res.status(500).json({ message: "Xəta baş verdi", error: err.message });
  }
};
