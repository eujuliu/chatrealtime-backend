import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  from: {
    type: {
      id: {
        type: String,
        required: true,
      },
      nickname: {
        type: String,
        required: true,
      },
    },
    required: true,
  },
  where: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  reply: {
    type: {
      id: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      from: {
        type: String,
        required: true,
      },
      where: {
        type: String,
        required: true,
      },
    },
  },
});

const MessageModel = mongoose.model('Message', MessageSchema);

export { MessageModel };
