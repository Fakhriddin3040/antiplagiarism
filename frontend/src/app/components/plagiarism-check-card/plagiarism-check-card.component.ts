import {ChangeDetectionStrategy, Component, computed, input, output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatButton} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon'; // ✅
import {PlagiarismVerdict} from '../../core/features/document/types/document.types';
import {
  PLAGIARISM_VERDICT_LABEL_MAP,
  PlagiarismCheck
} from '../../core/features/plagiarism-check/types/plagiarism-check.types';

@Component({
  selector: 'app-plagiarism-check-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatProgressSpinner,
    MatProgressBar,
    MatButton,
    MatIcon,
  ],
  templateUrl: './plagiarism-check-card.component.html',
  styleUrls: ['./plagiarism-check-card.component.scss'],
})
export class PlagiarismCheckCardComponent {
  // Angular 20: сигнал-входы/выход
  readonly check = input.required<PlagiarismCheck>();
  readonly isLoading = input(false);
  readonly recheck = output<void>();

  // Текст вердикта
  readonly verdictText = computed(() => PLAGIARISM_VERDICT_LABEL_MAP[this.check().verdict] ?? this.check().verdict);

  // Значение прогресс-бара: coverage предпочтительно, иначе maxSimilarity
  readonly progressValue = computed<number>(() => {
    const c = this.check();
    return (typeof c.coverage === 'number' ? c.coverage : c.maxSimilarityScore) ?? 0;
  });

  // Цвет прогресс-бара по вердикту
  readonly progressColor = computed<'primary' | 'accent' | 'warn'>(() => {
    const v = this.check().verdict;
    if (v === PlagiarismVerdict.PLAGIARISM) return 'warn';
    if (v === PlagiarismVerdict.PARTIAL_PLAGIARISM) return 'accent';
    return 'primary';
  });

  // CSS-класс вердикта
  readonly verdictClass = computed(() => {
    const v = this.check().verdict;
    return {
      'verdict-plagiarism': v === PlagiarismVerdict.PLAGIARISM,
      'verdict-partial': v === PlagiarismVerdict.PARTIAL_PLAGIARISM,
      'verdict-unique': v === PlagiarismVerdict.UNIQUE,
    };
  });

  onRecheck(): void {
    this.recheck.emit();
  }
}
