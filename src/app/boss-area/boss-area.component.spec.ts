import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BossAreaComponent } from './boss-area.component';

describe('BossAreaComponent', () => {
  let component: BossAreaComponent;
  let fixture: ComponentFixture<BossAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BossAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BossAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
