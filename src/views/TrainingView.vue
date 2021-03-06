<template>
  <div>
    <VNavbar
      title="Тренажер"
      has-home-button
    />
    <section class="section">
      <div class="columns">
        <div class="column column-training is-full container">
          <div class="card" v-if="training">
            <TrainingCardHeader
              :training="training"
              :training-state="trainingState"
              :active-task-index="activeTaskIndex"
              @finish="onFinish"
            />
            <TrainingCardContent
              :training="training"
              :training-state="trainingState"
              :active-task-index="activeTaskIndex"
              v-model="activeTaskUserAnswer"
            />
            <TrainingCardFooter
              :training="training"
              :training-state="trainingState"
              :active-task-index="activeTaskIndex"
              @answer="onAnswer"
              @continue="onContinue"
              @repeat="onRepeat"
              @close="onClose"
              v-model="activeTaskUserAnswer"
            />
          </div>

          <div v-else>
            <h1 class="title">
              Увы,
            </h1>
            <h2 class="subtitle">
              но такой тренировки не существует
            </h2>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import TrainingCardHeader from '@/components/TrainingCardHeader.vue';
import TrainingCardContent from '@/components/TrainingCardContent.vue';
import TrainingCardFooter from '@/components/TrainingCardFooter.vue';
import VNavbar from '@/components/VNavbar.vue';
import getTraining from '@/trainer';
import Training from '@/models/training';

export default {
  name: 'TrainingView',
  components: {
    TrainingCardContent,
    TrainingCardFooter,
    TrainingCardHeader,
    VNavbar,
  },
  data() {
    return {
      training: null,
      trainingState: null,
      activeTaskIndex: null,
      activeTaskUserAnswer: null,
    };
  },
  computed: {
    isLastTask() {
      return this.training.tasks.length === this.activeTaskIndex + 1;
    },
  },
  watch: {
    training(newTraining) {
      if (newTraining === null) {
        this.trainingState = null;
        this.activeTaskIndex = null;
      }

      this.trainingState = Training.STATE_ANSWERING;
      this.activeTaskIndex = 0;
    },
    activeTaskIndex(newTaskIndex) {
      if (newTaskIndex === null) {
        this.activeTaskUserAnswer = null;
      }

      const newTask = this.training.tasks[newTaskIndex];
      this.activeTaskUserAnswer = newTask.prompt.constructor.defaultValue;
    },
  },
  beforeRouteEnter(to, from, next) {
    getTraining(to.params.topic).then((training) => {
      next(vm => training && vm.setTraining(training));
    });
  },
  methods: {
    setTraining(training) {
      this.training = training;
    },
    onAnswer() {
      this.training.onUserAnswer(this.activeTaskIndex, this.activeTaskUserAnswer);
      this.trainingState = Training.STATE_CHECKING;
    },
    onContinue() {
      if (this.isLastTask) {
        this.activeTaskIndex = null;
        this.onFinish();
        return;
      }

      this.activeTaskIndex += 1;
      this.trainingState = Training.STATE_ANSWERING;
    },
    onFinish() {
      const shouldExitWithoutWarning = (
        this.activeTaskIndex === null
        || (this.activeTaskIndex === 0 && this.trainingState === Training.STATE_ANSWERING)
      );

      if (!shouldExitWithoutWarning) {
        this.$buefy.dialog.confirm({
          message: 'Вы уверены, что хотите <strong>преждевременно</strong> закончить тренировку?',
          confirmText: 'Закончить',
          cancelText: 'Отмена',
          onConfirm: () => {
            this.trainingState = Training.STATE_FINISHED;
          },
        });
        return;
      }

      this.trainingState = Training.STATE_FINISHED;
    },
    onRepeat() {
      const loadingComponent = this.$buefy.loading.open({ container: null });

      getTraining(this.$route.params.topic).then((training) => {
        this.setTraining(training || null);
        loadingComponent.close();
      });
    },
    onClose() {
      this.$router.back();
    },
  },
};
</script>

<style scoped>
.column-training {
  max-width: 30rem;
}
</style>
