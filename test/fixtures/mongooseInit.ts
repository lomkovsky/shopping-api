import * as mongoose from 'mongoose';

mongoose.connection.on('disconnected', () => {
  const errorMessage = 'MongoDB is disconnected';
  console.log(errorMessage);
});
mongoose.connection.on('reconnected', () => {
  if (process.env.ENV !== 'test') {
    console.log('MongoDB is reconnected');
  }
});

export const connectWithRetry = () => {
  const url = process.env.MONGODB;
  const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  };
  return mongoose
    .connect(url, options)
    .then(() => {
      if (process.env.ENV !== 'test') {
        console.log('DB Connected!');
      }
      // Connect services
    })
    .catch(async (err) => {
      await mongoose.disconnect();
      console.log(`DB Connection Error: ${err.message}`);
      setTimeout(connectWithRetry, 5000);
    });
};
