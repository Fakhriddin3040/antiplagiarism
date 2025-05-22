import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
// dashboard.component.ts (фрагмент)
  stats: Stats;
  latestChecks: PlagiarismCheck[];

  constructor(private statsService: StatisticsService) {}

  ngOnInit() {
    // Получаем сводные данные (может быть один запрос возвращает все необходимые показатели)
    this.statsService.getOverview().subscribe(data => {
      this.stats = data;
    });
    // Получаем список последних проверок
    this.statsService.getLatestChecks().subscribe(checks => {
      this.latestChecks = checks;
    });
  }
}
