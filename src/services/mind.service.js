import { StateManager, state } from "@/models/state.model.js";

import { NotificationService } from "./notification.service.js";
import { SoundModel } from "@/models/sound.model.js";
import { TaskService } from "./task.service.js";
import { soundService } from "./sound.service.js";

class MindService {
  constructor() {
    this.mindInterval = null;
  }

  initFromSavedState() {
    if (state.mind?.isRunning && !state.mind?.isPaused) {
      StateManager.updateMindState({ isPaused: true, isRunning: false });
    }
  }

  isMindRunning() {
    return state.mind?.isRunning && !state.mind?.isPaused;
  }

  toggle() {
    if (state.mind.isRunning && !state.mind.isPaused) {
      this.pause();
    } else {
      this.start();
    }
  }

  start() {
    if (state.mind.isRunning && !state.mind.isPaused) return;

    StateManager.updateMindState({ isRunning: true, isPaused: false });

    const currentTrack = SoundModel.getCurrentTrack();
    if (currentTrack) {
      soundService.playTrack(currentTrack);
    }

    clearInterval(this.mindInterval);
    this.mindInterval = setInterval(() => {
      this._tick();
    }, 1000);
  }

  pause() {
    clearInterval(this.mindInterval);
    StateManager.updateMindState({ isRunning: false, isPaused: true });

    soundService.pause();
  }

  stopAndTransition() {
    clearInterval(this.mindInterval);

    if (state.activeMode === "flow") {
      this._handleFlowStop();
    } else {
      this._onPomodoroComplete();
    }
  }

  reset() {
    clearInterval(this.mindInterval);
    StateManager.resetMind();
    soundService.pause();
  }

  _handlePomodoroTick() {
    const newTime = state.mind.mindemaining - 1;

    if (newTime <= 0) {
      this._onPomodoroComplete();
    } else {
      StateManager.updateMindState({ mindemaining: newTime });
    }
  }

  _onPomodoroComplete() {
    clearInterval(this.mindInterval);

    const isWorkPhase = state.mind.currentPhase === "work";

    const soundToPlay = isWorkPhase
      ? state.settings.pomodoroEndSound || "bell"
      : state.settings.breakEndSound || "chime";

    soundService.playNotificationSound(soundToPlay);

    if (isWorkPhase) {
      const currentTaskId = state.activeTaskId;
      const currentTask = TaskService.getActiveTask();

      if (currentTaskId) {
        TaskService.incrementCompletedFocusUnits(currentTaskId);
      }

      const newSessionCount = (state.mind.pomodoroSessionCount || 0) + 1;
      const workSecs = (state.settings.pomodoroWorkTime || 25) * 60;

      StateManager.addSession({
        taskId: currentTaskId,
        taskTitle: currentTask ? currentTask.title : "Untitled Session",
        type: "pomodoro",
        durationSeconds: workSecs,
      });

      NotificationService.show({
        type: "success",
        message: "Focus session completed! Time for a break",
        icon: "fa-circle-check",
        iconColor: "text-emerald-500",
      });

      if (state.settings.disableBreaks) {
        StateManager.updateMindState({
          isRunning: false,
          isPaused: false,
          pomodoroSessionCount: newSessionCount,
          currentPhase: "work",
          mindemaining: workSecs,
          duration: workSecs,
        });

        if (state.settings.autoStartPomodoros) {
          this.start();
        } else {
          soundService.pause();
        }
        return;
      }

      const interval = state.settings.longBreakInterval || 4;
      const isLongBreak = newSessionCount % interval === 0;
      const nextPhase = isLongBreak ? "longBreak" : "shortBreak";
      const breakMinutes =
        nextPhase === "longBreak"
          ? state.settings.longBreakTime || 15
          : state.settings.shortBreakTime || 5;

      StateManager.updateMindState({
        isRunning: false,
        isPaused: false,
        pomodoroSessionCount: newSessionCount,
        currentPhase: nextPhase,
        mindemaining: breakMinutes * 60,
        duration: breakMinutes * 60,
      });

      if (state.settings.autoStartBreaks) {
        this.start();
      } else {
        soundService.pause();
      }
    } else {
      // Break phase completed -> return to Work phase
      const workSecs = (state.settings.pomodoroWorkTime || 25) * 60;
      StateManager.updateMindState({
        isRunning: false,
        isPaused: false,
        currentPhase: "work",
        mindemaining: workSecs,
        duration: workSecs,
      });

      NotificationService.show({
        type: "info",
        message: "Break has ended! Ready to focus?",
        icon: "fa-bolt",
        iconColor: "text-brand",
      });

      if (state.settings.autoStartPomodoros) {
        this.start();
      } else {
        soundService.pause();
      }
    }

    window.dispatchEvent(new CustomEvent("pomodoroCompleted"));
  }

  _tick() {
    if (state.activeMode === "pomodoro") {
      this._handlePomodoroTick();
    } else {
      this._handleFlowTick();
    }
  }

  _handleFlowTick() {
    const isBreak = state.mind.currentPhase === "break";

    if (isBreak) {
      const newTime = state.mind.mindemaining - 1;
      if (newTime <= 0) {
        this._onFlowBreakComplete();
      } else {
        StateManager.updateMindState({ mindemaining: newTime });
      }
    } else {
      const newFlowTime = (state.mind.flowTime || 0) + 1;
      StateManager.updateMindState({ flowTime: newFlowTime });
    }
  }

  _onFlowBreakComplete() {
    clearInterval(this.mindInterval);

    const workSecs = (state.settings.pomodoroWorkTime || 25) * 60;
    StateManager.updateMindState({
      isRunning: false,
      isPaused: false,
      flowTime: 0,
      currentPhase: "work",
      mindemaining: workSecs,
      duration: workSecs,
    });

    NotificationService.show({
      type: "info",
      message: "Flow Break has ended! Ready to focus?",
      icon: "fa-bolt",
      iconColor: "text-brand",
    });

    soundService.pause();
  }

  _handleFlowStop() {
    const currentTaskId = state.activeTaskId;
    const currentTask = TaskService.getActiveTask();

    const flowTime = state.mind.flowTime || 0;
    const isBreak = state.mind.currentPhase === "break";

    const isWorkPhase = state.mind.currentPhase === "work";

    const soundToPlay = isWorkPhase
      ? state.settings.pomodoroEndSound || "bell"
      : state.settings.breakEndSound || "chime";

    soundService.playNotificationSound(soundToPlay);

    if (isBreak) {
      const workSecs = (state.settings.pomodoroWorkTime || 25) * 60;
      StateManager.updateMindState({
        isRunning: false,
        isPaused: false,
        flowTime: 0,
        currentPhase: "work",
        mindemaining: workSecs,
        duration: workSecs,
      });
      soundService.pause();
      return;
    }

    if (flowTime >= 1500) {
      StateManager.addSession({
        taskId: currentTaskId,
        taskTitle: currentTask ? currentTask.title : "Untitled Session",
        type: "flow",
        durationSeconds: flowTime,
      });

      if (currentTaskId) {
        TaskService.incrementCompletedFocusUnits(currentTaskId);
      }

      NotificationService.show({
        type: "success",
        message: `Flow session completed! You focused for ${Math.round(flowTime / 60)} minutes`,
        icon: "fa-circle-check",
        iconColor: "text-emerald-500",
      });
    } else {
      NotificationService.show({
        type: "info",
        message:
          "Flow session was too short (under 25 minutes), No session saved",
        icon: "fa-info-circle",
        iconColor: "text-brand",
      });
    }

    const breakSecs = (state.settings.flowBreakTime || 15) * 60;
    StateManager.updateMindState({
      isRunning: false,
      isPaused: false,
      flowTime: 0,
      currentPhase: "break",
      mindemaining: breakSecs,
      duration: breakSecs,
    });

    if (state.settings.autoStartFlowBreaks) {
      this.start();
    } else {
      soundService.pause();
    }
  }
}

export const mindService = new MindService();
