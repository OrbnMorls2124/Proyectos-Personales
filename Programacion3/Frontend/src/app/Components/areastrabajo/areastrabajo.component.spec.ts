import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreastrabajoComponent } from './areastrabajo.component';

describe('AreastrabajoComponent', () => {
  let component: AreastrabajoComponent;
  let fixture: ComponentFixture<AreastrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AreastrabajoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreastrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
