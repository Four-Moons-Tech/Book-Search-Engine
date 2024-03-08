const { User, Book } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return User.find({}).populate('books');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate('books');
    },
    
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('books');
      }
      throw AuthenticationError;
    },

    books: async (parent, args) => {
      return Book.find({})
    }
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },
    
    
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          {_id: context.user.id},
          {$pull: {savedBooks: bookId}},
        
          { new: true }
        );
        return updatedUser;

        
      }
      throw AuthenticationError;
    },

    saveBook: async (parent, {userId, bookInput}, context) => {
      if (context.user){
        return User.findByIdAndUpdate(
          { _id: userId},
          {$addToSet: {
            savedBooks:{bookInput}
          },
        },
        {
          new: true,
          runValidators: true,
        }
        )
      }
       throw AuthenticationError

    
  },
}
};

module.exports = resolvers;
