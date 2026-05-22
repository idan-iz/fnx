import { Component, inject, effect, OnDestroy } from '@angular/core';
import { General } from '../../services/general';

@Component({
  selector: 'app-error-toast',
  imports: [],
  templateUrl: './error-toast.html',
  styleUrl: './error-toast.css',
})
export class ErrorToast implements OnDestroy {
  protected generalService = inject(General);
  private dismissTimeout: any;

  constructor() {
    effect(() => {
      const errorMsg = this.generalService.error$();
      
      // Clear any pending dismissal timer
      if (this.dismissTimeout) {
        clearTimeout(this.dismissTimeout);
        this.dismissTimeout = null;
      }

      // Schedule auto-dismiss in 10 seconds if a new error has been set
      if (errorMsg) {
        this.dismissTimeout = setTimeout(() => {
          this.onClose();
        }, 10000);
      }
    });
  }

  onClose() {
    this.generalService.clearError();
  }

  ngOnDestroy() {
    if (this.dismissTimeout) {
      clearTimeout(this.dismissTimeout);
    }
  }
}
