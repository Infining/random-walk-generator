import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const MAX_STEP_LENGTH = 75;
const STEPS_TAKEN = 2000;
const GRID_WIDTH = 2000;
const GRID_HEIGHT = 2000;
const GRID_PADDING = 0;
const BACKGROUND_COLOR = "#212922";
const LINE_COLOR = "#F7B32B";

class Grid {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.originX = width / 2;
    this.originY = height / 2;
  }

  mapXToSVG(fromX) {
    return fromX + this.originX;
  }

  mapYToSVG(fromY) {
    return fromY * -1 + this.originY;
  }
}

let myGrid = new Grid(GRID_WIDTH, GRID_WIDTH);

let points = [...new Array(STEPS_TAKEN)].reduce(
  (acc, cur, index) => {
    let randNum = () =>
      Math.floor(Math.random() * MAX_STEP_LENGTH) *
      (Math.round(Math.random()) * 2 - 1);

    let randomX, randomY;
    do {
      randomX = acc[index].x + randNum();
    } while (
      myGrid.mapXToSVG(randomX) <= 0 + GRID_PADDING ||
      myGrid.mapXToSVG(randomX) >= myGrid.width - GRID_PADDING
    );
    do {
      randomY = acc[index].y + randNum();
    } while (
      myGrid.mapXToSVG(randomY) <= 0 + GRID_PADDING ||
      myGrid.mapXToSVG(randomY) >= myGrid.height - GRID_PADDING
    );

    return [...acc, { x: randomX, y: randomY }];
  },
  [{ x: 0, y: 0 }]
);

let lines = points
  .map(point => ({
    x: myGrid.mapXToSVG(point.x),
    y: myGrid.mapYToSVG(point.y)
  }))
  .map((point, index, points) => {
    if (!points[index + 1]) return null;
    return (
      <line
        x1={point.x}
        y1={point.y}
        x2={points[index + 1].x}
        y2={points[index + 1].y}
        stroke={LINE_COLOR}
        strokeWidth="5"
        key={(() =>
          ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, a =>
            (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
          ))()}
      />
    );
  });

function App() {
  return (
    <div className="App">
      <svg
        width="500px"
        viewBox={`0 0 ${myGrid.width} ${myGrid.height}`}
        style={{ backgroundColor: BACKGROUND_COLOR }}
      >
        <circle
          cx={myGrid.originX}
          cy={myGrid.originY}
          r={myGrid.width / 100}
        />
        {lines}
      </svg>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
