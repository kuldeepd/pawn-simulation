import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent, Color, Direction } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [AppComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.rows).toEqual([7, 6, 5, 4, 3, 2, 1, 0]);
    expect(component.columns).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(component.commandType).toBeNull();
    expect(component.currentPos).toEqual({
      x: null,
      y: null,
      direction: null,
      color: null,
    });
    expect(component.lastCommand).toBe('');
    expect(component.isFirstMove).toBe(false);
    expect(component.report).toBe('');
  });

  it('should set command form as invalid when executing command with empty input', () => {
    component.command.setValue('');
    component.executeCommand();
    expect(component.commandForm.invalid).toBe(true);
  });

  it('should set command form as invalid when executing command without placing pawn first', () => {
    component.command.setValue('MOVE');
    component.executeCommand();
    const errorMessage:string = component.command.errors?component.command.errors['message']:''
    expect(component.commandForm.invalid).toBe(true);
    expect(errorMessage).toBe('Please place pawn first');
  });

  it('should set command form as invalid when executing invalid command', () => {
    component.command.setValue('INVALID');
    component.executeCommand();
    const errorMessage:string = component.command.errors?component.command.errors['message']:'';
    expect(component.commandForm.invalid).toBe(true);
    expect(errorMessage).toBe('Invalid command');
  });

  it('should update pawn position correctly when executing a valid MOVE command', () => {
    component.currentPos = { x: 2, y: 3, direction: Direction['NORTH'], color: Color['BLACK'] };
    component.command.setValue('MOVE');
    component.executeCommand();
    expect(component.currentPos).toEqual({ x: 2, y: 4, direction: Direction['NORTH'], color: Color['BLACK'] });
  });

  it('should update pawn direction correctly when executing a valid LEFT command', () => {
    component.currentPos = { x: 2, y: 3, direction: Direction['NORTH'], color: Color['BLACK'] };
    component.command.setValue('LEFT');
    component.executeCommand();
    expect(component.currentPos).toEqual({ x: 2, y: 3, direction: Direction['WEST'], color: Color['BLACK'] });
  });

  it('should update pawn direction correctly when executing a valid RIGHT command', () => {
    component.currentPos = { x: 2, y: 3, direction: Direction['NORTH'], color: Color['BLACK'] };
    component.command.setValue('RIGHT');
    component.executeCommand();
    expect(component.currentPos).toEqual({ x: 2, y: 3, direction: Direction['EAST'], color: Color['BLACK'] });
  });

  it('should generate report correctly when executing a valid REPORT command', () => {
    component.currentPos = { x: 2, y: 3, direction: Direction['NORTH'], color: Color['BLACK'] };
    component.command.setValue('REPORT');
    component.executeCommand();
    expect(component.report).toBe('Output: 2,3,NORTH,BLACK');
  });

  it('should set command form as invalid when executing a command without placing pawn first', () => {
    component.isFirstMove = true;
    component.command.setValue('MOVE');
    component.executeCommand();
    const errorMessage:string = component.command.errors?component.command.errors['message']:''
    expect(component.commandForm.invalid).toBe(true);
    expect(errorMessage).toBe('Please place pawn first');
  });

  it('should set command form as invalid when executing a command without the first command being PLACE', () => {
    component.isFirstMove = true;
    component.command.setValue('MOVE');
    component.executeCommand();
    const errorMessage:string = component.command.errors?component.command.errors['message']:''
    expect(component.commandForm.invalid).toBe(true);
    expect(errorMessage).toBe('Please place pawn first');
  });
});

