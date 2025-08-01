import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';


if (process.env.MONGO_URL && process.env.NODE_ENV !== 'test') {
=======
// Only attempt to connect if a Mongo URL is defined. This prevents errors when
// running in environments where the variable isn't set (e.g. some test setups).
if (process.env.MONGO_URL) {

  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

// Models
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model('User', userSchema);

const conversationSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  messages: [
    {
      sender: String,
      text: String,
      timestamp: Date,
      isThinking: Boolean,
      isEdited: Boolean,
      attachments: [String],
    },
  ],
  createdAt: Date,
  updatedAt: Date,
  settings: {
    enableHistory: Boolean,
    aiModel: String,
    temperature: Number,
  },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
  archived: Boolean,
});
const Conversation = mongoose.model('Conversation', conversationSchema);

const projectSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
});
const Project = mongoose.model('Project', projectSchema);

// Helpers
function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Missing token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Auth routes
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = generateToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(400).json({ message: 'Signup failed', error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = generateToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
});

app.post('/api/logout', (req, res) => {
  res.json({ message: 'ok' });
});

// Conversations CRUD
app.get('/api/conversations', authMiddleware, async (req, res) => {
  const convs = await Conversation.find({ userId: req.userId });
  res.json(convs);
});

app.post('/api/conversations', authMiddleware, async (req, res) => {
  const convo = await Conversation.create({
    ...req.body,
    userId: req.userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  res.json(convo);
});

app.get('/api/conversations/:id', authMiddleware, async (req, res) => {
  const conv = await Conversation.findOne({ _id: req.params.id, userId: req.userId });
  if (!conv) return res.status(404).json({ message: 'Not found' });
  res.json(conv);
});

app.put('/api/conversations/:id', authMiddleware, async (req, res) => {
  const conv = await Conversation.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, {
    ...req.body,
    updatedAt: new Date(),
  }, { new: true });
  if (!conv) return res.status(404).json({ message: 'Not found' });
  res.json(conv);
});

app.delete('/api/conversations/:id', authMiddleware, async (req, res) => {
  await Conversation.deleteOne({ _id: req.params.id, userId: req.userId });
  res.json({});
});

// Projects CRUD
app.get('/api/projects', authMiddleware, async (req, res) => {
  const projs = await Project.find({ userId: req.userId });
  res.json(projs);
});

app.post('/api/projects', authMiddleware, async (req, res) => {
  const proj = await Project.create({ userId: req.userId, ...req.body });
  res.json(proj);
});

app.get('/api/projects/:id', authMiddleware, async (req, res) => {
  const proj = await Project.findOne({ _id: req.params.id, userId: req.userId });
  if (!proj) return res.status(404).json({ message: 'Not found' });
  res.json(proj);
});

app.put('/api/projects/:id', authMiddleware, async (req, res) => {
  const proj = await Project.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, req.body, { new: true });
  if (!proj) return res.status(404).json({ message: 'Not found' });
  res.json(proj);
});

app.delete('/api/projects/:id', authMiddleware, async (req, res) => {
  await Project.deleteOne({ _id: req.params.id, userId: req.userId });
  await Conversation.updateMany({ userId: req.userId, projectId: req.params.id }, { projectId: null });
  res.json({});
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
