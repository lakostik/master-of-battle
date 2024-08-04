import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleArenaComponent } from './battle-arena.component';

describe('BattleArenaComponent', () => {
  let component: BattleArenaComponent;
  let fixture: ComponentFixture<BattleArenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BattleArenaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BattleArenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
