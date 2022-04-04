import { Between, getRepository, Not } from "typeorm";

import { ResponseError } from "~/helpers/response-error";
import { UserEntity } from "~/entities/user-entity";
import { IUser } from "~/types";

const userRepository = getRepository(UserEntity);

export const registerAdmin = async () => {

  const user: Omit<IUser,'id'|'fitness'|'attendances'|'createdAt'|'updatedAt'> = {
    firstname: 'admin',
    lastname: 'admin',
    username: 'admin',
    email: 'admin@admin.com',
    password: 'admin',
    type: 'admin'
  };

  const countUser = await userRepository.count({ 
    where: { 
      username: user.username,
      password: user.password,
      type: 'admin'
    }
  });

  if (countUser === 0) {
    await userRepository.save(user);
  } 
}

export const registerUser = async (user: Omit<IUser, 'id'|'fitness'|'attendances'|'createdAt'|'updatedAt'>) => {

  const countUserByUsername = await userRepository.count({ where: { username: user.username } });
  const countUserByEmail = await userRepository.count({ where: { email: user.email } });

  if (countUserByUsername > 0) 
    throw new ResponseError(404, 'E-mail already exists');

  if (countUserByEmail > 0) 
    throw new ResponseError(404, 'Username already exists');

  await userRepository.save(user);
}

export const loginUser = async ({username, password}: Pick<IUser, 'username'|'password'>) => {
  const user = await userRepository.findOne({
    relations: ['fitness'],
    where: {
      username,
      password,
    }
  });

  if (!user)
    throw new ResponseError(404, 'Incorrect Username or Password');

  return user.id;
}

export const getUsers = async () => {
  return userRepository.find({
    relations: ['fitness', 'attendances', 'memberships'],
    where: {
      type: Not('admin')
    }
  });
}

export const getUserById = async (id: string) => {
  return userRepository.findOne({
    where: {
      id: id
    },
    relations: ['fitness', 'attendances', 'memberships']
  });
}

export const updateUser = async (id: string, userData: Partial<IUser>) => {
  const user = await userRepository.findOne(id);
  
  await userRepository.save({ 
    ...user,
    ...userData as any
  });
}

export const totalUsers = (rangeFrom: string, rangeTo: string) => {
  return userRepository.count({
    where: {
      type: Not('admin'),
      createdAt: Between(rangeFrom, rangeTo)
    }
  });
}
