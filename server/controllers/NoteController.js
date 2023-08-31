const notes = require("../models/NoteModel");

exports.createNotes = async (req, res) => {
  if (req.user_type !== "admin") {
    return res.status(403).json({ message: "Permission denied" });
  }

  const { title, content, category } = req.body;
  const body = { title, content, category };

  await notes.create(body, (error, addedNotes) => {
    if (error) {
      return res.status(500).json({
        code: 2003,
        message: "Something went wrong",
      });
    } else {
      return res.status(200).json({
        code: 2004,
        message: "Note created successfully",
        data: addedNotes,
      });
    }
  });
};

exports.getAllNotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const totalNotesCount = await notes.countDocuments(); // Get the total count of notes

    let noteData = await notes
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    if (noteData && noteData.length === 0) {
      return res.status(200).json({
        code: 2000,
        message: "No data available",
        data: noteData,
      });
    } else {
      return res.status(200).json({
        code: 2001,
        message: "All notes fetched successfully",
        data: noteData,
        count: noteData.length,
        totalPages: Math.ceil(totalNotesCount / pageSize), // Calculate total pages
        currentPage: page,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 2010,
      message: "something went wrong",
    });
  }
};

exports.getSingleNote = async (req, res) => {
  try {
    let noteData = await notes.findById(req.params.id);
    if (noteData && noteData.length === 0) {
      return res.status(200).json({
        code: 2000,
        message: "No data available",
        data: noteData,
      });
    } else {
      return res.status(200).json({
        code: 2001,
        message: "Note fetched successfully",
        data: noteData,
        count: noteData.length,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 2010,
      message: "something went wrong",
    });
  }
};

exports.deleteNote = async (req, res) => {
  if (req.user_type !== "admin") {
    return res.status(403).json({ message: "Permission denied" });
  }
  try {
    const deletedNote = await notes.findByIdAndDelete(req.params.id);
    return res.status(204).json({
      code: 2001,
      message: "Note deleted successfully",
      data: deletedNote,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 2010,
      message: "Something went wrong",
    });
  }
};

exports.updateNote = async (req, res) => {
  if (req.user_type !== "admin") {
    return res.status(403).json({ message: "Permission denied" });
  }
  const { title, content, category } = req.body;
  const body = {
    title,
    content,
    category,
  };
  try {
    const updatedNote = await notes.findByIdAndUpdate(req.params.id, body, {
      new: true,
    });
    if (updatedNote && updatedNote.length === 0) {
      return res.status(200).json({
        code: 2000,
        message: "No Data Found",
        data: updatedNote,
      });
    } else {
      return res.status(200).json({
        code: 2001,
        message: "Note updated successfully",
        data: updatedNote,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 2010,
      message: "Something went wrong",
    });
  }
};
