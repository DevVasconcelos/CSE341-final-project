module.exports = (mongoose) => {
  const usersSchema = mongoose.Schema(
    {
      name: { type: String, required: true },
      email: String,
    },
    { 
      timestamps: true,
      collection: 'users'
    }
  );

  const Users = mongoose.model('Users', usersSchema);

  return Users;
};