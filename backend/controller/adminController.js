import User from "../model/user.js";
import bcrypt from "bcryptjs";
export const setUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = ["student", "teacher", "parent"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Rolu düzgün daxil edin" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "İstifadəçi tapılmadı" });

    user.role = role;
    await user.save();

    res.status(200).json({
      message: "Rol uğurla yeniləndi",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};
export const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ role: "pending" }).select("-password");
    res.status(200).json({ users: pendingUsers });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "İstifadəçi tapılmadı" });

    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "İstifadəçi silindi" });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};
export const createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role, image } = req.body;

    
    const allowedRoles = ["teacher", "student"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Yalnız teacher və ya student rolu ola bilər" });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Bütün xanaları doldurun" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Bu email artıq istifadə olunur" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      image: image || "",
      isVerified: true,
    });

    await newUser.save();

    res.status(201).json({
      message: "İstifadəçi uğurla yaradıldı",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server xətası"});
  }
};

export const setMultipleUserRoles = async (req, res) => {
  try {
    const { userIds, role } = req.body;

    const allowedRoles = ["student", "teacher", "parent"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Rolu düzgün daxil edin" });
    }

    await User.updateMany(
      { _id: { $in: userIds } },
      { $set: { role } }
    );

    res.status(200).json({ message: "Rollar uğurla yeniləndi" });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};