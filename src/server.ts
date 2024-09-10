import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import {corsConfig} from './config/cors';
import {connectDB} from './config/db';
import authRoutes from './routes/authRoutes';
import customerRoutes from './routes/customerRoutes';
import categoryRoutes from './routes/categoryRoutes';
import suppliersRoutes from './routes/supplierRoutes';
import productsRoutes from './routes/productRoutes';
import productManagementRoutes from './routes/productManagementRoutes';
import purchaseHistoryRoutes from './routes/purchaseHistory';
import saleRoutes from './routes/saleRoutes';


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
app.use('/api/products', productsRoutes);
app.use('/api/products-management', productManagementRoutes);
app.use('/api/purchase-history', purchaseHistoryRoutes);
app.use('/api/sales', saleRoutes);

export default app;