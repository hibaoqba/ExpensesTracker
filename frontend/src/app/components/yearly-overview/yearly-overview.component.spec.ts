import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyOverviewComponent } from './yearly-overview.component';

describe('YearlyOverviewComponent', () => {
  let component: YearlyOverviewComponent;
  let fixture: ComponentFixture<YearlyOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearlyOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearlyOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
