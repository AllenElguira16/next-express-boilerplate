import { getRepository } from "typeorm";
import { FitnessEntity } from "~/entities/fitness-entity";
import { IFitness } from "~/types";

const fitnessRepository = getRepository(FitnessEntity);

export const createFitness = async (fitness: Omit<IFitness, 'id'|'createdAt'|'updatedAt'|'virtualAssistance'>) => {
  await fitnessRepository.save(fitness);
}

export const getFitness = async () => {
  return fitnessRepository.find();
}

export const getFitnessById = (fitnessId: IFitness['id']) => {
  return fitnessRepository.findOneOrFail({
    where: {
      id: fitnessId
    }
  });
}

export const deleteFitness = async (id: string) => {
  await fitnessRepository.delete(id);
}

export const updateFitness = async (id: string, newFitnessData: Partial<Omit<IFitness, 'id'>>) => {
  const fitnessToUpdate = await fitnessRepository.findOne({
    where: {
      id: id
    }
  });

  await fitnessRepository.save({
    ...fitnessToUpdate,
    ...newFitnessData
  });
}