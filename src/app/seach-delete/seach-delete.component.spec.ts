import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeachDeleteComponent } from './seach-delete.component';

describe('SeachDeleteComponent', () => {
  let component: SeachDeleteComponent;
  let fixture: ComponentFixture<SeachDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeachDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeachDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
