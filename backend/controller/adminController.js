import User from "../model/user.js";
import bcrypt from "bcryptjs";
import Class from "../model/class.js";
import subject from "../model/subject.js";

export const setUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = ["student", "teacher", "parent"];
    if (!allowedRoles.includes(role)) return res.status(400).json();

    const user = await User.findById(id);
    if (!user) return res.status(404).json();

    user.role = role;
    await user.save();

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json();
  }
};

export const getAllPendingUsersWithInfo = async (req, res) => {
  try {
    const users = await User.find({ role: "pending" })
      .populate("class", "name")
      .select("name class grade subject subjectName");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json();
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json();

    await User.findByIdAndDelete(id);
    res.status(200).json();
  } catch (error) {
    res.status(500).json();
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
    res.status(500).json();
  }
};

export const createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role, image } = req.body;

    const allowedRoles = ["teacher", "student"];
    if (!allowedRoles.includes(role)) return res.status(400).json();
    if (!name || !email || !password) return res.status(400).json();

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json();

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
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json();
  }
};

export const setMultipleUserRoles = async (req, res) => {
  try {
    const { userIds, role } = req.body;

    const allowedRoles = ["student", "teacher", "parent"];
    if (!allowedRoles.includes(role)) return res.status(400).json();

    await User.updateMany({ _id: { $in: userIds } }, { $set: { role } });
    res.status(200).json();
  } catch (error) {
    res.status(500).json();
  }
};

export const getTeachersWithSubjects = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" })
      .select("name email subjectName");

    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json();
  }
};

export const getStudentsForClassAssignment = async (req, res) => {
  try {
    const { grade } = req.query;
    if (!grade) return res.status(400).json();

    const classesInGrade = await Class.find({ grade: parseInt(grade) });
    const assignedIds = classesInGrade.flatMap(cls => cls.students);

    const students = await User.find({
      role: "student",
      grade: grade.toString(),
      _id: { $nin: assignedIds }
    }).select("name");

    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json();
  }
};

export const getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" }, "name _id email");
    res.json(teachers);
  } catch (error) {
    res.status(500).json();
  }
};
