/**
 * Javascript pseudocode
 * Find the dynamic width (width = width of viewport/container width)
 * Each element (in our case a div with elements inside of it) takes 150px of width (this is configurable), based on the dynamic width and , calculate the number of columns
 * For the remaining space, calculate the number of rows, ensure atleast 3 rows, and the number of rows will always be odd. This calclulation will be based on the height of the elements (default to 150px, configurable)
 * Now you have a grid
 * Allocate atleast two cells in the central row to the {children} componentn
 * In the remaining cells, places the elements
 */
import React, { useState, useEffect, useRef } from 'react';
import interact from 'interactjs';
import emojiArray from '../../data/layout/emoji-subset.json';
// import InteractiveDiv from './InteractiveDiv';



const InteractiveImagesV2 = ({ children, elementWidth = 80, elementHeight = 80, gapX = 150, gapY = 100 }) => {
  const containerRef = useRef(null);
  const [grid, setGrid] = useState({ cols: 0, rows: 0 });
  const [gridItems, setGridItems] = useState([]);

  const MIN_ROWS = 3
  const MIN_COLS = 3
  const MIN_CHILDREN_COLS = 3

  function getNearestHigherOdd(num) {
    let ceiledNum = Math.ceil(num);
    return ceiledNum % 2 === 0 ? ceiledNum + 1 : ceiledNum;
  }


  useEffect(() => {
    const calculateGrid = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();

        let cols = Math.max(getNearestHigherOdd(width / (elementWidth + gapX)), MIN_COLS);
        let rows = Math.max(getNearestHigherOdd(height / (elementHeight + gapY)), MIN_ROWS);
        setGrid({ cols, rows });
      }
    };

    calculateGrid();
    window.addEventListener('resize', calculateGrid);
    return () => window.removeEventListener('resize', calculateGrid);
  }, [elementWidth, elementHeight]);

  useEffect(() => {
    if (grid.rows > 0 && grid.cols > 0) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      const colWidth = width / grid.cols;
      const rowHeight = height / grid.rows;
      console.log('w, h, grid.cols, grid.rows, colWidth, rowHeight', width, height, grid.cols, grid.rows, colWidth, rowHeight)

      const newGridItems = Array(grid.rows).fill(null).map(() => Array(grid.cols).fill(null));
      const centerRow = Math.floor(grid.rows / 2);
      const centerCol = Math.floor(grid.cols / 2);

      for (let i = 0; i < MIN_CHILDREN_COLS; i++) {
        const correctionIndex = i - Math.floor(MIN_CHILDREN_COLS / 2)
        console.log('correctionIndex, centerRow, centerCol', centerRow, centerCol + correctionIndex, correctionIndex);
        if (correctionIndex == 0) {
          newGridItems[centerRow][centerCol] = { type: 'children', position: { x: (centerCol * colWidth) + (colWidth / 2), y: (centerRow * rowHeight) + (rowHeight / 2) } };
        } else {
          newGridItems[centerRow][centerCol + correctionIndex] = { type: 'children_placeholder' };
        }
      }

      let emojiIndex = 0;
      let emojiArrayLength = emojiArray.length
      for (let r = 0; r < grid.rows; r++) {
        for (let c = 0; c < grid.cols; c++) {
          if (newGridItems[r][c] === null) {
            console.log('r, c, colWidith, rowHeight', r, c, colWidth, rowHeight);
            newGridItems[r][c] = { type: 'emoji', data: emojiArray[emojiIndex % emojiArrayLength], position: { x: (c * colWidth) + (colWidth / 2), y: (r * rowHeight) + (rowHeight / 2) }, isHovered: false };
            emojiIndex++;
          }
        }
      }

      // console.log('newGridItems', newGridItems);
      setGridItems(newGridItems);
    }
  }, [grid]);

  useEffect(() => {
    function dragMoveListener(event) {
      const target = event.target;
      const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
      const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      target.style.transform = `translate(${x}px, ${y}px)`;
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    }

    const interaction = interact('.resizable-draggable')
      .draggable({
        listeners: { move: dragMoveListener },
        inertia: true,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: true
          })
        ]
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          move: function (event) {
            const target = event.target;
            let x = (parseFloat(target.getAttribute('data-x')) || 0);
            let y = (parseFloat(target.getAttribute('data-y')) || 0);

            target.style.width = event.rect.width + 'px';
            target.style.height = event.rect.height + 'px';

            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.transform = `translate(${x}px, ${y}px)`;

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
          }
        },
        modifiers: [
          interact.modifiers.restrictEdges({
            outer: 'parent'
          }),
          interact.modifiers.aspectRatio({
            ratio: 'preserve'
          }),
          interact.modifiers.restrictSize({
            min: { width: 50, height: 50 },
            max: { width: 200, height: 200 }
          })
        ],
        inertia: true
      });

    return () => {
      interaction.unset();
    };
  }, [])





  return (
    <div
      ref={containerRef}
      className="relative w-full h-full items-center justify-items-center"
    // style={{
    //   display: 'grid',
    //   gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
    //   gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
    //   gap: '10px'
    // }}
    >
      {gridItems.flat().map((item, index) => {
        if (!item) return <div key={index} className="border border-dashed border-gray-300"></div>;

        if (item.type === 'children') {
          return (
            <div key={index} className="absolute" style={{ top: item.position.y, left: item.position.x, transform: 'translate(-50%, -50%)' }}>
              {children}
            </div>
          );
        }

        if (item.type === 'emoji') {
          const handleMouseEnter = () => {
            setGridItems(currentGridItems => {
              const newGridItems = currentGridItems.map(row =>
                row.map(cell => {
                  if (cell && cell.position && cell.position.x === item.position.x && cell.position.y === item.position.y) {
                    return { ...cell, isHovered: true };
                  }
                  return cell;
                })
              );
              return newGridItems;
            });
          };

          const handleMouseLeave = () => {
            setGridItems(currentGridItems => {
              const newGridItems = currentGridItems.map(row =>
                row.map(cell => {
                  if (cell && cell.position && cell.position.x === item.position.x && cell.position.y === item.position.y) {
                    return { ...cell, isHovered: false };
                  }
                  return cell;
                })
              );
              return newGridItems;
            });
          };

          return (
            <div
              key={index}
              className="absolute resizable-draggable flex items-center justify-center border border-blue-400"
              style={{ transform: 'translate(0px, 0px)', top: item.position.y, left: item.position.x, width: `${elementWidth}px`, height: `${elementHeight}px` }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleMouseEnter}
              onTouchEnd={handleMouseLeave}
            >
              {/* <p>{item.position.x} {item.position.y}</p> */}
              <img
                src={item.isHovered ? item.data.gifLink : item.data.svgLink}
                alt={item.data.ariaLabel}
                className="w-full h-full object-contain"
              />
              <div className="absolute w-[10px] h-[10px] bg-white border border-blue-500 -top-[5px] -left-[5px]" />
              <div className="absolute w-[10px] h-[10px] bg-white border border-blue-500 -top-[5px] -right-[5px]" />
              <div className="absolute w-[10px] h-[10px] bg-white border border-blue-500 -bottom-[5px] -left-[5px]" />
              <div className="absolute w-[10px] h-[10px] bg-white border border-blue-500 -bottom-[5px] -right-[5px]" />
            </div>
            // <InteractiveDiv key={index} width={150} height={150} />
          )
        }

        // This will render nothing for 'children_placeholder'
        return null;
      })}
    </div>
  )
}

export default InteractiveImagesV2;