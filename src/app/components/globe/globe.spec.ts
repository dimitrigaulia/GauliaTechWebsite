import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Globe } from './globe';

describe('Globe', () => {
  let component: Globe;
  let fixture: ComponentFixture<Globe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Globe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Globe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
