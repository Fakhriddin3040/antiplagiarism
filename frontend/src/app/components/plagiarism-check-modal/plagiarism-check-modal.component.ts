import {Component, computed, EventEmitter, HostListener, input, Input, Output} from '@angular/core';
import {NgClass, NgStyle} from '@angular/common';
import {PlagiarismCheck} from '../../core/features/plagiarism-check/types/plagiarism-check.types';
import {PlagiarismVerdict} from '../../core/features/document/types/document.types';


@Component({
  selector: 'app-plagiarism-check-modal',
  standalone: true,
  templateUrl: './plagiarism-check-modal.component.html',
  styleUrls: ['./plagiarism-check-modal.component.scss'],
  imports: [
    NgStyle,
    NgClass
  ],
  host: {'role': 'dialog', 'aria-modal': 'true'}
})
export class PlagiarismCheckModalComponent {
  plagiarismCheck = input.required<PlagiarismCheck>();
  @Input() isChecked = false;
  @Input() loading = false;

  @Output() close = new EventEmitter<void>();
  @Output() check = new EventEmitter<void>();

  readonly LABELS: Record<PlagiarismVerdict, string> = {
    [PlagiarismVerdict.UNIQUE]: 'Уникальный',
    [PlagiarismVerdict.PARTIAL_PLAGIARISM]: 'Частичный плагиат',
    [PlagiarismVerdict.PLAGIARISM]: 'Плагиат',
  };

  verdict(): PlagiarismVerdict {
    return this.plagiarismCheck().verdict;
  }

  // Цветовая тема по вердикту
  themeClass = computed(() => ({
    'is-unique': this.verdict() === PlagiarismVerdict.UNIQUE,
    'is-partial': this.verdict() === PlagiarismVerdict.PARTIAL_PLAGIARISM,
    'is-bad':     this.verdict() === PlagiarismVerdict.PLAGIARISM
  }));

  // Числа в безопасном диапазоне, округление до 3 знаков
  pct(val?: number) {
    const v = Math.max(0, Math.min(100, Number(val ?? 0)));
    return Number(v.toFixed(3));
  }

  // Стиль для кругового индикатора (по avg)
  gaugeStyle() {
    const avg = this.pct(this.plagiarismCheck().averageChunksSimilarity);
    return {'--val': `${avg}%`};
  }

  @HostListener('document:keydown.escape')
  onEsc() { this.close.emit(); }
}
