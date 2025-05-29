// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   email: { type: String, unique: true, required: true },
//   password: { type: String, required: true },
//   favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
//   recommendations: [{
//     propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
//     recommendedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     createdAt: { type: Date, default: Date.now },
//   }],
// });

// export const User = mongoose.model('User', userSchema);