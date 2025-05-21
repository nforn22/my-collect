const itemSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    description: String,
    category: {
      type: String,
      required: true
    },
    imageUrl: String,
    purchaseDate: Date,
    value: Number,
    tags: [String],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
});