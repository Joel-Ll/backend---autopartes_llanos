import mongoose from 'mongoose';
import colors from 'colors';
import { exit } from 'node:process';
import User from '../models/User';
import dotenv from 'dotenv';
import { hashPassword } from '../utils/auth';

dotenv.config();

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.DATABASE_URL);
    const url = `${connection.host}:${connection.port}`;
    console.log(colors.magenta.bold(`MongoDB conectado en ${url}`));

    const nameUser = process.env.NAME_ADMIN;
    const passwordUser = process.env.PASSWORD_ADMIN;

    const adminUser = await User.findOne({role: 'admin'});
    if(!adminUser) {
      const hashedPassword = await hashPassword(passwordUser);

      const newUser = new User({
        name: nameUser,
        password: hashedPassword
      });

      await newUser.save();
      console.log(colors.blue.bold('El usuario Admin ha sido creado'));
    } else { 
      console.log(colors.yellow.bold('El usuario administrador ya existe'));
    }
  } catch (error) {
    console.log(colors.red.bold('Error al conectar a la base de datos'));
    exit(1);
  }
}