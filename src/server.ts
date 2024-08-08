import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import {corsConfig} from './config/cors';
import {connectDB} from './config/db';
import authRoutes from './routes/authRoutes';
import customerRoutes from './routes/customerRoutes';
import categoryRoutes from './routes/categoryRoutes';
import suppliersRoutes from './routes/supplierRoutes';


dotenv.config();
connectDB();

const app = express();
app.use(cors(corsConfig));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/categories', categoryRoutes );
app.use('/api/suppliers',  suppliersRoutes);

export default app;