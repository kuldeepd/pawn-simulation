import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { faCircleDown, faCircleLeft, faCircleRight, faCircleUp } from '@fortawesome/free-solid-svg-icons';

export enum Direction {NORTH='NORTH',SOUTH='SOUTH',EAST='EAST',WEST='WEST'};

export enum Color {BLACK='BLACK',WHITE='WHITE'};
export enum CommandType {PLACE='PLACE',MOVE='MOVE',REPORT='REPORT',LEFT='LEFT',RIGHT='RIGHT'}

export type PawnPosition = {
  x:number|null;
  y:number|null;
  direction:Direction|null;
  color:Color|null;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pawn-simulator';

  rows = [7,6,5,4,3,2,1,0];
  columns = [0,1,2,3,4,5,6,7];

  commandType:CommandType|null = null;

  currentPos:PawnPosition={
    x:null,
    y:null,
    direction:null,
    color:null
  }

  lastCommand:string='';
  isFirstMove:boolean = false;
  
  report:string = '';

  faCircleRight = faCircleRight;
  faCircleLeft = faCircleLeft;
  faCircleUp = faCircleUp;
  faCircleDown = faCircleDown;

  constructor(private formBuilder:FormBuilder){}

  commandForm:FormGroup = this.formBuilder.group({
    command:["",[this.isValidMove.bind(this)]]
  })

  get command():FormControl{
    return this.commandForm.get("command") as FormControl;
  }

  executeCommand(){
    if(this.commandForm.invalid){
      return;
    }
    let command = this.command?.value
    this.lastCommand = command;
    if(command){
      const commandPartsArr = command.split(' ');
      const commandValues = commandPartsArr[1];
      this.commandType = commandPartsArr[0];
      if(this.isFirstMove && this.commandType !== 'PLACE'){
        this.command.setErrors({message:'Please place pawn first'});
        return ;
      }else{
        if(this.commandType === 'PLACE'){
          const [x,y,direction,color] = commandValues.split(',');
          this.placePawn(x,y,direction,color)
        }
        else if(this.commandType === 'MOVE'){
          this.movePawn();
        }
        else if(this.commandType === 'LEFT'){
          this.rotateLeft();
        }
        else if(this.commandType === 'RIGHT'){
          this.rotateRight();
        }
        else if(this.commandType === 'REPORT'){
          this.GenerateReport();
        }
        if(this.commandForm.valid){
          // this.command.setValue('');
          this.commandForm.reset();
          this.commandForm.markAsPristine();
          this.commandForm.markAsUntouched();
        }
      }
    }
  }

  isValidMove(control: AbstractControl): {[key: string]: any} | null {
    //checking for required
    if(!control.value){
      return {message:'Please input a valid command'};
    }
    const value = control.value.toUpperCase().trim();
    const validCommandTypes = ['PLACE','MOVE','REPORT','LEFT','RIGHT']
    const commandType = value.split(' ');
    //checking for valid command
    if(!validCommandTypes.includes(commandType[0])){
      return {message:'Invalid command'};
    }
    //first command must be PLACE
    if((!this.isPawnOnBoard() && commandType[0] != 'PLACE') || (this.isFirstMove && commandType[0] != 'PLACE')){
      return {message:'Please place pawn first'};
    }
    
    return null;
  }

  isPawnOnBoard(){
    if (this.currentPos.x === null || this.currentPos.y === null) return false;
		else return true;
  }

  placePawn(x: number, y: number, direction: Direction, color: Color){
    if(!x || !y || !Direction[direction] || !Color[color]){
      this.command.setErrors({message:'Please input a valid command'});
      return;
    }else if (x < 0 || x > 7 || y < 0 || y > 7) {
      this.command.setErrors({message:'Pawn will fall out of the board'})
      return;
    }else{
      this.currentPos = {x,y,direction:Direction[direction],color:Color[color]};
      this.isFirstMove = false;
      this.report = "";
    }
  }

  movePawn(){
    let newX = this.currentPos.x ?? 0;
		let newY = this.currentPos.y ?? 0;
		// CALCULATING THE VALUE OF PAWN
		switch (this.currentPos.direction) {
			case 'NORTH':
				newY = +newY+1;
				break;
			case 'SOUTH':
				newY = +newY-1;
				break;
			case 'EAST':
				newX = +newX+1;
				break;
			case 'WEST':
				newX = +newX-1;
				break;
		}
		if (newX < 0 || newX > 7 || newY < 0 || newY > 7) {
      this.command.setErrors({message:'Pawn will fall out of the board'});
			return;
		}

		// UPDATE THE PAWN Current position
		this.currentPos = {...this.currentPos,x:newX,y:newY};
  }

  rotateLeft(){
    let newDirection:Direction|null = null;
		// CHANGING PAWN'S DIRECTION
		switch (this.currentPos.direction) {
			case 'NORTH':
				newDirection = Direction['WEST'];
				break;
			case 'SOUTH':
				newDirection = Direction['EAST'];
				break;
			case 'EAST':
				newDirection = Direction['NORTH'];
				break;
			case 'WEST':
				newDirection = Direction['SOUTH'];
				break;
		}

    if(newDirection !=null){
      this.currentPos = {...this.currentPos,direction:Direction[newDirection]}
    }
  }
  rotateRight(){
    let newDirection:Direction|null = null;
		// CHANGING PAWN'S DIRECTION
		switch (this.currentPos.direction) {
			case 'NORTH':
				newDirection = Direction['EAST'];
				break;
			case 'SOUTH':
				newDirection = Direction['WEST'];
				break;
			case 'EAST':
				newDirection = Direction['SOUTH'];
				break;
			case 'WEST':
				newDirection = Direction['NORTH'];
				break;
		}

    if(newDirection !=null){
      this.currentPos = {...this.currentPos,direction:Direction[newDirection]}
    }
  }

  GenerateReport(){
    console.log(this.currentPos);
    const {x,y,direction,color} = this.currentPos;
    this.report = `Output: ${x},${y},${direction},${color}`;
  }
}
