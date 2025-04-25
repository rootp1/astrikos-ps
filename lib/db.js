import mongoose from 'mongoose';

const connectDB = async () => {
  console.log(mongoose.connections[0].readyState);
  if (mongoose.connections[0].readyState) return;

  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default connectDB;
