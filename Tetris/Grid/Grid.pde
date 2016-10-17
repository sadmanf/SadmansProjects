int rows = 20;
int cols = 10;
int boardWidth = 300;
int boardHeight = 600;
int width = 977;
int height = 650;
int squareLength = boardWidth/10;
int topLeftw = (width/2) - (boardWidth/2);
int topLefth = (height - boardHeight) / 2;
int current;
int timer = 0;
int speed = 1000;
PFont f;

float r, b, g;
color c = color(r, g, b);

boolean gameOver;
boolean paused = true;
boolean inAction = false;
boolean flat;
String dir;

//Coordinates of Current Pieces 
int[] C = new int[8];


int[][] Grid = new int[rows][cols];

void clearGrid() {
  for (int x = 0; x < rows; x++) {
    for (int y = 0; y < cols; y++) {
      Grid[x][y] = 0;
    }
  }
}

void setup() { 

  clearGrid();
  size(width, height);
  PImage bg = loadImage("stars.jpg");
  background(bg);
  f = createFont("Gothic Bold", 20, true);

  stroke(255);
  strokeWeight(2);
  fill(153, 204, 255, 10);
  rect(topLeftw, topLefth, boardWidth, boardHeight); 

  for (int x = 0; x < rows; x++) {
    for (int y = 0; y < cols; y++) {
      stroke(255);
      strokeWeight(0.5);
      if (x == 0) {
        fill(255, 52, 204, 130);
        rect(topLeftw + (squareLength * y), topLefth + (squareLength * x), squareLength, squareLength);
      }
      if (Grid[x][y] == 0) {

        fill(153, 204, 255, 130);
        rect(topLeftw + (squareLength * y), topLefth + (squareLength * x), squareLength, squareLength);
      }
    }
  }
}

void setGrid(int[] L, int val) {
  for (int x = 0; x < 7; x+=2) {
    Grid[C[x]][C[x+1]] = val;
  }
}

void check() {
  // REDRAWS THE ENTIRE BOARD
  int timer = 0;
  size(width, height);
  PImage bg = loadImage("stars.jpg");
  background(bg);
  f = createFont("Gothic Bold", 20, true);

  stroke(255);
  strokeWeight(2);
  fill(153, 204, 255, 10);
  rect(topLeftw, topLefth, boardWidth, boardHeight); 

  for (int x = 0; x < rows; x++) {
    for (int y = 0; y < cols; y++) {
      stroke(255);
      strokeWeight(0.5);
      if (x == 0) {
        fill(255, 52, 204, 130);
        rect(topLeftw + (squareLength * y), topLefth + (squareLength * x), squareLength, squareLength);
      }
      if (Grid[x][y] == 0) {

        fill(153, 204, 255, 130);
        rect(topLeftw + (squareLength * y), topLefth + (squareLength * x), squareLength, squareLength);
      }
    }
  }
  // WRITE MY NAME IN THE BOTTOM RIGHT CORNER


  r = noise(frameCount) + 10;//255 - noise(frameCount * 0.01) * 255;
  b = 255;
  g = noise(frameCount * 0.025) * 255;
  fill(c);
  textFont(f, 30);
  textAlign(RIGHT);
  text("Sadman Fahmid", width - 15, height - 15);


  /*
   1. I = cyan rgb(0,255,255)
   2. O = yellow rgb(255,255,0)
   3. T = purple rgb(160,32,240)
   4. S = green rgb(0,255,0)
   5. Z = red rgb (255,0,0)
   6. J = blue rgb(0,0,255)
   7. L = orange rgb(255,140,0)
   */
  for (int x = 0; x < rows; x++) {
    for (int y = 0; y < cols; y++) {
      if (Grid[x][y] == 0) {       
        noFill();
        //fill(153, 204, 255, 10);
        //        rect(topLeftw + (squareLength * y), topLefth + (squareLength * x), squareLength, squareLength);
      } else if (Grid[x][y] == 1) {
        fill(0, 255, 255);
      } else if (Grid[x][y] == 2) {
        fill(255, 255, 0);
      } else if (Grid[x][y] == 3) {
        fill(160, 32, 240);
      } else if (Grid[x][y] == 4) {
        fill(0, 255, 0);
      } else if (Grid[x][y] == 5) {
        fill(255, 0, 0);
      } else if (Grid[x][y] == 6) {
        fill(0, 0, 255);
      } else if (Grid[x][y] == 7) {
        fill(255, 140, 0);
      }
      rect(topLeftw + (squareLength * y), topLefth + (squareLength * x), squareLength, squareLength);
    }
  }
}


void rotate() {
  /*
   1. I = cyan rgb(0,255,255)
   2. O = yellow rgb(255,255,0)
   3. T = purple rgb(160,32,240)
   4. S = green rgb(0,255,0)
   5. Z = red rgb (255,0,0)
   6. J = blue rgb(0,0,255)
   7. L = orange rgb(255,140,0)
   */
  if (current == 1) {
    println(C[0] + " : " + C[1] + " , " + C[2] + " : " + C[3] + " , " + C[4] + " : " + C[5] + " , " + C[6] + " : " + C[7]);

    if (flat) {
      if ((C[0] > 0 && C[0] < 18) && (Grid[C[0] - 1][C[1] + 1] == 0 || Grid[C[4] + 1][C[5] - 1] == 0 || Grid[C[6] + 2][C[7]-2] == 0)) { 
        setGrid(C, 0);
        C[0]--;
        C[1]++;
        C[4]++;
        C[5]--;
        C[6]+=2;
        C[7]-=2;
        setGrid(C, current);
        flat = false;
      }
    } else if (!flat) {
      if (C[1] == cols-1) {
        setGrid(C, 0);
        C[1]--;
        C[3]--;
        C[5]--;
        C[7]--;
        flat = true;
      }
      if (C[1] == 0) {
        setGrid(C, 0);
        C[1]++;
        C[3]++;
        C[5]++;
        C[7]++;
      }
      if (C[1] > 0 && C[1] < 8 && (Grid[C[0] + 1][C[1] - 1] == 0 || Grid[C[4] - 1][C[5] + 1] == 0 || Grid[C[6] - 2][C[7] + 2] == 0)) { 
        setGrid(C, 0);
        C[0]++;
        C[1]--;
        C[4]--;
        C[5]++;
        C[6]-=2;
        C[7]+=2;
        setGrid(C, current);
        flat = true;
      } else if (C[1] >= 8 && (Grid[C[0] + 1][C[1] - 2] == 0 || Grid[C[2]][C[3] - 1] == 0 || Grid[C[4] - 1][C[5]] == 0 || Grid[C[6] - 2][C[7] + 1] ==0)) {
        setGrid(C, 0);
        C[0]++;
        C[1]-=2;
        C[3]--;
        C[4]--;
        C[6]-=2;
        C[7]++;
        setGrid(C, current);
        flat = true;
      }
    }
  }

  if (current == 3) {//purple T
    if (dir.equals("up")) {
      if (C[2] < rows - 1  && (Grid[C[2] + 1][C[3] + 1] == 0)) {
        setGrid(C, 0);
        C[2]++;
        C[3]++;
        setGrid(C, current);
        dir = "right";
      }
    } else if (dir.equals("right")) {
      if (C[1] == 0) {
        setGrid(C, 0);
        C[1]++;
        C[3]++;
        C[5]++;
        C[7]++;
      } 
      if (C[1] > 0 && Grid[C[0]+1][C[1]-1] == 0) {
        setGrid(C, 0);
        C[0]++;
        C[1]--;
        setGrid(C, current);
        dir = "down";
      }
    } else if (dir.equals("down")) {
      if (C[5] > 0 && Grid[C[6] - 1][C[7] - 1] == 0) {
        setGrid(C, 0);
        C[6]--;
        C[7]--;
        setGrid(C, current);
        dir = "left";
      }
    } else if (dir.equals("left")) {
      if (C[5] == cols - 1) {
        setGrid(C, 0);
        C[1]--;
        C[3]--;
        C[5]--;
        C[7]--;
      }
      if (C[5] < cols - 1 && Grid[C[4]][C[5] + 1] == 0) {
        setGrid(C, 0);
        int tempX = C[0];
        int tempY = C[1];
        C[2]--;
        C[3]++;
        C[0]=C[6];
        C[1]=C[7];
        C[6]=C[2];
        C[7]=C[3];
        C[2]=tempX;
        C[3]=tempY;
        setGrid(C, current);
        dir = "up";
      }
    }
  }

  if (current ==4) {//green S
    if (flat) {
      if (C[0] > 0 && Grid[C[2]][C[3]+1] == 0 && Grid[C[2] - 1][C[3] + 1] == 0) {
        setGrid(C, 0);
        C[0]--;
        C[1]+=2;
        C[6]--;
        setGrid(C, current);
        flat = false;
      }
    } else if (!flat) {
      if (C[3] == 0) {
        setGrid(C, 0);
        C[1]++;
        C[3]++;
        C[5]++;
        C[7]++;
      }
      if (C[3] > 0 && Grid[C[2]][C[3]-1] == 0 && Grid[C[2]+1][C[3]+1] == 0) {
        setGrid(C, 0);
        C[0]++;
        C[1]-=2;
        C[6]++;
        setGrid(C, current);
        flat = true;
      }
    }
  }

  if (current == 5) {//red Z
    if (flat) {
      //      println(Grid[C[2]][C[3]+1] ==0);
      //    println(Grid[C[2]+1][C[3]+1]==0);
      if (C[0] > 0 && Grid[C[2]][C[3]-1] == 0 && Grid[C[2] - 1][C[3] - 1] == 0) {
        setGrid(C, 0);
        C[0]--;
        C[1]-=2;
        C[6]--;
        setGrid(C, current);
        flat = false;
      }
    } else if (!flat) {
      if (C[5] == cols - 1) {
        setGrid(C, 0);
        C[1]--;
        C[3]--;
        C[5]--;
        C[7]--;
      }
      if (C[3] < cols - 1 && Grid[C[2]][C[3]+1] == 0 && Grid[C[2]+1][C[3]-1] == 0) {
        setGrid(C, 0);
        C[0]++;
        C[1]+=2;
        C[6]++;
        setGrid(C, current);
        flat = true;
      }
    }
  }  

  if (current == 6) {
    if (dir.equals("up")) {
      if (C[2]+2 < rows  && Grid[C[2]+1][C[3]+1] ==0 && Grid[C[2]-1][C[3]+1] == 0 && Grid[C[2]-1][C[3]+2] == 0) {
        setGrid(C, 0);
        C[1]+=2;
        C[2]--;
        C[3]++;
        C[6]++;
        C[7]--;
        setGrid(C, current);
        dir = "right";
      }
    } else if (dir.equals("right")) {
      if (C[3] == 0) {
        setGrid(C, 0);
        C[1]++;
        C[3]++;
        C[5]++;
        C[7]++;
      }
      if (C[3]-1 >= 0 && Grid[C[2]+1][C[3]-1] ==0 && Grid[C[2]+1][C[3]+1] == 0 && Grid[C[2]][C[3]-1] == 0) {
        setGrid(C, 0);
        C[0]+=2;
        C[2]++;
        C[3]++;
        C[6]--;
        C[7]--;
        setGrid(C, current);
        dir = "down";
      }
    } else if (dir.equals("down")) {
      if (C[2] - 1 >= 0 && Grid[C[2]+1][C[3]-1] == 0 && Grid[C[2]+1][C[3]-2] == 0 && Grid[C[2]-1][C[3]-1] == 0) {
        setGrid(C, 0);
        C[1]-=2;
        C[2]++;
        C[3]--;
        C[6]--;
        C[7]++;
        setGrid(C, current);
        dir = "left";
      }
    } else if (dir.equals("left")) {
      if (C[3] == cols - 1) {
        setGrid(C, 0);
        C[1]--;
        C[3]--;
        C[5]--;
        C[7]--;
      }
      if (C[3] + 1 < cols && Grid[C[2]-1][C[3]+1] ==0 && Grid[C[2]-1][C[3]-1] == 0 && Grid[C[2]-2][C[3]-1] == 0) {
        setGrid(C, 0);
        C[0]-=2;
        C[2]--;
        C[3]--;
        C[6]++;
        C[7]++;
        setGrid(C, current);
        dir = "up";
      }
    }
  }

  if (current == 7) {
    if (dir.equals("up")) {
      if (C[2]+1 < rows  && Grid[C[2]+1][C[3]-1] ==0 && Grid[C[2]-1][C[3]-1] == 0 && Grid[C[2]+1][C[3]] == 0) {
        setGrid(C, 0);
        C[0]+=2;
        C[2]++;
        C[3]--;
        C[6]--;
        C[7]++;
        setGrid(C, current);
        dir = "right";
      }
    } else if (dir.equals("right")) {
       if (C[3] == 0) {
        setGrid(C, 0);
        C[1]++;
        C[3]++;
        C[5]++;
        C[7]++;
      }
      if (C[3]-1 >= 0 && Grid[C[2]-1][C[3]-1] ==0 && Grid[C[2]-1][C[3]+1] == 0 && Grid[C[2]][C[3]-1] == 0) {
        print("reached");
        setGrid(C, 0);
        C[1]-=2;
        C[2]--;
        C[3]--;
        C[6]++;
        C[7]++;
        setGrid(C, current);
        dir = "down";
      }
    } else if (dir.equals("down")) {
      if (C[2] - 1 >= 0 && Grid[C[2]-1][C[3]] == 0 && Grid[C[2]-1][C[3]+1] == 0 && Grid[C[2]+1][C[3]+1] == 0) {
        setGrid(C, 0);
        C[0]-=2;
        C[2]--;
        C[3]++;
        C[6]++;
        C[7]--;
        setGrid(C, current);
        dir = "left";
      }
    } else if (dir.equals("left")) {
      if (C[3] == cols - 1) {
        setGrid(C, 0);
        C[1]--;
        C[3]--;
        C[5]--;
        C[7]--;
      }
      if (C[3] + 1 < cols && Grid[C[2]+1][C[3]+1] ==0 && Grid[C[2]][C[3]+1] == 0 && Grid[C[2]+1][C[3]-1] == 0) {
        setGrid(C, 0);
        C[1]+=2;
        C[2]++;
        C[3]++;
        C[6]--;
        C[7]--;
        setGrid(C, current);
        dir = "up";
      }
    }
  }
}


void spawn() {
  //println("Has Spawned because inAction is " + inAction);
  /*
   1. I = cyan rgb(0,255,255)
   2. O = yellow rgb(255,255,0)
   3. T = purple rgb(160,32,240)
   4. S = green rgb(0,255,0)
   5. Z = red rgb (255,0,0)
   6. J = blue rgb(0,0,255)
   7. L = orange rgb(255,140,0)
   */

  flat = true;
  dir = "up";
  inAction = true;
  current = (int)random(1, 8);
  if (!gameOver)if (current == 1) {
    //    piece = "I";
    if (Grid[0][cols/2-2] != 0 || Grid[0][cols/2-1] != 0 || Grid[0][cols/2] != 0 || Grid[0][cols/2+1] != 0) gameOver = true;
    else {
      C[0] = 0;
      C[1] = cols/2 - 2;
      C[2] = 0;
      C[3] = cols/2 - 1;
      C[4] = 0;
      C[5] = cols/2;
      C[6] = 0;
      C[7] = cols/2 + 1;
    }
  }
  if (current == 2) {
    //    piece = "O";
    if (Grid[0][cols/2-1] != 0 || Grid[0][cols/2] != 0 || Grid[1][cols/2-1] != 0 || Grid[1][cols/2] != 0) gameOver = true;
    else {
      C[0] = 0;
      C[1] = cols/2 - 1;
      C[2] = 0;
      C[3] = cols/2;
      C[4] = 1;
      C[5] = cols/2 - 1;
      C[6] = 1;
      C[7] = cols/2;
    }
  }
  if (current == 3) {
    //    piece = "T";
    if (Grid[0][cols/2-1] != 0 || Grid[1][cols/2-2] != 0 || Grid[1][cols/2-1] != 0 || Grid[1][cols/2] != 0) gameOver = true;
    else {
      C[0] = 0;
      C[1] = cols/2 - 1;
      C[2] = 1;
      C[3] = cols/2 - 2;
      C[4] = 1;
      C[5] = cols/2 - 1;
      C[6] = 1;
      C[7] = cols/2;
    }
  }
  if (current == 4) {
    //  piece = "S";
    if (Grid[0][cols/2-2] != 0 || Grid[0][cols/2-1] != 0 || Grid[1][cols/2-1] != 0 || Grid[1][cols/2] != 0) gameOver = true;
    else {
      C[0] = 0;
      C[1] = cols/2 - 2;
      C[2] = 0;
      C[3] = cols/2 - 1;
      C[4] = 1;
      C[5] = cols/2 - 1;
      C[6] = 1;
      C[7] = cols/2;
    }
  }
  if (current == 5) {
    //piece = "Z";
    if (Grid[0][cols/2] != 0 || Grid[0][cols/2-1] != 0 || Grid[1][cols/2-1] != 0 || Grid[1][cols/2-2] != 0) gameOver = true;
    else {
      C[0] = 0;
      C[1] = cols/2;
      C[2] = 0;
      C[3] = cols/2 - 1;
      C[4] = 1;
      C[5] = cols/2 - 1;
      C[6] = 1;
      C[7] = cols/2 - 2;
    }
  }
  if (current == 6) {
    //    piece = "J";
    if (Grid[0][cols/2-1] != 0 || Grid[1][cols/2-1] != 0 || Grid[1][cols/2] != 0 || Grid[1][cols/2+1] != 0) gameOver = true;
    else {
      C[0] = 0;
      C[1] = cols/2 - 1;
      C[2] = 1;
      C[3] = cols/2 - 1;
      C[4] = 1;
      C[5] = cols/2;
      C[6] = 1;
      C[7] = cols/2 + 1;
    }
  }
  if (current == 7) {
    // piece = "L";
    if (Grid[0][cols/2+1] != 0 || Grid[1][cols/2+1] != 0 || Grid[1][cols/2] != 0 || Grid[1][cols/2-1] != 0) gameOver = true;
    else {
      C[0] = 0;
      C[1] = cols/2 + 1;
      C[2] = 1;
      C[3] = cols/2 + 1;
      C[4] = 1;
      C[5] = cols/2;
      C[6] = 1;
      C[7] = cols/2 - 1;
    }
  }
  if (!gameOver)setGrid(C, current);
}

boolean canMoveLeft() {
  setGrid(C, 0);
  for (int x = 1; x < 8; x+=2) {
    if (C[x] <= 0) return false;
    if (Grid[C[x-1]][C[x] - 1] != 0) return false;
  } 
  return true;
}

boolean canMoveRight() {
  setGrid(C, 0);
  for (int x = 1; x < 8; x+=2) {
    if (C[x] >= cols-1) return false;
    if (Grid[C[x-1]][C[x] + 1] != 0) return false;
  }
  return true;
}

boolean canMoveDown() {
  setGrid(C, 0);
  for (int x = 0; x < 7; x+=2) {
    if (C[x] >= rows-1) return false;
    if (Grid[C[x]+1][C[x+1]] != 0) return false;
  }
  return true;
}

void keyPressed() {
  int res = keyCode==LEFT ? -1 : (keyCode==RIGHT ? 1 : (keyCode==DOWN ? 2 : (keyCode==ENTER ? 3 : (key== ' ' ? 4 : (keyCode==UP ? 5 : 0)))));
  if (res == -1 && canMoveLeft()) {
    setGrid(C, 0);
    for (int x = 1; x < 8; x+=2) {
      C[x]--;
    }
  }
  if (res == 1 && canMoveRight()) {
    setGrid(C, 0);
    for (int x = 1; x < 8; x+=2) {
      C[x]++;
    }
  }
  if (res == 2 && canMoveDown()) {
    setGrid(C, 0);
    for (int x = 0; x < 7; x+=2) {
      C[x]++;
    }
  }
  if (res == 2 && !canMoveDown()) {
    inAction = false;
    setGrid(C, current);
    spawn();
  }
  if (res == 3) { 
    if (paused) paused = false;
    else paused = true;
  }
  if (res == 4) {
    while (canMoveDown ()) {
      setGrid(C, 0);
      for (int x = 0; x < 7; x+=2) {
        C[x]++;
      }
    }
    inAction = false;
    setGrid(C, current);
    spawn();
  }
  if (res == 5) rotate();
  setGrid(C, current);
}

boolean filled(int row) {
  for (int y = 0; y < cols; y++) {
    if (Grid[row][y] == 0) return false;
  }
  return true;
} 

void clearRow() {
  for (int r = rows - 1; r > 1; r--) {
    if (filled(r)) {
      inAction = true;
      println("filled");
      for (int x = r; x > 2; x--) {
        for (int y = 0; y < cols; y++) {
          Grid[x][y] = Grid[x-1][y];
        }
      }
    }
  }
}

void draw() {
  r = noise(frameCount) + 10;//255 - noise(frameCount * 0.01) * 255;
  b = /*frameCount % */ 255;
  g = noise(frameCount * 0.025) * 255;
  fill(c);
  textAlign(CENTER);
  text("Sadman Fahmid", width - 15, height - 15);
  if (gameOver) {
    fill(r, g, b, 2);
    textFont(f, 90);
    textAlign(CENTER);
    text("GAME OVER", width/2, height/2);
  } else if (!gameOver) {
    if (!paused) {

      clearRow();

      if (!inAction) { 
        spawn();
        timer = 0;
        println("Has Spawned");
        check();
      }
      if (!gameOver) {
        if (millis() - timer >= speed) {
          if (canMoveDown()) {
            setGrid(C, 0);
            for (int x = 0; x < 7; x+=2) {
              C[x]++;
            }
            timer = millis();
            setGrid(C, current);
          } else if (!canMoveDown()) {
            print(current);
            setGrid(C, current);
            //println("stuck");
            inAction = false;
          }
        }
      }
      check();
    } else if (paused) {
      textAlign(CENTER);
      text("PRESS ENTER TO RESUME PLAYING", width/2, height/2);
    }
  }
  fill(c);
}

