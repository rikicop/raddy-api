require("../models/db");
const Movie = require("../models/movie");

/* GET All Movies */

exports.listMovies = async (req, res) => {
  let { limit = 15, page = 1, category, q } = req.query;

  const limitRecords = parseInt(limit);
  const skip = (page - 1) * limit;

  let query = {};

  if (q) {
    query = { $text: { $search: q } };
  }

  if (category) query.category = category;

  console.log(query);
  try {
    const movies = await Movie.find(query).limit(limitRecords).skip(skip);
    res.json({ page: page, limit: limitRecords, movies });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

/* POST  Movie */

exports.insertSingleMovie = async (req, res) => {
  const newMovie = new Movie({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    thumbnail: req.body.thumbnail,
  });

  try {
    await newMovie.save();
    res.json(newMovie);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

/* UPDATE  Movie | /api/movies/:id | Patch*/

exports.updateSingleMovie = async (req, res) => {
  let paramID = req.params.id;
  let name = req.body.name;

  try {
    const updateMovie = await Movie.updateOne({ _id: paramID }, { name: name });
    res.json(updateMovie);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

/* DELETE  Movie  || /api/movies/:id*/

exports.deleteSingleMovie = async (req, res) => {
  let paramID = req.params.id;

  try {
    const deleteMovie = await Movie.deleteOne({ _id: paramID });
    res.json(deleteMovie);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};
