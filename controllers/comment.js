// @scripts
const { find } = require('../models/comment');
const Comment = require('../models/comment');
const Publication = require('../models/publication');

// Querys
const getComments = async (idPublication) => {
  const publications = await Comment.find()
    .where({ idPublication })
    .sort({ created: 1 })
    .populate('idUser');

  return publications;
};

// Mutations
const addComment = async (input, ctx) => {
  try {
    const comment = new Comment({
      comment: input.comment,
      idPublication: input.idPublication,
      idUser: ctx.user.id
    });
    comment.save();

    return comment;
  } catch (error) {
    console.log(error)
  }
};

module.exports = { addComment, getComments }