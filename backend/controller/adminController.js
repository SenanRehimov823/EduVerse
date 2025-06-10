import User from "../model/user.js";
import bcrypt from "bcryptjs";
import Class from "../model/class.js";
import subject from "../model/subject.js";

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
export const getAllPendingStudentsWithClass = async (req, res) => {
  try {
    const students = await User.find({
      role: "pending",
      class: { $ne: null }
    })
      .populate("class", "name")
      .select("name class");

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi" });
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
    res.status(500).json({ message: "Server xətası" });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("subject", "name")  
      .populate("class", "name")    
      .select("-password");         

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
    res.status(500).json({ message: "Server xətası" });
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
    res.status(500).json({ message: "Server xətası" });
  }
};
export const getTeachersWithSubjects = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" })
      .populate("subject", "name")
      .select("name email subject");

    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Xəta baş verdi", error: error.message });
  }
};
export const getStudentsForClassAssignment = async (req, res) => {
  try {
    const { grade } = req.query;

    if (!grade) {
      return res.status(400).json({ message: "Grade tələb olunur" });
    }

    // Bütün eyni grade-də olan sinifləri tapırıq (məs: 8, 9 və s.)
    const classesInGrade = await Class.find({ grade: parseInt(grade) });

    if (!classesInGrade || classesInGrade.length === 0) {
      return res.status(404).json({ message: "Bu grade üçün heç bir sinif tapılmadı" });
    }

    // Bu grade-də təyin olunmuş bütün şagirdlərin id-lərini çıxarırıq
    const assignedStudentIds = classesInGrade.flatMap(cls => cls.students);

    // Bu grade-də olub heç bir sinifə təyin olunmamış şagirdləri gətiririk
    const students = await User.find({
      role: "student",
      class: { $in: classesInGrade.map(cls => cls._id) },
      _id: { $nin: assignedStudentIds }
    }).select("name");

    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};