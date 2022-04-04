import { Between, getRepository } from "typeorm";

import { AttendanceEntity } from "~/entities/attendance-entity";
import { UserEntity } from "~/entities/user-entity";
import { ResponseError } from "~/helpers/response-error";

const attendanceEntity = getRepository(AttendanceEntity);
const userRepository = getRepository(UserEntity);

export const checkIn = async (userId: string) => {
  const start = new Date();
  start.setUTCHours(0,0,0,0);

  const end = new Date();
  end.setUTCHours(23,59,59,999);

  const checkInCount = await attendanceEntity.count({ 
    where: {
      user: await userRepository.findOneOrFail({ id: userId }),
      type: 'check-in',
      date: Between(new Date(start.toUTCString()).toISOString(), new Date(end.toUTCString()).toISOString()) as unknown as Date
    }
  });

  if (checkInCount > 0) {
    throw new ResponseError(400, 'Already Checked-in');
  }

  await attendanceEntity.save({  
    user: await userRepository.findOneOrFail({ id: userId }),
    type: 'check-in'
  });
};

export const checkOut = async (userId: string) => {
  const start = new Date();
  start.setUTCHours(0,0,0,0);

  const end = new Date();
  end.setUTCHours(23,59,59,999);

  const checkInCount = await attendanceEntity.count({ 
    where: {
      user: await userRepository.findOneOrFail({ id: userId }),
      type: 'check-in',
      date: Between(new Date(start.toUTCString()).toISOString(), new Date(end.toUTCString()).toISOString()) as unknown as Date
    }
  });

  if (checkInCount === 0) {
    throw new ResponseError(400, 'Check-in First');
  }

  const checkOutCount = await attendanceEntity.count({ 
    where: {
      // user: await userRepository.findOneByOrFail({ id: userId }),
      type: 'check-out',
      date: Between(new Date(start.toUTCString()).toISOString(), new Date(end.toUTCString()).toISOString()) as unknown as Date
    }
  });

  if (checkOutCount > 0) {
    throw new ResponseError(400, 'Already Checked-out');
  }

  await attendanceEntity.save({  
    user: await userRepository.findOneOrFail({ id: userId }),
    type: 'check-out'
  });
};

export const getAttendance = async (userId: string) => {
  return attendanceEntity.find({ 
    where: {
      user: await userRepository.findOneOrFail({ id: userId })
    }
  });
}
