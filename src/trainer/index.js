import trainingsNot from '@/trainer/trainings_not';
import trainingsEge04 from '@/trainer/trainings_ege04';
import trainingsEge05 from '@/trainer/trainings_ege05';
import trainingsEge10 from '@/trainer/trainings_ege10';
import trainingsEge11n12 from '@/trainer/trainings_ege11_12';
import trainingsEge11 from '@/trainer/trainings_ege11';
import trainingsEge12 from '@/trainer/trainings_ege12';
import trainingsEge15 from '@/trainer/trainings_ege15';

const asyncTrainingFactories = {
  ...trainingsNot.makeAsyncTrainingFactories(),
  ...trainingsEge04.makeAsyncTrainingFactories(),
  ...trainingsEge05.makeAsyncTrainingFactories(),
  ...trainingsEge10.makeAsyncTrainingFactories(),
  ...trainingsEge11n12.makeAsyncTrainingFactories(),
  ...trainingsEge11.makeAsyncTrainingFactories(),
  ...trainingsEge12.makeAsyncTrainingFactories(),
  ...trainingsEge15.makeAsyncTrainingFactories(),
};

export default async function getTraining(topic) {
  const makeTraining = asyncTrainingFactories[topic];
  return !makeTraining ? null : makeTraining();
}
