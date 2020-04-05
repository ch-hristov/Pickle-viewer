import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComlawComponent } from './comlaw.component';

describe('ComlawComponent', () => {
  let component: ComlawComponent;
  let fixture: ComponentFixture<ComlawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComlawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComlawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
