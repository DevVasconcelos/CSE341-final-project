module.exports = (mongoose) => {
  const genresSchema = mongoose.Schema(
    {
      name: { type: String, required: true },
      description: String
    },
    { 
      timestamps: true,
      collection: 'genres'
    }
  );

  const Genres = mongoose.model('Genres', genresSchema);

  return Genres;
};
