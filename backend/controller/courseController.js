import Course from "../model/Course.js";
export const createCourse = async (req, res) => {
  try {
    const { title, price, description, imageUrl } = req.body;
    const imageFile = req.file ? req.file.filename : "";

    const course = new Course({
      title,
      price,
      description,
      imageUrl,
      imageFile,
    });

    await course.save();
    res.status(201).json({ message: "Kurs yaradıldı", course });
  } catch (err) {
    console.error("Kurs yaratma xətası:", err);
    res.status(500).json({ error: "Kurs yaradılmadı" });
  }
};


export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Kurslar yüklənmədi" });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Kurs tapılmadı" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: "Kurs yüklənmədi" });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { title, price, description, imageUrl } = req.body;
    const imageFile = req.file ? req.file.filename : null;

    const updatedData = {
      title,
      price,
      description,
      imageUrl,
    };

    if (imageFile) {
      updatedData.imageFile = imageFile;
    }

    const course = await Course.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    if (!course) return res.status(404).json({ error: "Kurs tapılmadı" });

    res.json({ message: "Kurs yeniləndi", course });
  } catch (err) {
    res.status(500).json({ error: "Kurs yenilənmədi" });
  }
};


export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ error: "Kurs tapılmadı" });
    res.json({ message: "Kurs silindi" });
  } catch (err) {
    res.status(500).json({ error: "Kurs silinmədi" });
  }
};
