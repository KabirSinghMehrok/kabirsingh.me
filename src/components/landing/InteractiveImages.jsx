import React, { useEffect, useRef } from 'react';
import interact from 'interactjs';


const emojiArray = [
  {
    webpLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f604/512.webp',
    gifLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f604/512.gif',
    altEmoji: '😄',
    ariaLabel: 'Happiness on the face of the person',
    displayText: 'Satisfied clients'
  },
  {
    webpLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f929/512.webp',
    gifLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f929/512.gif',
    altEmoji: '🤩',
    ariaLabel: 'Star-struck face',
    displayText: 'Engaging User Interfaces'
  },
  {
    webpLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/263a_fe0f/512.webp',
    gifLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/263a_fe0f/512.gif',
    altEmoji: '☺',
    ariaLabel: 'Smiling face',
    displayText: 'Accessible Web Design'
  },
  {
    webpLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f62e_200d_1f4a8/512.webp',
    gifLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f62e_200d_1f4a8/512.gif',
    altEmoji: '😮',
    ariaLabel: 'Face with open mouth',
    displayText: 'Seamless User Experiences'
  },
  {
    webpLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f92f/512.webp',
    gifLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f92f/512.gif',
    altEmoji: '🤯',
    ariaLabel: 'Exploding head',
    displayText: 'Innovative Problem Solving'
  },
  {
    webpLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.webp',
    gifLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.gif',
    altEmoji: '🔥',
    ariaLabel: 'Fire',
    displayText: 'Performant Code'
  },
  {
    webpLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f340/512.webp',
    gifLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f340/512.gif',
    altEmoji: '🍀',
    ariaLabel: 'Clover',
    displayText: 'Elegant Solutions'
  }
];

const InteractiveImagesComponent = ({ numberOfImages = 5 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function randomizePositions() {
      const items = container.querySelectorAll('.resizable-draggable');
      const containerRect = container.getBoundingClientRect();

      items.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        const x = Math.random() * (containerRect.width - itemRect.width);
        const y = Math.random() * (containerRect.height - itemRect.height);

        item.style.transform = `translate(${x}px, ${y}px)`;
        item.setAttribute('data-x', String(x));
        item.setAttribute('data-y', String(y));
      });
    }

    function dragMoveListener(event) {
      const target = event.target;
      const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
      const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      target.style.transform = `translate(${x}px, ${y}px)`;
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    }

    randomizePositions();

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
  }, [numberOfImages]);

  return (
    <div
      ref={containerRef}
      id="interactive-container"
      className="relative w-full h-[400px]"
    >
      {emojiArray.map((emoji, i) => (
        <div className="resizable-draggable" data-id={`image-${i}`} key={i}>
          <picture>
            <source srcSet={emoji.webpLink} type="image/webp" />
            <img
              src={emoji.gifLink}
              alt={emoji.altEmoji}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </picture>
          <div className="resize-handle top-left" />
          <div className="resize-handle top-right" />
          <div className="resize-handle bottom-left" />
          <div className="resize-handle bottom-right" />
        </div>
      ))}
    </div>
  );
};

export default InteractiveImagesComponent;
