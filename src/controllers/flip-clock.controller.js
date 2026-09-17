import { StateManager, state } from "@/models/state.model.js";

import { ModalController } from "./modal.controller";
import { NotificationService } from "@/services/notification.service";
import { TaskService } from "@/services/task.service";
import { flipClockComponent } from "@/components/features/mind/flip-clock.component.js";
import { formatTime } from "@/utils/helpers.js";
import { mindService } from "@/services/mind.service.js";

export const FlipClockController = {
  overlayEl: null,
  wakeLock: null,
  unsubscribeState: null,
  prevHours: null,
  prevMinutes: null,
  prevSeconds: null,
  eventsBound: false,

  init() {
    this.overlayEl = flipClockComponent.render();
    this.bindEvents();
  },

  async open() {
    if (!this.overlayEl) this.init();

    flipClockComponent._isThreeCards = null;

    this.overlayEl.classList.remove("hidden");
    void this.overlayEl.offsetWidth;
    this.overlayEl.classList.remove("opacity-0");

    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }

      if (screen.orientation && typeof screen.orientation.lock === "function") {
        await screen.orientation.lock("landscape");
      }
    } catch (err) {
      console.warn("Fullscreen or orientation lock failed:", err);
    }

    await this.requestWakeLock();

    if (!this.unsubscribeState) {
      this.unsubscribeState = StateManager.subscribe(() => this.update());
    }

    this.prevHours = null;
    this.prevMinutes = null;
    this.prevSeconds = null;
    this.update(true);
  },

  async close() {
    if (!this.overlayEl) return;

    this.overlayEl.classList.add("opacity-0");
    setTimeout(() => this.overlayEl.classList.add("hidden"), 300);

    if (screen.orientation && typeof screen.orientation.unlock === "function") {
      try {
        screen.orientation.unlock();
      } catch (err) {
        console.warn("Failed to unlock screen orientation:", err);
      }
    }

    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.warn("Exit fullscreen failure:", err);
      }
    }

    this.releaseWakeLock();

    if (this.unsubscribeState) {
      this.unsubscribeState();
      this.unsubscribeState = null;
    }
  },

  async requestWakeLock() {
    try {
      if ("wakeLock" in navigator) {
        this.wakeLock = await navigator.wakeLock.request("screen");
      }
    } catch (err) {
      console.warn("Wake Lock acquisition failed:", err);
    }
  },

  releaseWakeLock() {
    if (this.wakeLock) {
      this.wakeLock.release().then(() => {
        this.wakeLock = null;
      });
    }
  },

  update(force = false) {
    if (!this.overlayEl || this.overlayEl.classList.contains("hidden")) return;

    const { activeMode, mind, settings } = StateManager.getState();
    const isPomodoro = activeMode === "pomodoro";
    const isBreak =
      isPomodoro &&
      (mind.currentPhase === "shortBreak" || mind.currentPhase === "longBreak");
    const isFlowBreak = activeMode === "flow" && mind.currentPhase === "break";

    let totalSeconds;
    if (isPomodoro || isFlowBreak) {
      totalSeconds = mind.mindemaining;
    } else {
      totalSeconds = mind.flowTime;
    }

    const formatted = formatTime(totalSeconds);
    const parts = formatted.split(":");

    let hrs = "00",
      mins = "00",
      secs = "00";
    if (parts.length === 3) {
      hrs = parts[0];
      mins = parts[1];
      secs = parts[2];
    } else if (parts.length === 2) {
      hrs = "00";
      mins = parts[0];
      secs = parts[1];
    }

    const prevHrs = this.prevHours;
    const prevMins = this.prevMinutes;
    const prevSecs = this.prevSeconds;

    flipClockComponent.updateDisplay(
      hrs,
      mins,
      secs,
      prevHrs,
      prevMins,
      prevSecs,
      force,
    );

    this.prevHours = hrs;
    this.prevMinutes = mins;
    this.prevSeconds = secs;

    let phaseText = "Flow Mode";
    if (isFlowBreak) {
      phaseText = "Flow Break";
    } else if (isPomodoro) {
      const currentPhase = mind.currentPhase;
      const isSingleInterval = Number(settings?.longBreakInterval) === 1;

      const phaseNames = {
        work: "Focus Phase",
        shortBreak: "Short Break",
        longBreak: isSingleInterval ? "Break Phase" : "Long Break",
      };

      phaseText = phaseNames[currentPhase] || "Focus Phase";
    }

    const isBreakPhase = isFlowBreak || isBreak;
    flipClockComponent.updateBadge(phaseText, isBreakPhase);

    const controlState =
      mind.isRunning && !mind.isPaused
        ? "running"
        : mind.isPaused
          ? "paused"
          : "idle";
    flipClockComponent.updateControls(controlState, isFlowBreak);
  },

  bindEvents() {
    if (this.eventsBound || !this.overlayEl) return;
    this.eventsBound = true;

    this.overlayEl.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      e.preventDefault();
      e.stopPropagation();

      if (btn.id === "btn-flip-start" || btn.id === "btn-flip-continue") {
        const activeTask = TaskService.getActiveTask();
        if (!activeTask && state.mind.currentPhase === "work") {
          NotificationService.show({
            type: "warning",
            message: "You need an active task to start a focus session",
            icon: "fa-bullseye-arrow",
            iconColor: "text-amber-500",
            duration: 5000,
            actionButton: {
              text: "Create Task",
              icon: "fa-plus",
              onClick: async () => {
                if (document.fullscreenElement) await document.exitFullscreen();
                ModalController.openTaskModal();
              },
            },
          });
          return;
        }
      }

      if (btn.id === "btn-flip-start" || btn.id === "btn-flip-continue") {
        mindService.start();
      } else if (btn.id === "btn-flip-pause") {
        mindService.pause();
      } else if (btn.id === "btn-flip-stop") {
        this.prevHours = null;
        this.prevMinutes = null;
        this.prevSeconds = null;
        mindService.stopAndTransition();
      } else if (btn.id === "exit-fullscreen-btn") {
        this.close();
      }
    });

    document.addEventListener("fullscreenchange", () => {
      if (
        !document.fullscreenElement &&
        this.overlayEl &&
        !this.overlayEl.classList.contains("hidden")
      ) {
        this.close();
      }
    });

    document.addEventListener("visibilitychange", async () => {
      if (
        document.visibilityState === "visible" &&
        this.overlayEl &&
        !this.overlayEl.classList.contains("hidden")
      ) {
        await this.requestWakeLock();
      }
    });
  },
};
